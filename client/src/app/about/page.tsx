import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-screen-md mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About CrowdFund</h1>
          
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Welcome to <strong>CrowdFund</strong>, the world's most dynamic and creator-friendly platform for bringing innovative ideas to life. We believe that great ideas shouldn't be gated by traditional funding bottlenecks.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p>
              Our mission is simple: to democratize innovation. Whether you are an artisan crafting sustainable goods, an engineer building the next quantum leap in technology, or a filmmaker producing an indie masterpiece, CrowdFund is built for you.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
            <p>
              Creators pitch their revolutionary ideas to our global community. Supporters browse campaigns that inspire them and contribute funds to help creators reach their goals. In return, supporters gain early access to products, exclusive rewards, and the satisfaction of fueling the future.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Trust & Safety</h2>
            <p>
              We employ state-of-the-art security measures and strict vetting processes to ensure that all campaigns on our platform are authentic. Your contributions are secure, and creators are held accountable to deliver on their promises.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
