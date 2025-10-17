import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: String,
    publishedAt: String,
    image: String,
    summary: String,
    url: {type:String, unique: true},
    category: String,
    author: String,
    source: String
})

export const ArticleModel = mongoose.model("Article", articleSchema, "Sawalifauto");
