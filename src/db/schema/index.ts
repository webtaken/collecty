// Auth-related tables
export {
  users,
  accounts,
  sessions,
  verificationTokens,
  usersRelations,
  accountsRelations,
  sessionsRelations,
} from "./users";

// Project tables
export {
  projects,
  projectsRelations,
  defaultWidgetConfig,
  defaultInlineWidgetConfig,
  type WidgetConfig,
  type InlineWidgetConfig,
} from "./projects";

// Widget tables
export {
  widgets,
  widgetsRelations,
  defaultWidgetConfigUnified,
  type WidgetConfigUnified,
} from "./widgets";

// Subscriber tables
export {
  subscribers,
  subscribersRelations,
  type SubscriberMetadata,
} from "./subscribers";

// API Key tables
export { apiKeys, apiKeysRelations } from "./api-keys";

// Lead Magnet tables
export {
  leadMagnets,
  leadMagnetsRelations,
  type RichTextContent,
} from "./lead-magnets";
