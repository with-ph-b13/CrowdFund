# CrowdFund Platform - MERN Stack Monorepo

A fully functional, robust Crowdfunding Platform built using the MERN stack (MongoDB, Express, React/Next.js, Node.js) with TypeScript. This platform supports multiple user roles (Admin, Creator, Supporter), features a robust credit-based economy, and incorporates dynamic design and responsive UI.

## Features

*   **Role-Based Access Control:** Secure JWT authentication for Admins, Creators, and Supporters.
*   **Credit Economy:** 
    *   Supporters can purchase credits (mock Stripe integration) and pledge them to campaigns.
    *   Creators receive credits upon approval and can request withdrawals (20 credits = $1).
*   **Global Notifications:** Real-time floating pop-ups using `react-hot-toast` to alert users of status changes.
*   **Data Visualization:** Interactive charts built with `recharts` on the dashboards.
*   **Campaign Management:** Full CRUD operations for Creators, including image uploads via ImgBB.
*   **Admin Dashboard:** Comprehensive oversight to approve campaigns, process withdrawals, and manage users.

## Technology Stack

*   **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, Swiper, React Hot Toast.
*   **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), bcrypt, jsonwebtoken.

## Setup Instructions

### 1. Prerequisites
Ensure you have Node.js installed on your machine.

### 2. Environment Variables
You need to set up two environment files:

**`server/.env`**:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**`client/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 3. Installation
Run the following command in the root directory to install dependencies for both the client and the server:
```bash
npm run install
# Note: if you use the concurrently script setup, you may need to install in both folders manually.
cd client && npm install
cd ../server && npm install
cd ..
```

### 4. Running the App (Dev Mode)
To spin up both the Next.js frontend and the Express backend simultaneously:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Architecture Details
This repository operates as a monorepo tracking both the frontend (`client/`) and backend (`server/`) under a single Git history, ensuring synchronization between API contracts and UI implementations. 
