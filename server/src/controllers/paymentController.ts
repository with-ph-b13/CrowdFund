import { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_fallback_key', {
  apiVersion: '2025-01-27.acacia' as any, // Using latest stable apiVersion
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { amountDollars } = req.body;
    const userId = (req as any).user.id;

    if (!amountDollars || amountDollars < 1) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const creditsToAdd = amountDollars * 20;

    // Use VERCEL_URL provided by Vercel automatically, fallback to NEXTAUTH_URL or localhost
    const baseUrl = process.env.NEXTAUTH_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Add ${creditsToAdd} Credits`,
            },
            unit_amount: amountDollars * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard/credits/success?amount=${amountDollars}&credits=${creditsToAdd}`,
      cancel_url: `${baseUrl}/dashboard/credits/purchase`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        creditsToAdd: creditsToAdd.toString(),
      }
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // req.body must be raw buffer here
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const creditsToAdd = parseInt(session.metadata?.creditsToAdd || '0', 10);

    if (userId && creditsToAdd > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.credits += creditsToAdd;
        await user.save();
        console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
      }
    }
  }

  res.json({ received: true });
};
