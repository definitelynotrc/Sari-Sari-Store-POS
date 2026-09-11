import type {
  BasketLine,
  Catalog,
  CheckoutResult,
  CommandId,
  Quote,
  SalesBook,
} from "./types";

/**
 * Running total for the cashier screen. Same line math checkout uses.
 * Does not check stock. Stock is a checkout rule, not a display rule.
 */
export function quoteBasket(args: {
  catalog: Catalog;
  lines: readonly BasketLine[];
}): Quote {
  throw new Error("not implemented");
}

/**
 * Records a sale and drops stock in one result.
 * Replaying the same commandId returns already_completed without a second drop.
 */
export function checkout(args: {
  commandId: CommandId;
  catalog: Catalog;
  sales: SalesBook;
  lines: readonly BasketLine[];
  now: Date;
}): CheckoutResult {
  throw new Error("not implemented");
}
