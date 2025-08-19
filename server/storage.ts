import { 
  type User, 
  type InsertUser,
  type Department,
  type InsertDepartment,
  type Document,
  type InsertDocument,
  type Ticket,
  type InsertTicket,
  type Workflow,
  type InsertWorkflow,
  type QAHistory,
  type InsertQAHistory,
  type DocChunk,
  type FAQ,
  type RoutingRule,
  type InsertRoutingRule,
  type WorkflowTemplate,
  type InsertWorkflowTemplate,
  type Integration,
  type InsertIntegration,
  type Notification,
  type InsertNotification,
  type InsertChunk,
  users,
  departments,
  documents,
  docChunks,
  tickets,
  workflows,
  qaHistory,
  faqs,
  routingRules,
  workflowTemplates,
  integrations,
  notifications
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, like } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;

  // Departments
  getDepartment(id: string): Promise<Department | undefined>;
  getAllDepartments(): Promise<Department[]>;
  createDepartment(dept: InsertDepartment): Promise<Department>;

  // Documents
  getDocument(id: string): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  getDocumentsByDept(deptId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;

  // Document Chunks
  getChunksByDocument(documentId: string): Promise<DocChunk[]>;
  searchChunks(query: string, deptId?: string): Promise<DocChunk[]>;
  createChunk(chunk: InsertChunk): Promise<DocChunk>;

  // Tickets
  getTicket(id: string): Promise<Ticket | undefined>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByDept(deptId: string): Promise<Ticket[]>;
  getTicketsByStatus(status: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined>;
  deleteTicket(id: string): Promise<boolean>;

  // Workflows
  getWorkflow(id: string): Promise<Workflow | undefined>;
  getAllWorkflows(): Promise<Workflow[]>;
  getWorkflowsByState(state: string): Promise<Workflow[]>;
  getPendingWorkflows(): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: string): Promise<boolean>;

  // Q&A History
  getQAHistory(): Promise<QAHistory[]>;
  getRecentQAHistory(limit: number): Promise<QAHistory[]>;
  createQAHistory(qa: InsertQAHistory): Promise<QAHistory>;

  // FAQs
  getFAQsByDept(deptId: string): Promise<FAQ[]>;
  createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ>;

  // Routing Rules
  getRoutingRules(): Promise<RoutingRule[]>;
  getRoutingRule(id: string): Promise<RoutingRule | undefined>;
  createRoutingRule(rule: InsertRoutingRule): Promise<RoutingRule>;
  updateRoutingRule(id: string, updates: Partial<RoutingRule>): Promise<RoutingRule | undefined>;

  // Workflow Templates
  getWorkflowTemplates(): Promise<WorkflowTemplate[]>;
  getWorkflowTemplate(id: string): Promise<WorkflowTemplate | undefined>;
  createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate>;

  // Integrations
  getIntegrations(): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private departments: Map<string, Department> = new Map();
  private documents: Map<string, Document> = new Map();
  private docChunks: Map<string, DocChunk> = new Map();
  private tickets: Map<string, Ticket> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private qaHistory: Map<string, QAHistory> = new Map();
  private routingRules: Map<string, RoutingRule> = new Map();
  private workflowTemplates: Map<string, WorkflowTemplate> = new Map();
  private integrations: Map<string, Integration> = new Map();
  private faqs: Map<string, FAQ> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create departments with new names
    const departments = [
      "Board of Directors",
      "Executive Office / CEO Office", 
      "Strategic Development Department",
      "Project Management Office (PMO)",
      "Finance Department",
      "Accounting Department",
      "Internal Audit Department",
      "Legal Affairs Department",
      "Human Resources Department (HR)",
      "Training and Development Department",
      "Internal Communications Department", 
      "Information Technology Department (IT)",
      "Software Development Department",
      "Technical Support / Help Desk",
      "Cybersecurity Department",
      "Marketing Department",
      "Digital Marketing Department",
      "Sales Department",
      "Customer Relationship Management (CRM) Department",
      "Production Department",
      "Quality Assurance / Quality Control (QA/QC) Department",
      "Supply Chain Department",
      "Logistics and Transportation Department",
      "Research and Development (R&D) Department",
      "Innovation Department",
      "Public Relations (PR) Department",
      "Security Department",
      "Office Management"
    ];

    // Create department objects
    const hrDept: Department = {
      id: randomUUID(),
      name: "Human Resources Department (HR)"
    };
    const itDept: Department = {
      id: randomUUID(),
      name: "Information Technology Department (IT)"
    };
    
    // Add all departments
    for (const deptName of departments) {
      const dept: Department = {
        id: randomUUID(),
        name: deptName
      };
      this.departments.set(dept.id, dept);
    }

    // Create admin user with HR department
    const hrDeptId = Array.from(this.departments.values()).find(d => d.name === "Human Resources Department (HR)")?.id || null;
    const adminUser: User = {
      id: randomUUID(),
      email: "admin@company.com",
      name: "Admin User",
      deptId: hrDeptId,
      role: "admin",
      authProvider: "local",
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      deptId: insertUser.deptId ?? null,
      authProvider: insertUser.authProvider ?? null,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Departments
  async getDepartment(id: string): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(insertDept: InsertDepartment): Promise<Department> {
    const id = randomUUID();
    const dept: Department = { ...insertDept, id };
    this.departments.set(id, dept);
    return dept;
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByDept(deptId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.deptId === deptId);
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const doc: Document = { 
      ...insertDoc,
      version: insertDoc.version ?? null,
      deptId: insertDoc.deptId ?? null,
      createdBy: insertDoc.createdBy ?? null,
      accessRole: insertDoc.accessRole ?? null,
      id,
      createdAt: new Date()
    };
    this.documents.set(id, doc);
    return doc;
  }

  // Document Chunks
  async getChunksByDocument(documentId: string): Promise<DocChunk[]> {
    return Array.from(this.docChunks.values()).filter(chunk => chunk.documentId === documentId);
  }

  async searchChunks(query: string, deptId?: string): Promise<DocChunk[]> {
    const chunks = Array.from(this.docChunks.values()).filter(chunk => {
      const matchesQuery = chunk.chunkText.toLowerCase().includes(query.toLowerCase());
      if (!deptId) return matchesQuery;
      
      const document = this.documents.get(chunk.documentId!);
      return matchesQuery && document?.deptId === deptId;
    });
    return chunks.slice(0, 5); // Return top 5 matches
  }

  async createChunk(chunk: Omit<DocChunk, 'id'>): Promise<DocChunk> {
    const id = randomUUID();
    const newChunk: DocChunk = { ...chunk, id };
    this.docChunks.set(id, newChunk);
    return newChunk;
  }

  // Tickets
  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTicketsByDept(deptId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.deptId === deptId);
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.status === status);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = { 
      ...insertTicket,
      deptId: insertTicket.deptId ?? null,
      createdBy: insertTicket.createdBy ?? null,
      assigneeId: insertTicket.assigneeId ?? null,
      slaDueAt: insertTicket.slaDueAt ?? null,
      id,
      createdAt: new Date()
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const existing = this.tickets.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.tickets.set(id, updated);
    return updated;
  }

  async deleteTicket(id: string): Promise<boolean> {
    return this.tickets.delete(id);
  }

  // Workflows
  async getWorkflow(id: string): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getWorkflowsByState(state: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(workflow => workflow.state === state);
  }

  async getPendingWorkflows(): Promise<Workflow[]> {
    return this.getWorkflowsByState('pending');
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = randomUUID();
    const workflow: Workflow = { 
      ...insertWorkflow,
      deptId: insertWorkflow.deptId ?? null,
      createdBy: insertWorkflow.createdBy ?? null,
      dataJson: insertWorkflow.dataJson ?? {},
      dueAt: insertWorkflow.dueAt ?? null,
      processedAt: null,
      processedBy: null,
      id,
      createdAt: new Date()
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const existing = this.workflows.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.workflows.set(id, updated);
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification = {
      ...notification,
      id,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        this.notifications.set(id, notification);
      }
    }
  }

  // Q&A History
  async getQAHistory(): Promise<QAHistory[]> {
    return Array.from(this.qaHistory.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getRecentQAHistory(limit: number): Promise<QAHistory[]> {
    const history = await this.getQAHistory();
    return history.slice(0, limit);
  }

  async createQAHistory(insertQA: InsertQAHistory): Promise<QAHistory> {
    const id = randomUUID();
    const qa: QAHistory = { 
      ...insertQA,
      userId: insertQA.userId ?? null,
      responseTime: insertQA.responseTime ?? null,
      confidence: insertQA.confidence ?? null,
      department: insertQA.department ?? null,
      sources: insertQA.sources ?? null,
      citations: insertQA.citations ?? null,
      id,
      createdAt: new Date()
    };
    this.qaHistory.set(id, qa);
    return qa;
  }

  // FAQs
  async getFAQsByDept(deptId: string): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).filter(faq => faq.deptId === deptId);
  }

  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const id = randomUUID();
    const newFAQ: FAQ = { ...faq, id };
    this.faqs.set(id, newFAQ);
    return newFAQ;
  }

  // Routing Rules
  async getRoutingRules(): Promise<RoutingRule[]> {
    return Array.from(this.routingRules.values());
  }

  async getRoutingRule(id: string): Promise<RoutingRule | undefined> {
    return this.routingRules.get(id);
  }

  async createRoutingRule(rule: InsertRoutingRule): Promise<RoutingRule> {
    const id = randomUUID();
    const newRule: RoutingRule = { 
      ...rule, 
      priority: rule.priority ?? null,
      isActive: rule.isActive ?? null,
      accuracy: rule.accuracy ?? null,
      id,
      createdAt: new Date()
    };
    this.routingRules.set(id, newRule);
    return newRule;
  }

  async updateRoutingRule(id: string, updates: Partial<RoutingRule>): Promise<RoutingRule | undefined> {
    const existing = this.routingRules.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.routingRules.set(id, updated);
    return updated;
  }

  // Workflow Templates
  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return Array.from(this.workflowTemplates.values());
  }

  async getWorkflowTemplate(id: string): Promise<WorkflowTemplate | undefined> {
    return this.workflowTemplates.get(id);
  }

  async createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const id = randomUUID();
    const newTemplate: WorkflowTemplate = { 
      ...template, 
      description: template.description ?? null,
      steps: template.steps ?? null,
      approvers: template.approvers ?? null,
      isDefault: template.isDefault ?? null,
      id,
      createdAt: new Date()
    };
    this.workflowTemplates.set(id, newTemplate);
    return newTemplate;
  }

  // Integrations
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const newIntegration: Integration = { 
      ...integration, 
      isActive: integration.isActive ?? null,
      config: integration.config ?? null,
      id,
      createdAt: new Date()
    };
    this.integrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined> {
    const existing = this.integrations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.integrations.set(id, updated);
    return updated;
  }

  // Notifications

}

// DatabaseStorage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  
  // Registration and authentication methods
  async createUserWithVerification(userData: {
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    department: string;
    verificationToken: string;
    tokenExpiry: Date;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        hashedPassword: userData.hashedPassword,
        department: userData.department,
        role: "employee", // Default role
        isVerified: false,
        verificationToken: userData.verificationToken,
        tokenExpiry: userData.tokenExpiry,
        authProvider: "local",
      })
      .returning();
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async verifyUser(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        tokenExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateVerificationToken(userId: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        verificationToken: token,
        tokenExpiry: expiry,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Departments
  async getDepartment(id: string): Promise<Department | undefined> {
    const [dept] = await db.select().from(departments).where(eq(departments.id, id));
    return dept || undefined;
  }

  async getAllDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async createDepartment(insertDept: InsertDepartment): Promise<Department> {
    const [dept] = await db.insert(departments).values(insertDept).returning();
    return dept;
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc || undefined;
  }

  async getAllDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByDept(deptId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.deptId, deptId));
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(insertDoc).returning();
    return doc;
  }

  // Document Chunks
  async getChunksByDocument(documentId: string): Promise<DocChunk[]> {
    return await db.select().from(docChunks).where(eq(docChunks.documentId, documentId));
  }

  async searchChunks(query: string, deptId?: string): Promise<DocChunk[]> {
    let chunks = await db
      .select()
      .from(docChunks)
      .where(like(docChunks.chunkText, `%${query}%`))
      .limit(10);

    // Filter by department if specified
    if (deptId) {
      const filteredChunks = [];
      for (const chunk of chunks) {
        if (chunk.documentId) {
          const [doc] = await db
            .select()
            .from(documents)
            .where(eq(documents.id, chunk.documentId));
          if (doc && doc.deptId === deptId) {
            filteredChunks.push(chunk);
          }
        }
      }
      return filteredChunks.slice(0, 5);
    }

    return chunks.slice(0, 5);
  }

  async createChunk(chunk: InsertChunk): Promise<DocChunk> {
    const [newChunk] = await db.insert(docChunks).values(chunk).returning();
    return newChunk;
  }

  // Tickets
  async getTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicketsByDept(deptId: string): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.deptId, deptId));
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.status, status));
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const [ticket] = await db.insert(tickets).values(insertTicket).returning();
    return ticket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set(updates).where(eq(tickets.id, id)).returning();
    return ticket || undefined;
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await db.delete(tickets).where(eq(tickets.id, id));
    return result.rowCount > 0;
  }

  // Workflows
  async getWorkflow(id: string): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).orderBy(desc(workflows.createdAt));
  }

  async getWorkflowsByState(state: string): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.state, state));
  }

  async getPendingWorkflows(): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.state, 'pending'));
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db.insert(workflows).values(insertWorkflow).returning();
    return workflow;
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const [workflow] = await db.update(workflows).set(updates).where(eq(workflows.id, id)).returning();
    return workflow || undefined;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id));
    return result.rowCount > 0;
  }

  // Q&A History
  async getQAHistory(): Promise<QAHistory[]> {
    return await db.select().from(qaHistory).orderBy(desc(qaHistory.createdAt));
  }

  async getRecentQAHistory(limit: number): Promise<QAHistory[]> {
    return await db.select().from(qaHistory).orderBy(desc(qaHistory.createdAt)).limit(limit);
  }

  async createQAHistory(insertQA: InsertQAHistory): Promise<QAHistory> {
    const [qa] = await db.insert(qaHistory).values(insertQA).returning();
    return qa;
  }

  // FAQs
  async getFAQsByDept(deptId: string): Promise<FAQ[]> {
    return await db.select().from(faqs).where(eq(faqs.deptId, deptId));
  }

  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const [newFAQ] = await db.insert(faqs).values(faq as any).returning();
    return newFAQ;
  }

  // Routing Rules
  async getRoutingRules(): Promise<RoutingRule[]> {
    return await db.select().from(routingRules).orderBy(desc(routingRules.createdAt));
  }

  async getRoutingRule(id: string): Promise<RoutingRule | undefined> {
    const [rule] = await db.select().from(routingRules).where(eq(routingRules.id, id));
    return rule || undefined;
  }

  async createRoutingRule(rule: InsertRoutingRule): Promise<RoutingRule> {
    const [newRule] = await db.insert(routingRules).values(rule).returning();
    return newRule;
  }

  async updateRoutingRule(id: string, updates: Partial<RoutingRule>): Promise<RoutingRule | undefined> {
    const [rule] = await db.update(routingRules).set(updates).where(eq(routingRules.id, id)).returning();
    return rule || undefined;
  }

  // Workflow Templates
  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return await db.select().from(workflowTemplates).orderBy(desc(workflowTemplates.createdAt));
  }

  async getWorkflowTemplate(id: string): Promise<WorkflowTemplate | undefined> {
    const [template] = await db.select().from(workflowTemplates).where(eq(workflowTemplates.id, id));
    return template || undefined;
  }

  async createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const [newTemplate] = await db.insert(workflowTemplates).values(template).returning();
    return newTemplate;
  }

  // Integrations
  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations).orderBy(desc(integrations.createdAt));
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const [newIntegration] = await db.insert(integrations).values(integration).returning();
    return newIntegration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined> {
    const [integration] = await db.update(integrations).set(updates).where(eq(integrations.id, id)).returning();
    return integration || undefined;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
