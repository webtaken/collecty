import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { polarCustomers } from "./polar-customers";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "refunded",
]);

export const billingReasonEnum = pgEnum("billing_reason", [
  "purchase",
  "subscription_create",
  "subscription_cycle",
  "subscription_update",
]);

export const polarOrders = pgTable(
  "polar_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    polarCustomerId: text("polar_customer_id"),
    polarOrderId: text("polar_order_id").notNull().unique(),
    polarSubscriptionId: text("polar_subscription_id"),
    status: orderStatusEnum("status").notNull().default("pending"),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    billingReason: billingReasonEnum("billing_reason"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("polar_orders_user_id_idx").on(table.userId),
    index("polar_orders_polar_customer_id_idx").on(table.polarCustomerId),
    index("polar_orders_polar_order_id_idx").on(table.polarOrderId),
    index("polar_orders_status_idx").on(table.status),
    index("polar_orders_billing_reason_idx").on(table.billingReason),
  ]
);

export const polarOrdersRelations = relations(polarOrders, ({ one }) => ({
  user: one(users, {
    fields: [polarOrders.userId],
    references: [users.id],
  }),
  customer: one(polarCustomers, {
    fields: [polarOrders.polarCustomerId],
    references: [polarCustomers.polarCustomerId],
  }),
}));
