# Grounding: Sari-sari store POS

Repo: [Sari-Sari-Store-POS](https://github.com/definitelynotrc/Sari-Sari-Store-POS).
Stack: React and Next.js. Greenfield. Portfolio project that must still be usable at a real counter.

Owner correction after the first brief: no utang, no barcode scanners. Do not put those in v1. Extra ideas go on a decision list, not into the kernel, until the owner says yes.

## v1 scope (build this)

- Product listings and name search
- Inventory counts that move when stock arrives and when a sale completes
- Checkout by tapping or searching products (a POS with no sale is a spreadsheet)
- Sales totals for day, month, and year
- Alerts when a product is low on stock, and when a product is not selling

## v1 non-scope (do not build until approved)

See [later-features.md](later-features.md). That list includes tingi, GCash, offline, voids, cost and profit, helper PINs, and utang. Utang was considered and rejected.

No barcode field, scanner flow, or camera scanning in v1.

## What a sari-sari counter is

A window or a small table. The owner stands, the customer stands, the basket is 3 to 8 items, payment is usually cash, and the next customer is already talking. The UI is a large-tap catalog plus a search box, on a phone or a cheap tablet.

This is not Square and not a grocery lane.

## Domain facts that still shape v1 types

### One price, one stock per product

v1 treats a product as a name, a peso price, and an integer quantity on the shelf. Pack-versus-stick (tingi) is a later-feature candidate. Do not invent `product.price` plus a hidden second unit. If tingi is approved later, the type changes to offerings. Until then, one SKU is one row.

### No scanner

Search is by name. Frequent items sit on a tap grid. Identity is `ProductId` plus name, not a barcode.

### Money

Philippine peso. Integer centavos only. No IEEE floats.

### Sales are facts

A completed sale is immutable. It stores the name and unit price that were in force at checkout, so a later price edit cannot rewrite yesterday's total. A day, month, or year total is a sum over those facts in `Asia/Manila`.

### Inventory is a count, not a guess

Receive stock increases the count. Checkout decreases it. Low-stock alerts compare `stockQty` to a per-product threshold. Dead-stock alerts compare "last sold at" to a fixed quiet window (30 days). Alerts are derived. They are not a table the cashier edits.

### One counter, one writer

Day one is one device, one cashier session. The Next.js server is not a second writer of the same cart. The cart is UI state. Only a completed sale is stored.

### Reports must not lie about "today"

"Today" is the calendar day in `Asia/Manila`, not UTC and not the browser's zone. Month and year use that same zone.

## Use cases v1 must make cheap

1. Owner searches "coke", taps two more items from the grid, confirms. Stock drops. Today's total rises.
2. Owner types a name fragment and finds the product among tens or a few hundred SKUs.
3. Owner records a delivery: this product, this many pieces. Count goes up. A low-stock alert on that product clears if it is now above the threshold.
4. Owner opens reports and sees peso totals and sale counts for today, this month, this year.
5. Owner opens alerts and sees which products are at or below their threshold, and which have not sold in 30 days.
6. Power dies mid-confirm. After restart the sale is fully recorded or not recorded. Retry with the same command id must not sell twice.

## Dominant access patterns

- Read the frequent-item grid
- Read name search
- Write one completed sale (hot path), atomically with stock
- Write a stock receive
- Read sales totals for day, month, year
- Read derived alerts

## Invariants to encode in types

- Money is integer centavos, PHP only
- A sale is `completed`. There is no edit. Void is not in v1
- A completed sale has at least one line. Each line has qty greater than zero
- Line totals and the sale total agree
- Utang, customer tabs, and barcode are not types in this kernel
- Walk-in is implied. There is no customer record in v1
- Low stock is `stockQty <= lowStockAt` on an active product
- Not moving is "no completed sale line for this product in 30 days"
- Helper cost-hiding is not in v1 because cost is not in v1

## Stack notes

- TypeScript, Next.js App Router, React
- Domain functions do not import `next/server`, React, or SQL clients
- Validate at the HTTP and form boundary. Trust domain types inside
- Zod at that boundary
- Kernel tests run without Next.js

## Portfolio constraint

A hiring manager should see three parts: kernel, Next.js adapters, UI. Not twelve layers.

## Out of scope for the product (not just v1)

- BIR-accredited invoicing
- Multi-store
- Hardware drivers
- E-commerce
- Microservices, Kafka, Kubernetes
