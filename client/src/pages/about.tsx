import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Users, 
  Target, 
  Award,
  ArrowRight,
  Building,
  Globe,
  Lightbulb,
  Shield,
  Zap
} from "lucide-react";

export default function About() {
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
              <Link href="/features" className="text-blue-200 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-blue-200 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-blue-300 hover:text-white transition-colors font-medium">
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Building className="w-4 h-4 mr-2" />
              About FlowMindAI
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Transforming Enterprise
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                Operations with AI
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              FlowMindAI is a comprehensive workplace automation platform that streamlines HR and IT operations 
              through intelligent document processing, multilingual AI assistance, and adaptive workflow systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-blue-200 text-lg mb-6 leading-relaxed">
                We believe that every organization deserves access to intelligent automation that enhances human productivity. 
                FlowMindAI was built to eliminate repetitive administrative tasks, accelerate decision-making processes, 
                and create more engaging workplace experiences.
              </p>
              <p className="text-blue-200 text-lg leading-relaxed">
                Our platform combines cutting-edge AI technology with enterprise-grade security and scalability, 
                making advanced automation accessible to organizations of all sizes.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/30">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">90%</div>
                    <div className="text-blue-200">Time Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">50+</div>
                    <div className="text-blue-200">Languages Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-blue-200">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-blue-200">AI Assistance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built with Enterprise-Grade Technology
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              FlowMindAI leverages the latest in AI, cloud computing, and security technologies 
              to deliver a robust, scalable platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">AI & Machine Learning</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-200">
                <ul className="space-y-2">
                  <li>• OpenAI GPT-4 for natural language processing</li>
                  <li>• Vector embeddings for semantic search</li>
                  <li>• Custom ML models for classification</li>
                  <li>• Continuous learning algorithms</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Cloud Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-200">
                <ul className="space-y-2">
                  <li>• React.js with TypeScript frontend</li>
                  <li>• Node.js/Express.js backend architecture</li>
                  <li>• PostgreSQL with Drizzle ORM</li>
                  <li>• Serverless deployment on Replit</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-200">
                <ul className="space-y-2">
                  <li>• End-to-end encryption</li>
                  <li>• Role-based access control</li>
                  <li>• SOC 2 Type II compliance</li>
                  <li>• GDPR data protection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              These principles guide everything we do at FlowMindAI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-blue-200">
                Continuously pushing the boundaries of what's possible with AI and automation technology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Human-Centric</h3>
              <p className="text-blue-200">
                Designing technology that enhances human capabilities rather than replacing them.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
              <p className="text-blue-200">
                Protecting your data and privacy with enterprise-grade security measures.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Efficiency</h3>
              <p className="text-blue-200">
                Streamlining operations to maximize productivity and minimize manual work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              FlowMindAI by the Numbers
            </h2>
            <p className="text-blue-200 text-lg">
              Real impact across organizations worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-blue-200">Organizations Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10M+</div>
              <div className="text-blue-200">Tickets Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500K+</div>
              <div className="text-blue-200">Documents Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2M+</div>
              <div className="text-blue-200">Questions Answered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-blue-200 text-lg">
              Industry experts dedicated to transforming workplace automation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">Tabriz Latifov</CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  Founder & CEO, Crocusoft
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
                  Visionary leader with 10+ years of experience in enterprise software development and AI implementation. 
                  Passionate about creating intelligent solutions that enhance human productivity and organizational efficiency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of organizations already using FlowMindAI to streamline their operations
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
                Schedule Demo
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