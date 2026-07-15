import CampaignClient from './CampaignClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ];
}

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  return <CampaignClient id={params.id} />;
}
