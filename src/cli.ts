#!/usr/bin/env node
import { loadLedger, renderMarkdown } from "./index.js";

const [, , fixturePath, format = "json"] = process.argv;

if (!fixturePath) {
  console.error("Usage: cyberark-privilege-drift-ledger <fixture.json> [json|markdown]");
  process.exit(1);
}

const ledger = loadLedger(fixturePath);

if (format === "markdown") {
  console.log(renderMarkdown(ledger));
} else {
  console.log(JSON.stringify(ledger, null, 2));
}

