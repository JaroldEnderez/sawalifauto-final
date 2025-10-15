"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: String,
    publishedAt: String,
    image: String,
    summary: String,
    url: { type: String, unique: true },
    category: String,
    author: String,
    source: String
});
exports.ArticleModel = mongoose_1.default.model("Article", articleSchema);
