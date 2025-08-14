"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import NewsCard from "./NewsCard";
import Link from "next/link";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
};

const PAGE_SIZE = 6;

export default function AllNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const fetchNews = async (pageNumber: number, replace = false) => {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching news:", error);
    } else {
      if (replace) {
        setNews(data);
      } else {
        setNews((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  return (
    <section className="py-10 px-2 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Sve Vijesti
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {news.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="h-full flex">
            <NewsCard item={item} />
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-0 mx-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg h-auto"
            style={{
              lineHeight: "1.5",
              minHeight: "3rem",
              width: "fit-content",
            }}
          >
            {loading ? "Učitavanje..." : "Učitaj još"}
          </button>
        </div>
      )}
    </section>
  );
}
