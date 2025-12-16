# Stock & Shop – E-Commerce System (MERN Stack)

## Project Overview
Stock & Shop is a full-stack web-based e-commerce application developed as a Major Project for the Bachelor of Computer Applications (BCA) program. The system is designed to streamline online grocery shopping by providing secure user authentication, real-time inventory management, and reliable online payment processing.

The application supports both Administrator and Customer roles and ensures secure order fulfillment using Stripe payment gateway integration.

## Features
- **Secure User Authentication:**
  - User Registration and Login
  - Forgot Password with OTP verification
  - Role-based access control (Admin and Customer)

- **Admin Module:**
  - Add and manage categories
  - Add and manage sub-categories
  - Upload and manage products
  - View customer orders
  - View saved customer addresses
  - Monitor and update inventory stock levels

- **Customer Module:**
  - Browse available products
  - Add products to cart
  - Checkout and online payment
  - View order history
  - Save and manage delivery addresses

- **Payment and Order Management:**
  - Secure Stripe payment gateway integration
  - Server-side webhook verification
  - Automatic order creation after successful payment
  - Inventory update and cart clearance

## Prerequisites
To run this application, you need:
- **Node.js (v18 or above)**
- **npm**
- **MongoDB**
- **Stripe CLI**

## Installation
Follow these steps to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saanvi-Rao/stock-and-shop-mern-ecommerce.git
   ```
2. **Navigate into the project directory:**
   ```bash
   cd stock-and-shop-mern-ecommerce
   ```
 
3. **Install required dependencies:**
**Backend:**
   ```bash
   npm  install
   ```
**Frontend:**
   ```bash
   npm  install
   ```
## Stripe Webhook Setup
To enable secure payment confirmation during local development, run:
```bash
stripe listen --forward-to localhost:8080/api/webhook/stripe
```

**How to Run the Application**
Start the backend server:
```bash
npm run dev
```

Start the frontend application:
```bash
npm run dev
```
The application will be accessible through the local development server in the browser.

**Project Status**

This project is developed strictly for academic purposes as part of the BCA curriculum and is not deployed.
