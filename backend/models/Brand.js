import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a brand name'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            public_id: { type: String },
            url: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
