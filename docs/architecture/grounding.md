# Grounding: Sari-sari store POS

Repo: [Sari-Sari-Store-POS](https://github.com/definitelynotrc/Sari-Sari-Store-POS).
Current state at planning time: README only. No code, no callers, no existing types.
Stack constraint from the owner: React and Next.js. This is a portfolio project that must still be a real store system.

This is greenfield. There is no surrounding system to trace. The constraints come from the domain.

## What a sari-sari store actually is

A sari-sari store is a neighborhood convenience window, often the front of the owner's house in the Philippines. One owner, maybe one helper. The counter is a window or a small table. The customer is usually standing, buying 3 to 8 items, paying cash, waiting for sukli (change). The owner is interrupted constantly. The UI that wins is a big-button catalog the owner can tap with a thumb, not a supermarket scan-and-belt flow.

This is not Square, not Shopify POS, and not a grocery lane. Copying those products is the wrong shape.

## Domain facts that must shape the types

### Tingi (split units)

The same physical pack is sold two ways. A Marlboro pack is 20 sticks. The owner sells the pack, or sells 1 stick. A 12-sachet family pack of shampoo is sold as 12 retail sachets. Eggs are sold by piece. Softdrinks are sold by bottle. Rice, when present, is sold by kilo or by small bag.

A Product is not a barcode with one price. A Product has one or more Offerings. Each Offering is a sellable unit with its own price and its own stock deduction rule (how much of the base pack it consumes).

If the design has `product.price` and `product.stock` as scalars, it cannot represent the store.

### Utang (customer tab)

Regulars buy on credit. The owner currently writes this in a notebook (lista). The system must record who owes what, take partial payments against a tab, and show the running balance at the window. Utang is not an afterthought payment type. It is a first-class ledger against a named neighbor.

A sale paid with utang still leaves the store. Stock goes down. Cash does not go up. A later payment against the tab is not a sale. It is a collection.

### Cash drawer and sukli

Cash is the default. GCash and Maya exist and should be recordable, but they are secondary. Change calculation is a daily act. End of day, the owner counts the drawer against the system's expected cash. That reconciliation is how they know if a helper stole, or if they forgot an utang.

### Load and other non-inventory items

Cellphone load is sold constantly and has no shelf stock in the usual sense. Some items are services. The catalog must allow a product that does not decrement inventory.

### Identity of an item

Many SKUs have no barcode, or the owner has no scanner. Primary input is search-by-name and a visual grid of frequent items. Barcode is optional, not the spine of the design.

### Money

Philippine peso. Store prices are usually whole pesos, sometimes 25/50 centavos. Never use IEEE floats. Integer centavos or a branded Money type backed by integer centavos.

### Devices and network

Cheap Android phone or tablet, sometimes an old laptop. Prepaid data. Brownouts. The owner will still sell during an outage. A sale that requires a round trip to a server before it is real will lose money and trust.

A helper and the owner may both be at the store, but this is usually one device on the counter. Multi-device concurrent checkout is not day-one. If two writers appear later, do not start from a shared mutable cart object.

### Staff

Owner (full access) and helper (sell, maybe not edit cost, maybe not forgive utang, maybe not see cost/markup). Auth is a PIN on the device, not OAuth theater.

## What modern POS means here

Modern means:

- Touch-first React UI that works on a phone in landscape or a small tablet
- Next.js as the application shell (App Router)
- Typed domain that can run without the UI
- Offline-capable checkout
- A daily close that a non-developer can understand
- A codebase a hiring manager can read in 20 minutes

Modern does not mean:

- Microservices
- Kafka
- Kubernetes
- BIR-accredited fiscal device integration (that is a legal product of its own; this portfolio system is a store operations POS, not an accredited invoicing device)
- Multi-branch inventory
- E-commerce storefront
- AI recommendations

## Use cases that the architecture must make cheap

1. Customer asks for "isa ng Lucky, tsaka coke, tsaka utang muna". Owner taps 3 items, taps the neighbor's name, confirms. Under 10 seconds. Stock moves. Tab increases. No cash.
2. Customer pays cash for a mixed basket of pack and tingi of the same brand. Change is shown. Drawer expected cash increases.
3. Owner opens the day, helper sells all afternoon, owner closes and sees cash expected vs counted, plus utang issued, plus collections.
4. Power or data dies mid-sale. After restart, that sale is either fully recorded or not recorded. Never half-recorded. Retry must not double-charge the tab or double-decrement stock.
5. Owner restocks a case of 24. The 24 individual offerings become sellable. Cost is recorded so markup is knowable later.
6. Owner looks up Aling Nena's tab and records a 200 peso collection.

## Dominant access patterns

- Read: top ~40 products by recency/frequency for the grid. Sub-10ms on device.
- Read: name search, prefix, Filipino and English names, typos.
- Write: complete a sale (the hot path). Must be one atomic domain operation.
- Write: apply a collection to a customer tab.
- Write: receive stock.
- Read: today's drawer, today's sales, open tabs.
- Read: product stock including tingi remaining.

If a design says "we'll add an index later" for the grid or search, the structure is wrong.

## Concurrent actors

Day one: one POS device, one active cashier session. The Next.js server, if any, is not a second writer of the same cart.

If a future phone and tablet both sell, each device owns its own sale events and a merge happens at the read/sync boundary. Do not start with a shared in-memory cart on the server.

## Invariants to encode in types

- Money is integer centavos. PHP only.
- A Sale is a state machine: `open` -> `completed` | `voided`. Completed sales are immutable. Void is a new compensating record, not an edit.
- A completed sale has at least one line, a customer-or-walk-in, and a payment allocation that sums to the total.
- Payment allocation: cash + e-wallet + utang + other = total. Overpay cash produces change. It does not inflate the total.
- Utang requires a named Customer. Walk-in cannot take utang.
- An Offering's stock deduction is defined. A non-stock item deducts zero.
- You cannot sell more tingi than the pack contents remaining, unless the owner explicitly allows negative stock. Represent this as an explicit policy, not a silent clamp.
- Tab collection reduces balance. Balance cannot go negative on day one.
- Helper cannot see unit cost. Encode via permission on the query, not by omitting a field in the same type used by the owner.

## Stack notes

- TypeScript, Next.js App Router, React.
- Domain and use-case functions must not import `next/server`, React, or SQL clients.
- Validate at HTTP/IndexedDB/form boundaries. Trust domain types inside.
- Prefer one runtime schema library (Zod) at boundaries.
- Tests of pricing, tingi deduction, utang, and idempotent checkout must run without Next.js.

## Portfolio constraint

The public module map should be small enough to screenshot in a README. A hiring manager should see: domain kernel, Next.js adapters, UI. Not 12 layers.

## Out of scope for v1

- BIR POS accreditation, OR/CR printing as a legal invoice
- Supplier accounts payable
- Multi-store
- Barcode hardware drivers
- Weight scale hardware
- Employee timekeeping
- SMS collection reminders
