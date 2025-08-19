import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Bot, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AuthVerify() {
  const [, navigate] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    // Verify the token
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const data = await response.json();
        
        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message || 'Your account has been verified successfully!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setMessage(data.message || 'Verification failed. The token may be expired or invalid.');
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FlowMindAI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verification</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
              {verificationStatus === 'loading' && (
                <div className="bg-blue-100">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {verificationStatus === 'success' && (
                <div className="bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              )}
              {verificationStatus === 'error' && (
                <div className="bg-red-100">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle>
              {verificationStatus === 'loading' && 'Verifying your account...'}
              {verificationStatus === 'success' && 'Verification Successful!'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Redirecting to login page in a few seconds...
                </p>
                <Link href="/login">
                  <Button className="w-full" data-testid="button-login-now">
                    Login Now
                  </Button>
                </Link>
              </div>
            )}
            
            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <Link href="/register">
                  <Button className="w-full" data-testid="button-register-again">
                    Create New Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full" data-testid="button-back-login">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}