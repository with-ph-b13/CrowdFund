import React from 'react';
import Link from 'next/link';

interface CampaignCardProps {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  goal: number;
  raised: number;
  creatorName: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ id, title, shortDescription, imageUrl, goal, raised, creatorName }) => {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-[420px]">
      <img className="object-cover w-full h-48" src={imageUrl} alt={title} />
      <div className="flex flex-col flex-grow p-5">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-1">{title}</h5>
        <p className="mb-3 text-sm text-gray-500">by {creatorName}</p>
        <p className="mb-4 text-sm text-gray-700 line-clamp-2 flex-grow">{shortDescription}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="flex justify-between text-sm font-medium text-gray-900 mb-4">
          <span>${raised.toLocaleString()} raised</span>
          <span className="text-gray-500">${goal.toLocaleString()} goal</span>
        </div>

        <Link href={`/campaigns/${id}`} className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
