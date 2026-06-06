import { describe, expect, it } from "vitest";
import { buildLedger, classifySeverity, renderMarkdown } from "../src/index.js";
import sample from "../fixtures/cyberark-privilege-sample.json" with { type: "json" };

describe("CyberArk privilege drift ledger", () => {
  it("scores and sorts privilege lanes by drift", () => {
    const ledger = buildLedger(sample);
    expect(ledger.lanes).toHaveLength(4);
    expect(ledger.lanes[0]?.name).toBe("Domain admin safes");
    expect(ledger.estateScore).toBeGreaterThan(50);
    expect(ledger.standingAccounts).toBe(116);
  });

  it("classifies severity thresholds", () => {
    expect(classifySeverity(82)).toBe("critical");
    expect(classifySeverity(70)).toBe("high");
    expect(classifySeverity(50)).toBe("moderate");
    expect(classifySeverity(20)).toBe("low");
  });

  it("renders board-readable markdown", () => {
    const markdown = renderMarkdown(buildLedger(sample));
    expect(markdown).toContain("Board ledger");
    expect(markdown).toContain("Vendor maintenance access");
    expect(markdown).toContain("Recommendation");
  });
});
