import { describe, it, expect } from "vitest";
import { computePayoutAllocations } from "./payout-engine";

describe("computePayoutAllocations — FILMS 40/30/7/23", () => {
  it("keeps totals consistent: platformTake + userPayout == grossEligible", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_001",
      category: "films",
      grossEligibleCents: 123_456_78,
      top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `inv_${i+1}`, role: "investor" as const })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `port_${i+1}`, role: "porter" as const })),
      investors11to100: Array.from({ length: 90 }, (_, i) => ({ userId: `inv11_${i+11}`, role: "investor" as const })),
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    expect(out.platformFeeCents).toBeGreaterThan(0);
    expect(out.allocations.length).toBe(10 + 10 + 90);
  });

  it("VISUAL gets 23% (not 7%) — films formula", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_films_pct",
      category: "films",
      grossEligibleCents: 10_000_00, // 10,000 EUR
      top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `inv_${i+1}`, role: "investor" as const })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `port_${i+1}`, role: "porter" as const })),
      investors11to100: Array.from({ length: 50 }, (_, i) => ({ userId: `inv11_${i+11}`, role: "investor" as const })),
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    // 23% of 10,000 EUR = 2,300 EUR base fee
    expect(out.platformFeeCents).toBe(230000);
    // 7% pool for 11-100 investors (not 23% as before)
    const inv11_100 = out.allocations.filter(a => a.bucket === "INV_11_100");
    expect(inv11_100.length).toBe(50);
  });

  it("captures 7% pool when no eligible investors11to100 are provided", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_002",
      category: "films",
      grossEligibleCents: 10_000_00,
      top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `inv_${i+1}`, role: "investor" as const })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `port_${i+1}`, role: "porter" as const })),
      investors11to100: [],
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.warnings.some(w => w.includes("7% pool is captured"))).toBe(true);
    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
  });
});

describe("computePayoutAllocations — PODCASTS 40/30/20/10 (bonus 6/2/2)", () => {
  const podInput = {
    cycleId: "cycle_pod_001",
    category: "podcasts" as const,
    grossEligibleCents: 50_000_00, // 50,000 EUR
    top10Investors: Array.from({ length: 10 }, (_, i) => ({ userId: `aud_${i+1}`, role: "listener" as const })),
    top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `pod_${i+1}`, role: "podcaster" as const })),
    investors11to100: Array.from({ length: 20 }, (_, i) => ({ userId: `aud11_${i+11}`, role: "listener" as const })),
    closedAtIso: "2026-02-17T12:00:00.000Z",
  };

  it("keeps totals consistent for podcasts", () => {
    const out = computePayoutAllocations(podInput);

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    // VISUAL gets 20% = 10,000 EUR base
    expect(out.platformFeeCents).toBe(1000000);
    // Podcast creators bucket (base 40%)
    const creators = out.allocations.filter(a => a.bucket === "PODCAST_CREATORS");
    expect(creators.length).toBe(10);
    // Podcast investors bucket
    const investors = out.allocations.filter(a => a.bucket === "PODCAST_INVESTORS");
    expect(investors.length).toBe(30); // 10 + 20
  });

  it("distributes bonus 6% as performance primes to TOP10 podcasters", () => {
    const out = computePayoutAllocations(podInput);

    const bonusAllocations = out.allocations.filter(a => a.bucket === "PODCAST_BONUS");
    // 6% primes are distributed to 10 podcasters
    expect(bonusAllocations.length).toBe(10);
    // Total bonus primes should be close to 6% of G = 3000 EUR (before rounding)
    const totalBonusGross = bonusAllocations.reduce((s, a) => s + a.grossCents, 0);
    const sixPercent = Math.floor((50_000_00 * 6) / 100);
    expect(totalBonusGross).toBeLessThanOrEqual(sixPercent);
    // Rank 1 gets more than rank 10
    expect(bonusAllocations[0].grossCents).toBeGreaterThan(bonusAllocations[9].grossCents);
  });

  it("supports model alias 'podcast' -> category 'podcasts'", () => {
    const out = computePayoutAllocations({
      ...podInput,
      category: undefined as unknown as "podcasts",
      model: "podcast",
    });

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    const creators = out.allocations.filter(a => a.bucket === "PODCAST_CREATORS");
    expect(creators.length).toBe(10);
  });
});

describe("computePayoutAllocations — VOIX DE L'INFO 60/40", () => {
  it("keeps totals consistent for voix_info", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_vi_001",
      category: "voix_info",
      grossEligibleCents: 20_000_00,
      top10Investors: Array.from({ length: 5 }, (_, i) => ({ userId: `reader_${i+1}`, role: "investireader" as const })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `author_${i+1}`, role: "infoporter" as const })),
      investors11to100: [],
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    const authors = out.allocations.filter(a => a.bucket === "AUTHORS_TOP10");
    expect(authors.length).toBe(10);
    const readers = out.allocations.filter(a => a.bucket === "READERS_GAGNANTS");
    expect(readers.length).toBe(5);
  });
});

describe("computePayoutAllocations — LIVRES 60/40", () => {
  it("keeps totals consistent for livres", () => {
    const out = computePayoutAllocations({
      cycleId: "cycle_livres_001",
      category: "livres",
      grossEligibleCents: 30_000_00,
      top10Investors: Array.from({ length: 8 }, (_, i) => ({ userId: `ir_${i+1}`, role: "investireader" as const })),
      top10Creators: Array.from({ length: 10 }, (_, i) => ({ userId: `auteur_${i+1}`, role: "infoporter" as const })),
      investors11to100: Array.from({ length: 15 }, (_, i) => ({ userId: `ir11_${i+11}`, role: "investireader" as const })),
      closedAtIso: "2026-02-17T12:00:00.000Z",
    });

    expect(out.platformTakeCents + out.totalUserPayoutCents).toBe(out.grossEligibleCents);
    const authors = out.allocations.filter(a => a.bucket === "AUTHORS_TOP10");
    expect(authors.length).toBe(10);
    const readers = out.allocations.filter(a => a.bucket === "READERS_GAGNANTS");
    expect(readers.length).toBe(23); // 8 + 15
  });
});
