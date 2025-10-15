"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const f1_1 = require("./scraper/f1");
const electric_1 = require("./scraper/electric");
const topgear_1 = require("./scraper/topgear");
const exclusive_1 = require("./scraper/exclusive");
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const scraperRoutes_1 = __importDefault(require("./routes/scraperRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const industry_1 = require("./scraper/industry");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 4000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // your Next.js frontend URL
    methods: ["GET", "POST"],
}));
mongoose_1.default.connect("mongodb://localhost:27017/sawalifauto")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Connection error:", err));
app.get("/f1", async (req, res) => {
    try {
        const articlessss = await (0, f1_1.scrapeF1)();
        res.json({ success: true, articlessss });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.get("/electric", async (req, res) => {
    try {
        const articlessss = await (0, electric_1.scrapeElectric)();
        res.json({ success: true, articlessss });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await (0, topgear_1.scrapeTopGear)();
        res.json({ success: true, reviews });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.get("/industry", async (req, res) => {
    try {
        const articlessss = await (0, industry_1.scrapeIndustry)();
        res.json({ success: true, articlessss });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.get("/top-gear", async (req, res) => {
    try {
        const articlessss = await (0, topgear_1.scrapeTopGear)();
        res.json({ success: true, articlessss });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.get("/exclusive", async (req, res) => {
    try {
        const articlessss = await (0, exclusive_1.scrapeExclusive)();
        res.json({ success: true, articlessss });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Scraping failed" });
    }
});
app.use("/api", scraperRoutes_1.default);
app.use("/api/articles", articleRoutes_1.default);
app.listen(PORT, () => {
    console.log(`✅ Scraper backend running on http://localhost:${PORT}`);
});
