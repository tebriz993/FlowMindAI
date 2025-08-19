import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, X } from "lucide-react";
import type { Workflow } from "../../../shared/schema";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Workflows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: workflows = [], isLoading } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const approveWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await apiRequest(`/api/workflows/${workflowId}/approve`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows/pending'] });
      toast({
        title: "Workflow Approved",
        description: "The workflow has been approved and the user will be notified.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await apiRequest(`/api/workflows/${workflowId}/reject`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows/pending'] });
      toast({
        title: "Workflow Rejected",
        description: "The workflow has been rejected and the user will be notified.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Unknown';
    const user = (users as any[]).find((u: any) => u.id === userId);
    return user?.name || user?.email || 'Unknown User';
  };

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return 'General';
    const dept = (departments as any[]).find((d: any) => d.id === deptId);
    return dept?.name || 'Unknown';
  };

  const formatCreatedAt = (createdAt: Date | string | null) => {
    if (!createdAt) return 'Unknown';
    const date = new Date(createdAt);
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const relative = formatDistanceToNow(date, { addSuffix: true });
    return `${time} • ${relative}`;
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Workflows"
          subtitle="Manage approval workflows for leave requests, expenses, and access permissions."
          actionButton={
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-create-workflow">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>All Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8" data-testid="loading-workflows">Loading workflows...</div>
              ) : workflows.length === 0 ? (
                <div className="text-center py-8" data-testid="text-no-workflows">
                  <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
                  <p className="text-slate-600">No approval workflows have been created yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Type</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Requester</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">State</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Due Date</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Created</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workflows.map((workflow) => (
                        <tr key={workflow.id} className="hover:bg-slate-50" data-testid={`row-workflow-${workflow.id}`}>
                          <td className="py-4 px-6">
                            <span className="text-sm font-medium text-slate-900" data-testid={`text-workflow-type-${workflow.id}`}>
                              {workflow.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600" data-testid={`text-workflow-requester-${workflow.id}`}>
                              {getUserName(workflow.createdBy)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStateColor(workflow.state)} data-testid={`badge-workflow-state-${workflow.id}`}>
                              {workflow.state.charAt(0).toUpperCase() + workflow.state.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600" data-testid={`text-workflow-due-${workflow.id}`}>
                              {workflow.dueAt ? new Date(workflow.dueAt).toLocaleDateString() : 'No due date'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600" data-testid={`text-workflow-created-${workflow.id}`}>
                              {formatCreatedAt(workflow.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {workflow.state === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => approveWorkflow.mutate(workflow.id)}
                                  disabled={approveWorkflow.isPending}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  data-testid={`button-approve-${workflow.id}`}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectWorkflow.mutate(workflow.id)}
                                  disabled={rejectWorkflow.isPending}
                                  data-testid={`button-reject-${workflow.id}`}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {workflow.state !== 'pending' && (
                              <span className="text-sm text-slate-500">
                                {workflow.state === 'approved' ? 'Completed' : 'Completed'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
