import fs from "node:fs";
import { loadLedger } from "../src/index.js";

const ledger = loadLedger("fixtures/cyberark-privilege-sample.json");
fs.mkdirSync("site", { recursive: true });
fs.copyFileSync("fixtures/cyberark-privilege-sample.json", "site/ledger.json");

const laneCards = ledger.lanes
  .map(
    (lane) => `<article class="lane">
      <p class="eyebrow">${lane.severity} drift</p>
      <h3>${lane.name}</h3>
      <p>${lane.exposureStory}</p>
      <dl>
        <div><dt>Score</dt><dd>${lane.driftScore}</dd></div>
        <div><dt>Owner</dt><dd>${lane.owner}</dd></div>
        <div><dt>Systems</dt><dd>${lane.criticalSystems.join(", ")}</dd></div>
      </dl>
      <strong>Next move</strong>
      <p>${lane.nextAction}</p>
    </article>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CyberArk Privilege Drift Ledger</title>
  <meta name="description" content="Board-ready CyberArk privilege drift ledger for standing access, stale safes, unmanaged sessions, and owner-bound remediation posture." />
  <style>
    :root {
      color-scheme: dark;
      --bg: #060b12;
      --panel: #101a28;
      --panel-2: #121f31;
      --text: #f5f2ea;
      --muted: #aeb8c8;
      --cyan: #31e6ff;
      --mint: #55f0b4;
      --amber: #ffd166;
      --line: rgba(49, 230, 255, 0.22);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at 80% 10%, rgba(85, 240, 180, 0.12), transparent 34rem), linear-gradient(135deg, #050814, var(--bg));
      color: var(--text);
      font-family: "Segoe UI", "Aptos", sans-serif;
    }
    main { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 34px 0 56px; }
    .hero {
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: clamp(28px, 6vw, 72px);
      background: linear-gradient(135deg, rgba(16, 26, 40, 0.94), rgba(5, 11, 18, 0.88));
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
    }
    .brand { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-bottom: 48px; }
    .mark { color: var(--mint); letter-spacing: 0.2em; font-size: 12px; text-transform: uppercase; }
    .pill { border: 1px solid rgba(85,240,180,.32); border-radius: 999px; padding: 10px 14px; color: var(--muted); }
    h1 { font-size: clamp(48px, 9vw, 112px); line-height: .86; letter-spacing: -0.075em; margin: 0 0 28px; max-width: 980px; }
    .lede { max-width: 820px; color: var(--muted); font-size: clamp(18px, 2vw, 24px); line-height: 1.55; }
    .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 34px; }
    .metric, .lane, .rec, .proof-card { background: rgba(16, 26, 40, .78); border: 1px solid rgba(174,184,200,.14); border-radius: 20px; padding: 22px; }
    .metric b { display: block; font-size: 36px; letter-spacing: -0.04em; color: var(--cyan); }
    .metric span, .eyebrow { color: var(--muted); text-transform: uppercase; letter-spacing: .16em; font-size: 11px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 22px; }
    h2 { font-size: clamp(34px, 5vw, 64px); line-height: .95; letter-spacing: -0.055em; margin: 54px 0 18px; }
    h3 { font-size: 25px; margin: 8px 0 12px; letter-spacing: -0.035em; }
    p { color: var(--muted); line-height: 1.55; }
    dl { display: grid; gap: 10px; margin: 20px 0; }
    dt { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .14em; }
    dd { margin: 4px 0 0; }
    .rec { border-color: rgba(85,240,180,.3); margin-top: 18px; }
    .proof { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:18px; margin-top:18px; }
    .proof-card h3 { margin:8px 0 10px; }
    footer { color: var(--muted); padding: 30px 0 0; display: flex; gap: 18px; flex-wrap: wrap; }
    a { color: var(--cyan); }
    @media (max-width: 780px) {
      .metrics, .grid, .proof { grid-template-columns: 1fr; }
      .brand { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="brand">
        <div class="mark">Kinetic Gain / CyberArk</div>
        <div class="pill">Privileged access drift ledger</div>
      </div>
      <h1>Where is standing privilege becoming board-visible exposure?</h1>
      <p class="lede">CyberArk Privilege Drift Ledger turns stale safes, unmanaged privileged sessions, rotation breaches, and break-glass sprawl into an owner-bound remediation surface.</p>
      <div class="metrics">
        <div class="metric"><b>${ledger.estateScore}</b><span>Estate drift score</span></div>
        <div class="metric"><b>${ledger.standingAccounts}</b><span>Standing accounts</span></div>
        <div class="metric"><b>${ledger.unmanagedSessions}</b><span>Unmanaged sessions</span></div>
        <div class="metric"><b>${ledger.rotationSlaBreaches}</b><span>Rotation breaches</span></div>
      </div>
    </section>
    <h2>Privilege lanes with explicit owners and next moves.</h2>
    <section class="grid">${laneCards}</section>
    <section class="rec">
      <p class="eyebrow">Primary recommendation</p>
      <h3>${ledger.recommendation}</h3>
      <p>Use this as a diligence packet for CyberArk, PAM, IAM, and security-governance review without exposing raw vault data.</p>
    </section>
    <section class="proof" aria-label="Product depth and shared pattern">
      <article class="proof-card"><p class="eyebrow">Product purpose</p><h3>What this product does</h3><p>Turns stale safes, unmanaged sessions, standing accounts, rotation breaches, break-glass sprawl, and owner gaps into a remediation ledger for security and audit leaders.</p></article>
      <article class="proof-card"><p class="eyebrow">Buyer lens</p><h3>Why executives care</h3><p>Privileged access risk is expensive because it is usually discovered after an audit, incident, or control failure. This makes the exposure visible while there is still time to fix it.</p></article>
      <article class="proof-card"><p class="eyebrow">Value architecture</p><h3>How it turns into action</h3><p>The ledger assigns each drift lane an owner and next move so teams can shrink standing access, close rotation gaps, and prove CyberArk value without raw vault exports.</p></article>
      <article class="proof-card"><p class="eyebrow">Technical proof</p><h3>What reviewers can inspect</h3><p>The repo keeps synthetic ledger data, deterministic rendering, public JSON, and CI-verifiable output together while avoiding secrets, session logs, and production IAM records.</p></article>
      <article class="proof-card"><p class="eyebrow">What these repos have in common</p><h3>Platform complexity becomes board-ready operating proof.</h3><p>Each repo names a buyer pain, exposes an evidence model, produces a reusable decision surface, and keeps the demo boundary safe with synthetic data.</p></article>
      <article class="proof-card"><p class="eyebrow">Interlinks</p><h3>Where this fits</h3><p><a href="https://portfolio.kineticgain.com/">Portfolio</a> · <a href="https://kineticgain.com/">Kinetic Gain</a> · <a href="https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger">GitHub</a></p></article>
    </section>
    <footer>
      <span>CyberArk Privilege Drift Ledger</span>
      <a href="ledger.json">ledger.json</a>
      <a href="https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger">GitHub</a>
    </footer>
  </main>
</body>
</html>`;

fs.writeFileSync("site/index.html", html);
fs.writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  "site/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://mizcausevic-dev.github.io/cyberark-privilege-drift-ledger/</loc></url></urlset>',
);
console.log("Prerendered site/index.html");
