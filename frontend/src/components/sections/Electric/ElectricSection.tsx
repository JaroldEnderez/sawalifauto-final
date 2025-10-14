import React from "react";
import Link from "next/link";
import ArticleCard from "@/components/Cards/ArticleCards";
import type { Article } from "@/types/types";

export default function ElectricCarsSection({articles} : {articles:Article[]}) {
  return (
    <section className="w-full mx-auto px-6 py-6 pb-20" id="electric">
        <div className="max-w-6xl mx-auto content-center">
            <h2 className="text-2xl font-semibold mb-2 text-right text-white">
            <Link href="/articles/electric" className="hover:underline">
                Electric Cars
            </Link>
            </h2>
            <hr className="border-gray-400 mb-6 bg-white w-full" />

            {articles && articles.length >= 3 ? (
            <div className="flex gap-x-5 h-[60vh] text-right">
                {/* Left small card */}
                <div className="w-1/4">
                <ArticleCard
                    article={articles[0]}
                    category={articles[0].category ?? "electric"}
                    variant="default"
                />
                </div>

                {/* Middle wide card */}
                <div className="w-1/2">
                <ArticleCard
                    article={articles[1]}
                    category={articles[1].category ?? "electric"}
                    variant="featured"
                />
                </div>

                {/* Right small card */}
                <div className="w-1/4">
                <ArticleCard
                    article={articles[2]}
                    category={articles[2].category ?? "electric"}
                    variant="default"
                />
                </div>
            </div>
            ) : (
            <p className="text-center text-white mt-6">
                No electric car articles available.
            </p>
            )}
        </div>
        </section>

  );
}
