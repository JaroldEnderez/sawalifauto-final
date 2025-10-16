import express from "express";
import { scrapeF1 } from "./scraper/f1";
import { scrapeElectric } from "./scraper/electric";
import { scrapeTopGear } from "./scraper/topgear";
import { scrapeExclusive } from "./scraper/exclusive";
import articleRoutes from './routes/articleRoutes'
import scraperRoutes from './routes/scraperRoutes'
import mongoose from "mongoose";
import { scrapeIndustry } from "./scraper/industry";
import cors from "cors";
const app = express();
const PORT = 4000;
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",                        // local dev frontend
  "https://sawalifauto-final.vercel.app",         // ✅ your Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//mongodb+srv://<jarold>:<>@cluster0.clore3k.mongodb.net/
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

app.get("/f1", async (req, res) => { 
  try {
    const articlessss = await scrapeF1();
    res.json({ success: true, articlessss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.get("/electric", async (req, res) => {
  try {
    const articlessss = await scrapeElectric();
    res.json({ success: true, articlessss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const reviews = await scrapeTopGear();
    res.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.get("/industry", async (req, res) => {
  try {
    const articlessss = await scrapeIndustry();
    res.json({ success: true, articlessss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.get("/top-gear", async (req, res) => {
  try {
    const articlessss = await scrapeTopGear();
    res.json({ success: true, articlessss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.get("/exclusive", async (req, res) => {
  try {
    const articlessss = await scrapeExclusive();
    res.json({ success: true, articlessss });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.use("/api", scraperRoutes);
app.use("/api/articles", articleRoutes)

app.listen(PORT, () => {
  console.log(`✅ Scraper backend running on http://localhost:${PORT}`);
});
