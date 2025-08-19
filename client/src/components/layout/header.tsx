import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Plus } from "lucide-react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

interface HeaderProps {
  title: string;
  subtitle: string;
  onQuickTest?: () => void;
  actionButton?: React.ReactNode;
}

export function Header({ title, subtitle, onQuickTest, actionButton }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid={`title-${title.toLowerCase()}`}>
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400" data-testid="subtitle">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Performance Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm" data-testid="status-indicator">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System Healthy</span>
          </div>
          
          {/* Notifications */}
          <NotificationsDropdown userId="dev-admin" />
          
          {/* Theme Toggle */}
          <ModeToggle />
          
          {/* Action Button */}
          {onQuickTest && (
            <Button 
              onClick={onQuickTest}
              className="bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              data-testid="button-quick-test"
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Test Q&A
            </Button>
          )}
          
          {actionButton}
        </div>
      </div>
    </header>
  );
}
