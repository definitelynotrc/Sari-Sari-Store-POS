# Sari-Sari Store POS

Point of sale for one sari-sari counter. React and Next.js. No barcode scanner.

This PR is the architecture. There is no running app yet.

## v1

- Product list and name search
- Inventory counts
- Tap or search to check out
- Sales totals for day, month, and year (`Asia/Manila`)
- Alerts for low stock and products that are not selling

No utang. No barcode. Extra ideas are listed in [docs/architecture/later-features.md](docs/architecture/later-features.md) and wait for a yes.

## Read these

1. [docs/architecture/grounding.md](docs/architecture/grounding.md) — what v1 is
2. [docs/architecture/rationale.md](docs/architecture/rationale.md) — why this shape
3. [docs/architecture/module-map.md](docs/architecture/module-map.md) — kernel, adapters, UI
4. [src/kernel](src/kernel) — types and function signatures (`not implemented`)

## First code after this plan

Implement `checkout` with tests for price snapshots, stock decrement, insufficient stock, and retry of the same command id.
