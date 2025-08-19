import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Receipt, UserPlus, Check, X } from "lucide-react";

export function PendingWorkflows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['/api/workflows/pending'],
    refetchInterval: 30000,
  });

  const approveWorkflowMutation = useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'approved' | 'rejected' }) => {
      await apiRequest(`/api/workflows/${id}/approve`, { 
        method: 'POST',
        body: JSON.stringify({ decision })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows/pending'] });
      toast({
        title: "Workflow Updated",
        description: "The workflow has been successfully processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'leave_request': return <Calendar className="text-amber-600 h-4 w-4" />;
      case 'expense_report': return <Receipt className="text-purple-600 h-4 w-4" />;
      case 'access_request': return <UserPlus className="text-blue-600 h-4 w-4" />;
      default: return <Calendar className="text-gray-600 h-4 w-4" />;
    }
  };

  const formatWorkflowType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDueStatus = (dueAt?: string) => {
    if (!dueAt) return { text: 'No due date', color: 'text-slate-500' };
    
    const due = new Date(dueAt).getTime();
    const now = Date.now();
    const hoursLeft = (due - now) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (hoursLeft < 4) {
      return { text: `Due in ${Math.round(hoursLeft)}h`, color: 'text-red-600' };
    } else if (hoursLeft < 24) {
      return { text: `Due in ${Math.round(hoursLeft)}h`, color: 'text-orange-600' };
    } else {
      const daysLeft = Math.round(hoursLeft / 24);
      return { text: `Due in ${daysLeft}d`, color: 'text-green-600' };
    }
  };

  const getMockWorkflowDetails = (workflow: any) => {
    switch (workflow.type) {
      case 'leave_request':
        return {
          requester: "Sarah Johnson - Marketing",
          details: "Dec 15-22, 2024"
        };
      case 'expense_report':
        return {
          requester: "Mike Chen - Sales", 
          details: "$1,247.50"
        };
      case 'access_request':
        return {
          requester: "Alex Rivera - Engineering",
          details: "Admin Database Access"
        };
      default:
        return {
          requester: "Unknown User",
          details: "No details available"
        };
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid="pending-workflows-card">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle>Pending Approvals</CardTitle>
          <Badge className="bg-red-100 text-red-800" data-testid="pending-count">
            {workflows.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-8" data-testid="no-pending-workflows">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-slate-600">No pending approvals at the moment.</p>
          </div>
        ) : (
          workflows.map((workflow: any) => {
            const workflowDetails = getMockWorkflowDetails(workflow);
            const dueStatus = getDueStatus(workflow.dueAt);
            
            return (
              <div 
                key={workflow.id} 
                className="border border-slate-200 rounded-lg p-4"
                data-testid={`workflow-item-${workflow.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getWorkflowIcon(workflow.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-1" data-testid={`workflow-type-${workflow.id}`}>
                      {formatWorkflowType(workflow.type)}
                    </p>
                    <p className="text-xs text-slate-500 mb-2" data-testid={`workflow-requester-${workflow.id}`}>
                      {workflowDetails.requester}
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs text-slate-600" data-testid={`workflow-details-${workflow.id}`}>
                        {workflowDetails.details}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className={`text-xs ${dueStatus.color}`} data-testid={`workflow-due-${workflow.id}`}>
                        {dueStatus.text}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => approveWorkflowMutation.mutate({ id: workflow.id, decision: 'approved' })}
                        disabled={approveWorkflowMutation.isPending}
                        data-testid={`button-approve-${workflow.id}`}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => approveWorkflowMutation.mutate({ id: workflow.id, decision: 'rejected' })}
                        disabled={approveWorkflowMutation.isPending}
                        data-testid={`button-reject-${workflow.id}`}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
