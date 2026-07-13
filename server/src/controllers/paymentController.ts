import { Request, Response } from 'express';
import User from '../models/User';

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { amountDollars } = req.body;
    const userId = (req as any).user.id;

    if (!amountDollars || amountDollars < 1) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // MOCK STRIPE IMPLEMENTATION:
    // In a real app, you would initialize stripe with STRIPE_SECRET_KEY, 
    // create a stripe.checkout.sessions.create() call, and return the session.url.
    // Since this is an assignment without active keys, we simulate a successful payment here directly.
    
    const creditsToadd = amountDollars * 20;
    
    const user = await User.findById(userId);
    if (user) {
      user.credits += creditsToadd;
      await user.save();
    }

    // Return a mock success URL that we'll redirect to in the frontend
    res.status(200).json({ 
      url: `/dashboard/credits/success?amount=${amountDollars}&credits=${creditsToadd}`,
      message: 'Mock Stripe checkout successful. Credits added.'
    });

  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};
