import React from "react";
import Link from "next/link";
import { Article } from "@/types/types";
import ArticleCard from "@/components/Cards/ArticleCards";

export default function IndustrySection({ articles = [] }: { articles?: Article[] }) {
  // Handle empty or missing data
  if (!articles || articles.length === 0) {
    return (
      <section className="w-full mx-auto px-6 py-6 pb-20" id="industry">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">Industry & Business</h2>
          <p>No industry articles available.</p>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="w-full mx-auto px-6 py-6 pb-20" id="industry">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-right mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-white">
            <Link href="/articles/industry" className="hover:underline">
              Industry & Business
            </Link>
          </h2>
          <hr className="border-gray-400 bg-white w-full" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            {featuredArticle ? (
              <ArticleCard
                article={featuredArticle}
                category={featuredArticle.category ?? "industry"}
                variant="featured"
              />
            ) : (
              <p className="text-white">No featured article available.</p>
            )}
          </div>

          {/* Side Articles */}
          <div className="flex flex-col gap-6">
            {sideArticles.length > 0 ? (
              sideArticles.map((article, i) => (
                <ArticleCard
                  key={article.id || i}
                  article={article}
                  category={article.category ?? "industry"}
                  variant="compact"
                />
              ))
            ) : (
              <p className="text-white">No additional articles available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
