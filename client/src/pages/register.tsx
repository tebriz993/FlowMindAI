import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Register() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to new registration flow
    navigate('/register/email');
  }, [navigate]);
  
  return null; // Component will redirect immediately
}