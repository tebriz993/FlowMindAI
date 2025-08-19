import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Key, Bell, Shield } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const [openaiKey, setOpenaiKey] = useState("");
  const { toast } = useToast();

  // Get current settings
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  // Save API key mutation
  const saveKeyMutation = useMutation({
    mutationFn: async (data: { openaiKey: string }) => {
      return await apiRequest('/api/settings', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "OpenAI API key has been saved successfully.",
      });
      setOpenaiKey(""); // Clear form
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    }
  });

  const handleSaveApiKey = () => {
    if (!openaiKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your OpenAI API key.",
        variant: "destructive",
      });
      return;
    }
    
    if (!openaiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'.",
        variant: "destructive",
      });
      return;
    }

    saveKeyMutation.mutate({ openaiKey });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Settings"
          subtitle="Configure FlowMindAI system settings and integrations."
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl space-y-8">
            
            {/* API Keys */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>API Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input 
                    id="openai-key" 
                    type="password" 
                    placeholder="sk-..." 
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    data-testid="input-openai-key"
                  />
                  <p className="text-sm text-slate-600">
                    Required for AI-powered Q&A responses and document processing.
                  </p>
                  {settings?.openaiKeyConfigured && (
                    <p className="text-sm text-green-600">
                      ✓ OpenAI API key is configured and working
                    </p>
                  )}
                </div>
                

                
                <Button 
                  onClick={handleSaveApiKey}
                  disabled={saveKeyMutation.isPending}
                  className="bg-primary-500 hover:bg-primary-600" 
                  data-testid="button-save-api-keys"
                >
                  {saveKeyMutation.isPending ? 'Saving...' : 'Save API Key'}
                </Button>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <CardTitle>System Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="response-time-target">Response Time Target (seconds)</Label>
                  <Input 
                    id="response-time-target" 
                    type="number" 
                    defaultValue="2.5" 
                    step="0.1"
                    data-testid="input-response-time"
                  />
                  <p className="text-sm text-slate-600">
                    Target response time for AI Q&A queries.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accuracy-threshold">Auto-routing Accuracy Threshold (%)</Label>
                  <Input 
                    id="accuracy-threshold" 
                    type="number" 
                    defaultValue="80" 
                    data-testid="input-accuracy-threshold"
                  />
                  <p className="text-sm text-slate-600">
                    Minimum confidence level for automatic ticket routing.
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Ticket Assignment</Label>
                    <p className="text-sm text-slate-600">
                      Automatically assign tickets to departments based on AI classification.
                    </p>
                  </div>
                  <Switch data-testid="switch-auto-assignment" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Learning Mode</Label>
                    <p className="text-sm text-slate-600">
                      Allow the AI to learn from user feedback and improve responses.
                    </p>
                  </div>
                  <Switch data-testid="switch-learning-mode" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-600">
                      Send email notifications for critical events.
                    </p>
                  </div>
                  <Switch data-testid="switch-email-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Slack Alerts</Label>
                    <p className="text-sm text-slate-600">
                      Send Slack alerts for SLA breaches and system issues.
                    </p>
                  </div>
                  <Switch data-testid="switch-slack-alerts" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alert-email">Alert Email Address</Label>
                  <Input 
                    id="alert-email" 
                    type="email" 
                    placeholder="admin@company.com" 
                    data-testid="input-alert-email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Security & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>PII Masking</Label>
                    <p className="text-sm text-slate-600">
                      Automatically mask personally identifiable information in logs.
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-pii-masking" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-slate-600">
                      Log all user actions for security auditing.
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-audit-logging" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    defaultValue="30" 
                    data-testid="input-session-timeout"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-save-settings">
                Save All Settings
              </Button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
