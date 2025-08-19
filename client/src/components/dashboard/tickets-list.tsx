import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Ticket } from "lucide-react";
import type { Ticket as TicketType } from "../../../../shared/schema";

export function TicketsList() {
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { data: tickets = [], isLoading } = useQuery<TicketType[]>({
    queryKey: ['/api/tickets', departmentFilter === 'all' ? '' : departmentFilter],
    refetchInterval: 30000,
  });

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

  const calculateSLA = (createdAt: string, slaDueAt?: string) => {
    if (!slaDueAt) return { percentage: 0, timeLeft: 'No SLA' };
    
    const created = new Date(createdAt).getTime();
    const due = new Date(slaDueAt).getTime();
    const now = Date.now();
    
    const totalTime = due - created;
    const elapsed = now - created;
    const percentage = Math.max(0, Math.min(100, ((totalTime - elapsed) / totalTime) * 100));
    
    const hoursLeft = Math.max(0, (due - now) / (1000 * 60 * 60));
    const timeLeft = hoursLeft > 24 
      ? `${Math.round(hoursLeft / 24)}d left`
      : hoursLeft > 1 
        ? `${Math.round(hoursLeft)}h left`
        : percentage > 0 
          ? '<1h left' 
          : 'Overdue';
    
    return { percentage, timeLeft };
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200" data-testid="tickets-list-card">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Tickets</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40" data-testid="select-tickets-department-filter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" className="text-primary-600 hover:text-primary-700" data-testid="button-view-all-tickets">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border-b border-slate-100">
                  <div className="w-12 h-12 bg-slate-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-6 text-center" data-testid="no-tickets">
            <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
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
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.slice(0, 5).map((ticket) => {
                  const sla = calculateSLA(ticket.createdAt, ticket.slaDueAt);
                  
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50" data-testid={`ticket-row-${ticket.id}`}>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-slate-900" data-testid={`ticket-subject-${ticket.id}`}>
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-slate-500" data-testid={`ticket-id-${ticket.id}`}>
                            #{ticket.id.slice(0, 8)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant="outline" 
                          className={
                            ticket.department === 'IT' ? 'bg-orange-100 text-orange-800' :
                            ticket.department === 'HR' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }
                          data-testid={`ticket-department-${ticket.id}`}
                        >
                          {ticket.department || 'General'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={getStatusColor(ticket.status)} data-testid={`ticket-status-${ticket.id}`}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={getPriorityColor(ticket.priority)} data-testid={`ticket-priority-${ticket.id}`}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                sla.percentage > 50 ? 'bg-green-500' :
                                sla.percentage > 25 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${sla.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500" data-testid={`ticket-sla-${ticket.id}`}>
                            {sla.timeLeft}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
