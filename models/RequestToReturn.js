import mongoose from 'mongoose';

const RequestToReturnSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model('RequestToReturn', RequestToReturnSchema);