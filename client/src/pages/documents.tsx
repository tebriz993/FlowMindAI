import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DocumentUpload } from "@/components/forms/document-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Upload, File, Calendar, User } from "lucide-react";
import type { Document } from "../../../shared/schema";

export default function Documents() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Documents"
          subtitle="Manage your document library and AI knowledge base."
          actionButton={
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-primary-500 hover:bg-primary-600"
              data-testid="button-upload-document"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8" data-testid="loading-documents">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <File className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" data-testid="text-no-documents">No documents uploaded yet</h3>
                <p className="text-slate-600 mb-4">Upload your first document to start building the AI knowledge base.</p>
                <Button 
                  onClick={() => setIsUploadOpen(true)}
                  data-testid="button-upload-first-document"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow" data-testid={`card-document-${doc.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <File className="h-5 w-5 text-blue-600" />
                      <span className="truncate" data-testid={`text-document-title-${doc.id}`}>{doc.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span data-testid={`text-document-creator-${doc.id}`}>Created by Admin</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span data-testid={`text-document-date-${doc.id}`}>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
      
      <DocumentUpload 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
