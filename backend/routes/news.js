import express from "express";
import News from "../models/news.js";

const router = express.Router();

// GET all news
router.get("/", async (req, res) => {
    const data = await News.find().sort({ createdAt: -1 });
    res.json(data);
});

// CREATE news
router.post("/", async (req, res) => {
    const news = new News(req.body);
    await news.save();
    res.json(news);
});

// Update news
router.put("/:id", async (req, res) => {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// Delete news
router.delete("/:id", async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted"});
});

export default router;
