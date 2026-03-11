import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { polarCustomers } from "./polar-customers";
import { polarOrders } from "./polar-orders";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "revoked",
]);

export const polarSubscriptions = pgTable(
  "polar_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    polarCustomerId: text("polar_customer_id"),
    polarSubscriptionId: text("polar_subscription_id").notNull().unique(),
    polarProductId: text("polar_product_id").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("polar_subscriptions_user_id_idx").on(table.userId),
    index("polar_subscriptions_polar_customer_id_idx").on(table.polarCustomerId),
    index("polar_subscriptions_polar_subscription_id_idx").on(table.polarSubscriptionId),
    index("polar_subscriptions_status_idx").on(table.status),
  ]
);

export const polarSubscriptionsRelations = relations(polarSubscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [polarSubscriptions.userId],
    references: [users.id],
  }),
  customer: one(polarCustomers, {
    fields: [polarSubscriptions.polarCustomerId],
    references: [polarCustomers.polarCustomerId],
  }),
  orders: many(polarOrders),
}));
