import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { EmployeeSidebar } from "@/components/portal/employee-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { PortalHeader } from "@/components/portal/portal-header";
import { ChatWindow } from "@/components/portal/chat-window";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/components/auth/auth-context";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
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

export default function PortalChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm FlowMindAI, your workplace assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const { user } = useAuth();

  // Use EmployeeSidebar for employee portal interface
  const SidebarComponent = user?.role === 'employee' ? EmployeeSidebar : PortalSidebar;

  const askQuestion = useMutation({
    mutationFn: async (data: { question: string; department: string; userId: string }) => {
      const response = await apiRequest("POST", "/api/qa/ask", data);
      return response.json();
    },
    onSuccess: (response, variables) => {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: variables.question,
        timestamp: new Date(),
      };

      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => [...prev, userMessage, botMessage]);
      
      // Invalidate Q&A cache
      queryClient.invalidateQueries({ queryKey: ["/api/qa/recent"] });
    },
  });

  const handleSendMessage = (question: string) => {
    if (!user) return;
    
    askQuestion.mutate({
      question,
      department: user.department || "general",
      userId: user.id,
    });
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <SidebarComponent />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader
          title="FlowMindAI Chat"
          subtitle="Ask questions about company policies, procedures, and more"
        />
        
        <main className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={askQuestion.isPending}
          />
        </main>
      </div>
    </div>
  );
}