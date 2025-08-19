import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Verification token not found in URL');
          return;
        }

        const response = await apiRequest(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        
        toast({
          title: "Email Verified!",
          description: "Your account has been activated. You can now sign in.",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Email verification failed');
        
        toast({
          title: "Verification Failed",
          description: error.message || "Unable to verify your email. Please try again.",
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
              {status === 'loading' && (
                <div className="bg-blue-100 w-full h-full rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-100 w-full h-full rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>
            
            <CardTitle>
              {status === 'loading' && "Verifying your email..."}
              {status === 'success' && "Email Verified!"}
              {status === 'error' && "Verification Failed"}
            </CardTitle>
            
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You will be redirected to the login page in a few seconds.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Sign In Now</Link>
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Having trouble? You can request a new verification email.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="outline">
                    <Link href="/resend-verification">Resend Verification Email</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/register">Back to Registration</Link>
                  </Button>
                </div>
              </div>
            )}
            
            {status === 'loading' && (
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}