import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

// Helper: calculate price after discount
export const priceWithDiscount = (price, discount = 0) => {
  const p = Number(price) || 0;
  const dis = Number(discount) || 0;
  const discountAmount = Math.ceil((p * dis) / 100);
  return p - discountAmount;
};

// --- Cash on Delivery Order ---
export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map(el => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: el.productId._id,
      product_details: { 
        name: el.productId.name, 
        image: el.productId.image 
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt
    }));

    const generatedOrder = await OrderModel.insertMany(payload);

    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order successfully placed",
      success: true,
      error: false,
      data: generatedOrder
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      success: false,
      error: true
    });
  }
}

// --- Stripe Online Payment Controller ---
export async function paymentController(req, res) {
  const DUMMY_IMAGE = 'https://dummyimage.com/600x400/000/fff&text=No+Image';

  try {
    const userId = req.userId; 
    const { list_items, addressId } = req.body;
    
    const user = await UserModel.findById(userId);
    if (!user?.email) {
      return res.status(400).json({ message: "User email not found", success: false, error: true });
    }

    const line_items = list_items.map(item => {
      if (!item.productId) {
        console.error("❌ Cart item missing product data:", item);
        throw new Error("Missing product details for an item in the cart.");
      }
      
      const product = item.productId;
      const finalPriceInRupees = priceWithDiscount(product.price, product.discount);
      const calculatedPriceInPaise = Math.max(1, Math.round(finalPriceInRupees * 100));

      let imageUrls = [];
      if (product.image) {
        const imagesArray = Array.isArray(product.image) ? product.image : [product.image];
        imageUrls = imagesArray
          .filter(img => img)
          .map(img => img.startsWith('http://') ? img.replace('http://', 'https://') : img);
      }
      const finalImages = imageUrls.length > 0 ? imageUrls : [DUMMY_IMAGE];

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: finalImages,
            metadata: { productId: product._id.toString() }
          },
          unit_amount: calculatedPriceInPaise
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
        quantity: item.quantity
      }
    });

    const session = await Stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: { userId, addressId },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });

    return res.status(200).json({ success: true, url: session.url });
    
  } catch (err) {
    console.error("❌ FATAL STRIPE ERROR:", err.message); 
    console.error("Full Error Object:", JSON.stringify(err, null, 2));

    return res.status(500).json({ message: err.message || "Payment processing failed.", success: false, error: true });
  }
}

// Helper: get Stripe line items for order creation
const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
  const productPromises = lineItems.data.map(async item => {
    const stripeProduct = item.price.product;
    const imageUrl = (stripeProduct.images && stripeProduct.images.length > 0) 
                      ? stripeProduct.images[0] 
                      : ''; 
    return {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: stripeProduct.metadata.productId, 
      product_details: { name: stripeProduct.name, image: imageUrl }, 
      paymentId,
      payment_status,
      subTotalAmt: (item.amount_subtotal / 100), 
      totalAmt: (item.amount_total / 100),
      delivery_address: addressId,
    };
  });
  return Promise.all(productPromises);
};

// --- Stripe Webhook ---
export async function webhookStripe(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY; 

  if (!endpointSecret || typeof endpointSecret !== 'string') {
    console.error("❌ STRIPE_WEBHOOK_SECRET_KEY not configured.");
    return res.status(400).send('Webhook secret not configured.');
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret); 
  } catch (err) {
    console.log(`❌ Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
      const userId = session.metadata.userId;

      const orderProducts = await getOrderProductItems({
        lineItems,
        userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status
      });

      const order = await OrderModel.insertMany(orderProducts);

      if (order[0]) {
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
        await CartProductModel.deleteMany({ userId });
        console.log("✔ Cart cleared successfully.");
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

// --- Get user order details ---
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;
    const orderList = await OrderModel.find({ userId }).sort({ createdAt: -1 }).populate("delivery_address");

    return res.json({
      message: "Order list fetched successfully",
      data: orderList,
      success: true,
      error: false
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, success: false, error: true });
  }
}
