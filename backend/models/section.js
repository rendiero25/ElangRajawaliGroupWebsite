import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    website: {type: String, required: true}, //Compro and 5 landing pages
    section: {type: String, required: true}, //Section hero and etc

    //Content section
    title: String,
    subtitle: String,
    description: String,
    buttonLink: String,
    buttonText: String,
    video: String,
    image: String,
    backgroundImage: String,
    icon: String,
});

export default mongoose.model("Section", sectionSchema);