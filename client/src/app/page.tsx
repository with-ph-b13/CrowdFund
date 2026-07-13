'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CampaignCard from '@/components/common/CampaignCard';
import Link from 'next/link';

export default function Home() {
  const dummyTopCampaigns = [
    { id: '1', title: 'Solar Powered Water Pump', shortDescription: 'Help us bring clean water to villages.', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500', goal: 10000, raised: 8500, creatorName: 'EcoTech' },
    { id: '2', title: 'Community Art Center', shortDescription: 'A safe space for local artists to create.', imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500', goal: 5000, raised: 4200, creatorName: 'Sarah Jenkins' },
    { id: '3', title: 'NextGen Smart Backpack', shortDescription: 'A backpack with solar charging.', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', goal: 20000, raised: 18000, creatorName: 'Urban Gear' },
    { id: '4', title: 'Save The Ocean Docs', shortDescription: 'A documentary series on marine life.', imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500', goal: 15000, raised: 15000, creatorName: 'Blue Earth' },
    { id: '5', title: 'Local Animal Shelter', shortDescription: 'Building a new wing for stray dogs.', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500', goal: 8000, raised: 7100, creatorName: 'Paws Rescue' },
    { id: '6', title: 'Urban Farm Initiative', shortDescription: 'Bringing fresh produce to the city.', imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e902?w=500', goal: 12000, raised: 10500, creatorName: 'Green City' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Section 1: Hero Slider (60-70% height) */}
        <section className="h-[70vh] w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="w-full h-full"
          >
            <SwiperSlide>
              <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 text-center px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Empower Ideas That Matter</h1>
                  <p className="text-xl text-gray-200 mb-8">Join thousands of supporters funding the next big innovation or community project.</p>
                  <Link href="/explore" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">Explore Campaigns</Link>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 text-center px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Bring Your Dreams to Life</h1>
                  <p className="text-xl text-gray-200 mb-8">Start a campaign today and get the funding you need to change the world.</p>
                  <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">Start a Campaign</Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Section 2: Top Funded Campaigns */}
        <section className="py-16 px-4 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Funded Campaigns</h2>
              <p className="text-gray-600">The projects our community loves the most.</p>
            </div>
            <Link href="/explore" className="text-blue-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dummyTopCampaigns.slice(0, 4).map(campaign => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-2">Create a Campaign</h3>
                <p className="text-gray-600">Tell your story, set your goal, and upload engaging media to attract supporters.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-2">Share With the World</h3>
                <p className="text-gray-600">Spread the word through our platform and your social networks.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-2">Get Funded</h3>
                <p className="text-gray-600">Receive contributions securely and easily withdraw funds to make it happen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Explore By Category */}
        <section className="py-16 px-4 max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment', 'Film', 'Music'].map(cat => (
              <Link href={`/explore?category=${cat}`} key={cat} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md hover:border-blue-300 transition-all">
                <h3 className="font-bold text-gray-800">{cat}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Platform Impact Statistics */}
        <section className="bg-blue-600 text-white py-16 px-4">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">$5M+</p>
              <p className="text-blue-100">Total Raised</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">10,000+</p>
              <p className="text-blue-100">Campaigns Funded</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50,000+</p>
              <p className="text-blue-100">Supporters</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">120+</p>
              <p className="text-blue-100">Countries Reached</p>
            </div>
          </div>
        </section>

        {/* Section 6: Testimonials (Static Slider approach via grid for simplicity, or Swiper) */}
        <section className="py-16 px-4 bg-gray-50 max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">"Without this platform, my community garden project would have just been a dream. The support was overwhelming."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-bold text-sm">Jessica W.</p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">"I love backing innovative tech projects. The process is completely seamless and secure."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-bold text-sm">David M.</p>
                  <p className="text-xs text-gray-500">Supporter</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">"A fantastic way to validate a product before going into full manufacturing."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-bold text-sm">Elena R.</p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Newsletter CTA */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Never Miss a Great Project</h2>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter to get weekly updates on the highest trending campaigns.</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
