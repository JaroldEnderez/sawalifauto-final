"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ArticleModel_1 = require("../models/ArticleModel");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const articles = await ArticleModel_1.ArticleModel.find(query).sort({ publishedAt: -1 });
        res.json({ success: true, articles });
    }
    catch (error) {
        console.error("❌ Error fetching articles: ", error);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
});
exports.default = router;
