import Image from "next/image";
import BlackCar from "../../images/black-car.jpg";
import Link from "next/link";
import { Article } from "../../types/types";

// force rebuild
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // spaces -> dashes
}

export default function ArticleCard({
  article,
  category,
  variant = "default",
}: {
  article: Article;
  category?: string;
  variant?: "default" | "compact" | "featured";
}) {
  const base =
    "border rounded shadow hover:shadow-lg transition text-right cursor-pointer h-full";
  if (!article) return null;

  const slug = slugify(article.title);

  if (variant === "featured") {
    return (
      <Link href={`/articles/${category}/${slug}`} 
          className={`${base} p-4 bg-gray-900 text-white flex flex-col`}
          onClick={()=> {localStorage.setItem("selectedArticle", JSON.stringify(article))}}>
          <Image
            src={article.image || BlackCar} 
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="text-gray-300 mb-2">{article.summary}</p>
          <span className="text-blue-500 hover:underline">
            {article.category
              ? article.category.charAt(0).toUpperCase() + article.category.slice(1)
              : "Uncategorized"}
          </span>

      </Link>
    );
  }

  // Compact Layout (small thumbnail + short text)
  if (variant === "compact") {
    return (
      <Link href={`/articles/${category}/${slug}`} 
          className={`${base} flex items-center gap-3 p-2 bg-black`}
          onClick={()=> {localStorage.setItem("selectedArticle", JSON.stringify(article))}}
          >
          <Image
            src={article.image || BlackCar}
            alt={article.title}
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-md mb-1">{article.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {article.summary}
            </p>
            <span className="text-blue-500 hover:underline">
              {article.category
            ? article.category.charAt(0).toUpperCase() + article.category.slice(1)
            : "Uncategorized"}
            </span>
            </div>
      </Link>
    );
  }

  // Default Layout
  return (
    <Link href={`/articles/${category}/${slug}`} className={`${base} p-2 bg-black`}
        onClick={()=> {localStorage.setItem("selectedArticle", JSON.stringify(article))}}
    >
        <Image
          src={article.image || BlackCar}
          alt={article.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <p className="text-white/90 mb-2">{article.summary}</p>
        <span className="text-blue-500 hover:underline">
          {article.category
            ? article.category.charAt(0).toUpperCase() + article.category.slice(1)
            : "Uncategorized"}
        </span>      
    </Link>
  );
}
