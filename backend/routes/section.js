import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import Section from "../models/section.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Debug route - list all available endpoints
router.get("/debug/routes", (req, res) => {
    res.json({
        message: "Available section routes",
        routes: [
            "GET /api/companyprofile/section/hero - Get hero section data",
            "POST /api/companyprofile/section/hero - Update hero section with file upload",
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

const upload = multer({ 
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

// POST - Update hero section with file upload
router.post("/companyprofile/section/hero", upload.single('backgroundVideo'), async (req, res) => {
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

export default router;
