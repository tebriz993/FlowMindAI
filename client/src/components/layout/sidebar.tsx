import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  MessageCircle, 
  FileText, 
  Ticket, 
  GitBranch, 
  Users, 
  Settings, 
  Bot,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { UserProfileDropdown } from "@/components/auth/user-profile-dropdown";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Q&A System", href: "/qa", icon: MessageCircle },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Users", href: "/users", icon: Users },
  { name: "HR Portal", href: "/hr-portal", icon: UserCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-slate-900 shadow-sm border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3" data-testid="logo-section">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Bot className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">FlowMindAI</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
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
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Portal Switch Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <Link href="/portal-chat">
          <Button 
            variant="outline" 
            className="w-full justify-start space-x-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            data-testid="button-switch-portal"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Employee Portal</span>
          </Button>
        </Link>
        <Link href="/hr-portal">
          <Button 
            variant="outline" 
            className="w-full justify-start space-x-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
            data-testid="button-switch-hr"
          >
            <UserCheck className="h-4 w-4" />
            <span>HR Portal</span>
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
