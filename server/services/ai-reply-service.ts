import OpenAI from 'openai';
import { IStorage } from '../storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AISuggestedReply {
  id: string;
  suggestion: string;
  tone: 'professional' | 'empathetic' | 'technical';
  confidence: number;
}

export class AIReplyService {
  constructor(private storage: IStorage) {}

  async generateSuggestedReplies(ticketId: string): Promise<AISuggestedReply[]> {
    try {
      // Get ticket details
      const ticket = await this.storage.getTicket(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Get relevant documents from knowledge base
      const relevantDocs = await this.findRelevantDocuments(ticket.subject + ' ' + ticket.description);

      // Generate AI suggestions
      const suggestions = await this.generateReplies(ticket, relevantDocs);

      return suggestions;
    } catch (error) {
      console.error('Error generating AI suggested replies:', error);
      throw error;
    }
  }

  private async findRelevantDocuments(query: string): Promise<any[]> {
    try {
      // Get documents from storage (simplified - in real implementation would use vector search)
      const documents = await this.storage.getAllDocuments();
      
      // For demo, return first 3 documents - in production would use semantic search
      return documents.slice(0, 3);
    } catch (error) {
      console.error('Error finding relevant documents:', error);
      return [];
    }
  }

  private async generateReplies(ticket: any, documents: any[]): Promise<AISuggestedReply[]> {
    const documentContext = documents.map(doc => 
      `Document: ${doc.name}\nContent: ${doc.content || 'File content not indexed'}`
    ).join('\n\n');

    const prompt = `
You are an AI assistant helping create professional replies to workplace tickets. 

Ticket Details:
- Subject: ${ticket.subject}
- Description: ${ticket.description}
- Category: ${ticket.category}
- Priority: ${ticket.priority}

Available Knowledge Base:
${documentContext}

Generate 3 distinct professional reply suggestions with different tones:
1. Professional/Formal tone
2. Empathetic/Supportive tone  
3. Technical/Detailed tone

Each reply should:
- Address the specific issue raised
- Reference relevant knowledge base information when applicable
- Be helpful and actionable
- Be appropriate for workplace communication
- Be 50-150 words

Format as JSON array with objects containing: suggestion, tone, confidence (0-1)
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const suggestions = JSON.parse(content);
      
      // Add unique IDs
      return suggestions.map((suggestion: any, index: number) => ({
        id: `reply-${ticketId}-${index}`,
        ...suggestion
      }));

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Fallback suggestions if OpenAI fails
      return [
        {
          id: `reply-${ticketId}-0`,
          suggestion: `Thank you for reporting this issue. I understand your concern regarding "${ticket.subject}". I'm looking into this matter and will provide you with a resolution within 24 hours. Please let me know if you need any immediate assistance.`,
          tone: 'professional' as const,
          confidence: 0.8
        },
        {
          id: `reply-${ticketId}-1`, 
          suggestion: `I'm sorry to hear you're experiencing this issue with "${ticket.subject}". I completely understand how frustrating this must be for you. Let me personally ensure this gets resolved quickly. I'll investigate the details and get back to you with a solution.`,
          tone: 'empathetic' as const,
          confidence: 0.8
        },
        {
          id: `reply-${ticketId}-2`,
          suggestion: `I've reviewed your ticket regarding "${ticket.subject}". Based on the information provided, this appears to be related to ${ticket.category}. I'll need to run some diagnostics and check our system logs. Please provide any error messages or additional details that might help with troubleshooting.`,
          tone: 'technical' as const,
          confidence: 0.8
        }
      ];
    }
  }
}

let aiReplyServiceInstance: AIReplyService | null = null;

export function initializeAIReplyService(storage: IStorage): AIReplyService {
  if (!aiReplyServiceInstance) {
    aiReplyServiceInstance = new AIReplyService(storage);
  }
  return aiReplyServiceInstance;
}

export function getAIReplyService(): AIReplyService {
  if (!aiReplyServiceInstance) {
    throw new Error('AIReplyService not initialized. Call initializeAIReplyService first.');
  }
  return aiReplyServiceInstance;
}