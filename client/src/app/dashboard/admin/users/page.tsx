'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function AdminUsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
      });
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete user?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  if (user?.role !== 'Admin') return <div className="p-8">Admin only.</div>;

  return (
    <div className="p-4 md:p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Credits</th>
              <th className="px-6 py-3 font-medium text-gray-500">Role</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u._id}>
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.credits}</td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border rounded p-1 text-gray-900 bg-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Creator">Creator</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <Button size="sm" onClick={() => handleDelete(u._id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
