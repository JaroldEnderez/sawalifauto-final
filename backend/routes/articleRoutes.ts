import express from 'express'
import { ArticleModel } from '../models/ArticleModel'

const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const {category} = req.query
        const query = category ? { category } : {}
        const articles = await ArticleModel.find(query).sort({publishedAt: -1})
        res.json({success:true, articles})
    }catch(error){
        console.error("❌ Error fetching articles: ", error)
        res.status(500).json({error: "Failed to fetch articles"})
    }
})

export default router