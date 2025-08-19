import OpenAI from 'openai';
import type { IStorage } from '../storage';
import type { RoutingRule, InsertTicket } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RoutingResult {
  department: string;
  confidence: number;
  matchedRule?: string;
  reasoning: string;
}

export class TicketRoutingService {
  constructor(private storage: IStorage) {}

  // Auto-route ticket based on content and routing rules
  async routeTicket(ticket: Pick<InsertTicket, 'subject' | 'body'>): Promise<RoutingResult> {
    try {
      // Get active routing rules
      const rules = await this.storage.getRoutingRules();
      const activeRules = rules.filter(rule => rule.isActive);

      // First, try keyword-based routing
      const keywordMatch = this.findKeywordMatch(ticket, activeRules);
      if (keywordMatch) {
        return keywordMatch;
      }

      // Fall back to AI-based routing
      return await this.aiBasedRouting(ticket);

    } catch (error) {
      console.error('Error routing ticket:', error);
      return {
        department: 'IT', // Default fallback
        confidence: 20,
        reasoning: 'Error in routing - defaulted to IT department'
      };
    }
  }

  // Find matches using keyword rules
  private findKeywordMatch(
    ticket: Pick<InsertTicket, 'subject' | 'body'>, 
    rules: RoutingRule[]
  ): RoutingResult | null {
    const content = `${ticket.subject} ${ticket.body}`.toLowerCase();
    
    for (const rule of rules) {
      const keywords = rule.keywords.split(',').map(k => k.trim().toLowerCase());
      const matchedKeywords = keywords.filter(keyword => 
        content.includes(keyword)
      );

      if (matchedKeywords.length > 0) {
        const confidence = Math.min(95, 60 + (matchedKeywords.length * 15));
        
        return {
          department: rule.department,
          confidence,
          matchedRule: rule.name,
          reasoning: `Matched keywords: ${matchedKeywords.join(', ')}`
        };
      }
    }

    return null;
  }

  // AI-based routing using GPT
  private async aiBasedRouting(
    ticket: Pick<InsertTicket, 'subject' | 'body'>
  ): Promise<RoutingResult> {
    const prompt = `Analyze this support ticket and determine which department should handle it.

Ticket Subject: ${ticket.subject}
Ticket Body: ${ticket.body}

Available Departments:
- HR: Human resources, payroll, benefits, leave requests, employee relations
- IT: Technical issues, software problems, hardware, network, security
- Finance: Expenses, budgets, accounting, invoices, payments
- General: Other requests that don't fit specific categories

Respond with JSON containing:
{
  "department": "HR|IT|Finance|General",
  "confidence": number (0-100),
  "reasoning": "brief explanation"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: 'You are an expert at categorizing support tickets. Always respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        department: result.department || 'General',
        confidence: Math.min(100, Math.max(0, result.confidence || 50)),
        reasoning: result.reasoning || 'AI-based classification'
      };

    } catch (error) {
      console.warn('OpenAI API unavailable, using keyword-based routing');
      
      // Enhanced keyword-based fallback routing
      const content = `${ticket.subject} ${ticket.body}`.toLowerCase();
      
      // Rule-based classification
      if (content.includes('password') || content.includes('login') || content.includes('access') || content.includes('software') || content.includes('computer') || content.includes('network')) {
        return { department: 'IT', confidence: 75, reasoning: 'Keyword-based: IT-related terms detected' };
      } else if (content.includes('leave') || content.includes('vacation') || content.includes('payroll') || content.includes('benefit') || content.includes('hr')) {
        return { department: 'HR', confidence: 75, reasoning: 'Keyword-based: HR-related terms detected' };
      } else if (content.includes('expense') || content.includes('payment') || content.includes('invoice') || content.includes('budget') || content.includes('finance')) {
        return { department: 'Finance', confidence: 75, reasoning: 'Keyword-based: Finance-related terms detected' };
      } else {
        return { department: 'General', confidence: 40, reasoning: 'Keyword-based: No specific department keywords found' };
      }
    }
  }

  // Update routing rule accuracy based on manual corrections
  async updateRuleAccuracy(ruleId: string, wasCorrect: boolean): Promise<void> {
    try {
      const rule = await this.storage.getRoutingRule(ruleId);
      if (!rule) return;

      // Simple accuracy calculation - in production, use more sophisticated tracking
      const newAccuracy = wasCorrect 
        ? Math.min(100, rule.accuracy + 5)
        : Math.max(0, rule.accuracy - 3);

      await this.storage.updateRoutingRule(ruleId, { accuracy: newAccuracy });
    } catch (error) {
      console.error('Error updating rule accuracy:', error);
    }
  }

  // Get overall routing accuracy metrics
  async getRoutingAccuracy(): Promise<number> {
    try {
      const rules = await this.storage.getRoutingRules();
      if (rules.length === 0) return 0;

      const totalAccuracy = rules.reduce((sum, rule) => sum + rule.accuracy, 0);
      return Math.round(totalAccuracy / rules.length);
    } catch (error) {
      console.error('Error calculating routing accuracy:', error);
      return 0;
    }
  }

  // Create default routing rules
  async createDefaultRules(): Promise<void> {
    const defaultRules = [
      {
        name: 'HR Leave Requests',
        keywords: 'leave, vacation, sick day, PTO, time off, absence, holiday',
        department: 'HR',
        priority: 'medium',
        isActive: true,
        accuracy: 85,
      },
      {
        name: 'HR Payroll & Benefits',
        keywords: 'payroll, salary, benefits, health insurance, 401k, pension, bonus',
        department: 'HR',
        priority: 'medium',
        isActive: true,
        accuracy: 90,
      },
      {
        name: 'IT Software Issues',
        keywords: 'software, application, program, bug, error, crash, login, password',
        department: 'IT',
        priority: 'high',
        isActive: true,
        accuracy: 88,
      },
      {
        name: 'IT Hardware Issues',
        keywords: 'computer, laptop, monitor, printer, mouse, keyboard, hardware',
        department: 'IT',
        priority: 'high',
        isActive: true,
        accuracy: 92,
      },
      {
        name: 'Finance Expenses',
        keywords: 'expense, receipt, reimbursement, travel, invoice, payment',
        department: 'Finance',
        priority: 'medium',
        isActive: true,
        accuracy: 87,
      },
    ];

    for (const rule of defaultRules) {
      await this.storage.createRoutingRule(rule);
    }
  }
}