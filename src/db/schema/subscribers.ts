import { pgTable, uuid, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";

export type SubscriberMetadata = {
  userAgent?: string;
  referrer?: string;
  pageUrl?: string;
  ipCountry?: string;
  customFields?: Record<string, string>;
};

export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    metadata: jsonb("metadata").$type<SubscriberMetadata>().default({}),
    source: varchar("source", { length: 100 }).default("widget"),
    subscribedAt: timestamp("subscribed_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("subscribers_project_id_idx").on(table.projectId),
    index("subscribers_email_idx").on(table.email),
    index("subscribers_subscribed_at_idx").on(table.subscribedAt),
  ]
);

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  project: one(projects, {
    fields: [subscribers.projectId],
    references: [projects.id],
  }),
}));

