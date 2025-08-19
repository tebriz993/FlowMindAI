import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  FileText,
  Clock,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProactiveAction {
  id: string;
  type: 'workflow' | 'ticket' | 'document';
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
}

interface ProactiveActionsProps {
  message: string;
  onActionTaken: (action: string) => void;
}

export function ProactiveActions({ message, onActionTaken }: ProactiveActionsProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // AI intent recognition - detects user needs and suggests actions
  const detectIntents = (message: string): ProactiveAction[] => {
    const lowerMessage = message.toLowerCase();
    const actions: ProactiveAction[] = [];

    // Leave request intent
    if (lowerMessage.includes('leave') || lowerMessage.includes('vacation') || 
        lowerMessage.includes('time off') || lowerMessage.includes('pto') ||
        lowerMessage.includes('holiday') || lowerMessage.includes('sick day')) {
      actions.push({
        id: 'create-leave-request',
        type: 'workflow',
        title: 'Create Leave Request',
        description: 'Start a leave request workflow based on your inquiry',
        icon: <Calendar className="h-4 w-4" />,
        action: () => handleCreateWorkflow('leave_request'),
        priority: 'high'
      });
    }

    // IT support intent
    if (lowerMessage.includes('password') || lowerMessage.includes('computer') ||
        lowerMessage.includes('laptop') || lowerMessage.includes('software') ||
        lowerMessage.includes('internet') || lowerMessage.includes('email') ||
        lowerMessage.includes('access') || lowerMessage.includes('login') ||
        lowerMessage.includes('technical') || lowerMessage.includes('it issue')) {
      actions.push({
        id: 'create-it-ticket',
        type: 'ticket',
        title: 'Report IT Issue',
        description: 'Create a support ticket for your technical problem',
        icon: <Settings className="h-4 w-4" />,
        action: () => handleCreateTicket('it'),
        priority: 'high'
      });
    }

    // Expense/reimbursement intent
    if (lowerMessage.includes('expense') || lowerMessage.includes('reimburse') ||
        lowerMessage.includes('receipt') || lowerMessage.includes('travel') ||
        lowerMessage.includes('meal') || lowerMessage.includes('business') ||
        lowerMessage.includes('cost') || lowerMessage.includes('money')) {
      actions.push({
        id: 'create-expense-request',
        type: 'workflow',
        title: 'Submit Expense Report',
        description: 'Create an expense reimbursement request',
        icon: <DollarSign className="h-4 w-4" />,
        action: () => handleCreateWorkflow('expense_reimbursement'),
        priority: 'high'
      });
    }

    // Document/policy intent
    if (lowerMessage.includes('policy') || lowerMessage.includes('handbook') ||
        lowerMessage.includes('document') || lowerMessage.includes('form') ||
        lowerMessage.includes('procedure') || lowerMessage.includes('guideline')) {
      actions.push({
        id: 'search-documents',
        type: 'document',
        title: 'Search Documents',
        description: 'Find relevant policies and documents',
        icon: <FileText className="h-4 w-4" />,
        action: () => handleSearchDocuments(),
        priority: 'medium'
      });
    }

    // General HR inquiry
    if (lowerMessage.includes('hr') || lowerMessage.includes('human resources') ||
        lowerMessage.includes('benefits') || lowerMessage.includes('payroll') ||
        lowerMessage.includes('schedule') || lowerMessage.includes('manager')) {
      actions.push({
        id: 'contact-hr',
        type: 'ticket',
        title: 'Contact HR',
        description: 'Create an HR inquiry ticket',
        icon: <MessageCircle className="h-4 w-4" />,
        action: () => handleCreateTicket('hr'),
        priority: 'medium'
      });
    }

    // Meeting/appointment intent
    if (lowerMessage.includes('meeting') || lowerMessage.includes('appointment') ||
        lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      actions.push({
        id: 'schedule-meeting',
        type: 'workflow',
        title: 'Schedule Meeting',
        description: 'Request a meeting or appointment',
        icon: <Clock className="h-4 w-4" />,
        action: () => handleCreateWorkflow('meeting_request'),
        priority: 'low'
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const handleCreateWorkflow = async (type: string) => {
    setIsProcessing(true);
    try {
      // Navigate to workflow creation with pre-filled type
      window.location.href = `/portal/requests/new?type=${type}&auto=true`;
      
      onActionTaken(`Created ${type.replace('_', ' ')} workflow`);
      toast({
        title: 'Workflow Started',
        description: `Opening ${type.replace('_', ' ')} request form...`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTicket = async (department: string) => {
    setIsProcessing(true);
    try {
      // Navigate to ticket creation with pre-selected department
      window.location.href = `/portal/support/new?dept=${department}&auto=true`;
      
      onActionTaken(`Created ${department.toUpperCase()} support ticket`);
      toast({
        title: 'Ticket Created',
        description: `Opening ${department.toUpperCase()} support form...`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchDocuments = () => {
    // Navigate to document search
    window.location.href = '/portal/documents';
    onActionTaken('Searched documents');
    toast({
      title: 'Documents',
      description: 'Opening document library...',
    });
  };

  const actions = detectIntents(message);

  if (actions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'low':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="p-4">
        <div className="mb-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <span className="text-blue-600">🤖</span>
            Suggested Actions
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Based on your message, I can help you with these actions:
          </p>
        </div>
        
        <div className="grid gap-2">
          {actions.slice(0, 3).map((action) => (
            <div
              key={action.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(action.priority)}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-blue-600">
                  {action.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={action.action}
                disabled={isProcessing}
                className="ml-2"
                data-testid={`action-${action.id}`}
              >
                {isProcessing ? 'Processing...' : 'Start'}
              </Button>
            </div>
          ))}
        </div>
        
        {actions.length > 3 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            +{actions.length - 3} more actions available
          </p>
        )}
      </CardContent>
    </Card>
  );
}