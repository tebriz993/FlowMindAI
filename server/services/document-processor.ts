import OpenAI from 'openai';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  documentId: string;
  pageNumber?: number;
}

export interface ProcessedDocument {
  chunks: DocumentChunk[];
  totalTokens: number;
}

export class DocumentProcessor {
  // Extract text from various document formats
  static async extractText(filePath: string, fileType: string): Promise<string> {
    try {
      if (fileType === 'text/plain' || filePath.endsWith('.txt')) {
        return readFileSync(filePath, 'utf8');
      }
      
      // For PDF and DOCX, we'll use a simple text extraction
      // In production, you'd use libraries like pdf-parse or mammoth
      if (fileType === 'application/pdf' || filePath.endsWith('.pdf')) {
        // Placeholder for PDF extraction - would use pdf-parse in production
        return `[PDF Content] This is a placeholder for PDF text extraction from ${filePath}`;
      }
      
      if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.endsWith('.docx')) {
        // Placeholder for DOCX extraction - would use mammoth in production
        return `[DOCX Content] This is a placeholder for DOCX text extraction from ${filePath}`;
      }
      
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error(`Failed to extract text from ${filePath}`);
    }
  }

  // Split document into chunks for better search and processing
  static chunkDocument(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    let currentSize = 0;

    for (const sentence of sentences) {
      const sentenceLength = sentence.trim().length;
      
      if (currentSize + sentenceLength > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        
        // Create overlap by including last few sentences
        const overlapText = currentChunk.split(/[.!?]+/).slice(-2).join('. ') + '. ';
        currentChunk = overlapText + sentence.trim() + '. ';
        currentSize = currentChunk.length;
      } else {
        currentChunk += sentence.trim() + '. ';
        currentSize += sentenceLength;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  // Generate embeddings using OpenAI
  static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      console.log('OpenAI API unavailable, using fallback embeddings');
      
      // Return fallback embedding vectors (random vectors with proper dimensions)
      return texts.map(() => 
        new Array(1536).fill(0).map(() => Math.random() * 0.01 - 0.005)
      );
    }
  }

  // Process a complete document
  static async processDocument(
    documentId: string, 
    filePath: string, 
    fileType: string
  ): Promise<ProcessedDocument> {
    const text = await this.extractText(filePath, fileType);
    const chunks = this.chunkDocument(text);
    const embeddings = await this.generateEmbeddings(chunks);

    const processedChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
      id: `${documentId}_chunk_${index}`,
      text: chunk,
      embedding: embeddings[index],
      documentId,
      pageNumber: Math.floor(index / 3) + 1, // Rough page estimation
    }));

    return {
      chunks: processedChunks,
      totalTokens: chunks.reduce((acc, chunk) => acc + chunk.length / 4, 0), // Rough token count
    };
  }

  // Search similar chunks using cosine similarity
  static cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  static async findSimilarChunks(
    query: string,
    chunks: DocumentChunk[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<Array<DocumentChunk & { similarity: number }>> {
    const [queryEmbedding] = await this.generateEmbeddings([query]);
    
    const similarities = chunks.map(chunk => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}