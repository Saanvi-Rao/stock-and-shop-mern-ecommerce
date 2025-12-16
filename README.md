Stock & Shop – E-Commerce System (MERN Stack)

Project Overview
Stock & Shop is a full-stack web-based e-commerce application developed as a Major Project for the Bachelor of Computer Applications (BCA) program. The system provides a secure and efficient platform for online grocery shopping, inventory management, and order processing.

The application supports role-based access for Administrators and Customers and ensures reliable payment handling using Stripe integration.

Features
User Authentication:
Secure login and registration
Forgot password with OTP verification
Role-based access control (Admin and Customer)

Admin Module:
Category and sub-category management
Product upload and inventory management
View orders and customer addresses

Customer Module:
Browse products
Add items to cart
Checkout and online payment
View order history
Manage saved addresses

Payment and Order Processing:
Stripe payment gateway integration
Secure server-side webhook verification
Automatic order creation
Inventory update and cart clearance after payment

Technology Stack
Frontend: React.js, Redux Toolkit
Backend: Node.js, Express.js
Database: MongoDB
Payment Gateway: Stripe
Authentication: JWT, Bcrypt, Nodemailer

Prerequisites
Node.js (v18 or above)
npm
MongoDB
Stripe CLI

Installation
Clone the repository:
git clone https://github.com/Saanvi-Rao/stock-and-shop-mern-ecommerce.git

Navigate to the project directory:
cd stock-and-shop-mern-ecommerce

Install dependencies:
Backend: npm install
Frontend: npm install

Stripe Webhook Setup
stripe listen --forward-to localhost:8080/api/webhook/stripe

How to Run the Application
Start backend server:
npm run server

Start frontend server:
npm run dev

Project Status
This project is developed for academic purposes as part of the BCA curriculum and is not deployed.


