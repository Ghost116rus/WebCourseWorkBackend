import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    volume: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authors: {
        type: Array,
        default: [],
    },
    genres: {
        type: Array,
        default: [],
    },
    count: {
        type: Number,
        default: 1,
    },

    imageUrl: String,
    bookUrl: String
});

export default mongoose.model('Book', BookSchema);