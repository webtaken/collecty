import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export type WidgetConfig = {
  title: string;
  description: string;
  buttonText: string;
  successMessage: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  position: "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left";
  triggerType: "delay" | "exit-intent" | "scroll" | "click";
  triggerValue: number; // delay in seconds or scroll percentage
  showBranding: boolean;
};

export const defaultWidgetConfig: WidgetConfig = {
  title: "Stay in the loop",
  description: "Subscribe to our newsletter and never miss an update.",
  buttonText: "Subscribe",
  successMessage: "Thanks for subscribing!",
  primaryColor: "#6366f1",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  position: "center",
  triggerType: "delay",
  triggerValue: 3,
  showBranding: true,
};

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  description: text("description"),
  widgetConfig: jsonb("widget_config").$type<WidgetConfig>().default(defaultWidgetConfig).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

