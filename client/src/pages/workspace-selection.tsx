import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-context";
import { Bot, Building, Users, Plus, Crown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceWithMembership {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  subscriptionPlan: string;
  memberCount: number;
  role: string;
  isOwner: boolean;
}

export default function WorkspaceSelection() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: workspaces, isLoading } = useQuery<WorkspaceWithMembership[]>({
    queryKey: ["/api/workspaces/user"],
    retry: 2,
  });

  const handleSelectWorkspace = (workspace: WorkspaceWithMembership) => {
    // Store selected workspace in session/context and navigate to appropriate portal
    localStorage.setItem("selectedWorkspaceId", workspace.id);
    
    // Navigate based on role
    if (workspace.role === 'admin' || workspace.isOwner) {
      navigate("/dashboard");
    } else if (workspace.role === 'hr') {
      navigate("/hr-portal");
    } else {
      navigate("/portal");
    }
  };

  const getRoleDisplay = (role: string, isOwner: boolean) => {
    if (isOwner) return "Owner";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Select a workspace to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Your Workspaces</span>
            </CardTitle>
            <CardDescription>
              Choose which company workspace you want to access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workspaces?.length === 0 ? (
              /* No Workspaces */
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No workspaces yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You're not a member of any workspace yet. Create your first company workspace to get started.
                </p>
                <Button className="w-full sm:w-auto" data-testid="button-create-workspace">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Company Workspace
                </Button>
              </div>
            ) : (
              /* Workspace List */
              <div className="space-y-3">
                {workspaces?.map((workspace) => (
                  <Card 
                    key={workspace.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                    onClick={() => handleSelectWorkspace(workspace)}
                    data-testid={`workspace-${workspace.slug}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {workspace.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {workspace.name}
                              </h3>
                              {workspace.isOwner && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{workspace.memberCount} members</span>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={getPlanColor(workspace.subscriptionPlan)}
                              >
                                {workspace.subscriptionPlan.charAt(0).toUpperCase() + workspace.subscriptionPlan.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {getRoleDisplay(workspace.role, workspace.isOwner)}
                              </Badge>
                            </div>
                            {workspace.description && (
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                {workspace.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {workspaces && workspaces.length > 0 && (
              <>
                <Separator />
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full sm:w-auto" data-testid="button-create-new-workspace">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Workspace
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </Link>
          </p>
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => {
              // Logout logic
              localStorage.removeItem("selectedWorkspaceId");
              window.location.href = "/api/auth/logout";
            }} data-testid="button-logout">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}