import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function scrapeExclusive() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const baseUrl = "https://www.thedrive.com";
    const targetUrl = `${baseUrl}/features`;

    console.log("🌍 Visiting:", targetUrl);
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for React to render the cards
    await page.waitForSelector(".card-post.category-archive-post", { timeout: 30000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    // ✅ Collect article links
    const links: string[] = [];
    $(".card-post.category-archive-post a.card-post-image-link").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("https://www.thedrive.com/news")) {
        links.push(href);
      }
    });

    const uniqueLinks = [...new Set(links)];
    console.log("✅ Found", uniqueLinks.length, "article links");

    await page.close();

    const articles: {
      title: string;
      url: string;
      content: string;
      image: string | null;
    }[] = [];

    // 🧠 Loop through each article link
    for (const [i, url] of uniqueLinks.slice(0, 6).entries()) {
      console.log(`📰 [${i + 1}/${uniqueLinks.length}] Scraping: ${url}`);

      const articlePage = await browser.newPage();

      try {
        await articlePage.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        await articlePage.waitForSelector("h1", { timeout: 20000 });

        // ✅ Extract title, paragraphs, and image
        const { title, content, image } = await articlePage.evaluate(() => {
          const title = document.querySelector("h1")?.textContent?.trim() || "";

          const paragraphs = Array.from(document.querySelectorAll("article p"))
            .map(p => p.textContent?.trim() || "")
            .filter(Boolean);
          const content = paragraphs.join("\n\n");

          const metaImg =
            document.querySelector("meta[property='og:image']")?.getAttribute("content") ||
            document.querySelector("article img")?.getAttribute("src") ||
            null;

          return { title, content, image: metaImg };
        });

        if (title && content) {
          console.log("✅ Saved article:", title);
          articles.push({ title, url, content, image });
        } else {
          console.log("⚠️ Skipped (missing title/content):", url);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`❌ Error scraping ${url}:`, err.message);
        } else {
          console.error(`❌ Unknown error scraping ${url}:`, err);
        }
      } finally {
        await articlePage.close();
      }
    }

    console.log("✅ Done. Scraped", articles.length, "articles total");
    return articles;
  } finally {
    await browser.close();
  }
}
