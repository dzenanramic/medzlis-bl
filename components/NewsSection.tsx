import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import NewsCard from "./NewsCard";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
};

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false })
        .limit(3);

      if (error) console.error("Error fetching news:", error);
      else setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-3 text-gray-900">
          Najnovije Vijesti
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          Pratite najnovije dešavanja i aktivnosti u našoj zajednici
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {news.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <NewsCard item={item} />
          </Link>
        ))}
      </div>

      <Link
        href="/news"
        className="mt-10 mx-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg h-auto"
        style={{ lineHeight: "1.5", minHeight: "3rem", width: "fit-content" }}
      >
        Prikaži više vijesti
      </Link>
    </section>
  );
}
