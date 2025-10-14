import express, { Request, Response } from "express";
import { scrapeF1 } from "../scraper/f1";
import { scrapeElectric } from "../scraper/electric";
import { scrapeIndustry } from "../scraper/industry";
import { scrapeExclusive } from "../scraper/exclusive";
import { scrapeTopGear } from "../scraper/topgear";
import { saveArticles } from "../services/saveArticles";
import type { Article } from "../types/article";

const router = express.Router();

router.get("/scrape-all", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🚀 Starting full scrape...");

    // Helper to safely run scrapers without crashing the whole job
    async function safeScrape(fn: () => Promise<Article[]>, label: string): Promise<Article[]> {
      console.log(`🕵️‍♂️ Starting ${label} scraper...`);
      try {
        const data = await fn();
        console.log(`✅ ${label} scraped: ${data.length} articles`);
        return data;
      } catch (err: any) {
        console.error(`❌ ${label} scraper failed:`, err.message || err);
        return [];
      }
    }

    // Optional small delay to reduce load / rate limiting
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const scrapers = [
      { fn: scrapeF1, name: "F1", category: "f1" },
      { fn: scrapeElectric, name: "Electric", category: "electric" },
      { fn: scrapeIndustry, name: "Industry", category: "industry" },
      { fn: scrapeExclusive, name: "Exclusive", category: "exclusive" },
      { fn: scrapeTopGear, name: "TopGear", category: "reviews" },
    ];

    const allArticles: Article[] = [];

    for (const { fn, name, category } of scrapers) {
      const articles = await safeScrape(fn, name);
      allArticles.push(...articles.map(a => ({ ...a, category })));

      // Add 2-second delay between scrapers
      await delay(2000);
    }

    console.log(`🧩 Total scraped: ${allArticles.length} articles from all categories`);

    await saveArticles(allArticles);

    res.json({
      success: true,
      message: `All categories scraped and saved successfully (${allArticles.length} total)`,
    });
  } catch (err: any) {
    console.error("❌ Error during scraping:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
