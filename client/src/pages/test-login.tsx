import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLogin() {
  const [currentRole, setCurrentRole] = useState('admin');

  const switchToRole = async (role: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('flowmind-user', JSON.stringify(userData));
        setCurrentRole(role);
        window.location.href = role === 'hr' ? '/hr-portal' : '/'; // Direct navigation
      } else {
        console.error('Login failed');
        alert('Login failed. Check credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>FlowMindAI - Test Login</CardTitle>
          <p className="text-sm text-slate-600">Switch between user roles for testing</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => switchToRole('admin', 'admin@flowmind.ai', 'admin123')}
            className="w-full"
            variant="outline"
          >
            Login as Admin
          </Button>
          
          <Button 
            onClick={() => switchToRole('hr', 'hr@flowmind.ai', 'hr123')}
            className="w-full"
            variant="outline"
          >
            Login as HR Manager
          </Button>
          
          <Button 
            onClick={() => switchToRole('employee', 'employee@test.com', 'test123')}
            className="w-full"
            variant="outline"
          >
            Login as Employee
          </Button>
          
          <p className="text-xs text-slate-500 text-center mt-4">
            Current role: {currentRole}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}