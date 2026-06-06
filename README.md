# cyberark-privilege-drift-ledger

[![ci](https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger/actions/workflows/ci.yml)
[![pages](https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/cyberark-privilege-drift-ledger/actions/workflows/pages.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

Board-ready CyberArk privilege drift ledger for standing access, stale safes, unmanaged sessions, rotation SLA breaches, break-glass sprawl, and owner-bound remediation posture.

## Why this exists

- Privileged-access drift is usually buried in vault exports, session logs, and recertification queues.
- Executives need a board-readable answer: where standing privilege is exposed, who owns it, and what should move first.
- This repo turns CyberArk/PAM evidence into a reusable diligence surface without exposing raw vault data.

## What it ships

- `TypeScript` scoring library and CLI for privilege drift evidence.
- `Python` board-pack generator for diligence review.
- Static executive surface with a machine-readable `ledger.json`.
- Fixture-driven validation for stale safes, unmanaged sessions, rotation breaches, break-glass accounts, and review age.

## Routes

- `/` executive privilege drift surface
- `/ledger.json` machine-readable scored ledger

## Local run

```bash
npm install
npm run verify
npm run prerender
```

## CLI

```bash
npm run build
node dist/cli.js fixtures/cyberark-privilege-sample.json markdown
```

## Python diligence pack

```bash
python python/cyberark_privilege_drift/pack.py fixtures/cyberark-privilege-sample.json --format markdown
```

## Strategic fit

This is a Kinetic Gain Protocol-aligned identity-security surface: it turns CyberArk/PAM evidence into board-ready privilege decisions across IAM, cloud, database, and vendor access lanes.

