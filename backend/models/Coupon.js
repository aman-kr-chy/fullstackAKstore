import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please enter coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'flat'],
            required: true,
        },
        discountAmount: {
            type: Number,
            required: [true, 'Please enter discount amount'],
        },
        minPurchase: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number,
        },
        expiryDate: {
            type: Date,
            required: [true, 'Please enter expiry date'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
