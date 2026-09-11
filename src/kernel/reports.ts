import type {
  CompletedSale,
  PeriodBucket,
  PeriodTotal,
  TimeZone,
  Timestamp,
} from "./types";

/**
 * Sums completed sales into calendar buckets in Asia/Manila.
 * `from` and `to` are instants. Each sale lands in exactly one bucket.
 */
export function salesTotals(args: {
  sales: readonly CompletedSale[];
  bucket: PeriodBucket;
  from: Timestamp;
  to: Timestamp;
  timeZone: TimeZone;
}): readonly PeriodTotal[] {
  throw new Error("not implemented");
}
