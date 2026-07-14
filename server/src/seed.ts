import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import Campaign from './models/Campaign';
import Contribution from './models/Contribution';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdfund';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});
    console.log('Cleared existing data.');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin Boss',
      email: 'admin@test.com',
      password: passwordHash,
      role: 'Admin',
      credits: 0
    });

    const creator1 = await User.create({
      name: 'Tech Visionary',
      email: 'creator1@test.com',
      password: passwordHash,
      role: 'Creator',
      credits: 100
    });

    const creator2 = await User.create({
      name: 'Artisan Crafter',
      email: 'creator2@test.com',
      password: passwordHash,
      role: 'Creator',
      credits: 50
    });

    const supporter1 = await User.create({
      name: 'Generous Backer',
      email: 'supporter1@test.com',
      password: passwordHash,
      role: 'Supporter',
      credits: 5000
    });

    // 2. Create Campaigns
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
        creatorId: creator1._id,
        creatorName: creator1.name,
        creatorEmail: creator1.email,
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
        creatorId: creator1._id,
        creatorName: creator1.name,
        creatorEmail: creator1.email,
        status: 'approved'
      },
      {
        title: 'The Lost Chronicles - Indie RPG',
        story: 'An epic 16-bit RPG inspired by the classics. Over 50 hours of gameplay, branching storylines, and a fully orchestrated soundtrack.\n\nWe have spent 3 years developing the engine. We need your help to finish the artwork and music.',
        category: 'Art',
        fundingGoal: 25000,
        minimumContribution: 15,
        amountRaised: 28000, // fully funded
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        rewardInfo: 'Digital copy of the game + your name in the credits.',
        creatorId: creator2._id,
        creatorName: creator2.name,
        creatorEmail: creator2.email,
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
        creatorId: creator2._id,
        creatorName: creator2.name,
        creatorEmail: creator2.email,
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
        creatorId: creator1._id,
        creatorName: creator1.name,
        creatorEmail: creator1.email,
        status: 'pending' // pending approval
      }
    ]);

    // 3. Create a test contribution
    await Contribution.create({
      campaignId: campaigns[0]._id,
      campaignTitle: campaigns[0].title,
      creatorName: campaigns[0].creatorName,
      creatorEmail: campaigns[0].creatorEmail,
      supporterId: supporter1._id,
      supporterName: supporter1.name,
      supporterEmail: supporter1.email,
      amount: 500,
      status: 'approved'
    });

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
