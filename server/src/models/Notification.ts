import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  message: string;
  toEmail: string;
  actionRoute: string;
  time: Date;
}

const NotificationSchema: Schema = new Schema({
  message: { type: String, required: true },
  toEmail: { type: String, required: true },
  actionRoute: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
