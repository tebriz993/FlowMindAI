import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {Icon && (
        <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">
          <Icon className="h-full w-full" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      {description && (
        <p className="mb-6 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          variant={action.variant || 'default'}
          data-testid="empty-state-action"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}