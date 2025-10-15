"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const f1_1 = require("../scraper/f1");
const electric_1 = require("../scraper/electric");
const industry_1 = require("../scraper/industry");
const exclusive_1 = require("../scraper/exclusive");
const topgear_1 = require("../scraper/topgear");
const saveArticles_1 = require("../services/saveArticles");
const router = express_1.default.Router();
router.get("/scrape-all", async (req, res) => {
    try {
        console.log("🚀 Starting full scrape...");
        // Helper to safely run scrapers without crashing the whole job
        async function safeScrape(fn, label) {
            console.log(`🕵️‍♂️ Starting ${label} scraper...`);
            try {
                const data = await fn();
                console.log(`✅ ${label} scraped: ${data.length} articles`);
                return data;
            }
            catch (err) {
                console.error(`❌ ${label} scraper failed:`, err.message || err);
                return [];
            }
        }
        // Optional small delay to reduce load / rate limiting
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const scrapers = [
            { fn: f1_1.scrapeF1, name: "F1", category: "f1" },
            { fn: electric_1.scrapeElectric, name: "Electric", category: "electric" },
            { fn: industry_1.scrapeIndustry, name: "Industry", category: "industry" },
            { fn: exclusive_1.scrapeExclusive, name: "Exclusive", category: "exclusive" },
            { fn: topgear_1.scrapeTopGear, name: "TopGear", category: "reviews" },
        ];
        const allArticles = [];
        for (const { fn, name, category } of scrapers) {
            const articles = await safeScrape(fn, name);
            allArticles.push(...articles.map(a => ({ ...a, category })));
            // Add 2-second delay between scrapers
            await delay(2000);
        }
        console.log(`🧩 Total scraped: ${allArticles.length} articles from all categories`);
        await (0, saveArticles_1.saveArticles)(allArticles);
        res.json({
            success: true,
            message: `All categories scraped and saved successfully (${allArticles.length} total)`,
        });
    }
    catch (err) {
        console.error("❌ Error during scraping:", err);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
