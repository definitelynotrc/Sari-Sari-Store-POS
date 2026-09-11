/** Integer PHP centavos. ₱1.00 is 100. Never a float. */
export type Centavos = number & { readonly __brand: "Centavos" };

export function centavos(amount: number): Centavos {
  throw new Error("not implemented");
}

export function add(a: Centavos, b: Centavos): Centavos {
  throw new Error("not implemented");
}

export function times(unit: Centavos, qty: number): Centavos {
  throw new Error("not implemented");
}

export function sum(amounts: readonly Centavos[]): Centavos {
  throw new Error("not implemented");
}

/** e.g. 150 -> "₱1.50" */
export function formatPhp(amount: Centavos): string {
  throw new Error("not implemented");
}
