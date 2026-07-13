import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
  creatorName: string;
  creatorEmail: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: 'pending' | 'approved';
  withdrawDate: Date;
}

const WithdrawalSchema: Schema = new Schema({
  creatorName: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  withdrawalCredit: { type: Number, required: true },
  withdrawalAmount: { type: Number, required: true },
  paymentSystem: { type: String, required: true },
  accountNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  withdrawDate: { type: Date, default: Date.now },
});

export default mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
