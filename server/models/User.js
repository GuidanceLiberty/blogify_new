import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    photo: {type: String},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null}],
    verificationToken: String,
    lastLogin: { type: Date, default: Date.now()},
    isVerified: {type: Boolean, default: false}
}, {timestamps: true})

export const User = mongoose.model('user', userSchema);