# Arena rubric

Three structurally distinct designs were sketched in parallel before synthesis.

| Candidate | Assigned shape | Why it exists |
| --- | --- | --- |
| 1 | Local-first cashier kernel | Device is the source of truth. Matches brownouts and prepaid data. |
| 2 | Server-authoritative Next.js | One database, one Sale aggregate. Simpler ops story. |
| 3 | Event-sourced store ledger | Append-only log. Stock, tabs, and drawer are projections. |

Candidates do not see this rubric. It is the picker's tool.

## Criteria

1. **Domain fidelity.** Tingi offerings, utang vs collection, cash drawer, load-as-non-stock, and walk-in-cannot-utang are encoded in types, not in a later TODO.
2. **Interface depth.** Completing a sale is one kernel operation (plus queries). Callers do not orchestrate validate/save/stock/tab themselves.
3. **Crash and retry.** Checkout, void, collection, and stock receive are idempotent. A retry cannot double-decrement or double-charge.
4. **Type invariants.** Money is integer centavos. Sale is a state machine. No optional-field bags. No IEEE floats. No Prisma/SQL/HTTP types on the kernel API.
5. **Next.js as a shell.** Domain does not import React or `next/server`. The module map is 3 to 6 modules, not 12 layers.
6. **Red flags.** Reject shallow modules, information leakage, temporal decomposition, and pass-through methods.

Pick the base on which a future maintainer can extend most easily without breaking invariants. Prefer the cleaner boundary when two feel tied.
