'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CampaignCard from '@/components/common/CampaignCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?search=${search}&category=${category}&sortBy=${sortBy}&page=${page}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, category, sortBy]); // refetch when filters/page change

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Explore Campaigns</h1>
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-grow flex gap-2">
            <Input 
              type="text" 
              placeholder="Search campaigns..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="flex-grow"
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Community">Community</option>
            <option value="Health">Health</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest First</option>
            <option value="highestFunded">Highest Funded</option>
            <option value="deadline">Ending Soon</option>
          </select>
        </div>

        {/* Campaign Grid (4 columns on desktop) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg h-[420px] flex flex-col">
                <div className="bg-gray-300 h-48 w-full rounded-t-lg"></div>
                <div className="p-5 flex flex-col gap-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No campaigns found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaigns.map(c => (
                <CampaignCard 
                  key={c._id} 
                  id={c._id} 
                  title={c.title} 
                  shortDescription={c.story} 
                  imageUrl={c.imageUrl} 
                  goal={c.fundingGoal} 
                  raised={c.amountRaised} 
                  creatorName={c.creatorName} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-gray-600 font-medium px-4">Page {page} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
