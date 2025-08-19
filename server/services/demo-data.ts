import { storage } from "../storage";
import type { 
  InsertUser, 
  InsertDepartment, 
  InsertDocument, 
  InsertTicket, 
  InsertWorkflow,
  InsertNotification,
  InsertQAHistory,
  InsertRoutingRule,
  InsertWorkflowTemplate,
  InsertIntegration,
  User,
  Department
} from "@shared/schema";

export class DemoDataService {
  private adminUserId: string = '';
  private hrUserId: string = '';
  private itUserId: string = '';
  private employeeUserId: string = '';
  private departments: Department[] = [];

  async initializeDemoData() {
    console.log('Initializing demo data...');
    
    // Check if data already exists
    const existingUsers = await storage.getAllUsers();
    if (existingUsers.length > 0) {
      console.log('Demo data already exists, skipping initialization');
      return;
    }

    // Create departments first
    await this.createDemoDepartments();
    
    // Create users
    await this.createDemoUsers();
    
    // Create documents
    await this.createDemoDocuments();
    
    // Create tickets
    await this.createDemoTickets();
    
    // Create workflows
    await this.createDemoWorkflows();
    
    // Create notifications
    await this.createDemoNotifications();
    
    // Create Q&A history
    await this.createDemoQAHistory();
    
    // Create routing rules
    await this.createDemoRoutingRules();
    
    // Create workflow templates
    await this.createDemoWorkflowTemplates();
    
    // Create integrations
    await this.createDemoIntegrations();

    console.log('✅ Demo data initialization completed');
  }

  private async createDemoDepartments() {
    console.log('Creating demo departments...');
    
    const departmentNames = [
      "Human Resources Department (HR)",
      "Information Technology Department (IT)", 
      "Finance Department",
      "Marketing Department",
      "Sales Department",
      "Operations Department",
      "Legal Affairs Department",
      "Executive Office",
      "Research and Development (R&D) Department",
      "Customer Support Department"
    ];

    for (const name of departmentNames) {
      const dept = await storage.createDepartment({ name });
      this.departments.push(dept);
    }
    
    console.log(`✅ Created ${this.departments.length} demo departments`);
  }

  private async createDemoUsers() {
    console.log('Creating demo users...');
    
    const hrDept = this.departments.find(d => d.name.includes("Human Resources"));
    const itDept = this.departments.find(d => d.name.includes("Information Technology"));
    const marketingDept = this.departments.find(d => d.name.includes("Marketing"));

    const users: InsertUser[] = [
      {
        email: "admin@flowmind.ai",
        name: "System Administrator", 
        role: "admin",
        deptId: hrDept?.id || null,
        authProvider: "local"
      },
      {
        email: "hr@flowmind.ai",
        name: "HR Manager",
        role: "hr", 
        deptId: hrDept?.id || null,
        authProvider: "local"
      },
      {
        email: "it@flowmind.ai", 
        name: "IT Support Lead",
        role: "it",
        deptId: itDept?.id || null,
        authProvider: "local"
      },
      {
        email: "employee@flowmind.ai",
        name: "John Employee",
        role: "employee",
        deptId: marketingDept?.id || null,
        authProvider: "local"
      },
      {
        email: "manager@flowmind.ai",
        name: "Sarah Manager",
        role: "manager",
        deptId: marketingDept?.id || null,
        authProvider: "local"
      }
    ];

    for (const userData of users) {
      const user = await storage.createUser(userData);
      if (userData.role === 'admin') this.adminUserId = user.id;
      if (userData.role === 'hr') this.hrUserId = user.id;
      if (userData.role === 'it') this.itUserId = user.id;
      if (userData.role === 'employee') this.employeeUserId = user.id;
    }
    
    console.log('✅ Created 5 demo users');
  }

  private async createDemoDocuments() {
    console.log('Creating demo documents...');
    
    const hrDept = this.departments.find(d => d.name.includes("Human Resources"));
    const itDept = this.departments.find(d => d.name.includes("Information Technology"));

    const documents: InsertDocument[] = [
      {
        title: "Employee Handbook 2024",
        path: "/uploads/employee-handbook.pdf",
        deptId: hrDept?.id || null,
        accessRole: "all",
        version: 1,
        createdBy: this.hrUserId || null
      },
      {
        title: "IT Security Policy",
        path: "/uploads/it-security-policy.pdf", 
        deptId: itDept?.id || null,
        accessRole: "all",
        version: 2,
        createdBy: this.itUserId || null
      },
      {
        title: "Leave Request Process",
        path: "/uploads/leave-process.pdf",
        deptId: hrDept?.id || null,
        accessRole: "employee",
        version: 1,
        createdBy: this.hrUserId || null
      },
      {
        title: "VPN Setup Guide",
        path: "/uploads/vpn-guide.pdf",
        deptId: itDept?.id || null,
        accessRole: "employee", 
        version: 3,
        createdBy: this.itUserId || null
      }
    ];

    for (const docData of documents) {
      await storage.createDocument(docData);
    }
    
    console.log('✅ Created 4 demo documents');
  }

  private async createDemoTickets() {
    console.log('Creating demo tickets...');
    
    const hrDept = this.departments.find(d => d.name.includes("Human Resources"));
    const itDept = this.departments.find(d => d.name.includes("Information Technology"));

    const tickets: InsertTicket[] = [
      {
        createdBy: this.employeeUserId || null,
        deptId: itDept?.id || null,
        subject: "Password Reset Request",
        body: "I forgot my password and cannot access my account. Please help me reset it.",
        status: "open",
        priority: "medium",
        assigneeId: this.itUserId || null
      },
      {
        createdBy: this.employeeUserId || null,
        deptId: itDept?.id || null,
        subject: "VPN Connection Issues",
        body: "I'm having trouble connecting to the company VPN from home. The connection keeps dropping.", 
        status: "in_progress",
        priority: "high",
        assigneeId: this.itUserId || null
      },
      {
        createdBy: this.employeeUserId || null,
        deptId: hrDept?.id || null,
        subject: "Leave Request Question",
        body: "I need to understand the process for requesting annual leave. How many days in advance should I submit?",
        status: "resolved",
        priority: "low",
        assigneeId: this.hrUserId || null
      }
    ];

    for (const ticketData of tickets) {
      await storage.createTicket(ticketData);
    }
    
    console.log('✅ Created 3 demo tickets');
  }

  private async createDemoWorkflows() {
    console.log('Creating demo workflows...');
    
    const hrDept = this.departments.find(d => d.name.includes("Human Resources"));

    const workflows: InsertWorkflow[] = [
      {
        type: "leave_request",
        createdBy: this.employeeUserId || null,
        state: "pending",
        deptId: hrDept?.id || null,
        dataJson: {
          startDate: "2024-03-15",
          endDate: "2024-03-20",
          reason: "Family vacation",
          days: 5
        }
      },
      {
        type: "expense_report", 
        createdBy: this.employeeUserId || null,
        state: "approved",
        deptId: hrDept?.id || null,
        dataJson: {
          amount: 150.00,
          category: "Travel",
          description: "Client meeting travel expenses"
        },
        processedBy: this.hrUserId || null,
        processedAt: new Date()
      },
      {
        type: "access_request",
        createdBy: this.employeeUserId || null,
        state: "pending", 
        deptId: hrDept?.id || null,
        dataJson: {
          system: "CRM",
          accessLevel: "read-write",
          justification: "Need access for new marketing campaign"
        }
      }
    ];

    for (const workflowData of workflows) {
      await storage.createWorkflow(workflowData);
    }
    
    console.log('✅ Created 3 demo workflows');
  }

  private async createDemoNotifications() {
    console.log('Creating demo notifications...');
    
    const notifications: InsertNotification[] = [
      {
        userId: this.adminUserId || '',
        title: "New Ticket Assigned",
        message: "A new IT support ticket has been assigned to your team",
        type: "ticket",
        isRead: false,
        actionUrl: "/admin/tickets"
      },
      {
        userId: this.adminUserId || '', 
        title: "Workflow Approval Needed",
        message: "A leave request is pending your approval",
        type: "approval",
        isRead: false,
        actionUrl: "/admin/workflows"
      },
      {
        userId: this.employeeUserId || '',
        title: "Leave Request Approved", 
        message: "Your leave request for March 15-20 has been approved",
        type: "approval",
        isRead: true,
        actionUrl: "/portal/workflows"
      }
    ];

    for (const notificationData of notifications) {
      await storage.createNotification(notificationData);
    }
    
    console.log('✅ Created 3 demo notifications');
  }

  private async createDemoQAHistory() {
    console.log('Creating demo Q&A history...');
    
    const qaEntries: InsertQAHistory[] = [
      {
        userId: this.employeeUserId || null,
        question: "How do I reset my password?",
        answer: "You can reset your password by clicking the 'Forgot Password' link on the login page or contacting IT support.",
        responseTime: 1250,
        confidence: 95,
        department: "IT",
        sources: JSON.stringify(["doc-1", "doc-2"]),
        citations: JSON.stringify([])
      },
      {
        userId: this.employeeUserId || null,
        question: "What is the leave request process?", 
        answer: "To request leave, you need to submit a formal request at least 2 weeks in advance through the HR portal.",
        responseTime: 890,
        confidence: 88,
        department: "HR",
        sources: JSON.stringify(["doc-3"]),
        citations: JSON.stringify([])
      }
    ];

    for (const qaData of qaEntries) {
      await storage.createQAHistory(qaData);
    }
    
    console.log('✅ Created 2 demo Q&A entries');
  }

  private async createDemoRoutingRules() {
    console.log('Creating demo routing rules...');
    
    const routingRules: InsertRoutingRule[] = [
      {
        name: "Password Issues",
        keywords: "password,login,access,authentication,signin",
        department: "IT",
        priority: "high",
        isActive: true,
        accuracy: 92
      },
      {
        name: "Leave Requests",
        keywords: "leave,vacation,time off,pto,holiday",
        department: "HR", 
        priority: "medium",
        isActive: true,
        accuracy: 95
      },
      {
        name: "VPN and Network",
        keywords: "vpn,network,connection,internet,wifi",
        department: "IT",
        priority: "high", 
        isActive: true,
        accuracy: 89
      }
    ];

    for (const ruleData of routingRules) {
      await storage.createRoutingRule(ruleData);
    }
    
    console.log('✅ Created 3 demo routing rules');
  }

  private async createDemoWorkflowTemplates() {
    console.log('Creating demo workflow templates...');
    
    const templates: InsertWorkflowTemplate[] = [
      {
        name: "Standard Leave Request",
        type: "leave_request",
        description: "Template for employee leave requests requiring manager approval",
        steps: [
          { step: 1, name: "Submit Request", required: true },
          { step: 2, name: "Manager Review", required: true },
          { step: 3, name: "HR Approval", required: true }
        ],
        approvers: ["manager", "hr"],
        isDefault: true
      },
      {
        name: "IT Access Request", 
        type: "access_request",
        description: "Template for requesting access to IT systems and applications",
        steps: [
          { step: 1, name: "Submit Request", required: true },
          { step: 2, name: "Security Review", required: true },
          { step: 3, name: "IT Approval", required: true }
        ],
        approvers: ["it", "security"],
        isDefault: true
      }
    ];

    for (const templateData of templates) {
      await storage.createWorkflowTemplate(templateData);
    }
    
    console.log('✅ Created 2 demo workflow templates');
  }

  private async createDemoIntegrations() {
    console.log('Creating demo integrations...');
    
    const integrations: InsertIntegration[] = [
      {
        platform: "slack",
        config: {
          botToken: "xoxb-example-token",
          channels: ["#general", "#it-support", "#hr"],
          webhookUrl: "https://hooks.slack.com/services/example"
        },
        isActive: false
      },
      {
        platform: "email",
        config: {
          smtpServer: "smtp.company.com",
          port: 587,
          username: "notifications@company.com",
          templates: {
            ticketCreated: "ticket-created-template",
            workflowApproved: "workflow-approved-template"
          }
        },
        isActive: true
      }
    ];

    for (const integrationData of integrations) {
      await storage.createIntegration(integrationData);
    }
    
    console.log('✅ Created 2 demo integrations');
  }
}