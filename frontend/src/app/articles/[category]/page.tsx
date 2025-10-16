'use client'

import ArticleCard from "@/components/Cards/ArticleCards";
import type { Article } from "@/types/types";
import { useEffect, useState, use } from "react";
import type { ArticlesResponse } from "@/types/api";


  
//   const dummyArticles: Record<string, Article[]> = {
//     latest: [
//       { title: "TopGear Review 1", summary: "This is a summary of review 1.", url: "#" },
//       { title: "TopGear Review 2", summary: "This is a summary of review 2.", url: "#" },
//     ],
//     exclusive: [
//       { title: "Car & Driver Review 1", summary: "Summary for C&D review 1.", url: "#" },
//       { title: "Car & Driver Review 2", summary: "Summary for C&D review 2.", url: "#" },
//     ],
//     reviews: [
//       { title: "Edmunds Review 1", summary: "Summary of Edmunds review 1.", url: "#" },
//     ],
//   };

  export default function ArticleListPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const [f1Articles, setF1Articles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
   
    useEffect(()=> {
        const url = 
            category === 'latest'
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/articles`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/articles?category=${category}`
        fetch(url)
        .then(res => res.json() as Promise<ArticlesResponse>)
        .then(data => {
            if (data.success) {
                setF1Articles(data.articles);
            }
        })
        
        .finally(() => setLoading(false))
    }, [category])
    
    console.log("Params: ", category)
    console.log("Articles: ", f1Articles)
    
    if (loading) return <p className="p-4">Loading {category.charAt(0).toUpperCase() + category.slice(1)} articles...</p>;

    return (
      <main className="">
        <div className="my-10 flex flex-col w-full max-w-6xl mx-auto" dir="rtl">
            <h1 className="text-2xl text-right font-bold mb-6 capitalize">
                {(category ==='f1') ? 'Latest on Formula One' : 
                 (category === 'electric') ? 'Latest about Electric Cars': 
                 (category === 'reviews')? 'In-depth Automotive Reviews' :
                 (category === 'industry')? 'Latest on the Automotive Industry and Business': 
                 (category === 'exclusive')? 'Exclusive Feautures': 'Latest Articles'
                }
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Featured */}
                {f1Articles[0] && (
                    <div className="md:col-span-2">
                    <ArticleCard article={f1Articles[0]} variant="featured" category={category}/>
                    </div>
                )}

                {/* One small next to featured */}
                {f1Articles[1] && (
                    <ArticleCard article={f1Articles[1]} variant="default"  category={category} />
                )}

                {/* Next 3 */}
                {f1Articles.slice(2, 5).map((a, i) => (
                    <ArticleCard key={`top-${i}`} article={a} variant="compact" category={category} />
                ))}
                </div>
        </div>
        
        <div className="bg-gray-800 w-screen h-24 flex justify-center items-center"><h1>Section block</h1></div>
        <div className="my-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column with light background */}
            <div className="bg-blue-900 p-6 rounded-lg flex flex-col gap-y-4">
                {f1Articles.slice(5, 10).map((a, i) => (
                    <ArticleCard key={`top-${i}`} article={a} variant="compact" category={category} />
                ))}
            </div>

            {/* Right column with no background */}
            <div className="p-6 rounded-lg flex flex-col gap-y-4">
                {f1Articles.slice(10, 15).map((a, i) => (
                    <ArticleCard key={`top-${i}`} article={a} variant="compact" category={category} />
                ))}
            </div>
        </div>

            <div className="my-10 w-full max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-right">More Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {f1Articles.slice(15, 35).map((a, i) => (
                        <ArticleCard key={`top-${i}`} article={a} variant="compact" category={category} />
                    ))}
                </div>
            </div>


      </main>
    );
  }
  