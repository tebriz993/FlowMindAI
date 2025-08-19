import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, X } from "lucide-react";

interface QATestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QAResponse {
  answer: string;
  confidence: number;
  sources: string[];
  responseTime: number;
}

export function QATestModal({ isOpen, onClose }: QATestModalProps) {
  const [question, setQuestion] = useState("");
  const [department, setDepartment] = useState("hr");
  const [response, setResponse] = useState<QAResponse | null>(null);
  const { toast } = useToast();

  const askQuestionMutation = useMutation({
    mutationFn: async ({ question, department }: { question: string; department: string }) => {
      const res = await apiRequest('/api/qa/ask', { 
        method: 'POST',
        body: JSON.stringify({ question, department })
      });
      return res.json();
    },
    onSuccess: (data: QAResponse) => {
      setResponse(data);
      toast({
        title: "Question Processed",
        description: `Response generated in ${(data.responseTime / 1000).toFixed(1)} seconds`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setResponse(null);
    askQuestionMutation.mutate({ question: question.trim(), department });
  };

  const handleClose = () => {
    setQuestion("");
    setDepartment("hr");
    setResponse(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" data-testid="qa-test-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Test Q&A System</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} data-testid="button-close-modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
              Select Department
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger data-testid="select-test-department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
              Ask a Question
            </Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the company's remote work policy?"
              className="h-24 resize-none"
              required
              data-testid="textarea-test-question"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              disabled={askQuestionMutation.isPending || !question.trim()}
              className="bg-primary-500 text-white hover:bg-primary-600 flex-1"
              data-testid="button-ask-question"
            >
              {askQuestionMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask Question
                </>
              )}
            </Button>
            <div className="text-sm text-slate-500">
              Target: ≤2.5s response
            </div>
          </div>
        </form>
        
        {/* Response Area */}
        {response && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg" data-testid="qa-response-area">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-blue-600 h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-slate-900">FlowMindAI Response</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs" data-testid="response-time">
                    {(response.responseTime / 1000).toFixed(1)}s
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs" data-testid="response-confidence">
                    {response.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-3" data-testid="response-answer">
                  {response.answer}
                </p>
                {response.sources.length > 0 && (
                  <div className="text-xs text-slate-500" data-testid="response-sources">
                    <span className="font-medium">Sources:</span> {response.sources.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
