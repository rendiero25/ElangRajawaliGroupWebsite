import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    unitBusiness: {type: String, required: true},
    date: {type: Date, required: true},
    image: {type: String, required: false}, // Made optional
    description: {type: String, required: true},
    link: {type: String, required: false},
}, {
    timestamps: true, // Add createdAt and updatedAt automatically
    collection: 'news' // Explicitly set collection name
});

// Create model with explicit collection name
const News = mongoose.model("News", newsSchema, 'news');

export default News;