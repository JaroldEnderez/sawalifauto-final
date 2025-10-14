"use client";
import { use } from "react"; // 👈 new React hook
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Article } from "@/types/types";
import type { ArticlesResponse } from "@/types/api";
import ArticleCard from "@/components/Cards/ArticleCards";
import Link from "next/link";


export default function ArticleClientPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  // 👇 unwrap the promise using the new React API
  const { category, slug } = use(params);
  const [isLoading, setIsLoading] = useState(true); // 👈 add loading state
  const [article, setArticle] = useState<Article | null>(null);
   const [f1Articles, setF1Articles] = useState<Article[]>([])
  
  useEffect(() => {
    const stored = localStorage.getItem("selectedArticle");
    if (stored) setArticle(JSON.parse(stored));
    setIsLoading(false)
  }, [category, slug]);

  useEffect(()=> {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?category=${category}`)
    .then(res => res.json() as Promise<ArticlesResponse>)
    .then(data => {
        if (data.success) {
            setF1Articles(data.articles);
        }
    })
    .finally(() => setIsLoading(false))
    }, [category])

  const paragraphs = article?.content?.split(/\.\s{1,}/g);

  console.log("Params:", { category, slug });
  console.log("Article:", article);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading article...</div>;
  
  if (!article) return notFound();
  const filtered = f1Articles.filter(a => a.title !== article.title)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      <div className="w-fit p-4 pr-0">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="h-1 bg-[#00AEEF] mt-1"></div>
        <div className="h-1 bg-[#8DC63F] mt-1 ml-auto"></div>
      </div>
      <p className="text-sm text-white mb-6">
        {article.publishedAt ?? "Published recently" + "  "} 
         • 
         <Link
            href={`/articles/${category}`}
            className="text-blue-400 hover:underline hover:text-blue-300 transition"
          >
            {category === "f1"
              ? "Latest on Formula One"
              : category === "electric"
              ? "Latest about Electric Cars"
              : category === "reviews"
              ? "In-depth Automotive Reviews"
              : category === "industry"
              ? "Latest on the Automotive Industry and Business"
              : category === "exclusive"
              ? "Exclusive Features"
              : ""}
          </Link>
      </p>
      <img src={article.image} alt={article.title} className="rounded-lg shadow mb-6" />
      <article className="prose max-w-none">
        <div className="flex items-start gap-8">
          {/* Main Content */}
          <div className="w-3/4 leading-8 text-gray-200">
            {paragraphs?.map((p, i) => (
              <p key={i} className="mb-6">{p}.</p>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-1/4 flex flex-col gap-y-4 sticky top-24">
            <h1 className="text-3xl font-bold">More Articles</h1>
            {filtered.map((a, i) => (
              <ArticleCard
                key={i}
                article={a}
                variant="default"
                category={category}
              />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
