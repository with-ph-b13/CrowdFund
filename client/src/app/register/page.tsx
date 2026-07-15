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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Supporter' | 'Creator'>('Supporter');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input 
              label="Full Name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
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
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="Supporter">Supporter (Starts with 50 credits)</option>
                <option value="Creator">Creator (Starts with 20 credits)</option>
              </select>
            </div>

            <Input 
              label="Profile Picture URL (Optional)" 
              type="url" 
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
            />

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
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
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                  const res = await fetch(`${API_URL}/api/auth/google-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      token: credentialResponse.credential,
                      role: role 
                    })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    login(data.user, data.token);
                    router.push('/dashboard');
                  } else {
                    setError(data.message || 'Google signup failed');
                  }
                } catch (err: any) {
                  console.error(err);
                  setError('Google signup error: ' + (err.message || 'Unknown network error'));
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => setError('Google signup failed')}
            />
          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
