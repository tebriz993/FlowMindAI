import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Ticket } from "../../../shared/schema";
import { formatDistanceToNow } from "date-fns";
import { AISuggestedReplies } from "@/components/ai-suggested-replies";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TicketRowProps {
  ticket: Ticket;
  getDepartmentName: (deptId: string | null) => string;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  formatCreatedAt: (createdAt: Date | string | null) => string;
}

function TicketRow({ ticket, getDepartmentName, getStatusColor, getPriorityColor, formatCreatedAt }: TicketRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reply, setReply] = useState('');

  const handleUseReply = (content: string) => {
    setReply(content);
  };

  return (
    <>
      <tr className="hover:bg-slate-50" data-testid={`row-ticket-${ticket.id}`}>
        <td className="py-4 px-6">
          <div>
            <p className="text-sm font-medium text-slate-900" data-testid={`text-ticket-subject-${ticket.id}`}>
              {ticket.subject}
            </p>
            <p className="text-xs text-slate-500" data-testid={`text-ticket-id-${ticket.id}`}>
              #{ticket.id.slice(0, 8)}
            </p>
          </div>
        </td>
        <td className="py-4 px-6">
          <Badge variant="outline" data-testid={`badge-ticket-department-${ticket.id}`}>
            {getDepartmentName(ticket.deptId)}
          </Badge>
        </td>
        <td className="py-4 px-6">
          <Badge className={getStatusColor(ticket.status)} data-testid={`badge-ticket-status-${ticket.id}`}>
            {ticket.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </Badge>
        </td>
        <td className="py-4 px-6">
          <Badge className={getPriorityColor(ticket.priority)} data-testid={`badge-ticket-priority-${ticket.id}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </Badge>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600" data-testid={`text-ticket-date-${ticket.id}`}>
              {formatCreatedAt(ticket.createdAt)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid={`button-expand-ticket-${ticket.id}`}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Reply
              {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-6 pb-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-4">
              {/* Ticket Details */}
              <div className="bg-white dark:bg-slate-700 rounded-md p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Ticket Details</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {ticket.body}
                </p>
              </div>

              {/* AI Suggested Replies */}
              <div className="bg-white dark:bg-slate-700 rounded-md p-4">
                <AISuggestedReplies
                  ticketId={ticket.id}
                  onUseReply={handleUseReply}
                />
              </div>

              {/* Reply Section */}
              <div className="bg-white dark:bg-slate-700 rounded-md p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Your Reply</h4>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply to this ticket..."
                  className="min-h-[120px] mb-3"
                  data-testid={`textarea-reply-${ticket.id}`}
                />
                <div className="flex justify-end">
                  <Button
                    disabled={!reply.trim()}
                    onClick={() => {
                      // Here you would typically send the reply to the backend
                      console.log('Sending reply:', reply);
                      // For demo purposes, just show a success message
                      alert(`Reply sent for ticket: ${ticket.subject}`);
                      setReply(''); // Clear the reply after sending
                    }}
                    data-testid={`button-send-reply-${ticket.id}`}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Tickets() {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: allTickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  // Filter tickets based on selected filters
  const tickets = allTickets.filter(ticket => {
    if (departmentFilter !== 'all' && ticket.deptId !== departmentFilter) return false;
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    return true;
  });

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return 'General';
    const dept = departments.find((d: any) => d.id === deptId);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Tickets"
          subtitle="Manage support tickets and track resolution status."
          actionButton={
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-create-ticket">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Tickets</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-40" data-testid="select-department-filter">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32" data-testid="select-status-filter">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32" data-testid="select-priority-filter">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8" data-testid="loading-tickets">Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8" data-testid="text-no-tickets">
                  <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                  <p className="text-slate-600">No support tickets match your current filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Ticket</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Department</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Priority</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Created / Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tickets.map((ticket) => (
                        <TicketRow
                          key={ticket.id}
                          ticket={ticket}
                          getDepartmentName={getDepartmentName}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                          formatCreatedAt={formatCreatedAt}
                        />
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
