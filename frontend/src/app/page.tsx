"use client"
import { Search } from "lucide-react"; 
import { Formula1Section, ElectricSection, IndustrySection } from '@/components/sections'
import Car from '../images/Car.jpg'
import Image from "next/image";
import BackToTopButton from "@/components/buttons/BackToTopButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/types/types";
import ArticleCard from "@/components/Cards/ArticleCards";


export default function Home() {
  const [f1Articles, setF1Articles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setF1Articles(data.articles);
      })
      .catch(err => console.error("Failed to fetch:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const reviewArticles = f1Articles.filter(
    (a) => a.category === 'reviews'
  )

  const formulaOneArticles = f1Articles.filter(
    (a) => a.category === 'f1'
  )

  const industryArticles = f1Articles.filter(
    (a) => a.category === 'industry'
  )
  const electricArticles = f1Articles.filter(
    (a) => a.category === 'electric'
  )

  const exclusiveArticles = f1Articles.filter(
    (a) => a.category === 'electric'
  )
  

  const categories = [
    { name: "Latest", slug: "latest" },
    { name: "Reviews", slug: "reviews" },
    { name: "Exclusive", slug: "exclusive" },
    { name: "Formula 1", slug: "formulaOne" },
    { name: "Electric Cars", slug: "electric" },
    { name: "Industry and Business", slug: "industry" }
  ];
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading article...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pb-20 ">
      <BackToTopButton/>
      

      {/* 🔹 Hero Section */}
      <section className="relative h-screen shadow-sm bg-black">
        {/* Sticky wrapper */}
        <div className="sticky top-0 h-screen w-full text-white">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={Car}
              alt="Car"
              fill
              className="object-cover object-[50%_80%]"
              unoptimized
            />

            {/* Bottom-only inset shadow */}
            <div className="absolute inset-0 [box-shadow:inset_0_-120px_80px_rgba(0,0,0,0.8)] pointer-events-none"></div>

            {/* Text overlay */}
            <div className="absolute top-10 right-0 text-center flex flex-col gap-y-4 px-6">
              <h1 className="text-6xl font-bold [text-shadow:2px_2px_6px_rgba(0,0,0,1)]">
                Auto Reviews
              </h1>
              <p className="text-2xl [text-shadow:2px_2px_6px_rgba(0,0,0,1)]">
                Latest car reviews scraped and translated for you.
              </p>
            </div>
          </div>
        </div>
      </section>


     {/* 📰 Articles Section */}
      <section className="w-full mx-auto px-6 py-6 pb-20" id="latest">
        <div className="max-w-6xl mx-auto content-center">
          <h2 className="text-2xl font-semibold mb-2 text-right text-white">
            <Link href="/articles/latest" className="hover:underline">
              Latest Articles
            </Link>
          </h2>
          <hr className="border-gray-400 mb-6 bg-white w-full" />

          {/* Prevent crash if API is empty */}
          {f1Articles.length >= 3 ? (
            <div className="flex gap-x-5 h-[60vh] text-right">
              <div className="w-1/4">
                <ArticleCard
                  article={f1Articles[0]}
                  variant="default"
                  category={f1Articles[0]?.category ?? "f1"}
                />
              </div>

              <div className="w-1/2">
                <ArticleCard
                  article={f1Articles[1]}
                  variant="featured"
                  category={f1Articles[1]?.category ?? "f1"}
                />
              </div>

              <div className="w-1/4">
                <ArticleCard
                  article={f1Articles[2]}
                  variant="default"
                  category={f1Articles[2]?.category ?? "f1"}
                />
              </div>
            </div>
          ) : (
            <p className="text-white text-center py-10">No latest articles available.</p>
          )}
        </div>
      </section>

      {/* 🎥 Reviews Section */}
      <section className="max-w-6xl mx-auto px-6 py-6 pb-20" id="reviews">
        <h2 className="text-2xl font-semibold mb-2 text-right text-white">
          <Link href="/articles/reviews" className="hover:underline">
            In-Depth Automotive Video Reviews
          </Link>
        </h2>

        {reviewArticles.length > 0 ? (
          <div className="flex gap-x-5">
            {/* LEFT SIDE */}
            <div className="w-1/2 flex flex-col gap-5">
              <hr className="border-gray-400 bg-white w-full" />
              {reviewArticles.slice(0, 3).map((article, i) => (
                <ArticleCard
                  key={i}
                  article={article}
                  category={article.category ?? "reviews"}
                  variant="compact"
                />
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 text-right">
              <hr className="border-gray-400 mb-4 bg-white w-full" />
              {reviewArticles[3] ? (
                <ArticleCard
                  article={reviewArticles[3]}
                  category={reviewArticles[3]?.category ?? "reviews"}
                  variant="featured"
                />
              ) : (
                <p className="text-white text-center">More reviews coming soon!</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-white text-center py-10">No reviews available yet.</p>
        )}
      </section>

      {/* 🔒 Exclusive Section */}
      <section className="w-full mx-auto px-6 py-6 pb-20" id="exclusive">
        <div className="max-w-6xl mx-auto content-center">
          <h2 className="text-2xl font-semibold mb-2 text-right text-white">
            <Link href="/articles/exclusive" className="hover:underline">
              Exclusive
            </Link>
          </h2>

          <hr className="border-gray-400 bg-white w-full mb-6" />

          {exclusiveArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {exclusiveArticles.slice(0, 6).map((article, i) => (
                <ArticleCard
                  key={article.id || i}
                  article={article}
                  category={article.category ?? "exclusive"}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <p className="text-white col-span-3 text-center">
              No exclusive articles available.
            </p>
          )}
        </div>
      </section>


      <Formula1Section articles={formulaOneArticles}/>
      <ElectricSection articles={electricArticles}/>
      <IndustrySection articles={industryArticles}/>
    </main>
  );
}
