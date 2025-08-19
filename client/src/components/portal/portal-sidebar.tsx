import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  MessageCircle, 
  Ticket, 
  FileText, 
  Bot,
  Settings
} from "lucide-react";
import { UserProfileDropdown } from "@/components/auth/user-profile-dropdown";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Chat", href: "/portal-chat", icon: MessageCircle },
  { name: "My Tickets", href: "/portal-tickets", icon: Ticket },
  { name: "My Requests", href: "/portal-requests", icon: FileText },
];

export function PortalSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-slate-900 shadow-sm border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Logo Section with Notifications */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between" data-testid="portal-logo-section">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Bot className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">FlowMindAI</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Employee Portal</p>
            </div>
          </div>
          
          {/* Notifications Bell - Top Left */}
          <div className="ml-auto">
            <NotificationsDropdown userId="cf3f879a-35e1-475b-a595-f831e48889c6" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                    isActive 
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                  data-testid={`portal-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Panel Switch Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full justify-start space-x-2 mb-3 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400"
            data-testid="button-switch-admin"
          >
            <Settings className="h-4 w-4" />
            <span>Admin Panel</span>
          </Button>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <UserProfileDropdown />
      </div>
    </div>
  );
}