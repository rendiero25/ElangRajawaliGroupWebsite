import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        console.log('📋 Request body:', req.body);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route root
app.get("/", (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>ERG Backend</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #2c3e50;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Hello World!</h1>
                    <p>Backend server is running successfully!</p>
                </div>
            </body>
        </html>
    `);
});

//Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
import sectionRoutes from "./routes/section.js";
import newsRoutes from "./routes/news.js";

app.use("/api", sectionRoutes);
app.use("/api/news", newsRoutes);

// Global error handler
app.use((error, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'File upload error',
            details: error.message
        });
    }
    
    res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

//MongoDB Connect
console.log("=== STARTING SERVER ===");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("NODE_ENV:", process.env.NODE_ENV || "development");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB");
        console.log("📊 Database:", mongoose.connection.name);
        console.log("🔗 Connection state:", mongoose.connection.readyState);
        
        app.listen(5000, () => {
            console.log("🚀 Server running on http://localhost:5000");
            console.log("📚 Available endpoints:");
            console.log("   - GET  /api/news (get all news)");
            console.log("   - POST /api/news/simple (create news)");
            console.log("   - POST /api/news/test (test endpoint)");
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:");
        console.error(err.message);
        process.exit(1);
    });