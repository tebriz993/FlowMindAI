import type { IStorage } from '../storage';
import type { InsertWorkflowTemplate, WorkflowTemplate } from '@shared/schema';

export class WorkflowTemplateService {
  constructor(private storage: IStorage) {}

  // Create default workflow templates
  async createDefaultTemplates(): Promise<void> {
    const templates: InsertWorkflowTemplate[] = [
      {
        name: 'Leave Request',
        type: 'leave_request',
        description: 'Standard employee leave request workflow',
        steps: [
          {
            id: 'submit',
            name: 'Submit Request',
            type: 'form',
            fields: [
              { name: 'startDate', type: 'date', required: true },
              { name: 'endDate', type: 'date', required: true },
              { name: 'leaveType', type: 'select', options: ['vacation', 'sick', 'personal'], required: true },
              { name: 'reason', type: 'textarea', required: false }
            ]
          },
          {
            id: 'manager_review',
            name: 'Manager Review',
            type: 'approval',
            assigneeRole: 'manager',
            actions: ['approve', 'reject', 'request_changes']
          },
          {
            id: 'hr_approval',
            name: 'HR Final Approval',
            type: 'approval',
            assigneeRole: 'hr',
            condition: 'leave_days > 5',
            actions: ['approve', 'reject']
          },
          {
            id: 'complete',
            name: 'Complete',
            type: 'notification',
            message: 'Leave request processed'
          }
        ],
        approvers: ['manager', 'hr'],
        isDefault: true
      },
      {
        name: 'Expense Report',
        type: 'expense_report',
        description: 'Employee expense reimbursement workflow',
        steps: [
          {
            id: 'submit_expenses',
            name: 'Submit Expenses',
            type: 'form',
            fields: [
              { name: 'totalAmount', type: 'number', required: true },
              { name: 'expenseType', type: 'select', options: ['travel', 'meals', 'supplies', 'other'], required: true },
              { name: 'receipts', type: 'file', multiple: true, required: true },
              { name: 'description', type: 'textarea', required: true }
            ]
          },
          {
            id: 'manager_review',
            name: 'Manager Review',
            type: 'approval',
            assigneeRole: 'manager',
            actions: ['approve', 'reject', 'request_changes']
          },
          {
            id: 'finance_review',
            name: 'Finance Review',
            type: 'approval',
            assigneeRole: 'finance',
            condition: 'amount > 500',
            actions: ['approve', 'reject', 'request_documentation']
          },
          {
            id: 'payment',
            name: 'Process Payment',
            type: 'task',
            assigneeRole: 'finance',
            autoComplete: false
          },
          {
            id: 'complete',
            name: 'Complete',
            type: 'notification',
            message: 'Expense reimbursement processed'
          }
        ],
        approvers: ['manager', 'finance'],
        isDefault: true
      },
      {
        name: 'IT Support Request',
        type: 'it_support',
        description: 'Standard IT support ticket workflow',
        steps: [
          {
            id: 'submit_request',
            name: 'Submit IT Request',
            type: 'form',
            fields: [
              { name: 'issueType', type: 'select', options: ['hardware', 'software', 'access', 'other'], required: true },
              { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'], required: true },
              { name: 'description', type: 'textarea', required: true },
              { name: 'screenshots', type: 'file', multiple: true, required: false }
            ]
          },
          {
            id: 'it_triage',
            name: 'IT Triage',
            type: 'review',
            assigneeRole: 'it',
            actions: ['assign', 'escalate', 'resolve_immediately']
          },
          {
            id: 'work_in_progress',
            name: 'Work in Progress',
            type: 'task',
            assigneeRole: 'it',
            actions: ['complete', 'escalate', 'request_info']
          },
          {
            id: 'user_testing',
            name: 'User Testing',
            type: 'approval',
            assigneeRole: 'requester',
            actions: ['confirm_resolved', 'report_issue']
          },
          {
            id: 'complete',
            name: 'Complete',
            type: 'notification',
            message: 'IT request resolved'
          }
        ],
        approvers: ['it'],
        isDefault: true
      },
      {
        name: 'Access Request',
        type: 'access_request',
        description: 'System access and permission workflow',
        steps: [
          {
            id: 'submit_access',
            name: 'Submit Access Request',
            type: 'form',
            fields: [
              { name: 'systemName', type: 'text', required: true },
              { name: 'accessType', type: 'select', options: ['read', 'write', 'admin'], required: true },
              { name: 'businessJustification', type: 'textarea', required: true },
              { name: 'urgency', type: 'select', options: ['routine', 'urgent', 'emergency'], required: true }
            ]
          },
          {
            id: 'manager_approval',
            name: 'Manager Approval',
            type: 'approval',
            assigneeRole: 'manager',
            actions: ['approve', 'reject']
          },
          {
            id: 'it_security_review',
            name: 'IT Security Review',
            type: 'approval',
            assigneeRole: 'it',
            actions: ['approve', 'reject', 'request_changes']
          },
          {
            id: 'provision_access',
            name: 'Provision Access',
            type: 'task',
            assigneeRole: 'it',
            autoComplete: false
          },
          {
            id: 'complete',
            name: 'Complete',
            type: 'notification',
            message: 'Access provisioned successfully'
          }
        ],
        approvers: ['manager', 'it'],
        isDefault: true
      }
    ];

    for (const template of templates) {
      await this.storage.createWorkflowTemplate(template);
    }
  }

  // Get workflow template by type
  async getTemplateByType(type: string): Promise<WorkflowTemplate | undefined> {
    const templates = await this.storage.getWorkflowTemplates();
    return templates.find(t => t.type === type && t.isDefault);
  }

  // Create workflow instance from template
  async createWorkflowFromTemplate(
    templateId: string,
    createdBy: string,
    data: any
  ): Promise<any> {
    const template = await this.storage.getWorkflowTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Create workflow instance with template steps and data
    return await this.storage.createWorkflow({
      type: template.type,
      createdBy,
      state: 'pending',
      dataJson: {
        ...data,
        templateId,
        currentStep: template.steps?.[0]?.id || 'start',
        steps: template.steps
      },
      deptId: null, // Will be assigned based on routing
      dueAt: this.calculateDueDate(template.type)
    });
  }

  private calculateDueDate(type: string): Date {
    const now = new Date();
    switch (type) {
      case 'leave_request':
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
      case 'expense_report':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      case 'it_support':
        return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day
      case 'access_request':
        return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days
      default:
        return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
    }
  }
}