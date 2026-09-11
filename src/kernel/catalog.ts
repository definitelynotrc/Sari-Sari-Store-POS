import type { Catalog, Product, ProductId } from "./types";

export function buildCatalog(products: readonly Product[]): Catalog {
  throw new Error("not implemented");
}

/**
 * Prefix match on normalized name and aliases.
 * Empty query returns active products in recency order.
 */
export function searchProducts(args: {
  catalog: Catalog;
  query: string;
}): readonly Product[] {
  throw new Error("not implemented");
}

/** Active products, recents first, then the rest, capped. */
export function frequentGrid(args: {
  catalog: Catalog;
  limit: number;
}): readonly Product[] {
  throw new Error("not implemented");
}

export function upsertProduct(args: {
  catalog: Catalog;
  product: Product;
}): Catalog {
  throw new Error("not implemented");
}

export function getProduct(args: {
  catalog: Catalog;
  id: ProductId;
}): Product | undefined {
  throw new Error("not implemented");
}
