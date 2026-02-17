import { describe, it, expect } from "vitest";
import { computePayoutAllocations } from "./payout-engine";

describe("computePayoutAllocations (VISUAL V1)", () => {
  it("keeps totals consistent: platformTake + userPayout == grossEligible", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_001",
      grossEligibleCents: 123_456_78, // 123,456.78€
      top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `inv_${i+1}`, role: "investor" })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `port_${i+1}`, role: "porter" })),
      investors11to100: Array.from({ length: 90 }, (_, i) => ({ userId: `inv11_${i+11}`, role: "investor" })),
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    expect(out.platformFeeCents).toBeGreaterThan(0);
    expect(out.allocations.length).toBe(10 + 10 + 90);
  });

  it("captures 23% pool when no eligible investors11to100 are provided", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_002",
      grossEligibleCents: 10_000_00, // 10,000€
      top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `inv_${i+1}`, role: "investor" })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `port_${i+1}`, role: "porter" })),
      investors11to100: [],
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.warnings.some(w => w.includes("23% pool is captured"))).toBe(true);
    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
  });
});
