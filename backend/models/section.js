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
    backgroundVideo: String,
    image: String,
    backgroundImage: String,
    icon: String,
    button: String,
    textButton: String,
    infoSideButton: String,
    
    // Why Us section fields
    backgroundImageWhyus: String,
    whyus1Title: String,
    whyus1Description: String,
    whyus2Title: String,
    whyus2Description: String,
    whyus3Title: String,
    whyus3Description: String
});

export default mongoose.model("Section", sectionSchema);