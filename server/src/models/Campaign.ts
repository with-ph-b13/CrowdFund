import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  story: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  deadline: Date;
  rewardInfo: string;
  imageUrl: string;
  creatorName: string;
  creatorEmail: string;
  amountRaised: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const CampaignSchema: Schema = new Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  category: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  minimumContribution: { type: Number, required: true },
  deadline: { type: Date, required: true },
  rewardInfo: { type: String, required: true },
  imageUrl: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  amountRaised: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
