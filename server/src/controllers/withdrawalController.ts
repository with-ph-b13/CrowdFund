// @ts-nocheck
import { Request, Response } from 'express';
import Withdrawal from '../models/Withdrawal';
import User from '../models/User';

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const { amountDollars } = req.body;
    const userId = (req as any).user.id;

    if (amountDollars < 10) {
      return res.status(400).json({ message: 'Minimum withdrawal is $10 (200 credits)' });
    }

    const creditsNeeded = amountDollars * 20;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.credits < creditsNeeded) {
      return res.status(400).json({ message: `Insufficient credits. You need ${creditsNeeded} credits for $${amountDollars}.` });
    }

    // Deduct credits immediately
    user.credits -= creditsNeeded;
    await user.save();

    const withdrawal = await Withdrawal.create({
      creatorId: userId,
      amountDollars,
      creditsDeducted: creditsNeeded,
      status: 'pending'
    });

    res.status(201).json({ message: 'Withdrawal requested successfully', withdrawal });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting withdrawal', error });
  }
};

export const getMyWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find({ creatorId: (req as any).user.id }).sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals', error });
  }
};
