# Arena rubric

Superseded. The first arena used utang, tingi, and a device log as must-haves. The owner then cut utang and barcodes, and required extra ideas to be proposed before they are built.

| Candidate | Assigned shape | Outcome |
| --- | --- | --- |
| 1 | Local-first cashier kernel | Did not land (runner failed, retry still empty at synthesis) |
| 2 | Server-authoritative Next.js | Did not land (empty tree at synthesis) |
| 3 | Event-sourced store ledger | Landed, then lost as v1 after the scope cut. Ideas grafted: centavos, sale snapshots, command-id retry, kernel without Next.js |

v1 pick: server-backed Next.js, SQLite, immutable sales, mutable counts, derived alerts. See [rationale.md](rationale.md).
