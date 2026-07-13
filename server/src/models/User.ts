import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  photoUrl?: string;
  password?: string; // Optional because of Google Auth
  role: 'Admin' | 'Creator' | 'Supporter';
  credits: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoUrl: { type: String },
  password: { type: String },
  role: { type: String, enum: ['Admin', 'Creator', 'Supporter'], required: true },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
