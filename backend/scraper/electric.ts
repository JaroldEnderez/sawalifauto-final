import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function scrapeElectric() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://electrek.co/", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  const html = await page.content();
  const $ = cheerio.load(html);

  
  // Matches hrefs like /2025/10/02/... or /2025/09/30/...
  const links: string[] = [];

// 1️⃣ Collect all links from Electrek article listings
$("a[href^='https://electrek.co/2025/']").each((i, el) => {
  let href = $(el).attr("href");
  if (!href) return;

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
    console.log("URL: ", url)
    const articleHtml = await articlePage.content();
    const $$ = cheerio.load(articleHtml);

    const title = $$("h1").first().text().trim();
    const image =
      $$("meta[property='og:image']").attr("content") ||
      $$("article img").first().attr("src") ||
      null;

    const paragraphs: string[] = [];
    $$("p").each((i, el) => {
      const text = $$(el).text().trim();
      if (text) paragraphs.push(text);
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
