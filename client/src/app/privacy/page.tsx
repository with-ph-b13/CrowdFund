import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-screen-md mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: July 2026</p>
          
          <div className="space-y-6 text-gray-700 text-base leading-relaxed">
            <p>
              At CrowdFund, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, profile picture, and Google authentication details when you sign up.</li>
              <li><strong>Financial Data:</strong> Payment processing information (securely handled via Stripe). We do not store your full credit card details.</li>
              <li><strong>Usage Data:</strong> Information about how you navigate and interact with our platform to improve user experience.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to facilitate transactions between creators and supporters, process withdrawals, send account notifications, and ensure compliance with our trust and safety guidelines.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Data Sharing</h2>
            <p>
              We do not sell your personal data to third parties. Information is only shared with creators (e.g., shipping details) when necessary to fulfill campaign rewards, or with trusted service providers (like Stripe for payments) under strict confidentiality agreements.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Your Rights</h2>
            <p>
              You have the right to access, update, or request the deletion of your personal data at any time. You can manage these settings directly from your Account Dashboard.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
