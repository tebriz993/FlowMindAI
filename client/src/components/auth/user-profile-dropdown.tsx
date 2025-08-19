import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from './auth-context';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { UserProfileModal } from './user-profile-modal';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const { data: department } = useQuery({
    queryKey: ['/api/departments', user?.deptId],
    enabled: !!user?.deptId,
  });

  if (!user) return null;

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
    const roleMap: { [key: string]: string } = {
      admin: 'System Admin',
      hr: 'HR Manager',
      it: 'IT Support',
      manager: 'Manager',
      employee: 'Employee',
    };
    return roleMap[role] || role;
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield className="h-3 w-3" />;
    return <User className="h-3 w-3" />;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-3 w-full p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
            data-testid="button-user-profile"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {getInitials(user.name || `${user.firstName || 'Admin'} ${user.lastName || 'User'}`)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user.name || `${user.firstName || 'Admin'} ${user.lastName || 'User'}`}
              </p>
              <div className="flex items-center space-x-1">
                {getRoleIcon(user.role)}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {getRoleDisplay(user.role)}
                </span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowProfile(true)}
            data-testid="menu-view-profile"
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="menu-settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={logout}
            className="text-red-600 focus:text-red-600"
            data-testid="menu-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileModal
        open={showProfile}
        onOpenChange={setShowProfile}
        user={user}
        department={department?.name || 'Not assigned'}
      />
    </>
  );
}