import Link from "next/link";
import ArticleCard from "@/components/Cards/ArticleCards";
import type { Article } from "@/types/types";

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  if (!articles || articles.length < 3) return null; // safety check

  return (
    <section className="w-full mx-auto px-6 py-6 pb-20" id="latest">
      <div className="max-w-6xl mx-auto content-center">
        <h2 className="text-2xl font-semibold mb-2 text-right text-white">
          <Link href="/articles/latest" className="hover:underline">
            Latest Articles
          </Link>
        </h2>
        <hr className="border-gray-400 mb-6 bg-white w-full" />

        <div className="flex gap-x-5 h-[60vh] text-right">
          <div className="w-1/4">
            <ArticleCard article={articles[0]} variant="default" category={articles[0].category} />
          </div>

          <div className="w-1/2">
            <ArticleCard article={articles[1]} variant="featured" category={articles[1].category} />
          </div>

          <div className="w-1/4">
            <ArticleCard article={articles[2]} variant="default" category={articles[2].category} />
          </div>
        </div>
      </div>
    </section>
  );
}
