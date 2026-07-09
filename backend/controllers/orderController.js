import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const sendOrderConfirmationEmail = async (order, user) => {
    const orderItemsHtml = order.orderItems.map(item => 
        `<li style="margin-bottom: 5px;">${item.qty} x <strong>${item.name}</strong> - ₹${item.price}</li>`
    ).join('');

    const orderItemsText = order.orderItems.map(item => 
        `- ${item.qty} x ${item.name} (₹${item.price})`
    ).join('\n');

    const message = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Inter', sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                h1 { color: #2563eb; }
                .details { background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px; }
                ul { padding-left: 20px; margin: 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Order Confirmed! 🎉</h1>
                <p>Hello ${user.name},</p>
                <p>Thank you for shopping with us! Your order <strong>#${order._id}</strong> has been placed successfully.</p>
                
                <div class="details">
                    <h3 style="margin-top: 0;">Items Ordered</h3>
                    <ul>
                        ${orderItemsHtml}
                    </ul>
                </div>

                <div class="details">
                    <h3 style="margin-top: 0;">Order Summary</h3>
                    <p>Total Amount: <strong>₹${order.totalPrice}</strong></p>
                    <p>Payment Method: ${order.paymentMethod}</p>
                    <p>Shipping To: ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
                </div>
                <p style="margin-top:20px; color:#6b7280; font-size:14px;">We'll notify you when your items are on the way!</p>
            </div>
        </body>
        </html>
    `;

    try {
        await sendEmail({
            email: order.shippingAddress.email || user.email,
            subject: `Order Confirmation - #${order._id}`,
            message: message,
            text: `Thank you for shopping with us! Your order #${order._id} for ₹${order.totalPrice} has been placed successfully.\n\nItems Ordered:\n${orderItemsText}`
        });
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// @desc    Create new order & Razorpay order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Create Razorpay Order if payment method is Razorpay
            if (paymentMethod === 'Razorpay') {
                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const options = {
                    amount: Math.round(totalPrice * 100), // amount in smallest currency unit
                    currency: 'INR',
                    receipt: `receipt_${createdOrder._id}`,
                };

                const razorpayOrder = await razorpay.orders.create(options);
                
                res.status(201).json({
                    order: createdOrder,
                    razorpayOrder,
                });
            } else {
                await sendOrderConfirmationEmail(createdOrder, req.user);
                res.status(201).json({ order: createdOrder });
            }
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (order) {
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
                
            const isAuthentic = expectedSignature === razorpay_signature;
            
            if (isAuthentic) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'success',
                    update_time: Date.now().toString(),
                };
                
                const updatedOrder = await order.save();
                await sendOrderConfirmationEmail(updatedOrder, req.user);
                res.json(updatedOrder);
            } else {
                res.status(400);
                throw new Error('Payment verification failed');
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            
            if (req.body.status === 'Delivered') {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};
