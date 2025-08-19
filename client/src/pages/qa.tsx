import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Clock, FileText, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QAResponse {
  answer: string;
  confidence: number;
  sources: Array<{
    documentId: string;
    documentTitle: string;
    chunk: string;
    similarity: number;
  }>;
  responseTime: number;
}

interface QAHistoryItem {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  responseTime: number;
  department: string;
  createdAt: string;
}

export default function QA() {
  const [question, setQuestion] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("general");
  const { toast } = useToast();

  const { data: recentQAs = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/qa/recent"],
  });

  const askQuestion = useMutation({
    mutationFn: async (data: { question: string; department: string; userId: string }) => {
      const response = await apiRequest("/api/qa/ask", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return response.json() as Promise<QAResponse>;
    },
    onSuccess: (response) => {
      setQuestion("");
      queryClient.invalidateQueries({ queryKey: ["/api/qa/recent"] });
      
      if (response.confidence < 50) {
        toast({
          title: "Low Confidence Response",
          description: "I'm not very confident about this answer. Consider contacting support directly.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    askQuestion.mutate({
      question: question.trim(),
      department: selectedDepartment,
      userId: "demo-user", // In real app, get from auth
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Q&A System"
          subtitle="Ask questions about company policies and procedures"
        />
        
        <main className="flex-1 overflow-y-auto p-6">

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ask Question Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Ask a Question
              </CardTitle>
              <CardDescription>
                Get instant answers from our AI assistant based on company documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger data-testid="select-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Your Question</label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., What is the vacation policy? How do I reset my password?"
                    className="min-h-[100px]"
                    data-testid="input-question"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={askQuestion.isPending || !question.trim()}
                  className="w-full"
                  data-testid="button-ask"
                >
                  {askQuestion.isPending ? "Getting Answer..." : "Ask Question"}
                </Button>
              </form>

              {/* Answer Display */}
              {askQuestion.data && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Answer</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={askQuestion.data.confidence > 70 ? "default" : "secondary"}>
                        {askQuestion.data.confidence}% confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {askQuestion.data.responseTime}ms
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-4">{askQuestion.data.answer}</p>
                  
                  {askQuestion.data.sources?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Sources:</h4>
                      <div className="space-y-2">
                        {askQuestion.data.sources.map((source, index) => (
                          <div key={index} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium">{source.documentTitle}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(source.similarity * 100)}% match
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{source.chunk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Q&A History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentQAs.length > 0 ? (
                <div className="space-y-3">
                  {recentQAs.map((qa) => (
                    <div key={qa.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{qa.question}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {qa.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {qa.answer}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Badge variant={qa.confidence > 70 ? "default" : "secondary"} className="text-xs">
                            {qa.confidence}%
                          </Badge>
                          <span>{qa.responseTime}ms</span>
                        </div>
                        <span>{new Date(qa.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No recent questions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
}