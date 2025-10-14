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

app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend URL
  methods: ["GET", "POST"],
}));
mongoose.connect("mongodb://localhost:27017/sawalifauto")
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
