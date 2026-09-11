import type { Centavos } from "./money";

export type ProductId = string & { readonly __brand: "ProductId" };
export type SaleId = string & { readonly __brand: "SaleId" };
export type CommandId = string & { readonly __brand: "CommandId" };
export type Timestamp = string & { readonly __brand: "Timestamp" };

export type Clock = {
  now(): Date;
};

export type TimeZone = "Asia/Manila";

export type Product = {
  id: ProductId;
  name: string;
  /** Extra search tokens, e.g. "coke" for "Coca-Cola". */
  aliases: readonly string[];
  price: Centavos;
  stockQty: number;
  /** Alert when stockQty <= lowStockAt. */
  lowStockAt: number;
  isActive: boolean;
};

/**
 * Product list plus the maps search and the tap grid need.
 * Built by buildCatalog. Updated by checkout, receiveStock, upsertProduct.
 */
export type Catalog = {
  products: readonly Product[];
  byId: ReadonlyMap<ProductId, Product>;
  /** Normalized prefix -> product ids. */
  byNamePrefix: ReadonlyMap<string, readonly ProductId[]>;
  recentProductIds: readonly ProductId[];
};

export type BasketLine = {
  product: ProductId;
  qty: number;
};

export type SaleLine = {
  product: ProductId;
  name: string;
  unitPrice: Centavos;
  qty: number;
  lineTotal: Centavos;
};

export type CompletedSale = {
  kind: "completed";
  id: SaleId;
  commandId: CommandId;
  at: Timestamp;
  lines: readonly [SaleLine, ...SaleLine[]];
  total: Centavos;
};

export type SalesBook = {
  sales: readonly CompletedSale[];
  byId: ReadonlyMap<SaleId, CompletedSale>;
  byCommandId: ReadonlyMap<CommandId, CompletedSale>;
  lastSoldAt: ReadonlyMap<ProductId, Timestamp>;
};

export type Quote =
  | { kind: "priced"; lines: readonly [SaleLine, ...SaleLine[]]; total: Centavos }
  | { kind: "rejected"; reason: QuoteReason };

export type QuoteReason =
  | { kind: "empty_basket" }
  | { kind: "unknown_product"; product: ProductId }
  | { kind: "invalid_qty"; product: ProductId; qty: number }
  | { kind: "inactive_product"; product: ProductId };

export type CheckoutResult =
  | { kind: "completed"; sale: CompletedSale; catalog: Catalog; sales: SalesBook }
  | { kind: "already_completed"; sale: CompletedSale; catalog: Catalog; sales: SalesBook }
  | { kind: "rejected"; reason: CheckoutReason };

export type CheckoutReason =
  | QuoteReason
  | { kind: "insufficient_stock"; product: ProductId; onHand: number; wanted: number };

export type ReceiveResult =
  | { kind: "received"; catalog: Catalog }
  | { kind: "already_received"; catalog: Catalog }
  | { kind: "rejected"; reason: ReceiveReason };

export type ReceiveReason =
  | { kind: "unknown_product"; product: ProductId }
  | { kind: "invalid_qty"; qty: number };

export type PeriodBucket = "day" | "month" | "year";

export type PeriodTotal = {
  bucket: PeriodBucket;
  /** Inclusive start of the period in Asia/Manila, ISO-8601. */
  periodStart: Timestamp;
  label: string;
  total: Centavos;
  saleCount: number;
};

export type StockAlert =
  | {
      kind: "low_stock";
      product: ProductId;
      name: string;
      onHand: number;
      lowStockAt: number;
    }
  | {
      kind: "not_moving";
      product: ProductId;
      name: string;
      lastSoldAt: Timestamp | null;
      quietForDays: number;
    };
