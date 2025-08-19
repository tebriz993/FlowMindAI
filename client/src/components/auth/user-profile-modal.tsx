import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Building, Shield, Calendar } from 'lucide-react';
import type { User as UserType } from '@shared/schema';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
  department: string;
}

export function UserProfileModal({ open, onOpenChange, user, department }: UserProfileModalProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return 'AU'; // Admin User default
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: { label: string; color: string } } = {
      admin: { label: 'System Administrator', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      hr: { label: 'HR Manager', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      it: { label: 'IT Support', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      manager: { label: 'Manager', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      employee: { label: 'Employee', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    };
    return roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const roleInfo = getRoleDisplay(user.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Your account information and details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {getInitials(user.name || `${user.firstName || 'Admin'} ${user.lastName || 'User'}`)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {user.name || `${user.firstName || 'Admin'} ${user.lastName || 'User'}`}
              </h3>
              <Badge className={roleInfo.color}>
                <Shield className="h-3 w-3 mr-1" />
                {roleInfo.label}
              </Badge>
            </div>
          </div>

          {/* Profile Information Cards */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</p>
                    <p className="text-sm text-slate-900 dark:text-white" data-testid="text-user-email">
                      {user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</p>
                    <p className="text-sm text-slate-900 dark:text-white" data-testid="text-user-department">
                      {department}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</p>
                    <p className="text-sm text-slate-900 dark:text-white" data-testid="text-user-role">
                      {roleInfo.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Member Since</p>
                    <p className="text-sm text-slate-900 dark:text-white" data-testid="text-user-created">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Authentication Provider */}
          {user.authProvider && (
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticated via {user.authProvider}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}