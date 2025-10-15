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
exports.scrapeIndustry = scrapeIndustry;
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = __importStar(require("cheerio"));
const saveArticles_1 = require("../services/saveArticles");
async function scrapeIndustry() {
    const browser = await puppeteer_1.default.launch({ headless: true });
    try {
        const page = await browser.newPage();
        const targetUrl = "https://cleantechnica.com/category/cleantechnica-2/cleantechnica-reports/";
        await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
        await page.waitForSelector("a[href^='https://cleantechnica.com/2025']", {
            timeout: 20000,
        });
        const html = await page.content();
        const $ = cheerio.load(html);
        const links = [];
        $("a[href^='https://cleantechnica.com/2025']").each((i, el) => {
            const href = $(el).attr("href");
            if (href && href.includes("/2025/"))
                links.push(href);
        });
        const uniqueLinks = [
            ...new Set(links.filter(link => !link.includes("#disqus_thread") && link.endsWith("/"))),
        ];
        console.log("✅ Found", uniqueLinks.length, "article links");
        await page.close();
        const articles = [];
        for (const [i, url] of uniqueLinks.slice(0, 20).entries()) {
            console.log(`📰 [${i + 1}/${uniqueLinks.length}] Starting scrape for: ${url}`);
            const articlePage = await browser.newPage();
            try {
                console.log("🌐 Navigating to:", url);
                await articlePage.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 60000,
                });
                console.log("✅ Page loaded:", url);
                const articleHtml = await articlePage.content();
                const $$ = cheerio.load(articleHtml);
                const title = $$("h1.entry-title, h1").first().text().trim();
                console.log("🧠 Got title:", title);
                const paragraphs = [];
                $$("div.cm-post-content p").each((i, el) => {
                    const text = $$(el).text().trim();
                    if (text)
                        paragraphs.push(text);
                });
                console.log("🧩 Paragraphs found:", paragraphs.length);
                const content = paragraphs.join("\n\n");
                const image = $$("meta[property='og:image']").attr("content") ||
                    $$("article img").first().attr("src") ||
                    null;
                if (title && content) {
                    console.log("✅ Article OK:", title);
                    articles.push({ title, url, content, image });
                }
                else {
                    console.log("⚠️ Skipped (no content or title):", url);
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error(`❌ Error scraping ${url}:`, err.message);
                }
                else {
                    console.error(`❌ Error scraping ${url}:`, err);
                }
            }
            finally {
                await articlePage.close();
            }
        }
        console.log("✅ Done. Scraped", articles.length, "articles");
        (0, saveArticles_1.saveArticles)(articles);
        return articles;
    }
    finally {
        await browser.close();
    }
}
