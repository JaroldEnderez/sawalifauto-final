import { ArticleModel } from "../models/ArticleModel";
import { Article } from "../types/article";

export async function saveArticles(articles: Article[]) {
  for (const article of articles) {
    try {
      await ArticleModel.updateOne(
        { url: article.url },
        { $set: article },
        { upsert: true } // prevent duplicates
      );
    } catch (err) {
      console.error("Error saving article:", article.title, err);
    }
  }
  console.log(`✅ Saved ${articles.length} articles`);
}
