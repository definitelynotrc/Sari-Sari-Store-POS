# Rationale

## Problem

This is a greenfield React and Next.js POS for one sari-sari counter. The owner wants a normal cash register: find a product by name, keep a count, complete a sale with taps (no scanner), see peso totals for day, month, and year, and get told when something is low or dead on the shelf.

The first brief also asked for utang and for a "modern" shape that could have grown into an event log, a sync protocol, and a customer ledger. The owner cut utang and barcodes, and asked that every extra idea be proposed, not built. The non-obvious part is what to refuse. A sari-sari store really does sell by tingi, really does lose power, and really does run on lista. Those are real. They are also not v1. The kernel has to make checkout, stock, totals, and alerts correct without types for credit, offerings, or a log.

## Usage (caller's view)

The cashier screen and the report screen talk to one kernel. They do not talk to SQL.

```ts
import {
  checkout,
  searchProducts,
  frequentGrid,
  receiveStock,
  salesTotals,
  stockAlerts,
  quoteBasket,
} from "@/kernel";

const catalog = await store.loadCatalog();
const hits = searchProducts({ catalog, query: "coke" });
const grid = frequentGrid({ catalog, recents: state.recentProductIds, limit: 40 });
```

Checkout is one call. The UI owns the basket. The kernel records the sale and drops stock together.

```ts
const quote = quoteBasket({ catalog, lines: basket });
// quote.total is what the owner reads before confirm

const result = checkout({
  commandId,
  catalog,
  lines: basket, // at least one line, qty > 0
  now: clock.now(),
});

if (result.kind === "completed") {
  // result.sale is immutable. result.catalog has new counts.
}
if (result.kind === "already_completed") {
  // same commandId after a retry. same sale. no second stock drop.
}
if (result.kind === "rejected") {
  // empty basket, unknown product, or insufficient stock
}
```

Stock in, without a sale:

```ts
const next = receiveStock({
  commandId,
  catalog,
  product: coke.id,
  qty: 24,
});
```

Totals and alerts are reads. They do not write.

```ts
const totals = salesTotals({
  sales: state.sales,
  bucket: "day", // or "month" | "year"
  from: startOfYear,
  to: clock.now(),
  timeZone: "Asia/Manila",
});

const alerts = stockAlerts({
  catalog: state.catalog,
  sales: state.sales,
  now: clock.now(),
  notMovingAfterDays: 30,
});
```

The Next.js route parses the form with Zod, calls one of those functions, and saves what came back. The route does not decrement stock itself.

## Shape

Data first. A `Product` is an id, names, a centavo price, an integer `stockQty`, a `lowStockAt`, and `isActive`. A `CompletedSale` is an id, a Manila-stamped time, and a non-empty list of lines that snapshot name, unit price, qty, and line total. `Catalog` is the product list plus the maps the grid and search need: `byId`, prefix keys on normalized names, and a recency list for the tap grid. `SalesBook` is the sale list plus `byCommandId` for retries and `lastSoldAt` per product for dead-stock alerts.

Those indexes are built when state loads and updated by `checkout` and `receiveStock`. They are not a later cache.

Money is `Centavos`, a branded integer. Quantity is a positive integer on sale lines and receives. `CommandId` is minted when the cashier opens the basket and reused if confirm is hit twice.

Write path:

```
UI basket
  -> quoteBasket (pure, for the running total)
  -> checkout (pure decision + new Catalog and SalesBook)
  -> adapter persist of the new sale and the new counts (one transaction)
```

`checkout` either applies fully or not at all. Persistence uses the `CommandId` unique key so a crash-retry converges.

Alerts are not stored. `stockAlerts` walks active products: `stockQty <= lowStockAt` is `low_stock`; no sale in 30 days is `not_moving`. A product can raise both.

Day, month, and year buckets are calendar folds in `Asia/Manila` over `CompletedSale.at`. A few hundred sales a day can be summed in memory. A reporting cube is not v1.

Public kernel:

- `searchProducts`
- `frequentGrid`
- `quoteBasket`
- `checkout`
- `receiveStock`
- `salesTotals`
- `stockAlerts`

That is the whole write-and-read surface for v1. Product create and edit are `upsertProduct`, also in the kernel, used by the listings screen. Next.js, SQL, and React stay outside.

Complexity pulled behind that surface: centavo math, snapshotting prices onto lines, atomic stock with sale, idempotent retry, Manila period bounds, derived alerts. Complexity left out on purpose: utang, barcode, tingi offerings, payment types, event replay.

## Synthesis decision

The first arena assumed utang, tingi, and a device-authoritative log. Candidate 3 (event-sourced ledger) was the only sketch that landed, and it is a strong design for that brief: one `submit`, facts in a log, projections for stock and drawer, walk-in unable to take utang at the type level.

The owner then cut utang and barcode, and forbade extra features without a yes. That kills the log as v1's source of truth. A log would still work, but every v1 read would pay for machinery the screens do not need. Candidates 1 and 2 did not finish (model policy on one runner, empty tree on the other).

Base for the new brief: server-backed Next.js app, SQLite (or one Postgres later), immutable `CompletedSale` rows, mutable product counts, derived alerts, framework-free kernel.

Grafted from candidate 3, without taking the log:

- Integer `Centavos` and no floats
- Sale lines snapshot name and price
- `CommandId` idempotency on checkout and receive
- Void, if approved later, is a new compensating record, not an update
- Kernel ports (`Clock`) instead of `Date.now()` scattered in UI
- Cart stays UI state until confirm

Rejected from that sketch: event log as database, utang settlement types, offering/base-unit stock, shift close, Lamport stamps, in-memory fold of the whole store.

## Tradeoffs accepted

- We accept one price and one count per product in exchange for a kernel a hiring manager can read in one sitting. Tingi waits for a yes.
- We accept a server round trip on confirm in exchange for a demo that hosts like a normal Next.js app. Offline waits for a yes.
- We accept mutable `stockQty` on the product in exchange for a count the inventory screen can show without folding a log. The sale is still immutable, so totals do not depend on that mutable field.
- We accept scanning sales in memory for totals and alerts in exchange for no warehouse tables. One store does not need a cube.
- We accept blocking checkout when `qty > stockQty` in exchange for counts that mean something. Negative stock waits for a yes.
- We accept no payment type in v1 in exchange for "total sales" meaning "sum of completed sales," not "cash in the drawer."

## Alternatives considered

- **Event log as source of truth (candidate 3).** Deep module: one `submit` hides fold, idempotency, and projections. It also hides a storage model the v1 screens never mention. Lost because the owner asked for a normal POS and a hold on extra features. Revisit if offline plus void plus drawer close all get a yes.
- **Local-first SQLite WASM with the server as backup.** Matches brownouts. Exposes sync to every caller the day a second device appears. Lost for v1 because the owner did not ask for offline and the portfolio demo is easier as one hosted app.
- **Next.js Server Actions writing Prisma rows directly, no kernel.** Shallow: every screen re-implements stock math and period bounds. Lost because totals, alerts, and checkout share invariants that must live in one place.

## Open questions and risks

- Do you want tingi in a v2, or should this stay a generic one-row-per-product shop? See [later-features.md](later-features.md).
- Is a hosted always-online demo acceptable, or must the tablet sell with no data signal?
- Should v1 show only peso totals, or also item counts and a top-sellers list? Top-sellers is a later feature unless you say yes.
- 30 days for "not moving": keep, or pick another number?
- Product create/edit: owner-only in v1 with no PIN, meaning anyone with the URL can edit. Is that acceptable for the demo?

## Next implementation step

Add a Next.js App Router app with Vitest, then implement `Centavos` and `checkout` against failing tests for snapshot totals, stock decrement, insufficient stock, and command-id retry. No other screens until that function is real.
