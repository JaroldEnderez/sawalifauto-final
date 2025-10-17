import axios from 'axios'
import * as cheerio from "cheerio";

export async function scrapeJalopnik() {

    const baseUrl = "https://www.jalopnik.com";
    const targetUrl = `${baseUrl}/category/reviews`;

    console.log("🌍 Visiting:", targetUrl);
    
    const {data:html} = await axios.get(targetUrl, {
        headers:{
            "User-Agent": "Mozilla/5.0 (Compatible; JalopnikScraper/1.0)"
        }
    })
    
    const $ = cheerio.load(html);

    // ✅ Collect article links
    const links: string[] = [];
    
    $("article.article-block").each((_, el) => {
        const element = $(el)
        const href = element.find("h3 a").attr("href");
        if (href) { 
            const fullUrl = href.startsWith("http") ? href : baseUrl + href
            links.push(fullUrl)
        }
    });

    const uniqueLinks : string[] = [...new Set(links)]
    console.log("Unique Links found: ", uniqueLinks.length)

    const articles: {
      title: string;
      url: string;
      content: string;
      image: string | null;
      author: string;
      timeStamp: string;
    }[] = [];

    // 🧠 Loop through each article link
    for (const [i, url] of links.slice(0, 10).entries()) {
        console.log(`📰 [${i + 1}/${links.length}] Scraping: ${url}`);
    
        try {
          const { data: articleHtml } = await axios.get(url);
          const $ = cheerio.load(articleHtml);
    
          const title = $("h1").first().text().trim();
    
          const paragraphs = $("article p")
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(Boolean);
    
          const content = paragraphs.join("\n\n");
    
          const image =
            $("meta[property='og:image']").attr("content") ||
            $("article img").first().attr("src") ||
            null;
            
            const author = $("a[href^='/author").text().trim()
            const timeEl = $("time");
            const datetime = timeEl.attr("datetime");  // → "2025-09-30T23:42:39+00:00"
            const readable = timeEl.text().trim(); 
            const timeStamp = readable

          if (title && content) {
            console.log("✅ Saved:", title);
            articles.push({ title, url, content, image, author, timeStamp });
          } else {
            console.log("⚠️ Skipped:", url);
          }
        } catch (err) {
          console.error("❌ Error:", err.message);
        }
      }
      console.log("✅ Done scraping all articles");
      return articles;
}

scrapeJalopnik()
