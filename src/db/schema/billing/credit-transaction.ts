import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

// Credit ledger (积分使用情况): every recharge / consumption is recorded here.
// `amount` is positive for top-ups and negative for usage. `balanceAfter`
// snapshots the user's balance right after the transaction was applied.
export const creditTransaction = pgTable("credit_transaction", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  // "recharge" | "usage"
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balanceAfter").notNull(),
  description: text("description"),
  // Links a recharge transaction back to the originating payment, when any.
  paymentId: text("paymentId"),
  createdAt: timestamp("createdAt").defaultNow(),
}).enableRLS();

export type CreditTransactionType = typeof creditTransaction.$inferSelect;
