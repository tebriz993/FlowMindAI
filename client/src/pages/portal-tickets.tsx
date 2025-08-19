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
import { Plus, Ticket, Clock, AlertCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  body: string;
  category: string;
}

export default function PortalTickets() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<UserTicket | null>(null);
  const { toast } = useToast();

  // Default to PortalSidebar for portal interface
  const SidebarComponent = PortalSidebar;

  const { data: userTickets = [], isLoading } = useQuery({
    queryKey: ["/api/tickets/me"],
  }) as { data: UserTicket[]; isLoading: boolean };

  const createTicket = useMutation({
    mutationFn: async (data: { 
      subject: string; 
      body: string; 
      priority: string; 
      category: string;
      createdBy: string;
    }) => {
      const response = await apiRequest( "/api/tickets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/me"] });
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Your ticket has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTicket = useMutation({
    mutationFn: async (data: { 
      id: string;
      subject: string; 
      body: string; 
      priority: string; 
      category: string;
    }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${data.id}`, {
        subject: data.subject,
        body: data.body,
        priority: data.priority,
        category: data.category
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/me"] });
      setIsEditModalOpen(false);
      setEditingTicket(null);
      toast({
        title: "Success",
        description: "Your ticket has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (ticketId: string) => {
      await apiRequest("DELETE", `/api/tickets/${ticketId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/me"] });
      toast({
        title: "Success",
        description: "Your ticket has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    createTicket.mutate({
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      priority: formData.get("priority") as string,
      category: formData.get("category") as string,
      createdBy: "demo-user", // In real app, get from auth
    });
  };

  const handleEditTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTicket) return;
    
    const formData = new FormData(event.currentTarget);
    
    updateTicket.mutate({
      id: editingTicket.id,
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      priority: formData.get("priority") as string,
      category: formData.get("category") as string,
    });
  };

  const handleDeleteTicket = (ticketId: string) => {
    deleteTicket.mutate(ticketId);
  };

  const openEditModal = (ticket: UserTicket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "in-progress": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <SidebarComponent />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader
          title="My Tickets"
          subtitle="View and manage your support requests"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-ticket">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief description of the issue"
                        required
                        data-testid="input-subject"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue="medium">
                          <SelectTrigger data-testid="select-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue="general">
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="it">IT Support</SelectItem>
                            <SelectItem value="facilities">Facilities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body">Description</Label>
                      <Textarea
                        id="body"
                        name="body"
                        placeholder="Detailed description of your issue"
                        rows={4}
                        required
                        data-testid="textarea-description"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createTicket.isPending}
                        data-testid="button-submit-ticket"
                      >
                        {createTicket.isPending ? "Creating..." : "Create Ticket"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              {/* Edit Ticket Modal */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Support Ticket</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-subject">Subject</Label>
                      <Input
                        id="edit-subject"
                        name="subject"
                        defaultValue={editingTicket?.subject}
                        placeholder="Brief description of the issue"
                        required
                        data-testid="input-edit-subject"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-priority">Priority</Label>
                        <Select name="priority" defaultValue={editingTicket?.priority}>
                          <SelectTrigger data-testid="select-edit-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={editingTicket?.category}>
                          <SelectTrigger data-testid="select-edit-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="it">IT Support</SelectItem>
                            <SelectItem value="facilities">Facilities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-body">Description</Label>
                      <Textarea
                        id="edit-body"
                        name="body"
                        defaultValue={editingTicket?.body}
                        placeholder="Detailed description of your issue"
                        rows={4}
                        required
                        data-testid="textarea-edit-description"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
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
                        disabled={updateTicket.isPending}
                        data-testid="button-update-ticket"
                      >
                        {updateTicket.isPending ? "Updating..." : "Update Ticket"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Tickets Table */}
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>
                  Track the status of your submitted tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading tickets...</p>
                  </div>
                ) : userTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No tickets found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first support ticket to get help
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTickets.map((ticket: UserTicket) => (
                        <TableRow key={ticket.id} data-testid={`ticket-row-${ticket.id}`}>
                          <TableCell className="font-medium">
                            {ticket.subject}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace("-", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {ticket.category}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(ticket.status === "open" || ticket.status === "in-progress") && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`ticket-actions-${ticket.id}`}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(ticket)} data-testid={`edit-ticket-${ticket.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} data-testid={`delete-ticket-${ticket.id}`}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this ticket? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteTicket(ticket.id)}
                                          data-testid={`confirm-delete-ticket-${ticket.id}`}
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