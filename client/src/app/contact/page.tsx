import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-screen-md mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Have a question, feedback, or need support with a campaign? We're here to help. Reach out to our team using the form below.
          </p>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" placeholder="John" required />
              <Input label="Last Name" placeholder="Doe" required />
            </div>
            
            <Input label="Email Address" type="email" placeholder="john@example.com" required />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option>General Inquiry</option>
                <option>Campaign Support</option>
                <option>Billing Issue</option>
                <option>Report a Campaign</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea 
                rows={5} 
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <Button type="submit" className="w-full text-lg py-3">Send Message</Button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-gray-600 mt-1">support@crowdfund.com</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Phone</h3>
              <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Office</h3>
              <p className="text-gray-600 mt-1">123 Innovation Drive<br/>San Francisco, CA</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
