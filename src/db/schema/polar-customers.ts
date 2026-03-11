import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { polarSubscriptions } from "./polar-subscriptions";
import { polarOrders } from "./polar-orders";
import { polarCheckouts } from "./polar-checkouts";

export const polarCustomers = pgTable(
  "polar_customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    polarCustomerId: text("polar_customer_id").notNull().unique(),
    polarCustomerExternalId: text("polar_customer_external_id").unique(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("polar_customers_user_id_idx").on(table.userId),
    index("polar_customers_polar_customer_id_idx").on(table.polarCustomerId),
    index("polar_customers_email_idx").on(table.email),
  ]
);

export const polarCustomersRelations = relations(polarCustomers, ({ one, many }) => ({
  user: one(users, {
    fields: [polarCustomers.userId],
    references: [users.id],
  }),
  subscriptions: many(polarSubscriptions),
  orders: many(polarOrders),
  checkouts: many(polarCheckouts),
}));
