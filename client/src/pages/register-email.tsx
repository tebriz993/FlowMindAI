import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { emailCheckSchema, type EmailCheckInput } from "@shared/schema";
import { Bot, ArrowLeft, Mail } from "lucide-react";

export default function RegisterEmail() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<EmailCheckInput>({
    resolver: zodResolver(emailCheckSchema),
    defaultValues: {
      email: "",
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: async (data: EmailCheckInput) => {
      const response = await apiRequest("/api/auth/check-email", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.exists) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate(`/login?email=${encodeURIComponent(form.getValues("email"))}`);
        }, 1500);
      } else {
        // Email is available, proceed to complete registration
        navigate(`/register/complete?email=${encodeURIComponent(form.getValues("email"))}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailCheckInput) => {
    checkEmailMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            Let's start with your email address
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>What's your email address?</CardTitle>
            <CardDescription>
              We'll check if you already have an account and guide you through the next steps.
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
                          placeholder="john@example.com"
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
                  disabled={checkEmailMutation.isPending}
                  data-testid="button-continue"
                >
                  {checkEmailMutation.isPending ? "Checking..." : "Continue"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                <p>We protect your data with enterprise-grade security.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}