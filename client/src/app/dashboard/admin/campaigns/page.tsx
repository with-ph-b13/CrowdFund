'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function AdminCampaignsPage() {
  const { token, user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCampaigns(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) fetchCampaigns();
  }, [token]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/campaigns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      toast.success(`Campaign ${status} successfully`);
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSeedDatabase = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/seed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Database seeded perfectly with amazing dummy data!');
        fetchCampaigns();
      } else {
        toast.error('Failed to seed database');
      }
    } catch (error) {
      toast.error('Failed to seed database');
    }
  };

  if (user?.role !== 'Admin') return <div className="p-8">Admin only.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Campaigns</h1>
        <Button onClick={handleSeedDatabase} className="bg-green-600 hover:bg-green-700">
          Seed Database (Auto-Fill)
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Title</th>
              <th className="px-6 py-3 font-medium text-gray-500">Creator</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns.map(c => (
              <tr key={c._id}>
                <td className="px-6 py-4">{c.title}</td>
                <td className="px-6 py-4">{c.creatorName}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{c.status}</span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button size="sm" onClick={() => handleStatus(c._id, 'approved')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" onClick={() => handleStatus(c._id, 'rejected')} className="bg-red-600 hover:bg-red-700">Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
