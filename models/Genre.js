import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Genre', GenreSchema);