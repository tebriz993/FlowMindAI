import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AISuggestedReply {
  id: string;
  content: string;
  confidence: number;
  sources: string[];
}

interface AISuggestedRepliesProps {
  ticketId: string;
  onUseReply: (content: string) => void;
}

export function AISuggestedReplies({ ticketId, onUseReply }: AISuggestedRepliesProps) {
  const [suggestions, setSuggestions] = useState<AISuggestedReply[]>([]);
  const { toast } = useToast();

  const suggestRepliesMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest( `/api/tickets/${ticketId}/suggest-replies`, {});
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
      toast({
        title: "AI Suggestions Generated",
        description: `Generated ${data.suggestions?.length || 0} reply suggestions.`,
      });
    },
    onError: (error: any) => {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateSuggestions = () => {
    suggestRepliesMutation.mutate(ticketId);
  };

  const handleUseReply = (content: string) => {
    onUseReply(content);
    toast({
      title: "Reply Added",
      description: "AI suggestion has been added to your reply box.",
    });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Reply content copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="space-y-4" data-testid="ai-suggested-replies">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Suggested Replies
          </h3>
        </div>
        <Button
          onClick={handleGenerateSuggestions}
          disabled={suggestRepliesMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="button-generate-suggestions"
        >
          {suggestRepliesMutation.isPending ? 'Generating...' : 'Generate AI Suggestions'}
        </Button>
      </div>

      {suggestRepliesMutation.isPending && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
            <span className="text-gray-600 dark:text-gray-400">
              Analyzing ticket and generating personalized responses...
            </span>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here are {suggestions.length} AI-generated reply suggestions based on the ticket content and your knowledge base:
          </p>
          
          {suggestions.map((suggestion, index) => (
            <Card key={suggestion.id} className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Suggestion {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
                {suggestion.sources.length > 0 && (
                  <CardDescription className="text-xs">
                    Based on: {suggestion.sources.slice(0, 2).join(', ')}
                    {suggestion.sources.length > 2 && ` +${suggestion.sources.length - 2} more`}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {suggestion.content}
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {suggestion.confidence >= 0.8 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {suggestion.confidence >= 0.8 ? 'High confidence' : 'Review recommended'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.content)}
                      data-testid={`button-copy-reply-${index + 1}`}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUseReply(suggestion.content)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid={`button-use-reply-${index + 1}`}
                    >
                      Use This Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !suggestRepliesMutation.isPending && (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Click "Generate AI Suggestions" to get personalized reply options for this ticket.
          </p>
        </div>
      )}
    </div>
  );
}