import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { emailCheckSchema, type EmailCheckInput } from "@shared/schema";
import { Bot, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ResendVerification() {
  const { toast } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<EmailCheckInput>({
    resolver: zodResolver(emailCheckSchema),
    defaultValues: {
      email: "",
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (data: EmailCheckInput) => {
      const response = await apiRequest("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setEmailSent(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailCheckInput) => {
    resendMutation.mutate(data);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Verification Email Sent!</CardTitle>
              <CardDescription>
                We've sent a new verification link to {form.getValues("email")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-2 space-y-1 text-left">
                  <li>1. Check your email inbox</li>
                  <li>2. Look for an email from FlowMindAI</li>
                  <li>3. Click the verification link</li>
                  <li>4. Sign in to your account</li>
                </ol>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Didn't receive the email? Check your spam folder.</p>
                <p>The verification link will expire in 24 hours.</p>
              </div>

              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">Start Over</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resend Verification Email</h1>
          <p className="text-gray-600">
            Enter your email address to receive a new verification link
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Resend Verification</CardTitle>
            <CardDescription>
              We'll send a new verification link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@company.com"
                          className="h-12 text-lg"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={resendMutation.isPending}
                  data-testid="button-resend"
                >
                  {resendMutation.isPending ? "Sending..." : "Send Verification Email"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}