import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { QAActivity } from "@/components/dashboard/qa-activity";
import { TicketsList } from "@/components/dashboard/tickets-list";
import { PendingWorkflows } from "@/components/dashboard/pending-workflows";
import { DocumentStats } from "@/components/dashboard/document-stats";
import { SystemHealth } from "@/components/dashboard/system-health";
import { QATestModal } from "@/components/modals/qa-test-modal";
import { useState } from "react";

export default function Dashboard() {
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with FlowMindAI today."
          onQuickTest={() => setIsQAModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <MetricsGrid />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <QAActivity />
              <TicketsList />
            </div>
            
            <div className="space-y-8">
              <PendingWorkflows />
              <DocumentStats />
              <SystemHealth />
            </div>
          </div>
        </main>
      </div>
      
      <QATestModal 
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
      />
    </div>
  );
}
