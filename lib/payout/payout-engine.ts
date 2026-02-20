import {
  Bucket,
  LedgerEntry,
  PayoutAllocation,
  PayoutEngineInput,
  PayoutEngineOutput,
  Currency,
} from "./types";
import {
  FILMS_VISUAL_BPS,
  FILMS_INVESTOR_TOP10_RANK_BPS,
  FILMS_CREATOR_TOP10_RANK_BPS,
  FILMS_INVESTOR_11_100_BPS,
  PODCASTS_POT_CREATORS_PERCENT,
  PODCASTS_POT_INVESTORS_PERCENT,
  PODCASTS_POT_VISUAL_PERCENT,
  PODCASTS_POT_BONUS_PERCENT,
  PODCASTS_ANTI_CAPTURE_MAX_VOTE_SHARE,
  VOIXINFO_POT_AUTHORS_TOP10_PERCENT,
  VOIXINFO_POT_READERS_PERCENT,
  LIVRES_POT_AUTHORS_TOP10_PERCENT,
  LIVRES_POT_INVESTIREADERS_PERCENT,
} from "./constants";

/**
 * VISUAL Payout Engine V2 — Multi-category support
 *
 * Formulas by category (source: "VISUAL - Formules Mathematiques"):
 * ───────────────────────────────────────────
 * FILMS / VIDEOS / DOCS:
 *   40% Investisseurs TOP10 (rank-weighted BPS)
 *   30% Porteurs TOP10 (rank-weighted BPS)
 *    7% Investisseurs rangs 11-100 (equal split)
 *   23% VISUAL (plateforme)
 *
 * PODCASTS (pot mensuel):
 *   40% Podcasteurs (pro-rata score_audio)
 *   30% Auditeurs investisseurs (pro-rata votes * listen_score, cap 20%)
 *   20% VISUAL
 *   10% Bonus Pool (TOP10 primes + events)
 *
 * VOIX DE L'INFO (pot quotidien):
 *   60% Auteurs TOP10 (pro-rata score)
 *   40% Lecteurs gagnants (pro-rata votes ponderes)
 *
 * LIVRES (pot mensuel):
 *   60% Auteurs TOP10 (pro-rata score)
 *   40% Investi-lecteurs gagnants (pro-rata votes ponderes)
 *
 * Vente unitaire (Voix Info, Livres, Podcasts): 70/30 (auteur/VISUAL)
 * ───────────────────────────────────────────
 *
 * IMPORTANT: payouts are euro-floor rounded (down to the nearest euro),
 * and the removed cents are captured by VISUAL as residuals.
 */

// Basis points (bps) = 1/100 of a percent (0.01%). 10000 bps = 100%.
const BPS_DENOM = 10000;

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
  const category = input.category ?? "films";

  if (!Number.isInteger(input.grossEligibleCents) || input.grossEligibleCents < 0) {
    throw new Error("grossEligibleCents must be a non-negative integer (cents).");
  }

  const G = input.grossEligibleCents;
  const allocations: PayoutAllocation[] = [];
  let residualTotal = 0;
  let platformFeeGross = 0;

  // ── FILMS / VIDEOS / DOCUMENTAIRES: 40/30/7/23 ──
  if (category === "films") {
    assertArrayLen("top10Investors", input.top10Investors, 10, warnings);
    assertArrayLen("top10Creators", input.top10Creators, 10, warnings);

    // Sanity: 40 + 30 + 7 + 23 = 100
    const totalBps = sum(FILMS_INVESTOR_TOP10_RANK_BPS.slice()) + sum(FILMS_CREATOR_TOP10_RANK_BPS.slice()) + FILMS_INVESTOR_11_100_BPS + FILMS_VISUAL_BPS;
    if (totalBps !== BPS_DENOM) warnings.push(`Films total BPS expected 10000, got ${totalBps}.`);

    platformFeeGross = mulBpsFloor(G, FILMS_VISUAL_BPS); // 23%

    // Investisseurs TOP10 (40% rank-weighted)
    for (let r = 0; r < Math.min(10, input.top10Investors.length); r++) {
      const winner = input.top10Investors[r];
      const gross = mulBpsFloor(G, FILMS_INVESTOR_TOP10_RANK_BPS[r]);
      const { floored, residual } = euroFloor(gross);
      residualTotal += residual;
      allocations.push({
        userId: winner.userId, role: winner.role, bucket: "INV_TOP10",
        amountCents: floored, grossCents: gross, roundingResidualCents: residual,
        currency, meta: { cycleId: input.cycleId, rank: r + 1, bps: FILMS_INVESTOR_TOP10_RANK_BPS[r], category },
      });
    }

    // Porteurs TOP10 (30% rank-weighted)
    for (let r = 0; r < Math.min(10, input.top10Creators.length); r++) {
      const winner = input.top10Creators[r];
      const gross = mulBpsFloor(G, FILMS_CREATOR_TOP10_RANK_BPS[r]);
      const { floored, residual } = euroFloor(gross);
      residualTotal += residual;
      allocations.push({
        userId: winner.userId, role: winner.role, bucket: "PORTEUR_TOP10",
        amountCents: floored, grossCents: gross, roundingResidualCents: residual,
        currency, meta: { cycleId: input.cycleId, rank: r + 1, bps: FILMS_CREATOR_TOP10_RANK_BPS[r], category },
      });
    }

    // Investisseurs rangs 11-100 (7% equal split)
    const eligible = input.investors11to100 ?? [];
    const pool11_100Gross = mulBpsFloor(G, FILMS_INVESTOR_11_100_BPS);

    if (eligible.length === 0) {
      residualTotal += pool11_100Gross;
      warnings.push("No eligible investors11to100 provided; 7% pool is captured by VISUAL.");
    } else {
      const perUserGross = Math.floor(pool11_100Gross / eligible.length);
      for (let i = 0; i < eligible.length; i++) {
        const u = eligible[i];
        const { floored, residual } = euroFloor(perUserGross);
        residualTotal += residual;
        allocations.push({
          userId: u.userId, role: u.role, bucket: "INV_11_100",
          amountCents: floored, grossCents: perUserGross, roundingResidualCents: residual,
          currency, meta: { cycleId: input.cycleId, group: "11-100", poolGrossCents: pool11_100Gross, eligibleCount: eligible.length, category },
        });
      }
      const divisionRemainder = pool11_100Gross - perUserGross * eligible.length;
      if (divisionRemainder > 0) residualTotal += divisionRemainder;
    }
  }

  // ── PODCASTS: 40/30/20/10 ──
  else if (category === "podcasts") {
    const creatorsPool = Math.floor((G * PODCASTS_POT_CREATORS_PERCENT) / 100);
    const investorsPool = Math.floor((G * PODCASTS_POT_INVESTORS_PERCENT) / 100);
    const bonusPool = Math.floor((G * PODCASTS_POT_BONUS_PERCENT) / 100);
    platformFeeGross = Math.floor((G * PODCASTS_POT_VISUAL_PERCENT) / 100);

    // 40% Podcasteurs (pro-rata score_audio via rank)
    for (let r = 0; r < Math.min(10, input.top10Creators.length); r++) {
      const creator = input.top10Creators[r];
      // Weight by inverse rank (simple: 10-r)
      const weight = 10 - r;
      const totalWeight = 55; // sum(1..10) = 55
      const gross = Math.floor((creatorsPool * weight) / totalWeight);
      const { floored, residual } = euroFloor(gross);
      residualTotal += residual;
      allocations.push({
        userId: creator.userId, role: creator.role, bucket: "PODCAST_CREATORS",
        amountCents: floored, grossCents: gross, roundingResidualCents: residual,
        currency, meta: { cycleId: input.cycleId, rank: r + 1, weight, category },
      });
    }

    // 30% Auditeurs investisseurs (pro-rata votes * listen_score, cap 20%)
    const allInvestors = [...input.top10Investors, ...(input.investors11to100 ?? [])];
    const totalGlobalVotes = input.totalGlobalVotes ?? allInvestors.length;
    const listenScores = input.listenScores ?? {};

    // Compute weights with anti-capture cap
    const investorWeights = allInvestors.map((inv, idx) => {
      const ls = listenScores[inv.userId] ?? 0.5;
      let effectiveVotes = idx + 1 <= 10 ? (10 - idx) : 1; // simplified vote count
      // Apply anti-capture cap
      if (totalGlobalVotes > 0 && effectiveVotes / totalGlobalVotes > PODCASTS_ANTI_CAPTURE_MAX_VOTE_SHARE) {
        effectiveVotes = Math.floor(totalGlobalVotes * PODCASTS_ANTI_CAPTURE_MAX_VOTE_SHARE);
        warnings.push(`Anti-capture cap applied to ${inv.userId}: votes capped at 20% of global.`);
      }
      return { ...inv, weight: effectiveVotes * ls };
    });
    const totalInvWeight = investorWeights.reduce((s, w) => s + w.weight, 0);

    if (totalInvWeight === 0) {
      residualTotal += investorsPool;
      warnings.push("No investor weights for podcasts; 30% pool captured by VISUAL.");
    } else {
      for (const iw of investorWeights) {
        const gross = Math.floor((investorsPool * iw.weight) / totalInvWeight);
        const { floored, residual } = euroFloor(gross);
        residualTotal += residual;
        allocations.push({
          userId: iw.userId, role: iw.role, bucket: "PODCAST_INVESTORS",
          amountCents: floored, grossCents: gross, roundingResidualCents: residual,
          currency, meta: { cycleId: input.cycleId, weight: iw.weight, category },
        });
      }
    }

    // 10% Bonus pool — allocated to platform for redistribution
    residualTotal += bonusPool;
  }

  // ── VOIX DE L'INFO: pot quotidien 60/40 ──
  else if (category === "voix_info") {
    const authorsPool = Math.floor((G * VOIXINFO_POT_AUTHORS_TOP10_PERCENT) / 100);
    const readersPool = Math.floor((G * VOIXINFO_POT_READERS_PERCENT) / 100);
    platformFeeGross = G - authorsPool - readersPool; // remainder to VISUAL

    // 60% Auteurs TOP10 (rank-weighted: 10, 9, 8, ..., 1)
    const totalRankWeight = 55;
    for (let r = 0; r < Math.min(10, input.top10Creators.length); r++) {
      const author = input.top10Creators[r];
      const weight = 10 - r;
      const gross = Math.floor((authorsPool * weight) / totalRankWeight);
      const { floored, residual } = euroFloor(gross);
      residualTotal += residual;
      allocations.push({
        userId: author.userId, role: author.role, bucket: "AUTHORS_TOP10",
        amountCents: floored, grossCents: gross, roundingResidualCents: residual,
        currency, meta: { cycleId: input.cycleId, rank: r + 1, weight, category },
      });
    }

    // 40% Lecteurs gagnants (equal split among eligible)
    const readers = [...input.top10Investors, ...(input.investors11to100 ?? [])];
    if (readers.length === 0) {
      residualTotal += readersPool;
      warnings.push("No eligible readers for Voix de l'Info; 40% pool captured by VISUAL.");
    } else {
      const perReader = Math.floor(readersPool / readers.length);
      for (const reader of readers) {
        const { floored, residual } = euroFloor(perReader);
        residualTotal += residual;
        allocations.push({
          userId: reader.userId, role: reader.role, bucket: "READERS_GAGNANTS",
          amountCents: floored, grossCents: perReader, roundingResidualCents: residual,
          currency, meta: { cycleId: input.cycleId, category },
        });
      }
      const divRem = readersPool - perReader * readers.length;
      if (divRem > 0) residualTotal += divRem;
    }
  }

  // ── LIVRES: pot mensuel 60/40 ──
  else if (category === "livres") {
    const authorsPool = Math.floor((G * LIVRES_POT_AUTHORS_TOP10_PERCENT) / 100);
    const investiReadersPool = Math.floor((G * LIVRES_POT_INVESTIREADERS_PERCENT) / 100);
    platformFeeGross = G - authorsPool - investiReadersPool;

    // 60% Auteurs TOP10
    const totalRankWeight = 55;
    for (let r = 0; r < Math.min(10, input.top10Creators.length); r++) {
      const author = input.top10Creators[r];
      const weight = 10 - r;
      const gross = Math.floor((authorsPool * weight) / totalRankWeight);
      const { floored, residual } = euroFloor(gross);
      residualTotal += residual;
      allocations.push({
        userId: author.userId, role: author.role, bucket: "AUTHORS_TOP10",
        amountCents: floored, grossCents: gross, roundingResidualCents: residual,
        currency, meta: { cycleId: input.cycleId, rank: r + 1, weight, category },
      });
    }

    // 40% Investi-lecteurs gagnants
    const readers = [...input.top10Investors, ...(input.investors11to100 ?? [])];
    if (readers.length === 0) {
      residualTotal += investiReadersPool;
      warnings.push("No eligible investi-lecteurs for Livres; 40% pool captured by VISUAL.");
    } else {
      const perReader = Math.floor(investiReadersPool / readers.length);
      for (const reader of readers) {
        const { floored, residual } = euroFloor(perReader);
        residualTotal += residual;
        allocations.push({
          userId: reader.userId, role: reader.role, bucket: "READERS_GAGNANTS",
          amountCents: floored, grossCents: perReader, roundingResidualCents: residual,
          currency, meta: { cycleId: input.cycleId, category },
        });
      }
      const divRem = investiReadersPool - perReader * readers.length;
      if (divRem > 0) residualTotal += divRem;
    }
  }

  // ── Finalization (all categories) ──
  const totalUserPayout = allocations.reduce((acc, a) => acc + a.amountCents, 0);
  const platformTake = G - totalUserPayout;
  const platformResidual = platformTake - platformFeeGross;

  if (platformTake < 0) {
    throw new Error("Computed payouts exceed grossEligibleCents. Check formula inputs.");
  }
  if (platformResidual < 0) {
    warnings.push("Platform residual is negative. This indicates rounding or percentage inconsistencies.");
  }

  // Ledger entries
  const ledgerEntries: LedgerEntry[] = [];
  let seq = 0;

  ledgerEntries.push({
    entryId: mkEntryId("platform_fee", input.cycleId, seq++),
    type: "platform_fee",
    amountCents: platformFeeGross,
    currency, status: "posted", occurredAt: closedAtIso,
    meta: { cycleId: input.cycleId, category, basis: "grossEligibleCents" },
  });

  if (platformResidual !== 0) {
    ledgerEntries.push({
      entryId: mkEntryId("platform_residual", input.cycleId, seq++),
      type: "platform_residual",
      amountCents: platformResidual,
      currency, status: "posted", occurredAt: closedAtIso,
      meta: { cycleId: input.cycleId, category, note: "Rounding residuals + division remainder + undistributed pools" },
    });
  }

  for (const a of allocations) {
    ledgerEntries.push({
      entryId: mkEntryId("wallet_credit_gain", input.cycleId, seq++),
      type: "wallet_credit_gain",
      userId: a.userId,
      amountCents: a.amountCents,
      currency, status: "posted", occurredAt: closedAtIso,
      meta: {
        cycleId: input.cycleId, bucket: a.bucket, role: a.role, category,
        grossCents: a.grossCents, roundingResidualCents: a.roundingResidualCents,
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
