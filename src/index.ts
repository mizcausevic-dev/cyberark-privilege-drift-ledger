import fs from "node:fs";

export interface PrivilegeLane {
  name: string;
  owner: string;
  businessUnit: string;
  standingAccounts: number;
  staleSafes: number;
  unmanagedSessions: number;
  rotationSlaBreaches: number;
  breakGlassAccounts: number;
  lastReviewedDays: number;
  criticalSystems: string[];
  nextAction: string;
}

export interface PrivilegeInput {
  generatedAt: string;
  portfolio: string;
  lanes: PrivilegeLane[];
}

export interface ScoredPrivilegeLane extends PrivilegeLane {
  driftScore: number;
  severity: "low" | "moderate" | "high" | "critical";
  exposureStory: string;
}

export interface PrivilegeLedger {
  generatedAt: string;
  portfolio: string;
  estateScore: number;
  criticalLaneCount: number;
  standingAccounts: number;
  unmanagedSessions: number;
  staleSafes: number;
  rotationSlaBreaches: number;
  lanes: ScoredPrivilegeLane[];
  recommendation: string;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function classifySeverity(score: number): ScoredPrivilegeLane["severity"] {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "moderate";
  return "low";
}

export function scoreLane(lane: PrivilegeLane): ScoredPrivilegeLane {
  const accountPressure = lane.standingAccounts * 0.55;
  const staleSafePressure = lane.staleSafes * 4.5;
  const sessionPressure = lane.unmanagedSessions * 2.2;
  const rotationPressure = lane.rotationSlaBreaches * 3.8;
  const breakGlassPressure = lane.breakGlassAccounts * 5.5;
  const reviewPressure = Math.max(0, lane.lastReviewedDays - 21) * 0.65;
  const driftScore = clampScore(
    accountPressure +
      staleSafePressure +
      sessionPressure +
      rotationPressure +
      breakGlassPressure +
      reviewPressure,
  );
  const severity = classifySeverity(driftScore);
  return {
    ...lane,
    driftScore,
    severity,
    exposureStory: `${lane.name} has ${lane.standingAccounts} standing privileged accounts, ${lane.unmanagedSessions} unmanaged sessions, and ${lane.rotationSlaBreaches} rotation SLA breaches tied to ${lane.owner}.`,
  };
}

export function buildLedger(input: PrivilegeInput): PrivilegeLedger {
  if (!Array.isArray(input.lanes) || input.lanes.length === 0) {
    throw new Error("Privilege ledger requires at least one lane.");
  }
  const lanes = input.lanes.map(scoreLane).sort((a, b) => b.driftScore - a.driftScore);
  const estateScore = clampScore(lanes.reduce((sum, lane) => sum + lane.driftScore, 0) / lanes.length);
  const criticalLaneCount = lanes.filter((lane) => lane.severity === "critical").length;
  const totals = lanes.reduce(
    (acc, lane) => {
      acc.standingAccounts += lane.standingAccounts;
      acc.unmanagedSessions += lane.unmanagedSessions;
      acc.staleSafes += lane.staleSafes;
      acc.rotationSlaBreaches += lane.rotationSlaBreaches;
      return acc;
    },
    { standingAccounts: 0, unmanagedSessions: 0, staleSafes: 0, rotationSlaBreaches: 0 },
  );
  const riskiest = lanes[0];
  return {
    generatedAt: input.generatedAt,
    portfolio: input.portfolio,
    estateScore,
    criticalLaneCount,
    ...totals,
    lanes,
    recommendation: `Start with ${riskiest.name}: ${riskiest.nextAction}`,
  };
}

export function loadLedger(path: string): PrivilegeLedger {
  const input = JSON.parse(fs.readFileSync(path, "utf8")) as PrivilegeInput;
  return buildLedger(input);
}

export function renderMarkdown(ledger: PrivilegeLedger): string {
  const rows = ledger.lanes
    .map(
      (lane) =>
        `| ${lane.name} | ${lane.severity} | ${lane.driftScore} | ${lane.owner} | ${lane.nextAction} |`,
    )
    .join("\n");
  return [
    `# ${ledger.portfolio}`,
    "",
    `Estate privilege drift score: **${ledger.estateScore}**`,
    "",
    `Standing privileged accounts: **${ledger.standingAccounts}**`,
    `Unmanaged sessions: **${ledger.unmanagedSessions}**`,
    `Rotation SLA breaches: **${ledger.rotationSlaBreaches}**`,
    "",
    "## Board ledger",
    "",
    "| Lane | Severity | Drift score | Owner | Next action |",
    "| --- | --- | ---: | --- | --- |",
    rows,
    "",
    `## Recommendation`,
    "",
    ledger.recommendation,
    "",
  ].join("\n");
}

