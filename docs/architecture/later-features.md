# Later features (owner decides)

Nothing in this file is in v1. Say yes, no, or later on each row. A yes still waits for a follow-up before code.

v1 is: product list and search, inventory, tap-to-checkout, sales totals (day, month, year), low-stock alerts, not-moving alerts. No utang. No barcode.

## Already decided

| Idea | Decision |
| --- | --- |
| Utang / lista / customer credit | No |
| Barcode scanner, barcode field, camera scan | No |

## Worth deciding soon

These change the types if they land. Cheaper to pick now than to retrofit.

| Idea | What it is | Recommendation | Why |
| --- | --- | --- | --- |
| Tingi (pack vs piece) | One Marlboro pack also sold as 20 sticks, each with its own price and stock rule | Later, not v1 | This is the sari-sari tell. v1 stays one price and one count per product so checkout stays small. If you want the portfolio to look like a real sari-sari instead of a generic shop, this is the first yes to give. |
| Void last sale | Compensating sale that puts stock back. Not an edit of the old sale | Yes, soon after v1 | Mis-taps happen. Without void, the owner will delete rows by hand and reports will lie. |
| Cash tendered and sukli | Owner types cash given, screen shows change | Yes, small | Makes checkout feel like a POS. Does not need GCash. Sale total stays the source of truth; change is display math. |
| Per-product low-stock number | Already in v1 as `lowStockAt` | Keep | A global "alert under 5" is wrong for eggs vs softdrinks. |
| Not-moving window | v1 uses 30 days, one constant | Keep 30 unless you say otherwise | Pick one number. Do not make a settings screen until you hate 30. |
| Hide discontinued products | Active flag so old SKUs leave search and the grid | Yes, in v1 (small) | Search dies if expired SKUs stay forever. This is a field, not a product. |
| Sell when stock is 0 | Block vs allow negative stock | Block in v1 | Owner can receive stock, then sell. Allowing negative is a later policy switch. |

## Optional, ask before building

| Idea | What it is | Recommendation | Why |
| --- | --- | --- | --- |
| GCash / Maya as payment type | Tag the sale as cash or e-wallet | Later | Totals still work with "a sale happened." Split by tender only if you want to know why the drawer is short. |
| Offline checkout | Sell during brownout, sync later | Later | Right for a real barangay store. Extra persistence and conflict work. Fine to skip on a hosted portfolio demo. |
| Cost price and profit | Record buy price, show markup | Later | You asked for sales totals, not profit. Profit needs cost on every receive. |
| Helper PIN and roles | Owner vs helper | Later | One person at the window in v1. |
| Categories | Snacks, drinks, load | Later | Search plus a grid of frequent items covers a few hundred SKUs. |
| Stock adjust / spoilage | Drop count without a sale | Later | Receive + sell covers the happy path. Rotten milk needs this. |
| Daily cash close | Count drawer vs expected cash | Later | Needs payment types and a shift. |
| Receipt print or share | Paper or image of the basket | No for v1 | Window customers do not wait for a printer. |
| Supplier invoices | Who delivered, unpaid bills | No for v1 | Inventory receive is enough. |
| SMS restock reminders | Text the owner | No | Alerts in the app first. |
| Multi-device | Phone and tablet both selling | No for v1 | One counter. |
| English + Tagalog UI | Copy, not types | Later | Can land as strings without a kernel change. |
| Load / no-stock items | Cellphone load that does not decrement | Later | v1 every product has a count. Load either gets a fake high stock or waits for a "service" kind. |
| Tawad (line discount) | Owner overrides a line price | No for v1 | Snapshot prices already freeze the sold price. A discount field is extra. |
| Customer names without utang | Save regulars for search | No | Not useful until utang or receipts exist. |

## How to answer

Reply with the table ids you want, for example: "tingi later, void yes, sukli yes, GCash no, offline no." Until that message, the kernel stays the v1 list only.
