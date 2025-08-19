import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth/auth-context";
import AuthPage from "@/pages/auth-page";

// Admin Panel Pages
import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import Tickets from "@/pages/tickets";
import Workflows from "@/pages/workflows";
import Users from "@/pages/users";
import Settings from "@/pages/settings";
import QA from "@/pages/qa";
import Reports from "@/pages/reports";

// Employee Portal Pages
import PortalChat from "@/pages/portal-chat";
import PortalTickets from "@/pages/portal-tickets";
import PortalRequests from "@/pages/portal-requests";
import HRPortal from "@/pages/hr-portal";
import NotFound from "@/pages/not-found";
import TestLogin from "@/pages/test-login";
import Register from "@/pages/register";
import RegisterEmail from "@/pages/register-email";
import RegisterComplete from "@/pages/register-complete";
import MarketingHome from "@/pages/marketing-home";
import WorkspaceSelection from "@/pages/workspace-selection";
import UserDashboard from "@/pages/user-dashboard";
import VerifyEmail from "@/pages/verify-email";
import AuthVerify from "@/pages/auth-verify";
import Login from "@/pages/login";
import UserProfile from "@/components/user-profile";
import Features from "@/pages/features";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Pricing from "@/pages/pricing";

function Router() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Transform your workplace with</h2>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">intelligent automation</h2>
          <p className="text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Show marketing site and auth pages if not authenticated
  if (!user) {
    return (
      <Switch>
        {/* Marketing Website */}
        <Route path="/" component={MarketingHome} />
        <Route path="/features" component={Features} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        
        {/* New Registration Flow */}
        <Route path="/register" component={Register} />
        <Route path="/register/email" component={RegisterEmail} />
        <Route path="/register/complete" component={RegisterComplete} />
        
        {/* Authentication */}
        <Route path="/login" component={Login} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/auth/verify" component={AuthVerify} />
        <Route path="/verify-email" component={VerifyEmail} />
        
        {/* Fallback */}
        <Route component={MarketingHome} />
      </Switch>
    );
  }

  // Authenticated user - check workspace membership and show appropriate interface
  return (
    <Switch>
      {/* Workspace Selection Hub */}
      <Route path="/select-workspace" component={WorkspaceSelection} />
      
      {(user as any).role === 'admin' && (
        <>
          {/* Admin Panel Routes - '/' still shows marketing */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Dashboard} />
          <Route path="/documents" component={Documents} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/workflows" component={Workflows} />
          <Route path="/users" component={Users} />
          <Route path="/qa" component={QA} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          {/* Admin can also access HR Portal */}
          <Route path="/hr-portal" component={HRPortal} />
        </>
      )}
      
      {/* Default routes for all authenticated users - everyone sees marketing site by default */}
      <Route path="/" component={MarketingHome} />
      
      {/* Marketing pages accessible by all authenticated users */}
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Common routes accessible by all roles */}
      <Route path="/profile" component={UserProfile} />
      <Route path="/portal-chat" component={PortalChat} />
      <Route path="/portal-tickets" component={PortalTickets} />
      <Route path="/portal-requests" component={PortalRequests} />
      <Route path="/test-login" component={TestLogin} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="flowmind-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
