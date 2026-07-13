'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function AdminWithdrawalsPage() {
  const { token, user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setWithdrawals(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) fetchWithdrawals();
  }, [token]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/withdrawals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchWithdrawals();
    } catch (e) { console.error(e); }
  };

  if (user?.role !== 'Admin') return <div className="p-8">Admin only.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Process Withdrawal Requests</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Creator</th>
              <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
              <th className="px-6 py-3 font-medium text-gray-500">Credits Deducted</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {withdrawals.map(w => (
              <tr key={w._id}>
                <td className="px-6 py-4">{w.creatorId?.name} ({w.creatorId?.email})</td>
                <td className="px-6 py-4 font-bold text-green-600">${w.amountDollars}</td>
                <td className="px-6 py-4">{w.creditsDeducted}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{w.status}</span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button size="sm" onClick={() => handleStatus(w._id, 'approved')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" onClick={() => handleStatus(w._id, 'rejected')} className="bg-red-600 hover:bg-red-700">Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
