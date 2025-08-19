import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-test-key"
});

export interface QAResponse {
  answer: string;
  confidence: number;
  sources: string[];
  responseTime: number;
}

export async function answerQuestion(
  question: string,
  context: string,
  department?: string
): Promise<QAResponse> {
  const startTime = Date.now();

  try {
    const systemPrompt = `You are FlowMindAI, an expert workplace assistant specializing in ${department || 'general'} queries. 

Your task is to answer employee questions based on the provided company documentation context. 

Guidelines:
- Provide clear, concise, and accurate answers
- If the answer isn't in the context, say so clearly
- Always cite specific documents when possible
- Use a professional but friendly tone
- For policy questions, be specific about requirements and procedures

Context from company documents:
${context}

Respond in JSON format with:
{
  "answer": "Your detailed answer here",
  "confidence": 85,
  "sources": ["document1.pdf", "document2.docx"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const responseTime = Date.now() - startTime;
    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      answer: result.answer || "I couldn't process your question properly.",
      confidence: Math.min(100, Math.max(0, result.confidence || 0)),
      sources: Array.isArray(result.sources) ? result.sources : [],
      responseTime
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      answer: "I'm experiencing technical difficulties. Please try again or contact IT support.",
      confidence: 0,
      sources: [],
      responseTime: Date.now() - startTime
    };
  }
}

export async function categorizeTicket(subject: string, body: string): Promise<{
  department: string;
  priority: string;
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a ticket routing system. Analyze the ticket and categorize it.

Department options: "HR", "IT", "General"
Priority options: "low", "medium", "high", "critical"

Respond in JSON format:
{
  "department": "IT",
  "priority": "medium", 
  "confidence": 85
}`
        },
        {
          role: "user",
          content: `Subject: ${subject}\n\nBody: ${body}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      department: result.department || "General",
      priority: result.priority || "medium",
      confidence: Math.min(100, Math.max(0, result.confidence || 0))
    };
  } catch (error) {
    console.error("Ticket categorization error:", error);
    return {
      department: "General",
      priority: "medium", 
      confidence: 0
    };
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding generation error:", error);
    return [];
  }
}
