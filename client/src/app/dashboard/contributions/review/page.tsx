'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function ReviewContributionsPage() {
  const { token, user } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContributions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/review`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setContributions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchContributions();
  }, [token]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/${id}/review`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchContributions();
    } catch (e) {
      console.error(e);
    }
  };

  if (user?.role !== 'Creator') return <div className="p-8">Not authorized.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Review Contributions</h1>
      <p className="mb-4 text-gray-600">Approve to add funds to your campaign. Reject to refund the supporter's credits.</p>
      
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Supporter</th>
                <th className="px-6 py-3 font-medium text-gray-500">Campaign</th>
                <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contributions.map(c => (
                <tr key={c._id}>
                  <td className="px-6 py-4 font-medium">{c.supporterName}</td>
                  <td className="px-6 py-4 text-blue-600">{c.campaignId?.title}</td>
                  <td className="px-6 py-4 font-bold">{c.amount} Credits</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="sm" onClick={() => handleReview(c._id, 'approved')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                    <Button size="sm" onClick={() => handleReview(c._id, 'rejected')} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                  </td>
                </tr>
              ))}
              {contributions.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pending contributions to review.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
