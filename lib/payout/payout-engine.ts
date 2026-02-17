import {
  Bucket,
  LedgerEntry,
  PayoutAllocation,
  PayoutEngineInput,
  PayoutEngineOutput,
  Currency,
} from "./types";

/**
 * VISUAL consolidated V1 percentages from ODT (17/02/2026)
 * - VISUAL fee: 7% of G
 * - Investors TOP10: 40% of G distributed with rank-specific percentages
 * - Creators TOP10: 30% of G distributed with rank-specific percentages
 * - Investors 11–100: 23% of G equally split among eligible investors
 * - Creators 11–100: 0%
 *
 * IMPORTANT: payouts are euro-floor rounded (down to the nearest euro),
 * and the removed cents are captured by VISUAL as residuals.
 */

// Basis points (bps) = 1/100 of a percent (0.01%). 10000 bps = 100%.
const BPS_DENOM = 10000;

// 7% = 700 bps
const VISUAL_FEE_BPS = 700;

// Rank-specific % of G expressed in bps (e.g. 13.66% => 1366 bps)
const INVESTOR_TOP10_BPS: number[] = [1366, 683, 455, 341, 273, 228, 195, 171, 152, 137];
const CREATOR_TOP10_BPS: number[] = [1024, 512, 341, 256, 205, 171, 146, 128, 114, 102];

// 23% = 2300 bps
const INVESTOR_11_100_BPS = 2300;

function nowIso() {
  return new Date().toISOString();
}

function euroFloor(cents: number): { floored: number; residual: number } {
  const floored = Math.floor(cents / 100) * 100;
  return { floored, residual: cents - floored };
}

function mulBpsFloor(amountCents: number, bps: number): number {
  // floor(amountCents * bps / 10000)
  return Math.floor((amountCents * bps) / BPS_DENOM);
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function assertArrayLen(name: string, arr: unknown[], len: number, warnings: string[]) {
  if (arr.length !== len) {
    warnings.push(`${name} must have length ${len}, got ${arr.length}. Engine will still run but distribution may be wrong.`);
  }
}

function mkEntryId(prefix: string, cycleId: string, i: number) {
  return `${prefix}_${cycleId}_${i}`;
}

export function computePayoutAllocations(input: PayoutEngineInput): PayoutEngineOutput {
  const warnings: string[] = [];
  const currency: Currency = "eur";

  const closedAtIso = input.closedAtIso ?? nowIso();

  if (!Number.isInteger(input.grossEligibleCents) || input.grossEligibleCents < 0) {
    throw new Error("grossEligibleCents must be a non-negative integer (cents).");
  }

  assertArrayLen("top10Investors", input.top10Investors, 10, warnings);
  assertArrayLen("top10Creators", input.top10Creators, 10, warnings);

  // Sanity checks for percentages
  const invTop10Sum = sum(INVESTOR_TOP10_BPS);
  const creatorTop10Sum = sum(CREATOR_TOP10_BPS);
  if (invTop10Sum !== 4000) warnings.push(`Investor TOP10 bps sum expected 4000 (40%), got ${invTop10Sum}.`);
  if (creatorTop10Sum !== 3000) warnings.push(`Creator TOP10 bps sum expected 3000 (30%), got ${creatorTop10Sum}.`);
  if (VISUAL_FEE_BPS + 4000 + 3000 + INVESTOR_11_100_BPS !== 10000) {
    warnings.push("Global bps total is not 100%. Please verify consolidated formulas.");
  }

  const G = input.grossEligibleCents;

  const platformFeeGross = mulBpsFloor(G, VISUAL_FEE_BPS);

  const allocations: PayoutAllocation[] = [];
  let residualTotal = 0;

  // TOP10 investors
  for (let r = 0; r < Math.min(10, input.top10Investors.length); r++) {
    const winner = input.top10Investors[r];
    const gross = mulBpsFloor(G, INVESTOR_TOP10_BPS[r]);
    const { floored, residual } = euroFloor(gross);
    residualTotal += residual;

    allocations.push({
      userId: winner.userId,
      role: winner.role,
      bucket: "INV_TOP10",
      amountCents: floored,
      grossCents: gross,
      roundingResidualCents: residual,
      currency,
      meta: { cycleId: input.cycleId, rank: r + 1, bps: INVESTOR_TOP10_BPS[r] },
    });
  }

  // TOP10 creators
  for (let r = 0; r < Math.min(10, input.top10Creators.length); r++) {
    const winner = input.top10Creators[r];
    const gross = mulBpsFloor(G, CREATOR_TOP10_BPS[r]);
    const { floored, residual } = euroFloor(gross);
    residualTotal += residual;

    allocations.push({
      userId: winner.userId,
      role: winner.role,
      bucket: "PORTEUR_TOP10",
      amountCents: floored,
      grossCents: gross,
      roundingResidualCents: residual,
      currency,
      meta: { cycleId: input.cycleId, rank: r + 1, bps: CREATOR_TOP10_BPS[r] },
    });
  }

  // Investors ranks 11–100 (equal share)
  const eligible = input.investors11to100 ?? [];
  const pool11_100Gross = mulBpsFloor(G, INVESTOR_11_100_BPS);

  if (eligible.length === 0) {
    // Entire pool becomes platform take (undistributed)
    residualTotal += pool11_100Gross; // treat as residual captured by VISUAL
    warnings.push("No eligible investors11to100 provided; 23% pool is captured by VISUAL.");
  } else {
    const perUserGross = Math.floor(pool11_100Gross / eligible.length); // cents
    // Each user payout is euro-floor rounded
    for (let i = 0; i < eligible.length; i++) {
      const u = eligible[i];
      const { floored, residual } = euroFloor(perUserGross);
      residualTotal += residual;

      allocations.push({
        userId: u.userId,
        role: u.role,
        bucket: "INV_11_100",
        amountCents: floored,
        grossCents: perUserGross,
        roundingResidualCents: residual,
        currency,
        meta: { cycleId: input.cycleId, group: "11-100", poolGrossCents: pool11_100Gross, eligibleCount: eligible.length },
      });
    }
    // Any remainder from integer division of pool also goes to platform
    const divisionRemainder = pool11_100Gross - perUserGross * eligible.length;
    if (divisionRemainder > 0) residualTotal += divisionRemainder;
  }

  const totalUserPayout = allocations.reduce((acc, a) => acc + a.amountCents, 0);

  // Platform take is what's left from G after crediting user payouts
  const platformTake = G - totalUserPayout;

  // Platform residual is everything beyond the base 7% fee (includes rounding residuals, division remainder, undistributed pools)
  const platformResidual = platformTake - platformFeeGross;

  if (platformTake < 0) {
    throw new Error("Computed payouts exceed grossEligibleCents. Check formula inputs.");
  }

  if (platformResidual < 0) {
    warnings.push(
      "Platform residual is negative (payouts+fee exceed gross). This indicates rounding or percentage inconsistencies."
    );
  }

  // Ledger entries (wallet credits + platform fee/residual)
  const ledgerEntries: LedgerEntry[] = [];
  let seq = 0;

  ledgerEntries.push({
    entryId: mkEntryId("platform_fee", input.cycleId, seq++),
    type: "platform_fee",
    amountCents: platformFeeGross,
    currency,
    status: "posted",
    occurredAt: closedAtIso,
    meta: { cycleId: input.cycleId, bps: VISUAL_FEE_BPS, basis: "grossEligibleCents" },
  });

  if (platformResidual !== 0) {
    ledgerEntries.push({
      entryId: mkEntryId("platform_residual", input.cycleId, seq++),
      type: "platform_residual",
      amountCents: platformResidual,
      currency,
      status: "posted",
      occurredAt: closedAtIso,
      meta: { cycleId: input.cycleId, note: "Rounding residuals + division remainder + undistributed pools" },
    });
  }

  for (const a of allocations) {
    ledgerEntries.push({
      entryId: mkEntryId("wallet_credit_gain", input.cycleId, seq++),
      type: "wallet_credit_gain",
      userId: a.userId,
      amountCents: a.amountCents,
      currency,
      status: "posted",
      occurredAt: closedAtIso,
      meta: {
        cycleId: input.cycleId,
        bucket: a.bucket,
        role: a.role,
        grossCents: a.grossCents,
        roundingResidualCents: a.roundingResidualCents,
        ...a.meta,
      },
    });
  }

  return {
    cycleId: input.cycleId,
    currency,
    grossEligibleCents: G,
    platformTakeCents: platformTake,
    platformFeeCents: platformFeeGross,
    platformResidualCents: platformResidual,
    totalUserPayoutCents: totalUserPayout,
    allocations,
    ledgerEntries,
    warnings,
  };
}
