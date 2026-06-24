import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

export const generationTaskStatus = [
  "pending",
  "waiting",
  "success",
  "fail",
] as const;

export type GenerationTaskStatus = (typeof generationTaskStatus)[number];

export const generationTask = pgTable("generation_task", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  kieTaskId: text("kieTaskId"),
  status: text("status").notNull().default("pending"),
  prompt: text("prompt").notNull(),
  outfitId: text("outfitId"),
  backgroundId: text("backgroundId"),
  originalImageUrl: text("originalImageUrl").notNull(),
  generatedImageUrl: text("generatedImageUrl"),
  creditsCost: integer("creditsCost").notNull().default(20),
  creditsDeducted: boolean("creditsDeducted").notNull().default(false),
  creditTransactionId: text("creditTransactionId"),
  failCode: text("failCode"),
  failMsg: text("failMsg"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  completedAt: timestamp("completedAt"),
}).enableRLS();

export type GenerationTask = typeof generationTask.$inferSelect;
