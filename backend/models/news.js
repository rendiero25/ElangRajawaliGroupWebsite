import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    unitBusiness: {type: String, required: true},
    date: {type: Date, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    link: {type: String, required: true},
})

export default mongoose.model("News", newsSchema);