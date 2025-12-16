Stock & Shop – MERN E-Commerce System

Project Overview  
Stock & Shop is a full-stack web-based e-commerce application developed as a Major Project for the Bachelor of Computer Applications (BCA) program. The system is designed to facilitate online grocery shopping with secure payment processing, role-based access control, and real-time inventory management.

The application supports both Administrator and Customer roles and ensures reliable order processing using Stripe payment integration.

Features  
User Authentication & Authorization:
- User Registration and Login
- Forgot Password with OTP verification
- Role-based access for Admin and Customer

Admin Module:
- Manage Categories and Sub-Categories
- Upload and Manage Products
- View Orders and Saved Addresses
- Monitor Inventory Stock Levels

Customer Module:
- Browse Products
- Add Products to Cart
- Checkout and Online Payment
- View Orders
- Save and Manage Addresses

Payment & Order Management:
- Secure Stripe Payment Gateway Integration
- Server-side Webhook Verification
- Automatic Order Creation
- Inventory Update and Cart Clearance after Payment

Technology Stack  
Frontend:
- React.js
- Redux Toolkit

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Payment Gateway:
- Stripe API

Authentication & Utilities:
- JWT (JSON Web Tokens)
- Bcrypt
- Nodemailer (OTP emails)

Prerequisites  
To run this project locally, the following are required:
- Node.js (v18 or above)
- npm
- MongoDB
- Stripe CLI (for webhook testing)

Installation & Setup  
Clone the repository:

git clone https://github.com/Saanvi-Rao/stock-and-shop-mern-ecommerce.git

Navigate into the project directory:

cd stock-and-shop-mern-ecommerce

Install dependencies for backend and frontend separately:

Backend:
npm install

Frontend:
npm install

Environment Setup  
Create a `.env` file in the backend directory and configure required environment variables such as database URL, JWT secret, and Stripe keys.

Stripe Webhook Setup (Local Development):

stripe listen --forward-to localhost:8080/api/webhook/stripe

How to Run the Application  
Start the backend server:
npm run server

Start the frontend application:
npm run dev

The application will be accessible on the browser using the local development URL.

Project Status  
This project is developed for academic purposes as part of the BCA curriculum and is not deployed to a live environment.

