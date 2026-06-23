import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

// Payment history (支付历史): one row per completed Stripe checkout session.
export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  // Stripe checkout session id, kept unique so the webhook stays idempotent.
  stripeSessionId: text("stripeSessionId").notNull().unique(),
  stripePaymentIntentId: text("stripePaymentIntentId"),
  // Amount in the smallest currency unit (e.g. cents).
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  // Credits granted by this payment.
  credits: integer("credits").notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("createdAt").defaultNow(),
}).enableRLS();

export type PaymentType = typeof payment.$inferSelect;
