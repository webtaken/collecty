import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { polarCustomers } from "./polar-customers";

export const checkoutStatusEnum = pgEnum("checkout_status", [
  "created",
  "succeeded",
  "failed",
  "canceled",
]);

export const polarCheckouts = pgTable(
  "polar_checkouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    polarCustomerId: text("polar_customer_id"),
    polarCheckoutId: text("polar_checkout_id").notNull().unique(),
    status: checkoutStatusEnum("status").notNull().default("created"),
    successUrl: text("success_url"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("polar_checkouts_user_id_idx").on(table.userId),
    index("polar_checkouts_polar_customer_id_idx").on(table.polarCustomerId),
    index("polar_checkouts_polar_checkout_id_idx").on(table.polarCheckoutId),
    index("polar_checkouts_status_idx").on(table.status),
  ]
);

export const polarCheckoutsRelations = relations(polarCheckouts, ({ one }) => ({
  user: one(users, {
    fields: [polarCheckouts.userId],
    references: [users.id],
  }),
  customer: one(polarCustomers, {
    fields: [polarCheckouts.polarCustomerId],
    references: [polarCustomers.polarCustomerId],
  }),
}));
