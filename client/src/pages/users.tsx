import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, User, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { User as UserType } from "../../../shared/schema";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EditUserModal } from "@/components/modals/edit-user-modal";

export default function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  const { data: users = [], isLoading } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('DELETE', `/api/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const response = await apiRequest('PATCH', `/api/users/${userId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Updated",
        description: "The user has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = (userId: string, data: any) => {
    updateUser.mutate({ userId, data });
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

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'it': return 'bg-orange-100 text-orange-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Users"
          subtitle="Manage user accounts, roles, and permissions."
          actionButton={
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-add-user">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8" data-testid="loading-users">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8" data-testid="text-no-users">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-slate-600">Start by adding your first user.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">User</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Role</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Department</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Created</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50" data-testid={`row-user-${user.id}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900" data-testid={`text-user-name-${user.id}`}>
                                  {user.name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-slate-500" data-testid={`text-user-email-${user.id}`}>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getRoleColor(user.role)} data-testid={`badge-user-role-${user.id}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600" data-testid={`text-user-department-${user.id}`}>
                              {getDepartmentName(user.deptId)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600" data-testid={`text-user-created-${user.id}`}>
                              {formatCreatedAt(user.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" data-testid={`button-user-actions-${user.id}`}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleEditUser(user)}
                                  data-testid={`menu-edit-user-${user.id}`}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => deleteUser.mutate(user.id)}
                                  disabled={deleteUser.isPending}
                                  data-testid={`menu-delete-user-${user.id}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        departments={departments as any[]}
        onSave={handleSaveUser}
      />
    </div>
  );
}
