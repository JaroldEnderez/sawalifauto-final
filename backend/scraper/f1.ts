import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function scrapeF1() {
  const browser = await puppeteer.launch({ headless: true });
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
  const links: string[] = [];
  $("a[href^='/en/latest/article/']").each((i, el) => {
    const href = $(el).attr("href");
    if (href) links.push("https://www.formula1.com" + href);
  });

  // Deduplicate (because same articles appear in multiple places on the page)
  const uniqueLinks = [...new Set(links)];

  // STEP 2: Visit each article page and scrape content
  const articles: { title: string; url: string; content: string; image: string | null}[] = [];

  for (const url of uniqueLinks.slice(0, 30)) { // limit to 5 for testing
    const articlePage = await browser.newPage();
    await articlePage.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

    const articleHtml = await articlePage.content();
    const $$ = cheerio.load(articleHtml);

    // Get article title
    const title = $$("h1").first().text().trim();

    // Get article body paragraphs
    const paragraphs: string[] = [];
    $$("div.f1rd-page.contents p").each((i, el) => {
      const text = $$(el).text().trim();
      if (text) paragraphs.push(text);
    });

    // Join into one big content string
    const content = paragraphs.join("\n\n");
    const image =
      $$("meta[property='og:image']").attr("content") ||
      $$("article img").first().attr("src") ||
      null;
    // Save result
    articles.push({ title, url, content, image});

    await articlePage.close();
  }

  await browser.close();
  return articles;
}
