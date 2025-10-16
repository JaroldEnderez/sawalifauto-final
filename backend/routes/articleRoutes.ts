import express from 'express'
import { ArticleModel } from '../models/ArticleModel'
import mongoose from 'mongoose';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
      const { category } = req.query
      const query = category ? { category } : {}
      console.log("Incoming request:", req.query);
      console.log("Mongo connected:", mongoose.connection.readyState); // 1 = connected
      const articles = await ArticleModel.find(query).sort({ publishedAt: -1 });
      console.log("Articles found:", articles.length);
      res.json({ success: true, articles });
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  

export default router