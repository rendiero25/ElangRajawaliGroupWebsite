import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import News from "../models/news.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
    console.log('=== GET TEST ENDPOINT ===');
    res.json({ 
        message: 'GET Test successful',
        timestamp: new Date().toISOString(),
        endpoint: '/api/news/test'
    });
});

router.post("/test", (req, res) => {
    console.log('=== POST TEST ENDPOINT ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.json({ 
        message: 'POST Test successful', 
        body: req.body,
        headers: req.headers 
    });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept image files only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// GET all news
router.get("/", async (req, res) => {
    try {
        const data = await News.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: error.message });
    }
});

// CREATE news (simple version for debugging)
router.post("/simple", async (req, res) => {
    try {
        console.log('=== CREATE NEWS SIMPLE ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        // Validate required fields
        const { title, unitBusiness, description, date, image } = req.body;
        
        if (!title || !unitBusiness || !description) {
            console.log('❌ Validation failed - missing required fields');
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'unitBusiness', 'description'],
                received: { title: !!title, unitBusiness: !!unitBusiness, description: !!description }
            });
        }
        
        const newsData = {
            title: title.trim(),
            unitBusiness: unitBusiness.trim(),
            date: date ? new Date(date) : new Date(),
            description: description.trim(),
            image: image || ''
        };
        
        console.log('📝 Creating news with data:', newsData);
        
        const news = new News(newsData);
        const savedNews = await news.save();
        
        console.log('✅ News saved successfully to MongoDB!');
        console.log('📄 Document ID:', savedNews._id);
        console.log('📂 Collection: erg_db/news');
        
        res.status(201).json({
            success: true,
            message: 'News created successfully',
            data: savedNews
        });
    } catch (error) {
        console.error('❌ Error creating news:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            success: false,
            error: error.message, 
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
});

// CREATE news with file upload support
router.post("/", upload.single('image'), async (req, res) => {
    try {
        console.log('=== CREATE NEWS REQUEST ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Content-Type:', req.get('Content-Type'));
        
        // Validate required fields
        if (!req.body.title || !req.body.unitBusiness || !req.body.description) {
            console.log('Missing required fields validation failed');
            return res.status(400).json({ 
                error: 'Missing required fields: title, unitBusiness, and description are required',
                received: {
                    title: !!req.body.title,
                    unitBusiness: !!req.body.unitBusiness,
                    description: !!req.body.description
                }
            });
        }
        
        const newsData = {
            title: req.body.title,
            unitBusiness: req.body.unitBusiness,
            date: req.body.date || new Date(),
            description: req.body.description
        };
        
        // Handle image: either file upload or URL
        if (req.file) {
            newsData.image = `http://localhost:5000/uploads/${req.file.filename}`;
            console.log('✅ Image uploaded and URL set:', newsData.image);
        } else if (req.body.imageUrl) {
            newsData.image = req.body.imageUrl;
            console.log('✅ Image URL used:', newsData.image);
        } else if (req.body.image) {
            newsData.image = req.body.image;
            console.log('✅ Image from form:', newsData.image);
        } else {
            console.log('⚠️ No image provided');
        }
        
        console.log('News data to save:', newsData);
        
        const news = new News(newsData);
        await news.save();
        
        console.log('✅ News with file saved successfully:', news._id);
        res.status(201).json({
            success: true,
            message: 'News created successfully with file',
            data: news
        });
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update news with file upload support
router.put("/:id", upload.single('image'), async (req, res) => {
    try {
        console.log('Update Request body:', req.body);
        console.log('Update Request file:', req.file);
        
        // Validate required fields
        if (!req.body.title || !req.body.unitBusiness || !req.body.description) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, unitBusiness, and description are required' 
            });
        }
        
        const newsData = {
            title: req.body.title,
            unitBusiness: req.body.unitBusiness,
            date: req.body.date,
            description: req.body.description
        };
        
        // Handle image: either file upload or URL
        if (req.file) {
            newsData.image = `http://localhost:5000/uploads/${req.file.filename}`;
            console.log('✅ Update: Image uploaded and URL set:', newsData.image);
        } else if (req.body.imageUrl) {
            newsData.image = req.body.imageUrl;
            console.log('✅ Update: Image URL used:', newsData.image);
        } else if (req.body.image) {
            newsData.image = req.body.image;
            console.log('✅ Update: Image from form:', newsData.image);
        } else {
            console.log('⚠️ Update: No image provided');
        }
        
        console.log('Update News data:', newsData);
        
        const updated = await News.findByIdAndUpdate(req.params.id, newsData, { new: true });
        
        if (!updated) {
            return res.status(404).json({ error: 'News not found' });
        }
        
        console.log('✅ News updated successfully:', updated._id);
        res.json({
            success: true,
            message: 'News updated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete news
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await News.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: 'News not found' });
        }
        
        console.log('News deleted successfully:', req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
