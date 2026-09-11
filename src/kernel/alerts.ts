import type { Catalog, CompletedSale, StockAlert } from "./types";

/**
 * Derived. Does not write.
 * low_stock: active product with stockQty <= lowStockAt.
 * not_moving: active product with no sale in notMovingAfterDays (v1: 30).
 */
export function stockAlerts(args: {
  catalog: Catalog;
  sales: readonly CompletedSale[];
  now: Date;
  notMovingAfterDays: number;
}): readonly StockAlert[] {
  throw new Error("not implemented");
}
