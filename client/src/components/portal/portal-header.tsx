import { ModeToggle } from "@/components/mode-toggle";

interface PortalHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: React.ReactNode;
}

export function PortalHeader({ title, subtitle, actionButton }: PortalHeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid={`portal-title-${title.toLowerCase()}`}>
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400" data-testid="portal-subtitle">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Performance Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm" data-testid="portal-status-indicator">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
          
          {/* Theme Toggle */}
          <ModeToggle />
          
          {/* Action Button */}
          {actionButton}
        </div>
      </div>
    </header>
  );
}