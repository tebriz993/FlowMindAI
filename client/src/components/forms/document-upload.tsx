import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X } from "lucide-react";

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentUpload({ isOpen, onClose }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [deptId, setDeptId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Document Uploaded",
        description: `Successfully processed ${data.chunksCreated} text chunks for AI search.`,
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!deptId) {
      toast({
        title: "Missing Department",
        description: "Please select a department for this document.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    formData.append('deptId', deptId);

    uploadMutation.mutate(formData);
  };

  const handleClose = () => {
    setFile(null);
    setTitle("");
    setDeptId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="document-upload-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Upload Document</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} data-testid="button-close-upload-modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-2">
              Select File
            </Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-600">Click to select a file</p>
                    <p className="text-xs text-slate-500">PDF, Word, or Text files up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Document Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              data-testid="input-document-title"
            />
          </div>
          
          <div>
            <Label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </Label>
            <Select value={deptId} onValueChange={setDeptId} required>
              <SelectTrigger data-testid="select-document-department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel-upload"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploadMutation.isPending || !file || !deptId}
              className="bg-primary-500 text-white hover:bg-primary-600 flex-1"
              data-testid="button-submit-upload"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
