'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function WithdrawalsPage() {
  const { token, user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [amountDollars, setAmountDollars] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setWithdrawals(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWithdrawals();
  }, [token]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (Number(amountDollars) < 10) {
      return setMessage('Minimum withdrawal is $10 (200 credits).');
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amountDollars })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMessage('Withdrawal requested successfully!');
      setAmountDollars('');
      fetchWithdrawals();
      // Reload user to update credits on client side:
      // (in a real app we'd dispatch context update)
      window.location.reload(); 
    } catch (e: any) {
      setMessage(e.message || 'Withdrawal failed');
    }
  };

  if (user?.role !== 'Creator') return <div className="p-8">Not authorized.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="font-bold text-lg mb-4">Request Withdrawal</h2>
          <p className="text-sm text-gray-600 mb-4">
            Exchange rate: <strong>20 Credits = $1.00</strong><br/>
            Your balance: <strong>{user.credits} Credits (${(user.credits / 20).toFixed(2)})</strong>
          </p>
          
          {message && <div className="mb-4 p-2 bg-blue-50 text-blue-800 rounded">{message}</div>}

          <form onSubmit={handleRequest} className="space-y-4">
            <Input 
              label="Amount in Dollars ($)" 
              type="number" 
              value={amountDollars}
              onChange={(e) => setAmountDollars(Number(e.target.value) || '')}
              placeholder="Min $10"
              required 
            />
            <p className="text-xs text-gray-500">
              Credits to deduct: {Number(amountDollars) > 0 ? Number(amountDollars) * 20 : 0}
            </p>
            <Button type="submit" className="w-full">Request Withdrawal</Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="font-bold text-lg p-6 border-b bg-gray-50">Withdrawal History</h2>
          {loading ? <p className="p-6">Loading...</p> : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-2">Date</th>
                  <th className="px-6 py-2">Amount</th>
                  <th className="px-6 py-2">Credits</th>
                  <th className="px-6 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {withdrawals.map(w => (
                  <tr key={w._id}>
                    <td className="px-6 py-3">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-bold">${w.amountDollars}</td>
                    <td className="px-6 py-3">{w.creditsDeducted}</td>
                    <td className="px-6 py-3">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {withdrawals.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No past withdrawals.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
