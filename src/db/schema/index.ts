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
  type WidgetConfig,
} from "./projects";

// Subscriber tables
export {
  subscribers,
  subscribersRelations,
  type SubscriberMetadata,
} from "./subscribers";

// API Key tables
export { apiKeys, apiKeysRelations } from "./api-keys";

