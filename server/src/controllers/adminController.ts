// @ts-nocheck
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import User from '../models/User';
import Withdrawal from '../models/Withdrawal';
import Notification from '../models/Notification';
import Contribution from '../models/Contribution';
import bcrypt from 'bcrypt';

export const getPendingCampaigns = async (req: Request, res: Response) => {
  try {
    // For MVP, returning all campaigns to manage, or just ones needing approval
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

export const updateCampaignStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    
    // Create notification for creator
    await Notification.create({
      userId: campaign.creatorId,
      message: `Your campaign "${campaign.title}" status has been changed to ${status}.`,
      type: status === 'approved' ? 'campaign_approved' : 'campaign_rejected'
    });

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign status', error });
  }
};

export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find({}).populate('creatorId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals', error });
  }
};

export const updateWithdrawalStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    withdrawal.status = status;
    await withdrawal.save();

    if (status === 'rejected') {
      // Refund credits
      const user = await User.findById(withdrawal.creatorId);
      if (user) {
        user.credits += withdrawal.creditsDeducted;
        await user.save();
      }
    }

    await Notification.create({
      userId: withdrawal.creatorId,
      message: `Your withdrawal request for $${withdrawal.amountDollars} was ${status}.`,
      type: status === 'approved' ? 'withdrawal_approved' : 'withdrawal_rejected'
    });

    res.status(200).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating withdrawal', error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    // Clear everything
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});

    const adminUser = await User.findOne({ role: 'Admin' });
    const creatorUser = await User.findOne({ role: 'Creator' });
    
    // We need at least a creator to assign campaigns to. If none exists, create a dummy one.
    let creatorId = creatorUser?._id;
    let creatorName = creatorUser?.name || 'Demo Creator';
    let creatorEmail = creatorUser?.email || 'demo_creator@test.com';
    
    if (!creatorId) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const newCreator = await User.create({
        name: 'Demo Creator', email: 'demo_creator@test.com', password: passwordHash, role: 'Creator', credits: 100
      });
      creatorId = newCreator._id;
      creatorName = newCreator.name;
      creatorEmail = newCreator.email;
    }

    const campaigns = await Campaign.insertMany([
      {
        title: 'Quantum Computing Educational Kit',
        story: 'Bring the power of quantum mechanics into high school classrooms. This kit includes a tabletop quantum simulator, an interactive curriculum, and direct integration with cloud quantum computers.\n\nWe believe education should be cutting-edge. Your funding helps us manufacture the first 1,000 units!',
        category: 'Technology',
        fundingGoal: 50000,
        minimumContribution: 50,
        amountRaised: 15000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        rewardInfo: 'Get an early-bird Quantum Kit and a digital certificate.',
        creatorId: creatorId,
        creatorName: creatorName,
        creatorEmail: creatorEmail,
        status: 'approved'
      },
      {
        title: 'Eco-Friendly Bamboo Bicycles',
        story: 'Handcrafted, sustainable, and incredibly durable. Our bamboo bicycles are lighter than steel and stronger than carbon fiber. \n\nBy backing us, you are reducing carbon footprints and supporting local artisans who craft these beautiful bikes.',
        category: 'Technology',
        fundingGoal: 120000,
        minimumContribution: 200,
        amountRaised: 95000,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
        rewardInfo: 'A fully assembled Bamboo Bicycle delivered to your door.',
        creatorId: creatorId,
        creatorName: creatorName,
        creatorEmail: creatorEmail,
        status: 'approved'
      },
      {
        title: 'The Lost Chronicles - Indie RPG',
        story: 'An epic 16-bit RPG inspired by the classics. Over 50 hours of gameplay, branching storylines, and a fully orchestrated soundtrack.\n\nWe have spent 3 years developing the engine. We need your help to finish the artwork and music.',
        category: 'Art',
        fundingGoal: 25000,
        minimumContribution: 15,
        amountRaised: 28000,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        rewardInfo: 'Digital copy of the game + your name in the credits.',
        creatorId: creatorId,
        creatorName: creatorName,
        creatorEmail: creatorEmail,
        status: 'approved'
      },
      {
        title: 'Community Garden Initiative',
        story: 'Transforming an abandoned city lot into a thriving organic community garden. We will grow fresh produce for local food banks and provide a green space for urban residents.',
        category: 'Community',
        fundingGoal: 10000,
        minimumContribution: 10,
        amountRaised: 2000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
        rewardInfo: 'A basket of fresh organic produce upon our first harvest.',
        creatorId: creatorId,
        creatorName: creatorName,
        creatorEmail: creatorEmail,
        status: 'approved'
      },
      {
        title: 'Smart Health Monitoring Ring',
        story: 'A sleek, titanium ring that tracks your sleep, heart rate, and oxygen levels with medical-grade precision. The app provides actionable AI-driven insights to improve your daily wellness.',
        category: 'Health',
        fundingGoal: 75000,
        minimumContribution: 150,
        amountRaised: 10000,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800',
        rewardInfo: 'One Smart Health Ring in your choice of color.',
        creatorId: creatorId,
        creatorName: creatorName,
        creatorEmail: creatorEmail,
        status: 'pending' // pending approval
      }
    ]);

    res.status(200).json({ message: 'Database beautifully seeded with stunning campaigns!', count: campaigns.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error });
  }
};
