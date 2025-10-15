"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveArticles = saveArticles;
const ArticleModel_1 = require("../models/ArticleModel");
async function saveArticles(articles) {
    for (const article of articles) {
        try {
            await ArticleModel_1.ArticleModel.updateOne({ url: article.url }, { $set: article }, { upsert: true } // prevent duplicates
            );
        }
        catch (err) {
            console.error("Error saving article:", article.title, err);
        }
    }
    console.log(`✅ Saved ${articles.length} articles`);
}
