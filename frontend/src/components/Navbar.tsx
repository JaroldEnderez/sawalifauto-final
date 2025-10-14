'use client'
import { Facebook, Twitter, Instagram, Youtube, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Navbar () {
    const pathname = usePathname(); // returns something like "/articles/f1"

    const categories = [
        { name: "Latest", slug: "latest" },
        { name: "Reviews", slug: "reviews" },
        { name: "Exclusive", slug: "exclusive" },
        { name: "Formula 1", slug: "f1" },
        { name: "Electric Cars", slug: "electric" },
        { name: "Industry and Business", slug: "industry" }
      ];
    return (
        <header className="bg-gray-900 text-white text-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-end gap-4 px-6 py-2">
            <a href="#" className="hover:text-blue-400"><Facebook size={24} /></a>
            <a href="#" className="hover:text-sky-400"><Twitter size={24} /></a>
            <a href="#" className="hover:text-pink-400"><Instagram size={24} /></a>
            <a href="#" className="hover:text-red-500 mr-8"><Youtube size={24} /></a>
            <Link href='/'>
                <h1 className="text-2xl font-bold text-white">Sawalifauto</h1>
            </Link>
            </div>
            <nav className="shadow-sm bg-gradient-to-r from-black via-gray-700 to-black">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="relative w-64">
                    <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
                    />
                    <input
                    type="text"
                    placeholder="Search..."
                    className="border-2 border-gray-300 px-10 py-2 text-white rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    />
                </div>
                
                <div className="flex w-full justify-between pl-6 ">
                    <ul className="flex w-full justify-between text-white text-lg list-none font-bold">
                        {categories.map((category) => {
                        const isActive = pathname === `/articles/${category.slug}`;

                        return (
                            <li key={category.slug}>
                            <Link
                                href={`/articles/${category.slug}`}
                                className={`transition-colors duration-200 ${
                                isActive
                                    ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                                    : "hover:text-blue-400"
                                }`}
                            >
                                {category.name}
                            </Link>
                            </li>
                        );
                        })}
                    </ul>
                </div>
                </div>
            </nav>
        </header>
        
    )
}