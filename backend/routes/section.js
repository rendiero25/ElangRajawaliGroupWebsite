import express from "express";
import Section from "../models/section.js";

const router = express.Router();

//GET section by website + section
router.get("/:website/:section", async (rec, res) => {
    const { website, section} = req.params;
    try {
        const data = await Section.findOne({website, section});
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update section
router.put("/:website/:section", async (req, res) => {
    const { website, section} = req.params;
    try {
        const updated = await Section.findOneAndUpdate({ website, section }, req.body, { new: true, upsert: true});
        res.json(updated);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
