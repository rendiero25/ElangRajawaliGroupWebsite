import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import Section from "../models/section.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Test route for news endpoint
router.get("/test/news", (req, res) => {
    res.json({ 
        message: "News test endpoint working!",
        timestamp: new Date().toISOString()
    });
});

// Debug route - list all available endpoints
router.get("/debug/routes", (req, res) => {
    res.json({
        message: "Available section routes",
        routes: [
            "GET /api/companyprofile/section/hero - Get hero section data",
            "POST /api/companyprofile/section/hero - Update hero section with file upload",
            "GET /api/companyprofile/section/news - Get news section data",
            "POST /api/companyprofile/section/news - Update news section",
            "GET /api/companyprofile/section/aboutus - Get about us section data",
            "POST /api/companyprofile/section/aboutus - Update about us section with multiple image uploads (backgroundImage, image)",
            "GET /api/companyprofile/section/whyus - Get whyus section data",
            "POST /api/companyprofile/section/whyus - Update whyus section",
            "GET /api/sections/:website/:section - Legacy get section",
            "POST /api/sections - Legacy create/update section",
            "PUT /api/sections/:website/:section - Legacy update section"
        ]
    });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Upload for videos (hero section)
const uploadVideo = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept video files only
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Upload for images (about us section)
const uploadImage = multer({ 
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
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// POST - Update hero section with file upload
router.post("/companyprofile/section/hero", uploadVideo.single('backgroundVideo'), async (req, res) => {
    try {
        // Set default values for hero section
        const website = 'compro';
        const section = 'hero';
        const { title, subtitle, description, button, textButton, infoSideButton } = req.body;
        
        // Build the section data
        const sectionData = {
            website,
            section,
            title,
            subtitle,
            description,
            button,
            textButton,
            infoSideButton
        };
        
        // Add video file path if uploaded
        if (req.file) {
            sectionData.backgroundVideo = `/uploads/${req.file.filename}`;
        }
        
        const updated = await Section.findOneAndUpdate(
            { website, section }, 
            sectionData, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            success: true,
            section: 'hero',
            data: updated,
            message: 'Hero section updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// POST - Update news section
router.post("/companyprofile/section/news", async (req, res) => {
    try {
        // Set default values for news section
        const website = 'compro';
        const section = 'news';
        const { title, subtitle } = req.body;
        
        // Build the section data
        const sectionData = {
            website,
            section,
            title,
            subtitle
        };
        
        const updated = await Section.findOneAndUpdate(
            { website, section }, 
            sectionData, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            success: true,
            section: 'news',
            data: updated,
            message: 'News section updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('News update error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// POST - Create/Update section (without file) - Legacy route
router.post("/sections", async (req, res) => {
    try {
        const { website, section } = req.body;
        const updated = await Section.findOneAndUpdate(
            { website, section }, 
            req.body, 
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET hero section data
router.get("/companyprofile/section/hero", async (req, res) => {
    try {
        const data = await Section.findOne({
            website: 'compro',
            section: 'hero'
        });
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Hero section not found',
                section: 'hero'
            });
        }
        
        res.status(200).json({
            success: true,
            section: 'hero',
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching hero section:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            section: 'hero'
        });
    }
});

// GET news section data
router.get("/companyprofile/section/news", async (req, res) => {
    try {
        const data = await Section.findOne({
            website: 'compro',
            section: 'news'
        });
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'News section not found',
                section: 'news'
            });
        }
        
        res.status(200).json({
            success: true,
            section: 'news',
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching news section:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            section: 'news'
        });
    }
});

//GET section by website + section (legacy route)
router.get("/sections/:website/:section", async (req, res) => {
    const { website, section} = req.params;
    try {
        const data = await Section.findOne({website, section});
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update section (legacy route)
router.put("/sections/:website/:section", async (req, res) => {
    const { website, section} = req.params;
    try {
        const updated = await Section.findOneAndUpdate({ website, section }, req.body, { new: true, upsert: true});
        res.json(updated);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// POST - Update about us section with multiple image uploads
router.post("/companyprofile/section/aboutus", uploadImage.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
        // Set default values for about us section
        const website = 'compro';
        const section = 'aboutus';
        const { title, subtitle, description, buttonText } = req.body;
        
        // Build the section data
        const sectionData = {
            website,
            section,
            title,
            subtitle,
            description,
            buttonText
        };
        
        // Add background image file path if uploaded
        if (req.files && req.files['backgroundImage'] && req.files['backgroundImage'][0]) {
            sectionData.backgroundImage = `/uploads/${req.files['backgroundImage'][0].filename}`;
        }
        
        // Add image file path if uploaded
        if (req.files && req.files['image'] && req.files['image'][0]) {
            sectionData.image = `/uploads/${req.files['image'][0].filename}`;
        }
        
        const updated = await Section.findOneAndUpdate(
            { website, section }, 
            sectionData, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            success: true,
            section: 'aboutus',
            data: updated,
            message: 'About Us section updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('About Us update error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// GET about us section data
router.get("/companyprofile/section/aboutus", async (req, res) => {
    try {
        const data = await Section.findOne({
            website: 'compro',
            section: 'aboutus'
        });
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'About Us section not found',
                section: 'aboutus'
            });
        }
        
        res.status(200).json({
            success: true,
            section: 'aboutus',
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching about us section:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            section: 'aboutus'
        });
    }
});

// POST - Update whyus section with background image upload
router.post("/companyprofile/section/whyus", uploadImage.single('backgroundImageWhyus'), async (req, res) => {
    try {
        // Set default values for whyus section
        const website = 'compro';
        const section = 'whyus';
        // Debug logging
        console.log('=== WHYUS POST REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const { 
            subtitle, 
            title, 
            description, 
            whyus1Title, 
            whyus1Description,
            whyus2Title, 
            whyus2Description,
            whyus3Title, 
            whyus3Description 
        } = req.body || {};
        
        console.log('Extracted data:', {
            subtitle, title, description,
            whyus1Title, whyus1Description,
            whyus2Title, whyus2Description,
            whyus3Title, whyus3Description
        });
        
        // Validate required fields
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'Request body is empty or not properly parsed'
            });
        }
        
        // Build the section data
        const sectionData = {
            website,
            section,
            subtitle: subtitle || '',
            title: title || '',
            description: description || '',
            whyus1Title: whyus1Title || '',
            whyus1Description: whyus1Description || '',
            whyus2Title: whyus2Title || '',
            whyus2Description: whyus2Description || '',
            whyus3Title: whyus3Title || '',
            whyus3Description: whyus3Description || ''
        };
        
        // Add background image file path if uploaded
        if (req.file) {
            sectionData.backgroundImageWhyus = `/uploads/${req.file.filename}`;
        }
        
        const updated = await Section.findOneAndUpdate(
            { website, section }, 
            sectionData, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            success: true,
            section: 'whyus',
            data: updated,
            message: 'Why Us section updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Why Us update error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// GET whyus section data
router.get("/companyprofile/section/whyus", async (req, res) => {
    try {
        const data = await Section.findOne({
            website: 'compro',
            section: 'whyus'
        });
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Why Us section not found',
                section: 'whyus'
            });
        }
        
        res.status(200).json({
            success: true,
            section: 'whyus',
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching whyus section:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            section: 'whyus'
        });
    }
});

export default router;
