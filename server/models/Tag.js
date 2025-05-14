import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Tag = mongoose.model('tag', tagSchema);