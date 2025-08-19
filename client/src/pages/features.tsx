import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Globe
} from "lucide-react";

export default function Features() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FlowMindAI</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/features" className="text-blue-300 hover:text-white transition-colors font-medium">
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
                    <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-blue-800/30">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
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
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Enterprise Features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful Features
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
              That Transform Business Operations
            </span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Discover FlowMindAI's comprehensive enterprise automation platform. AI-powered document processing, 
            intelligent ticket management, multilingual support, and advanced analytics to revolutionize your workplace efficiency.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Q&A */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">AI-Powered HR & IT Assistant</CardTitle>
                <CardDescription className="text-blue-200">
                  OpenAI GPT-4 powered intelligent workplace assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant answers to HR & IT questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Document-based knowledge search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Multilingual support (English, Turkish, Azerbaijani)</span>
                </div>
              </CardContent>
            </Card>

            {/* Smart Ticket Management */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Intelligent Ticket Management</CardTitle>
                <CardDescription className="text-blue-200">
                  AI-powered ticket routing with suggested replies
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Smart categorization (HR, IT, General)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>AI-suggested replies with multiple tones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Priority detection & SLA tracking</span>
                </div>
              </CardContent>
            </Card>

            {/* Document Intelligence */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Document Intelligence</CardTitle>
                <CardDescription className="text-blue-200">
                  AI-powered document processing & knowledge extraction
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>PDF, Word, Excel processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Vector-based semantic search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Automatic content summarization</span>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Automation */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Workflow Automation</CardTitle>
                <CardDescription className="text-blue-200">
                  Custom approval flows və process automation
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Custom approval chains</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Conditional logic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Email notifications</span>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Advanced Analytics</CardTitle>
                <CardDescription className="text-blue-200">
                  Comprehensive reporting və insights
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Real-time dashboards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Custom reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Export capabilities</span>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Security */}
            <Card className="bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-blue-200">
                  Bank-level security və compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="text-blue-100 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Role-based access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Data encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Audit logs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose FlowMindAI?
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Enterprise-grade AI automation platform built with cutting-edge technology stack
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">90% Time Savings</h3>
              <p className="text-blue-200">
                Reduce manual administrative tasks by 90% through intelligent automation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">95% Accuracy</h3>
              <p className="text-blue-200">
                High precision AI responses with context-aware understanding
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">24/7 Availability</h3>
              <p className="text-blue-200">
                Cloud-based platform accessible anywhere, anytime with 99.9% uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started with FlowMindAI?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Start your 14-day free trial and experience all enterprise features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200">
            © 2025 FlowMindAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}