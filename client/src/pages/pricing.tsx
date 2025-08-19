import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Check, 
  Star,
  ArrowRight,
  Users,
  Building,
  Zap,
  Shield,
  Crown,
  Sparkles
} from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      description: "Perfect for small teams getting started with AI automation",
      features: [
        "Up to 25 users",
        "1,000 AI queries/month",
        "Basic ticket management",
        "Document upload (10GB)",
        "Email support",
        "Standard integrations",
        "Basic reporting"
      ],
      popular: false,
      cta: "Start Free Trial",
      color: "blue"
    },
    {
      name: "Professional",
      price: "$149",
      period: "per month",
      description: "Advanced features for growing organizations",
      features: [
        "Up to 100 users",
        "5,000 AI queries/month",
        "Advanced ticket routing",
        "AI-suggested replies",
        "Document upload (50GB)",
        "Priority support",
        "Advanced workflows",
        "Custom integrations",
        "Advanced analytics"
      ],
      popular: true,
      cta: "Start Free Trial",
      color: "purple"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Unlimited scale with enterprise-grade security",
      features: [
        "Unlimited users",
        "Unlimited AI queries",
        "Multi-tenant architecture",
        "Custom AI training",
        "Unlimited storage",
        "24/7 dedicated support",
        "Custom workflows",
        "SSO integration",
        "Advanced security",
        "On-premise option"
      ],
      popular: false,
      cta: "Contact Sales",
      color: "gold"
    }
  ];

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
              <Link href="/pricing" className="text-blue-300 hover:text-white transition-colors font-medium">
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
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your Plan
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
              Scale as You Grow
            </span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Start with our 14-day free trial. No credit card required. Upgrade or downgrade anytime.
            All plans include core AI automation features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative bg-slate-800/50 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    plan.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    {plan.color === 'blue' && <Users className="w-8 h-8 text-white" />}
                    {plan.color === 'purple' && <Building className="w-8 h-8 text-white" />}
                    {plan.color === 'gold' && <Crown className="w-8 h-8 text-white" />}
                  </div>
                  
                  <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-2">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-blue-200 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-blue-100">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6">
                    {plan.name === "Enterprise" ? (
                      <Link href="/contact">
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3">
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/register">
                        <Button className={`w-full py-3 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                        }`}>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Additional Services
            </h2>
            <p className="text-blue-200 text-lg">
              Enhance your FlowMindAI experience with premium add-ons
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader className="text-center">
                <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <CardTitle className="text-white">Custom AI Training</CardTitle>
                <div className="text-2xl font-bold text-blue-400">$500</div>
                <div className="text-blue-200 text-sm">one-time setup</div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Train AI on your specific company documents and processes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader className="text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <CardTitle className="text-white">Advanced Security</CardTitle>
                <div className="text-2xl font-bold text-green-400">$200</div>
                <div className="text-blue-200 text-sm">per month</div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Enhanced encryption, audit logs, and compliance features
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader className="text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-white">Dedicated Support</CardTitle>
                <div className="text-2xl font-bold text-purple-400">$300</div>
                <div className="text-blue-200 text-sm">per month</div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  24/7 priority support with dedicated account manager
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader className="text-center">
                <Building className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <CardTitle className="text-white">On-Premise</CardTitle>
                <div className="text-2xl font-bold text-orange-400">Custom</div>
                <div className="text-blue-200 text-sm">contact sales</div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Deploy FlowMindAI on your own infrastructure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pricing FAQ
            </h2>
            <p className="text-blue-200 text-lg">
              Common questions about FlowMindAI pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate the billing accordingly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white">What's included in the free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  The 14-day free trial includes full access to Professional features with up to 10 users 
                  and 500 AI queries to test the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white">Are there setup fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  No setup fees for Starter and Professional plans. Enterprise plans include 
                  complimentary onboarding and setup assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-700/30">
              <CardHeader>
                <CardTitle className="text-white">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">
                  We accept all major credit cards, bank transfers, and can provide invoicing 
                  for annual subscriptions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Start your free trial today. No credit card required.
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
                Contact Sales
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