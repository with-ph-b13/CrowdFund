import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import contributionRoutes from './routes/contributionRoutes';
import withdrawalRoutes from './routes/withdrawalRoutes';
import paymentRoutes from './routes/paymentRoutes';
import paymentWebhookRoutes from './routes/paymentWebhookRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notificationRoutes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Webhook MUST be mounted before express.json() parses the body!
app.use('/api/payments/webhook', paymentWebhookRoutes);

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Crowdfunding Platform API is running!');
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default app;
