'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function CampaignClient({ id }: { id: string }) {
  const { user } = useAuth();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contribution, setContribution] = useState<number | ''>('');
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCampaign(data);
        }
      } catch (err) {
        console.error("Failed to load campaign", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to contribute.' });
      return;
    }
    if (user.role !== 'Supporter') {
      setMessage({ type: 'error', text: 'Only Supporters can make contributions.' });
      return;
    }
    if (Number(contribution) < (campaign.minimumContribution || 1)) {
      setMessage({ type: 'error', text: `Minimum contribution is ${campaign.minimumContribution} credits.` });
      return;
    }

    setMessage({ type: 'success', text: `Successfully pledged ${contribution} credits! (Pending admin/creator approval)` });
    setContribution('');
    // In reality, we'd make a POST /api/contributions here
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!campaign) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Campaign not found</div>;
  }

  const progress = Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="lg:w-2/3">
            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-96 object-cover rounded-lg" />
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">{campaign.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
            <p className="text-gray-600 mb-6 flex-grow">{campaign.story}</p>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">${campaign.amountRaised.toLocaleString()}</p>
              <p className="text-gray-500 mb-4">raised of ${campaign.fundingGoal.toLocaleString()} goal</p>
              <p className="text-sm text-gray-700"><strong>Creator:</strong> {campaign.creatorName}</p>
              <p className="text-sm text-gray-700"><strong>Deadline:</strong> {new Date(campaign.deadline).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Back this project</h3>
              {message && <div className={`mb-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
              <form onSubmit={handleContribute} className="flex flex-col gap-3">
                <Input 
                  type="number" 
                  placeholder={`Min ${campaign.minimumContribution} credits`}
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value) || '')}
                  required
                />
                <Button type="submit" disabled={!user}>Contribute Now</Button>
                {!user && <p className="text-xs text-red-500 text-center">You must be logged in to contribute</p>}
              </form>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{campaign.story}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Reviews & Comments</h2>
              <p className="text-gray-500 italic">No reviews yet for this campaign.</p>
            </section>
          </div>
          <div>
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Rewards</h2>
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">Pledge ${campaign.minimumContribution} or more</h4>
                <p className="text-sm text-gray-700 mb-4">{campaign.rewardInfo}</p>
                <Button className="w-full text-sm" onClick={() => setContribution(campaign.minimumContribution)}>Select Reward</Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
