import fs from "node:fs";

const html = fs.readFileSync("site/index.html", "utf8");
const markers = [
  "CyberArk Privilege Drift Ledger",
  "standing privilege",
  "Rotation breaches",
  "Primary recommendation",
];

for (const marker of markers) {
  if (!html.includes(marker)) {
    throw new Error(`Missing smoke marker: ${marker}`);
  }
}

console.log("Smoke check passed");

