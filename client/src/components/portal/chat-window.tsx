import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, ExternalLink } from "lucide-react";
import { ProactiveActions } from "@/components/chat/proactive-actions";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    path: string;
    relevance: number;
  }>;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
            data-testid={`message-${message.type}-${message.id}`}
          >
            {message.type === "bot" && (
              <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-3xl ${message.type === "user" ? "order-first" : ""}`}>
              <Card className={`${
                message.type === "user" 
                  ? "bg-primary-500 text-white" 
                  : "bg-white dark:bg-slate-800"
              }`}>
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                            data-testid={`source-${index}`}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {source.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {message.type === "user" && (
              <div className="flex-shrink-0 w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </div>
            )}
          </div>
        ))}
        
        {/* AI Suggested Actions for last user message */}
        {messages.length > 0 && messages[messages.length - 1]?.type === 'user' && (
          <div className="flex justify-end">
            <div className="max-w-3xl w-full">
              <ProactiveActions 
                message={messages[messages.length - 1].content}
                onActionTaken={(action) => console.log('Action taken:', action)}
              />
            </div>
          </div>
        )}
        
        {/* Loading Message */}
        {isLoading && (
          <div className="flex gap-3 justify-start" data-testid="loading-message">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="max-w-3xl">
              <Card className="bg-white dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">FlowMindAI is typing...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about company policies, procedures, or anything work-related..."
            disabled={isLoading}
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          FlowMindAI can help with HR policies, IT support, and general workplace questions
        </p>
      </div>
    </div>
  );
}