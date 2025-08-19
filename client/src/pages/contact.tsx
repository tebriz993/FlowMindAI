import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  MessageSquare,
  Building,
  Globe,
  Send
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    // In a real implementation, this would send the data to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              <Link href="/about" className="text-blue-200 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-blue-300 hover:text-white transition-colors font-medium">
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
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Contact Our Team
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Ready to transform your workplace with FlowMindAI? Get in touch with our team for a personalized 
              consultation, technical support, or to schedule a live demo.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-blue-200">
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-blue-200 text-sm font-medium mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-blue-200 text-sm font-medium mb-2 block">
                        Work Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-2 block">
                      Company Name
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter your company"
                      className="bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your needs, questions, or how we can help..."
                      className="bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300/50 min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3"
                  >
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Info */}
              <Card className="bg-slate-800/50 border-blue-700/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-400" />
                    Headquarters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Crocusoft</p>
                      <p className="text-blue-200">Baku, Azerbaijan</p>
                      <p className="text-blue-200">Enterprise Technology Hub</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white">tabrizl@crocusoft.com</p>
                      <p className="text-blue-200 text-sm">Primary business contact</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white">www.crocusoft.com</p>
                      <p className="text-blue-200 text-sm">Corporate website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="bg-slate-800/50 border-blue-700/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-400" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM (GMT+4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Saturday</span>
                    <span className="text-white">10:00 AM - 2:00 PM (GMT+4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Sunday</span>
                    <span className="text-white">Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-blue-200 text-sm">
                      <strong className="text-white">Emergency Support:</strong> Available 24/7 for Enterprise customers
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-blue-700/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white justify-between">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white justify-between"
                    onClick={() => window.open('mailto:tabrizl@crocusoft.com?subject=FlowMindAI Demo Request', '_blank')}
                  >
                    Schedule Demo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-blue-200 hover:text-white hover:bg-blue-800/30 justify-between"
                    onClick={() => window.open('mailto:tabrizl@crocusoft.com?subject=FlowMindAI Technical Support', '_blank')}
                  >
                    Technical Support
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-blue-200 text-lg">
              Quick answers to common questions about FlowMindAI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">How quickly can we get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  FlowMindAI can be deployed in less than 24 hours. Our team provides full onboarding support, 
                  including data migration, user training, and custom configuration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">What languages are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  FlowMindAI supports 50+ languages including English, Turkish, Azerbaijani, Russian, Arabic, 
                  and all major European and Asian languages with native AI processing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  Yes. FlowMindAI uses enterprise-grade encryption, SOC 2 compliance, role-based access controls, 
                  and follows GDPR data protection standards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Do you offer custom integrations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  Absolutely. We provide custom API integrations with existing HR systems, ticketing platforms, 
                  document management systems, and enterprise software.
                </p>
              </CardContent>
            </Card>
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