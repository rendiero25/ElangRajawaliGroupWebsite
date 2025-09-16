import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
const app = express();

app.use(express.json());

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

//Routes
import sectionRoutes from "./routes/section.js";
import newsRoutes from "./routes/news.js";

app.use("/api/sections", sectionRoutes);
app.use("/api/news", newsRoutes);


//MongoDB Connect
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => {
        console.log(err);
    });