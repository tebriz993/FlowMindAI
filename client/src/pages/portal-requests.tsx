import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { PortalHeader } from "@/components/portal/portal-header";
import { useAuth } from "@/components/auth/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, FileText, Calendar, DollarSign, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserWorkflow {
  id: string;
  type: "leave_request" | "expense_reimbursement" | "access_request";
  state: "pending" | "approved" | "rejected" | "in_review";
  createdAt: string;
  dataJson: {
    startDate?: string;
    endDate?: string;
    reason?: string;
    amount?: number;
    description?: string;
    resource?: string;
  };
}

export default function PortalRequests() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<UserWorkflow | null>(null);
  const [requestType, setRequestType] = useState<string>("");
  const { toast } = useToast();

  // Default to PortalSidebar for portal interface
  const SidebarComponent = PortalSidebar;

  const { data: userRequests = [], isLoading } = useQuery({
    queryKey: ["/api/workflows/me"],
  }) as { data: UserWorkflow[]; isLoading: boolean };

  const createRequest = useMutation({
    mutationFn: async (data: { 
      type: string; 
      state: string;
      deptId: string;
      dataJson: Record<string, any>;
      createdBy: string;
    }) => {
      const response = await apiRequest( "/api/workflows", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows/me"] });
      setIsCreateModalOpen(false);
      setRequestType("");
      toast({
        title: "Success",
        description: "Your request has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateRequest = useMutation({
    mutationFn: async (data: { 
      id: string;
      type: string;
      dataJson: Record<string, any>;
    }) => {
      const response = await apiRequest("PATCH", `/api/workflows/${data.id}`, {
        type: data.type,
        dataJson: data.dataJson
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows/me"] });
      setIsEditModalOpen(false);
      setEditingRequest(null);
      toast({
        title: "Success",
        description: "Your request has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (requestId: string) => {
      await apiRequest("DELETE", `/api/workflows/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows/me"] });
      toast({
        title: "Success",
        description: "Your request has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    let requestData: Record<string, any> = {};
    
    switch (requestType) {
      case "leave_request":
        requestData = {
          startDate: formData.get("startDate") as string,
          endDate: formData.get("endDate") as string,
          reason: formData.get("reason") as string,
        };
        break;
      case "expense_reimbursement":
        requestData = {
          amount: parseFloat(formData.get("amount") as string),
          description: formData.get("description") as string,
        };
        break;
      case "access_request":
        requestData = {
          resource: formData.get("resource") as string,
          reason: formData.get("reason") as string,
        };
        break;
    }

    createRequest.mutate({
      type: requestType,
      state: "pending",
      deptId: "cea68d1f-541a-492f-a5e3-3fde01949879", // HR department ID
      dataJson: requestData,
      createdBy: "demo-user", // In real app, get from auth
    });
  };

  const handleEditRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRequest) return;
    
    const formData = new FormData(event.currentTarget);
    
    let requestData: Record<string, any> = {};
    
    switch (editingRequest.type) {
      case "leave_request":
        requestData = {
          startDate: formData.get("startDate") as string,
          endDate: formData.get("endDate") as string,
          reason: formData.get("reason") as string,
        };
        break;
      case "expense_reimbursement":
        requestData = {
          amount: parseFloat(formData.get("amount") as string),
          description: formData.get("description") as string,
        };
        break;
      case "access_request":
        requestData = {
          resource: formData.get("resource") as string,
          reason: formData.get("reason") as string,
        };
        break;
    }

    updateRequest.mutate({
      id: editingRequest.id,
      type: editingRequest.type,
      dataJson: requestData,
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    deleteRequest.mutate(requestId);
  };

  const openEditModal = (request: UserWorkflow) => {
    setEditingRequest(request);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "in_review": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "leave_request": return <Calendar className="h-4 w-4" />;
      case "expense_reimbursement": return <DollarSign className="h-4 w-4" />;
      case "access_request": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatRequestType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderEditRequestForm = () => {
    if (!editingRequest) return null;
    
    switch (editingRequest.type) {
      case "leave_request":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  name="startDate"
                  type="date"
                  defaultValue={editingRequest.dataJson?.startDate}
                  required
                  data-testid="input-edit-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  name="endDate"
                  type="date"
                  defaultValue={editingRequest.dataJson?.endDate}
                  required
                  data-testid="input-edit-end-date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reason">Reason</Label>
              <Textarea
                id="edit-reason"
                name="reason"
                defaultValue={editingRequest.dataJson?.reason}
                placeholder="Reason for leave"
                required
                data-testid="textarea-edit-reason"
              />
            </div>
          </div>
        );
      case "expense_reimbursement":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={editingRequest.dataJson?.amount}
                placeholder="0.00"
                required
                data-testid="input-edit-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={editingRequest.dataJson?.description}
                placeholder="Description of expense"
                required
                data-testid="textarea-edit-description"
              />
            </div>
          </div>
        );
      case "access_request":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-resource">Resource</Label>
              <Input
                id="edit-resource"
                name="resource"
                defaultValue={editingRequest.dataJson?.resource}
                placeholder="System or resource name"
                required
                data-testid="input-edit-resource"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reason">Reason</Label>
              <Textarea
                id="edit-reason"
                name="reason"
                defaultValue={editingRequest.dataJson?.reason}
                placeholder="Reason for access"
                required
                data-testid="textarea-edit-reason"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderRequestForm = () => {
    switch (requestType) {
      case "leave_request":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  data-testid="input-end-date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please provide a reason for your leave request"
                rows={3}
                required
                data-testid="textarea-reason"
              />
            </div>
          </div>
        );
      
      case "expense_reimbursement":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                data-testid="input-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the expense and provide justification"
                rows={4}
                required
                data-testid="textarea-description"
              />
            </div>
          </div>
        );
      
      case "access_request":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resource">Resource/System</Label>
              <Input
                id="resource"
                name="resource"
                placeholder="e.g., Database access, VPN, specific application"
                required
                data-testid="input-resource"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Business Justification</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Please explain why you need access to this resource"
                rows={3}
                required
                data-testid="textarea-justification"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <SidebarComponent />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader
          title="My Requests"
          subtitle="View and manage your workflow requests"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workflow Requests</h1>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-request">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Request</DialogTitle>
                  </DialogHeader>
                  
                  {!requestType ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Select the type of request you'd like to submit:
                      </p>
                      <div className="grid gap-3">
                        <Button
                          variant="outline"
                          className="justify-start p-4 h-auto"
                          onClick={() => setRequestType("leave_request")}
                          data-testid="button-leave-request"
                        >
                          <Calendar className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Leave Request</div>
                            <div className="text-sm text-gray-500">Request time off work</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="justify-start p-4 h-auto"
                          onClick={() => setRequestType("expense_reimbursement")}
                          data-testid="button-expense-request"
                        >
                          <DollarSign className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Expense Reimbursement</div>
                            <div className="text-sm text-gray-500">Submit expenses for reimbursement</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="justify-start p-4 h-auto"
                          onClick={() => setRequestType("access_request")}
                          data-testid="button-access-request"
                        >
                          <FileText className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Access Request</div>
                            <div className="text-sm text-gray-500">Request access to systems or resources</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateRequest}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{formatRequestType(requestType)}</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setRequestType("")}
                            data-testid="button-back"
                          >
                            ← Back
                          </Button>
                        </div>
                        
                        {renderRequestForm()}
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsCreateModalOpen(false);
                              setRequestType("");
                            }}
                            data-testid="button-cancel"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createRequest.isPending}
                            data-testid="button-submit-request"
                          >
                            {createRequest.isPending ? "Submitting..." : "Submit Request"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* Edit Request Modal */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Request</DialogTitle>
                  </DialogHeader>
                  
                  {editingRequest && (
                    <form onSubmit={handleEditRequest}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          {getTypeIcon(editingRequest.type)}
                          <h3 className="text-lg font-medium">{formatRequestType(editingRequest.type)}</h3>
                        </div>
                        
                        {renderEditRequestForm()}
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            data-testid="button-cancel-edit"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={updateRequest.isPending}
                            data-testid="button-update-request"
                          >
                            {updateRequest.isPending ? "Updating..." : "Update Request"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>
                  Track the status of your submitted requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading requests...</p>
                  </div>
                ) : userRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No requests found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first request to get started
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userRequests.map((request: UserWorkflow) => (
                        <TableRow key={request.id} data-testid={`request-row-${request.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(request.type)}
                              <span className="font-medium">
                                {formatRequestType(request.type)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.state)}>
                              {request.state?.replace("_", " ") || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {request.type === "leave_request" && request.dataJson && 
                                `${request.dataJson.startDate} to ${request.dataJson.endDate}`}
                              {request.type === "expense_reimbursement" && request.dataJson && 
                                `$${request.dataJson.amount}`}
                              {request.type === "access_request" && request.dataJson && 
                                request.dataJson.resource}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.state === "pending" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`request-actions-${request.id}`}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(request)} data-testid={`edit-request-${request.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} data-testid={`delete-request-${request.id}`}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this request? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteRequest(request.id)}
                                          data-testid={`confirm-delete-request-${request.id}`}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}