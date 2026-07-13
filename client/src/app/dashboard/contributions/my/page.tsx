'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function MyContributionsPage() {
  const { token, user } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContributions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContributions(data.contributions);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchContributions();
  }, [token]);

  if (user?.role !== 'Supporter') return <div className="p-8">Not authorized.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">My Contributions</h1>
      
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Campaign</th>
                <th className="px-6 py-3 font-medium text-gray-500">Amount (Credits)</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contributions.map(c => (
                <tr key={c._id}>
                  <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{c.campaignId?.title || 'Deleted Campaign'}</td>
                  <td className="px-6 py-4 font-bold">{c.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs 
                      ${c.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        c.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {contributions.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">You haven't made any contributions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
