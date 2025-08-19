import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertTriangle } from "lucide-react";

export function QAActivity() {
  const { data: qaHistory = [], isLoading } = useQuery({
    queryKey: ['/api/qa/recent'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid="qa-activity-card">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Q&A Activity</CardTitle>
          <Button variant="ghost" className="text-primary-600 hover:text-primary-700" data-testid="button-view-all-qa">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : qaHistory.length === 0 ? (
          <div className="text-center py-8" data-testid="no-qa-activity">
            <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recent Q&A activity</h3>
            <p className="text-slate-600">Questions and answers will appear here once users start interacting with FlowMindAI.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {qaHistory.slice(0, 3).map((qa: any) => {
              const confidence = qa.confidence || 0;
              const isLowConfidence = confidence < 70;
              
              return (
                <div 
                  key={qa.id} 
                  className={`flex space-x-4 p-4 rounded-lg ${isLowConfidence ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}
                  data-testid={`qa-item-${qa.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isLowConfidence ? 'bg-amber-100' : 
                    qa.department === 'HR' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {isLowConfidence ? (
                      <AlertTriangle className={`${isLowConfidence ? 'text-amber-600' : 'text-blue-600'} h-5 w-5`} />
                    ) : (
                      <MessageCircle className={`${
                        qa.department === 'HR' ? 'text-blue-600' : 'text-orange-600'
                      } h-5 w-5`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-1" data-testid={`qa-question-${qa.id}`}>
                      {qa.question}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-2">
                      <span data-testid={`qa-department-${qa.id}`}>{qa.department || 'General'}</span>
                      <span data-testid={`qa-response-time-${qa.id}`}>
                        {qa.responseTime ? `${(qa.responseTime / 1000).toFixed(1)}s response` : 'N/A'}
                      </span>
                      <span data-testid={`qa-timestamp-${qa.id}`}>{formatTimeAgo(qa.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        isLowConfidence 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isLowConfidence ? 'Low Confidence' : 'Answered'}
                      </span>
                      <span className="text-xs text-slate-500" data-testid={`qa-confidence-${qa.id}`}>
                        {confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
