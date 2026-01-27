import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tiptap stores content as JSON
export type RichTextContent = {
  type: string;
  content?: RichTextContent[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
};

export const leadMagnets = pgTable(
  "lead_magnets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    description: jsonb("description").$type<RichTextContent>(), // Rich text content from Tiptap
    previewText: text("preview_text"), // Short teaser shown on widget
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("lead_magnets_is_active_idx").on(table.isActive)],
);

// Relations are defined in widgets.ts to avoid circular imports
// A lead magnet is optionally linked to one widget
export const leadMagnetsRelations = relations(leadMagnets, () => ({}));
