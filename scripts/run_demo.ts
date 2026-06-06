import { loadLedger, renderMarkdown } from "../src/index.js";

const ledger = loadLedger("fixtures/cyberark-privilege-sample.json");
console.log(renderMarkdown(ledger));

