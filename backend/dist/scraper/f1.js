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
exports.scrapeF1 = scrapeF1;
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = __importStar(require("cheerio"));
async function scrapeF1() {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    // STEP 1: Go to the latest articles listing page
    await page.goto("https://www.formula1.com/en/latest", {
        waitUntil: "networkidle2",
        timeout: 60000,
    });
    // Wait until article links appear
    await page.waitForSelector("a[href^='/en/latest/article/']", { timeout: 15000 });
    // Get the page HTML
    const html = await page.content();
    const $ = cheerio.load(html);
    // Extract all links
    const links = [];
    $("a[href^='/en/latest/article/']").each((i, el) => {
        const href = $(el).attr("href");
        if (href)
            links.push("https://www.formula1.com" + href);
    });
    // Deduplicate (because same articles appear in multiple places on the page)
    const uniqueLinks = [...new Set(links)];
    // STEP 2: Visit each article page and scrape content
    const articles = [];
    for (const url of uniqueLinks.slice(0, 30)) { // limit to 5 for testing
        const articlePage = await browser.newPage();
        await articlePage.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
        const articleHtml = await articlePage.content();
        const $$ = cheerio.load(articleHtml);
        // Get article title
        const title = $$("h1").first().text().trim();
        // Get article body paragraphs
        const paragraphs = [];
        $$("div.f1rd-page.contents p").each((i, el) => {
            const text = $$(el).text().trim();
            if (text)
                paragraphs.push(text);
        });
        // Join into one big content string
        const content = paragraphs.join("\n\n");
        const image = $$("meta[property='og:image']").attr("content") ||
            $$("article img").first().attr("src") ||
            null;
        // Save result
        articles.push({ title, url, content, image });
        await articlePage.close();
    }
    await browser.close();
    return articles;
}
