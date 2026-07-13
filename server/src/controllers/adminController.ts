import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import User from '../models/User';
import Withdrawal from '../models/Withdrawal';
import Notification from '../models/Notification';

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
