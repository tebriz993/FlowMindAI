import { generateEmbedding } from "./openai";
import { storage } from "../storage";
import { randomUUID } from "crypto";

export interface ProcessedDocument {
  id: string;
  title: string;
  chunks: Array<{
    text: string;
    embedding: number[];
  }>;
}

export async function processDocument(
  title: string,
  content: string,
  deptId: string,
  createdBy: string
): Promise<ProcessedDocument> {
  // Create document record
  const document = await storage.createDocument({
    title,
    path: `documents/${randomUUID()}_${title}`,
    deptId,
    createdBy,
    accessRole: "department"
  });

  // Split content into chunks (simple implementation)
  const chunks = chunkText(content, 500); // 500 character chunks
  const processedChunks = [];

  for (const chunkText of chunks) {
    // Generate embedding for each chunk
    const embedding = await generateEmbedding(chunkText);
    
    // Store chunk with embedding
    await storage.createChunk({
      documentId: document.id,
      chunkText,
      embeddingVector: JSON.stringify(embedding)
    });

    processedChunks.push({
      text: chunkText,
      embedding
    });
  }

  return {
    id: document.id,
    title: document.title,
    chunks: processedChunks
  };
}

function chunkText(text: string, maxChunkSize: number): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence.trim();
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence.trim();
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // In a real implementation, you would use a PDF parsing library like pdf-parse
  // For now, return a placeholder
  return Promise.resolve("PDF content extraction not implemented yet. Please implement with pdf-parse library.");
}

export function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // In a real implementation, you would use a DOCX parsing library like mammoth
  // For now, return a placeholder
  return Promise.resolve("DOCX content extraction not implemented yet. Please implement with mammoth library.");
}
