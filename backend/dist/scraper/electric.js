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
exports.scrapeElectric = scrapeElectric;
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio = __importStar(require("cheerio"));
async function scrapeElectric() {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://electrek.co/", {
        waitUntil: "networkidle2",
        timeout: 60000,
    });
    const html = await page.content();
    const $ = cheerio.load(html);
    // Matches hrefs like /2025/10/02/... or /2025/09/30/...
    const links = [];
    // 1️⃣ Collect all links from Electrek article listings
    $("a[href^='https://electrek.co/2025/']").each((i, el) => {
        let href = $(el).attr("href");
        if (!href)
            return;
        // Ensure full absolute URL
        let url = href.startsWith("http") ? href : "https://electrek.co" + href;
        // 2️⃣ Clean the URL: remove ?query and #fragments
        url = url.split("?")[0].split("#")[0];
        // 3️⃣ Match only valid article structure
        if (url.match(/^https:\/\/electrek\.co\/\d{4}\/\d{2}\/\d{2}\//)) {
            links.push(url);
        }
    });
    // 4️⃣ Deduplicate after cleaning
    const uniqueLinks = [...new Set(links)];
    console.log(`Found ${uniqueLinks.length} unique article links`);
    uniqueLinks.forEach((url) => console.log("URL:", url));
    const articles = [];
    for (const url of uniqueLinks.slice(0, 20)) { // limit to 5 for testing
        const articlePage = await browser.newPage();
        await articlePage.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
        console.log("URL: ", url);
        const articleHtml = await articlePage.content();
        const $$ = cheerio.load(articleHtml);
        const title = $$("h1").first().text().trim();
        const image = $$("meta[property='og:image']").attr("content") ||
            $$("article img").first().attr("src") ||
            null;
        const paragraphs = [];
        $$("p").each((i, el) => {
            const text = $$(el).text().trim();
            if (text)
                paragraphs.push(text);
        });
        articles.push({
            title,
            url,
            image: image || undefined, // 👈 instead of null
            content: paragraphs.join("\n\n"),
        });
        await articlePage.close();
    }
    await browser.close();
    return articles;
}
