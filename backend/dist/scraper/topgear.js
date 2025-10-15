"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeTopGear = scrapeTopGear;
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = __importStar(require("cheerio"));
async function scrapeTopGear() {
    const browser = await puppeteer_1.default.launch({ headless: true });
    try {
        const page = await browser.newPage();
        const baseUrl = "https://www.topgear.com";
        const targetUrl = `${baseUrl}/car-reviews`;
        console.log("🌍 Visiting:", targetUrl);
        await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
        // Wait for the cards to load
        await page.waitForSelector("article[data-testid='DetailedCard']", { timeout: 20000 });
        const html = await page.content();
        const $ = cheerio.load(html);
        // ✅ Collect article links
        const links = [];
        $("article[data-testid='DetailedCard']").each((_, el) => {
            const href = $(el).find("a").attr("href");
            if (href && href.includes("/car-reviews")) {
                links.push(baseUrl + href);
            }
        });
        const uniqueLinks = [...new Set(links)];
        console.log("✅ Found", uniqueLinks.length, "article links");
        await page.close();
        const articles = [];
        // 🧠 Loop through each article link
        for (const [i, url] of uniqueLinks.slice(0, 6).entries()) {
            console.log(`📰 [${i + 1}/${uniqueLinks.length}] Scraping: ${url}`);
            const articlePage = await browser.newPage();
            try {
                await articlePage.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
                await articlePage.waitForSelector("h1[data-testid='Canon']", { timeout: 20000 });
                // ✅ Extract title & content directly from rendered DOM
                const { title, content, image } = await articlePage.evaluate(() => {
                    const titleEl = document.querySelector("h1[data-testid='Canon']");
                    const title = titleEl ? titleEl.textContent?.trim() || "" : "";
                    const paragraphs = Array.from(document.querySelectorAll("main p"))
                        .map(p => p.textContent?.trim() || "")
                        .filter(Boolean);
                    const content = paragraphs.join("\n\n");
                    const metaImg = document.querySelector("meta[property='og:image']")?.getAttribute("content") ||
                        document.querySelector("article img")?.getAttribute("src") ||
                        null;
                    return { title, content, image: metaImg };
                });
                if (title && content) {
                    console.log("✅ Saved article:", title);
                    articles.push({ title, url, content, image });
                }
                else {
                    console.log("⚠️ Skipped (missing title/content):", url);
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error(`❌ Error scraping ${url}:`, err.message);
                }
                else {
                    console.error(`❌ Unknown error scraping ${url}:`, err);
                }
            }
            finally {
                await articlePage.close();
            }
        }
        console.log("✅ Done. Scraped", articles.length, "articles total");
        return articles;
    }
    finally {
        await browser.close();
    }
}
