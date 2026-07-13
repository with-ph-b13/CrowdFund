'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const amount = searchParams.get('amount');
  const credits = searchParams.get('credits');

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-green-700">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase of ${amount}. We have added <strong>{credits} Credits</strong> to your account.
      </p>
      <Button onClick={() => {
        // Force full reload to update context credits from backend, or just route to dashboard
        window.location.href = '/dashboard';
      }}>
        Return to Dashboard
      </Button>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <div className="p-4 md:p-8 mt-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
