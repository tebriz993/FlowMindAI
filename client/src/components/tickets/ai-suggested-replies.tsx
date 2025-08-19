import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface AISuggestedReply {
  id: string;
  suggestion: string;
  tone: 'professional' | 'empathetic' | 'technical';
  confidence: number;
}

interface AISuggestedRepliesProps {
  ticketId: string;
  onUseReply: (reply: string) => void;
}

export function AISuggestedReplies({ ticketId, onUseReply }: AISuggestedRepliesProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/tickets', ticketId, 'ai-suggestions'],
    enabled: !!ticketId,
  });

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'empathetic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'technical':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'professional':
        return '🤝';
      case 'empathetic':
        return '❤️';
      case 'technical':
        return '⚙️';
      default:
        return '💬';
    }
  };

  const handleUseReply = (suggestion: AISuggestedReply) => {
    onUseReply(suggestion.suggestion);
    toast({
      title: 'Reply Added',
      description: 'AI suggestion has been added to your reply.',
    });
  };

  const handleRegenerateReplies = async () => {
    setIsGenerating(true);
    try {
      await refetch();
      toast({
        title: 'Replies Regenerated',
        description: 'New AI suggestions have been generated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to regenerate suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Suggested Replies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Generating intelligent replies..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Suggested Replies
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateReplies}
            disabled={isGenerating}
            data-testid="regenerate-replies"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No AI suggestions available. Try regenerating.
          </div>
        ) : (
          suggestions.map((suggestion: AISuggestedReply) => (
            <div
              key={suggestion.id}
              className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              data-testid={`ai-suggestion-${suggestion.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getToneIcon(suggestion.tone)}</span>
                  <Badge className={getToneColor(suggestion.tone)}>
                    {suggestion.tone}
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseReply(suggestion)}
                  data-testid={`use-reply-${suggestion.id}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Reply
                </Button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {suggestion.suggestion}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}