import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { 
  Bot, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  Settings,
  Home
} from "lucide-react";

const navigation = [
  { name: "Approvals", href: "/hr-portal", icon: CheckCircle },
  { name: "Employees", href: "/hr-employees", icon: Users },
  { name: "Q&A History", href: "/hr-qa", icon: MessageSquare },
];

export function HRSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-slate-900 shadow-sm border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Logo Section with Notifications */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between" data-testid="hr-logo-section">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Bot className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">FlowMindAI</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">HR Portal</p>
            </div>
          </div>
          
          {/* Notifications Bell */}
          <div className="ml-auto">
            <NotificationsDropdown userId="f84e9653-487d-4b40-bf18-7d5e74553e17" />
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
                  data-testid={`hr-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
            className="w-full flex items-center space-x-2"
            data-testid="switch-to-admin"
          >
            <Home className="h-4 w-4" />
            <span>Admin Panel</span>
          </Button>
        </Link>
      </div>

      {/* Portal Switch Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Link href="/portal">
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-2"
            data-testid="switch-to-portal"
          >
            <Users className="h-4 w-4" />
            <span>Employee Portal</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}