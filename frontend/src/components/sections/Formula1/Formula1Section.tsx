import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ArticleCard from "@/components/Cards/ArticleCards"; // adjust path as needed
import type { Article } from "@/types/types";

export default function FormulaOneSection({ articles }: { articles: Article[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full mx-auto px-6 py-6 pb-20" id="formulaOne">
    <div className="max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-right mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-white">
          <Link href="/articles/f1" className="hover:underline">
            Formula 1
          </Link>
        </h2>
        <hr className="border-gray-400 bg-white w-full mb-4" />
        <p className="text-white text-lg italic">
          Every Second Counts. Every Lap Tells a Story.
        </p>
      </div>

      {/* Article Grid */}
      <div
        className="
          grid gap-6 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4
        "
      >
        {articles.slice(0,8).map((article,i) => (
          <ArticleCard
            key={i}
            article={article}
            category={article.category ?? "f1"}
            variant="default"
          />
        ))}
      </div>
    </div>
  </section>
  );
}
