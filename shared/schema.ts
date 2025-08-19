import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// New multi-tenant architecture - Global user accounts
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  name: text("name"), // Full name for display
  hashedPassword: text("hashed_password"),
  role: text("role").default("employee"), // admin, hr, it, manager, employee
  department: text("department"), // Department name
  deptId: varchar("dept_id"), // Department ID reference
  authProvider: text("auth_provider").default("local"), // local, google, etc
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token").unique(),
  tokenExpiry: timestamp("token_expiry"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company workspaces for multi-tenant B2B SaaS
export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Company name
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  description: text("description"),
  logoUrl: text("logo_url"),
  subscriptionPlan: text("subscription_plan").default("basic"), // basic, pro, enterprise
  subscriptionStatus: text("subscription_status").default("active"), // active, suspended, cancelled
  maxUsers: integer("max_users").default(10),
  ownerId: varchar("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workspace memberships - users can belong to multiple workspaces
export const workspaceMemberships = pgTable("workspace_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  role: text("role").notNull(), // 'admin', 'hr', 'it', 'manager', 'employee'
  departmentId: varchar("department_id").references(() => departments.id),
  isActive: boolean("is_active").default(true),
  invitedBy: varchar("invited_by").references(() => users.id),
  invitedAt: timestamp("invited_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pending invitations
export const invitations = pgTable("invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  role: text("role").notNull(),
  departmentId: varchar("department_id").references(() => departments.id),
  invitedBy: varchar("invited_by").references(() => users.id),
  inviteToken: text("invite_token").notNull().unique(),
  expiresAt: timestamp("expires_at"),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  path: text("path").notNull(),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  deptId: varchar("dept_id").references(() => departments.id),
  accessRole: text("access_role"),
  version: integer("version").default(1),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const docChunks = pgTable("doc_chunks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id),
  chunkText: text("chunk_text").notNull(),
  embeddingVector: text("embedding_vector"), // JSON string of vector
});

export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  deptId: varchar("dept_id").references(() => departments.id),
  hits: integer("hits").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  createdBy: varchar("created_by").references(() => users.id),
  deptId: varchar("dept_id").references(() => departments.id),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  description: text("description"), // Additional description field
  status: text("status").notNull(), // 'open', 'in_progress', 'resolved', 'closed'
  priority: text("priority").notNull(), // 'low', 'medium', 'high', 'critical'
  assigneeId: varchar("assignee_id").references(() => users.id),
  slaDueAt: timestamp("sla_due_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  type: text("type").notNull(), // 'leave_request', 'expense_report', 'access_request'
  createdBy: varchar("created_by").references(() => users.id),
  state: text("state").notNull(), // 'pending', 'approved', 'rejected', 'cancelled'
  dataJson: jsonb("data_json"), // Workflow-specific data
  deptId: varchar("dept_id").references(() => departments.id),
  dueAt: timestamp("due_at"),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvals = pgTable("approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").references(() => workflows.id),
  approverId: varchar("approver_id").references(() => users.id),
  decision: text("decision"), // 'approved', 'rejected'
  decidedAt: timestamp("decided_at"),
  comment: text("comment"),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id").references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id").notNull(),
  metaJson: jsonb("meta_json"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  scopes: text("scopes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qaHistory = pgTable("qa_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  responseTime: integer("response_time"), // in milliseconds
  confidence: integer("confidence"), // 0-100
  department: text("department"),
  sources: text("sources"), // JSON array of source document IDs
  citations: text("citations"), // JSON string of document citations
  createdAt: timestamp("created_at").defaultNow(),
});

export const routingRules = pgTable("routing_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  keywords: text("keywords").notNull(), // Comma-separated keywords
  department: text("department").notNull(), // Target department
  priority: text("priority").default("medium"),
  isActive: boolean("is_active").default(true),
  accuracy: integer("accuracy").default(0), // Percentage accuracy
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflowTemplates = pgTable("workflow_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'leave_request', 'expense_report', 'it_support'
  description: text("description"),
  steps: jsonb("steps"), // Array of workflow steps
  approvers: jsonb("approvers"), // Array of approver roles/ids
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // 'slack', 'teams', 'email'
  config: jsonb("config"), // Platform-specific configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'ticket', 'approval', 'qa', 'system'
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add relations for Drizzle ORM
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMemberships: many(workspaceMemberships),
  ownedWorkspaces: many(workspaces),
  createdDocuments: many(documents),
  tickets: many(tickets),
  workflows: many(workflows),
  notifications: many(notifications),
  sentInvitations: many(invitations),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  memberships: many(workspaceMemberships),
  departments: many(departments),
  documents: many(documents),
  tickets: many(tickets),
  workflows: many(workflows),
  invitations: many(invitations),
}));

export const workspaceMembershipsRelations = relations(workspaceMemberships, ({ one }) => ({
  user: one(users, {
    fields: [workspaceMemberships.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [workspaceMemberships.workspaceId],
    references: [workspaces.id],
  }),
  department: one(departments, {
    fields: [workspaceMemberships.departmentId],
    references: [departments.id],
  }),
  invitedByUser: one(users, {
    fields: [workspaceMemberships.invitedBy],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
  department: one(departments, {
    fields: [invitations.departmentId],
    references: [departments.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [departments.workspaceId],
    references: [workspaces.id],
  }),
  memberships: many(workspaceMemberships),
  documents: many(documents),
  tickets: many(tickets),
  workflows: many(workflows),
  faqs: many(faqs),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [documents.workspaceId],
    references: [workspaces.id],
  }),
  department: one(departments, {
    fields: [documents.deptId],
    references: [departments.id],
  }),
  createdBy: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
  }),
  chunks: many(docChunks),
}));

export const docChunksRelations = relations(docChunks, ({ one }) => ({
  document: one(documents, {
    fields: [docChunks.documentId],
    references: [documents.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [tickets.workspaceId],
    references: [workspaces.id],
  }),
  createdBy: one(users, {
    fields: [tickets.createdBy],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [tickets.deptId],
    references: [departments.id],
  }),
  assignee: one(users, {
    fields: [tickets.assigneeId],
    references: [users.id],
  }),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [workflows.workspaceId],
    references: [workspaces.id],
  }),
  createdBy: one(users, {
    fields: [workflows.createdBy],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [workflows.deptId],
    references: [departments.id],
  }),
  approvals: many(approvals),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChunkSchema = createInsertSchema(docChunks).omit({
  id: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
});

export const insertQAHistorySchema = createInsertSchema(qaHistory).omit({
  id: true,
  createdAt: true,
});

export const insertRoutingRuleSchema = createInsertSchema(routingRules).omit({
  id: true,
  createdAt: true,
});

// New B2B SaaS Registration Schemas
export const emailCheckSchema = z.object({
  email: z.string().email("Valid email address is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "hr", "it", "manager", "employee"]).default("employee"),
  department: z.string().optional(),
});

export const completeRegistrationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z.string(),
  companyName: z.string().min(1, "Company name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "hr", "it", "manager", "employee"]),
  departmentId: z.string().optional(),
});

export type EmailCheckInput = z.infer<typeof emailCheckSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Insert schemas for new tables
export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkspaceMembershipSchema = createInsertSchema(workspaceMemberships).omit({
  id: true,
  createdAt: true,
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  createdAt: true,
});

// Types  
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;

export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect;
export type InsertWorkspaceMembership = z.infer<typeof insertWorkspaceMembershipSchema>;

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type QAHistory = typeof qaHistory.$inferSelect;
export type InsertQAHistory = z.infer<typeof insertQAHistorySchema>;

export type DocChunk = typeof docChunks.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type Approval = typeof approvals.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type RoutingRule = typeof routingRules.$inferSelect;
export type InsertRoutingRule = z.infer<typeof insertRoutingRuleSchema>;

export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type InsertChunk = z.infer<typeof insertChunkSchema>;
