import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { leadMagnets } from "./lead-magnets";

// Unified widget config that can render as popup or inline
// The embed type (popup vs inline) is determined client-side
export type WidgetConfigUnified = {
  // Common fields
  title: string;
  description: string;
  buttonText: string;
  successMessage: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  showBranding: boolean;

  // Popup-specific options
  position?:
    | "center"
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left";
  triggerType?: "delay" | "exit-intent" | "scroll" | "click";
  triggerValue?: number;

  // Inline-specific options
  layout?: "horizontal" | "vertical";
  placeholderText?: string;
  borderRadius?: number;
};

export const defaultWidgetConfigUnified: WidgetConfigUnified = {
  title: "Stay in the loop",
  description: "Subscribe to our newsletter and never miss an update.",
  buttonText: "Subscribe",
  successMessage: "Thanks for subscribing!",
  primaryColor: "#6366f1",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  showBranding: true,
  // Popup defaults
  position: "center",
  triggerType: "delay",
  triggerValue: 3,
  // Inline defaults
  layout: "horizontal",
  placeholderText: "Enter your email",
  borderRadius: 8,
};

export const widgets = pgTable(
  "widgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    config: jsonb("config").$type<WidgetConfigUnified>().notNull(),
    leadMagnetId: uuid("lead_magnet_id").references(() => leadMagnets.id, {
      onDelete: "set null",
    }),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("widgets_project_id_idx").on(table.projectId),
    index("widgets_is_default_idx").on(table.isDefault),
  ],
);

export const widgetsRelations = relations(widgets, ({ one }) => ({
  project: one(projects, {
    fields: [widgets.projectId],
    references: [projects.id],
  }),
  leadMagnet: one(leadMagnets, {
    fields: [widgets.leadMagnetId],
    references: [leadMagnets.id],
  }),
}));
