import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { saveArticles } from "../services/saveArticles";

export async function scrapeIndustry(){
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    const targetUrl =
      "https://cleantechnica.com/category/cleantechnica-2/cleantechnica-reports/";
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("a[href^='https://cleantechnica.com/2025']", {
      timeout: 20000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const links: string[] = [];
    $("a[href^='https://cleantechnica.com/2025']").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/2025/")) links.push(href);
    });

    const uniqueLinks: string[] = [
      ...new Set(links.filter(link => !link.includes("#disqus_thread") && link.endsWith("/"))),
    ];
    console.log("✅ Found", uniqueLinks.length, "article links");

    await page.close();

    const articles: { title: string; url: string; content: string; image: string | null}[] = [];

    for (const [i, url] of uniqueLinks.slice(0,20).entries()){
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
      
          const paragraphs: string[] = [];
          $$("div.cm-post-content p").each((i, el) => {
            const text = $$(el).text().trim();
            if (text) paragraphs.push(text);
          });
          console.log("🧩 Paragraphs found:", paragraphs.length);
      
          const content = paragraphs.join("\n\n");
          const image =
            $$("meta[property='og:image']").attr("content") ||
            $$("article img").first().attr("src") ||
            null;
      
          if (title && content) {
            console.log("✅ Article OK:", title);
            articles.push({ title, url, content, image });
          } else {
            console.log("⚠️ Skipped (no content or title):", url);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(`❌ Error scraping ${url}:`, err.message);
          } else {
            console.error(`❌ Error scraping ${url}:`, err);
          }
        } finally {
          await articlePage.close();
        }
      }
      

    console.log("✅ Done. Scraped", articles.length, "articles");
    saveArticles(articles)
    return articles;


  } finally {
    await browser.close();
  }
}
