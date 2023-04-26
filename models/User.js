import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobilePhone: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    loyaltyPoints: {
        type: Number,
        required: true,
        default: 50,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);