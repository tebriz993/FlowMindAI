import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HRPortal() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: hrMetrics } = useQuery({
    queryKey: ['/api/hr/metrics'],
    select: () => ({
      totalEmployees: 156,
      pendingApprovals: 8,
      openTickets: 12,
      avgResponseTime: "2.3 hours"
    })
  });

  const { data: pendingWorkflows = [] } = useQuery({
    queryKey: ['/api/workflows/pending']
  });

  const { data: hrTickets = [] } = useQuery({
    queryKey: ['/api/tickets', 'hr']
  });

  const { data: recentQueries = [] } = useQuery({
    queryKey: ['/api/qa/recent', 'hr']
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="HR Portal"
          subtitle="Manage employee requests, approvals, and HR operations"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="tickets">HR Tickets</TabsTrigger>
              <TabsTrigger value="qa-history">Q&A History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                        <p className="text-2xl font-bold">{hrMetrics?.totalEmployees || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                        <p className="text-2xl font-bold">{hrMetrics?.pendingApprovals || 0}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Open HR Tickets</p>
                        <p className="text-2xl font-bold">{hrMetrics?.openTickets || 0}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                        <p className="text-2xl font-bold">{hrMetrics?.avgResponseTime || "N/A"}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingWorkflows.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No pending approvals</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingWorkflows.slice(0, 5).map((workflow: any) => (
                          <div key={workflow.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">{workflow.type?.replace('_', ' ')}</p>
                              <p className="text-sm text-muted-foreground">
                                by {workflow.requestorName} • {formatDistanceToNow(new Date(workflow.createdAt))} ago
                              </p>
                            </div>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent HR Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hrTickets.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No recent HR tickets</p>
                    ) : (
                      <div className="space-y-3">
                        {hrTickets.slice(0, 5).map((ticket: any) => (
                          <div key={ticket.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(ticket.createdAt))} ago
                              </p>
                            </div>
                            <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'}>
                              {ticket.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Employee Directory</h3>
                    <p className="text-muted-foreground mb-4">
                      View and manage employee information, roles, and departments.
                    </p>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      View All Employees
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingWorkflows.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">No pending approvals at this time.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingWorkflows.map((workflow: any) => (
                        <div key={workflow.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{workflow.type?.replace('_', ' ')}</h4>
                              <p className="text-sm text-muted-foreground">
                                Requested by {workflow.requestorName}
                              </p>
                            </div>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm mb-4">{workflow.details}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>HR Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {hrTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No HR Tickets</h3>
                      <p className="text-muted-foreground">All HR tickets have been resolved.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hrTickets.map((ticket: any) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <div className="flex gap-2">
                              <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                                {ticket.priority}
                              </Badge>
                              <Badge variant="outline">{ticket.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{ticket.body}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Created {formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qa-history">
              <Card>
                <CardHeader>
                  <CardTitle>Q&A History</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentQueries.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Recent Queries</h3>
                      <p className="text-muted-foreground">HR-related questions will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentQueries.map((query: any) => (
                        <div key={query.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium mb-1">{query.question}</p>
                              <p className="text-sm text-muted-foreground">{query.answer}</p>
                            </div>
                            <Badge variant="outline">
                              {Math.round(query.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Asked {formatDistanceToNow(new Date(query.createdAt))} ago
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}