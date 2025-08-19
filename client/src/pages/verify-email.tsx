import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Bot } from 'lucide-react';

export default function VerifyEmail() {
  const [location] = useLocation();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setError('No verification token provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        const data = await response.json();

        if (response.ok) {
          setVerified(true);
        } else {
          setError(data.message || data.error || 'Email verification failed');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="text-white h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Verifying Your Account</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Please wait while we verify your email address...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white h-8 w-8" />
            </div>
            <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Your account has been successfully activated! You can now log in to FlowMindAI.
            </p>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Welcome to FlowMindAI! Your account is now ready to use.
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full" data-testid="button-go-to-login">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-white h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-slate-600">
            The verification link may be invalid or expired. Please try registering again or request a new verification email.
          </p>
          <div className="space-y-2">
            <Link href="/register">
              <Button variant="outline" className="w-full" data-testid="button-register-again">
                Register Again
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="w-full" data-testid="button-back-to-login">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}