import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    returnDate: {
        type: Date,
        required: false,
    },
    isGiven: {
        type: Boolean,
        default: false
    },
    isReturned: {
        type: Boolean,
        default: false
    },
    isCancled: {
        type: Boolean,
        default: false
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    librarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Order', OrderSchema);