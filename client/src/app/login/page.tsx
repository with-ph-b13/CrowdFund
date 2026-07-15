'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    // In a real app, you might have specific demo accounts
    setEmail(`demo${role.toLowerCase()}@example.com`);
    setPassword('password123');
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Welcome Back</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-300 w-full"></span>
            <span className="text-sm text-gray-500">or</span>
            <span className="h-px bg-gray-300 w-full"></span>
          </div>

          <div className="mt-4 flex justify-center w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: credentialResponse.credential })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    login(data.user, data.token);
                    router.push('/dashboard');
                  } else {
                    setError(data.message || 'Google login failed');
                  }
                } catch (err: any) {
                  console.error(err);
                  setError('Google login error: ' + (err.message || 'Unknown network error'));
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => setError('Google login failed')}
            />
          </div>

          <div className="mt-8 border-t pt-4">
            <p className="text-sm text-gray-500 mb-3 text-center">Demo Accounts</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleDemoLogin('Admin')} type="button">Admin</Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleDemoLogin('Creator')} type="button">Creator</Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleDemoLogin('Supporter')} type="button">Supporter</Button>
            </div>
          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
