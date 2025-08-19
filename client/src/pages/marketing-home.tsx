import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { UserNav } from "@/components/user-nav";
import { 
  Bot, 
  MessageSquare, 
  Workflow, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Globe
} from "lucide-react";

export default function MarketingHome() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FlowMindAI</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/features" className="text-blue-200 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-blue-200 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-blue-200 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-blue-200 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <UserNav />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-blue-800/30" data-testid="button-login">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" data-testid="button-signup">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
            🚀 Enterprise AI-Powered Automation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Workplace with
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">AI-Powered Automation</span>
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline HR operations, automate IT support, and boost productivity with FlowMindAI's 
            intelligent workplace automation platform designed for modern enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white px-8 py-4 text-lg" data-testid="button-watch-demo">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-blue-300 mt-4">
            ✅ 14-day free trial • ✅ No credit card required • ✅ Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything Your Team Needs to Work Smarter
            </h2>
            <p className="text-xl text-blue-200">
              Comprehensive automation platform built for enterprise workplaces
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:shadow-lg transition-shadow bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">AI Q&A Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200">
                  Instant answers to HR, IT, and company policies using advanced AI that learns from your documents.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-shadow bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <Workflow className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Smart Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200">
                  Automate leave requests, expense approvals, and IT support with intelligent routing and notifications.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-shadow bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Analytics & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200">
                  Real-time dashboards and reports to track productivity, response times, and team performance.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-shadow bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200">
                  SOC 2 compliant with role-based access, audit logs, and enterprise-grade data protection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Leading Companies Choose FlowMindAI
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">80% Faster Response Times</h3>
                    <p className="text-blue-200">AI-powered instant answers reduce ticket volume and improve employee satisfaction.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">50% Reduction in Manual Work</h3>
                    <p className="text-blue-200">Automated workflows eliminate repetitive tasks and streamline approvals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Enterprise-Ready</h3>
                    <p className="text-blue-200">Multi-tenant architecture with SSO, advanced permissions, and compliance features.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="p-6 text-center bg-slate-800/50 border-blue-700/30">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-sm text-blue-200">Active Users</div>
                </Card>
                <Card className="p-6 text-center bg-slate-800/50 border-blue-700/30">
                  <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-blue-200">Uptime SLA</div>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="p-6 text-center bg-slate-800/50 border-blue-700/30">
                  <Globe className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">25+</div>
                  <div className="text-sm text-blue-200">Countries</div>
                </Card>
                <Card className="p-6 text-center bg-slate-800/50 border-blue-700/30">
                  <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-blue-200">Satisfaction</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using FlowMindAI to automate their operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" data-testid="button-start-trial">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600" data-testid="button-contact-sales">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">FlowMindAI</span>
              </div>
              <p className="text-sm">
                AI-powered workplace automation platform for modern enterprises.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm">
            © 2025 FlowMindAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}