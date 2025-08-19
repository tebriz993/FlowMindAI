import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AISuggestedReplies } from './ai-suggested-replies';
import type { Ticket } from '@shared/schema';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketDetailModal({ ticket, isOpen, onClose }: TicketDetailModalProps) {
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: async (reply: string) => {
      return apiRequest(`/api/tickets/${ticket?.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: reply }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Reply Sent',
        description: 'Your reply has been sent successfully.',
      });
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate(replyText);
  };

  const handleUseAIReply = (suggestion: string) => {
    setReplyText(suggestion);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {ticket.subject}
            </span>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {ticket.body || 'No description provided.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">SLA Due:</span>{' '}
                {ticket.slaDueAt 
                  ? formatDistanceToNow(new Date(ticket.slaDueAt), { addSuffix: true })
                  : 'Not set'
                }
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Suggested Replies */}
          <AISuggestedReplies 
            ticketId={ticket.id} 
            onUseReply={handleUseAIReply} 
          />

          <Separator />

          {/* Reply Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Send Reply</h4>
            <Textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              data-testid="reply-textarea"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={!replyText.trim() || replyMutation.isPending}
                data-testid="send-reply-button"
              >
                <Send className="h-4 w-4 mr-2" />
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}