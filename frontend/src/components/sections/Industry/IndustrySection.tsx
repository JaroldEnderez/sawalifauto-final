import React from "react";
import Link from "next/link";
import { Article } from "@/types/types";
import ArticleCard from "@/components/Cards/ArticleCards";

export default function IndustrySection({ articles }: { articles: Article[] }) {
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
          {/* Featured Article (large card) */}
          <div className="lg:col-span-2">
            <ArticleCard
              article={articles[0]}
              category={articles[0].category ?? "industry"}
              variant="featured"
            />
          </div>

          {/* Side Articles (2 stacked smaller cards) */}
          <div className="flex flex-col gap-6">
            {articles.slice(1, 3).map((article, i) => (
              <ArticleCard
                key={i}
                article={article}
                category={article.category ?? "industry"}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
