import Image from "next/image";
import Link from "next/link";
import BlackCar from "../../images/black-car.jpg";
import { Article } from "../../types/types";

// Utility: safe slug creation
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // spaces -> dashes
}

type ArticleCardProps = {
  article?: Article; // now optional — avoids runtime crashes
  category?: string;
  variant?: "default" | "compact" | "featured";
};

export default function ArticleCard({
  article,
  category,
  variant = "default",
}: ArticleCardProps) {
  // 🔒 Safety first: handle missing article
  if (!article) {
    return (
      <div className="border rounded p-4 text-gray-500 bg-gray-900 text-center">
        No article data
      </div>
    );
  }

  const slug = slugify(article.title || "untitled");
  const displayCategory =
    category ||
    article.category ||
    "uncategorized"; // fallback category if missing

  const base =
    "border rounded shadow hover:shadow-lg transition text-right cursor-pointer h-full overflow-hidden";

  const handleClick = () => {
    try {
      localStorage.setItem("selectedArticle", JSON.stringify(article));
    } catch (err) {
      console.error("Failed to cache article:", err);
    }
  };

  const imageSrc = article.image || BlackCar;
  const displayTitle = article.title || "Untitled Article";
  const displaySummary = article.summary || "No summary available.";

  // 🟦 FEATURED layout
  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${displayCategory}/${slug}`}
        className={`${base} p-4 bg-gray-900 text-white flex flex-col`}
        onClick={handleClick}
      >
        <Image
          src={imageSrc}
          alt={displayTitle}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2 line-clamp-2">{displayTitle}</h2>
        <p className="text-gray-300 mb-3 line-clamp-3">{displaySummary}</p>
        <span className="text-blue-400 hover:underline capitalize">
          {displayCategory}
        </span>
      </Link>
    );
  }

  // 🟩 COMPACT layout
  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${displayCategory}/${slug}`}
        className={`${base} flex items-center gap-3 p-2 bg-black text-white`}
        onClick={handleClick}
      >
        <Image
          src={imageSrc}
          alt={displayTitle}
          width={100}
          height={100}
          className="w-24 h-24 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-md mb-1 line-clamp-2">
            {displayTitle}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2">{displaySummary}</p>
          <span className="text-blue-400 hover:underline capitalize">
            {displayCategory}
          </span>
        </div>
      </Link>
    );
  }

  // 🟥 DEFAULT layout
  return (
    <Link
      href={`/articles/${displayCategory}/${slug}`}
      className={`${base} p-3 bg-black text-white`}
      onClick={handleClick}
    >
      <Image
        src={imageSrc}
        alt={displayTitle}
        width={400}
        height={200}
        className="w-full h-48 object-cover rounded mb-3"
      />
      <h2 className="text-xl font-bold mb-2 line-clamp-2">{displayTitle}</h2>
      <p className="text-gray-300 mb-2 line-clamp-3">{displaySummary}</p>
      <span className="text-blue-400 hover:underline capitalize">
        {displayCategory}
      </span>
    </Link>
  );
}
