import mongoose, { Schema, Document } from 'mongoose';

export interface IContribution extends Document {
  campaignId: mongoose.Types.ObjectId;
  campaignTitle: string;
  amount: number;
  supporterName: string;
  supporterEmail: string;
  creatorName: string;
  creatorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
}

const ContributionSchema: Schema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  campaignTitle: { type: String, required: true },
  amount: { type: Number, required: true },
  supporterName: { type: String, required: true },
  supporterEmail: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IContribution>('Contribution', ContributionSchema);
