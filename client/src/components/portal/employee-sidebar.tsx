import { useState } from "react";
import { useLocation } from "wouter";
import { MessageCircle, FileText, Users, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-context";

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "My Tickets", href: "/tickets", icon: FileText },
  { name: "My Requests", href: "/requests", icon: Users },
];

export function EmployeeSidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Portal</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">FlowMindAI</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.department || 'Employee'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
                  onClick={() => setLocation(item.href)}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'px-2' : ''}`}
          onClick={logout}
          data-testid="logout-button"
        >
          <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
}