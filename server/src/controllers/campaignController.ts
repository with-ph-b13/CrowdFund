import { Request, Response } from 'express';
import Campaign from '../models/Campaign';

export const getTopCampaigns = async (req: Request, res: Response) => {
  try {
    const topCampaigns = await Campaign.find({ status: 'approved' })
      .sort({ amountRaised: -1 })
      .limit(6);
    res.status(200).json(topCampaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top campaigns', error });
  }
};

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { search, category, status, sortBy, page = '1', limit = '12' } = req.query;

    let query: any = {};

    // Search query matches title or short description (story snippet)
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { story: { $regex: search as string, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // Default to approved if not specified, unless admin asks for something else
    query.status = status || 'approved';

    let sortConfig: any = { createdAt: -1 };
    if (sortBy === 'highestFunded') sortConfig = { amountRaised: -1 };
    if (sortBy === 'deadline') sortConfig = { deadline: 1 };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      campaigns,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    let campaign;
    const dummyIds = ['1', '2', '3', '4', '5', '6'];
    
    if (dummyIds.includes(req.params.id)) {
      campaign = await Campaign.findOne({ status: 'approved' }).sort({ amountRaised: -1 });
      
      // If database is completely empty, provide a robust mock for the dummy IDs to prevent 404s on the homepage
      if (!campaign) {
        return res.status(200).json({
          _id: req.params.id,
          title: 'Solar Powered Water Pump',
          category: 'Technology',
          story: 'Help us bring clean water to villages. This is a robust fallback campaign because your MongoDB database is currently empty. Please run the seed script or create a campaign to see real data!',
          fundingGoal: 10000,
          minimumContribution: 5,
          amountRaised: 8500,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500',
          rewardInfo: 'Get a personalized thank you video from the villages you helped!',
          creatorName: 'EcoTech',
          creatorId: 'mock_creator_id'
        });
      }
    } else {
      campaign = await Campaign.findById(req.params.id);
    }

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign details', error });
  }
};

export const getMyCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ creatorId: (req as any).user.id }).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your campaigns', error });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, story, category, fundingGoal, minimumContribution, deadline, imageUrl, rewardInfo } = req.body;
    
    const newCampaign = await Campaign.create({
      title,
      story,
      category,
      fundingGoal,
      minimumContribution,
      deadline,
      imageUrl,
      rewardInfo,
      creatorId: (req as any).user.id,
      creatorName: (req as any).user.name || 'Creator', // Use user's name
      amountRaised: 0,
      status: 'approved' // Setting approved by default for MVP, typically would be 'pending'
    });

    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    
    if (campaign.creatorId.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign', error });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    
    if (campaign.creatorId.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await campaign.deleteOne();
    res.status(200).json({ message: 'Campaign removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign', error });
  }
};
