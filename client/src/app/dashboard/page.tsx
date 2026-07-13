'use client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {user?.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 font-medium mb-2">Your Role</h3>
            <p className="text-2xl font-bold text-blue-600">{user?.role}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 font-medium mb-2">Available Credits</h3>
            <p className="text-2xl font-bold text-green-600">{user?.credits}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 font-medium mb-2">Status</h3>
            <p className="text-2xl font-bold text-gray-900">Active</p>
          </div>
        </div>

        {/* Dynamic Chart Area */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">Platform Activity (Past 6 Months)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', funds: 4000 },
                { name: 'Feb', funds: 3000 },
                { name: 'Mar', funds: 2000 },
                { name: 'Apr', funds: 2780 },
                { name: 'May', funds: 1890 },
                { name: 'Jun', funds: 2390 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="funds" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.role === 'Admin' && (
            <>
              <a href="/dashboard/admin/campaigns" className="bg-gray-800 text-white p-4 rounded text-center font-bold">Manage Campaigns</a>
              <a href="/dashboard/admin/withdrawals" className="bg-gray-800 text-white p-4 rounded text-center font-bold">Process Withdrawals</a>
              <a href="/dashboard/admin/users" className="bg-gray-800 text-white p-4 rounded text-center font-bold">Manage Users</a>
            </>
          )}
          {user?.role === 'Creator' && (
            <>
              <a href="/dashboard/campaigns/add" className="bg-blue-600 text-white p-4 rounded text-center font-bold">Launch Campaign</a>
              <a href="/dashboard/campaigns/manage" className="bg-blue-600 text-white p-4 rounded text-center font-bold">My Campaigns</a>
              <a href="/dashboard/contributions/review" className="bg-blue-600 text-white p-4 rounded text-center font-bold">Review Pledges</a>
              <a href="/dashboard/withdrawals" className="bg-blue-600 text-white p-4 rounded text-center font-bold">Withdrawals</a>
            </>
          )}
          {user?.role === 'Supporter' && (
            <>
              <a href="/dashboard/contributions/my" className="bg-green-600 text-white p-4 rounded text-center font-bold">My Pledges</a>
              <a href="/dashboard/credits/purchase" className="bg-green-600 text-white p-4 rounded text-center font-bold">Buy Credits</a>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
