'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function ManageCampaignsPage() {
  const { token, user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCampaigns(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCampaigns();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCampaigns();
    } catch (e) {
      console.error(e);
    }
  };

  if (user?.role !== 'Creator') return <div className="p-8">Not authorized.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Manage My Campaigns</h1>
      
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Raised / Goal</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map(c => (
                <tr key={c._id}>
                  <td className="px-6 py-4 font-medium">{c.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${c.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${c.amountRaised} / ${c.fundingGoal}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="sm" variant="outline">Update</Button>
                    <Button size="sm" onClick={() => handleDelete(c._id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No campaigns found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
