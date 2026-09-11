import type { Catalog, CommandId, ProductId, ReceiveResult } from "./types";

/**
 * Adds qty to an existing product. Same commandId is a no-op after success.
 * qty must be a positive integer.
 */
export function receiveStock(args: {
  commandId: CommandId;
  catalog: Catalog;
  product: ProductId;
  qty: number;
}): ReceiveResult {
  throw new Error("not implemented");
}
