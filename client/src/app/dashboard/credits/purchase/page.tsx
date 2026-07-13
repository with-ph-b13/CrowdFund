'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function PurchaseCreditsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [amountDollars, setAmountDollars] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amountDollars })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // In a real Stripe app, data.url would be the Stripe Checkout Session URL.
      // Here, it's a mock success route we'll redirect to.
      window.location.href = data.url;
    } catch (e: any) {
      alert(e.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (user?.role !== 'Supporter') return <div className="p-8">Not authorized.</div>;

  return (
    <div className="p-4 md:p-8 mt-8 max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border text-center">
        <h1 className="text-2xl font-bold mb-2">Purchase Credits</h1>
        <p className="text-gray-600 mb-8">1 Dollar = 20 Credits</p>
        
        <form onSubmit={handleCheckout} className="space-y-6">
          <Input 
            label="Amount in USD ($)" 
            type="number" 
            value={amountDollars}
            onChange={(e) => setAmountDollars(Number(e.target.value) || '')}
            placeholder="e.g. 50"
            required 
          />
          
          <div className="bg-blue-50 p-4 rounded text-blue-900 border border-blue-100">
            You will receive: <strong>{Number(amountDollars) > 0 ? Number(amountDollars) * 20 : 0} Credits</strong>
          </div>

          <Button type="submit" className="w-full text-lg py-3" disabled={loading || !amountDollars}>
            {loading ? 'Processing...' : 'Checkout with Stripe'}
          </Button>
        </form>
      </div>
    </div>
  );
}
