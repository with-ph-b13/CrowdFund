// @ts-nocheck
import { Request, Response } from 'express';
import Contribution from '../models/Contribution';
import Campaign from '../models/Campaign';
import User from '../models/User';
import Notification from '../models/Notification';

export const makeContribution = async (req: Request, res: Response) => {
  try {
    const { campaignId, amount } = req.body;
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.credits < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Deduct credits
    user.credits -= amount;
    await user.save();

    const contribution = await Contribution.create({
      campaignId,
      supporterId: userId,
      supporterName: user.name,
      amount,
      status: 'pending'
    });

    // Notify the Creator
    await Notification.create({
      userId: campaign.creatorId,
      message: `${user.name} has pledged ${amount} credits to your campaign "${campaign.title}". Please review it.`,
      type: 'contribution_received'
    });

    res.status(201).json({ message: 'Contribution submitted for review', contribution });
  } catch (error) {
    res.status(500).json({ message: 'Error making contribution', error });
  }
};

export const getMyContributions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = { supporterId: (req as any).user.id };
    
    const total = await Contribution.countDocuments(query);
    const contributions = await Contribution.find(query)
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      contributions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contributions', error });
  }
};

export const getContributionsToReview = async (req: Request, res: Response) => {
  try {
    // Get all campaigns created by this user
    const campaigns = await Campaign.find({ creatorId: (req as any).user.id }).select('_id');
    const campaignIds = campaigns.map(c => c._id);

    // Find pending contributions for these campaigns
    const contributions = await Contribution.find({ 
      campaignId: { $in: campaignIds },
      status: 'pending'
    }).populate('campaignId', 'title').sort({ createdAt: -1 });

    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending contributions', error });
  }
};

export const reviewContribution = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const contributionId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contribution = await Contribution.findById(contributionId);
    if (!contribution || contribution.status !== 'pending') {
      return res.status(404).json({ message: 'Contribution not found or already reviewed' });
    }

    // Verify creator owns the campaign
    const campaign = await Campaign.findById(contribution.campaignId);
    if (!campaign || campaign.creatorId.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contribution.status = status;
    await contribution.save();

    if (status === 'approved') {
      // Add amount to campaign
      campaign.amountRaised += contribution.amount;
      await campaign.save();
    } else if (status === 'rejected') {
      // Refund credits to supporter
      const supporter = await User.findById(contribution.supporterId);
      if (supporter) {
        supporter.credits += contribution.amount;
        await supporter.save();
      }
    }

    // Notify the Supporter
    await Notification.create({
      userId: contribution.supporterId,
      message: `Your contribution of ${contribution.amount} credits to "${campaign.title}" was ${status}.`,
      type: status === 'approved' ? 'contribution_approved' : 'contribution_rejected'
    });

    res.status(200).json({ message: `Contribution ${status}`, contribution });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing contribution', error });
  }
};
