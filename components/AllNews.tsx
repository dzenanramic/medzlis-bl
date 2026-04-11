"use client";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import NewsCard from "./NewsCard";
import Link from "next/link";
import { DisplayNewsItem, normalizeNewsList } from "@/lib/newsNormalize";

const PAGE_SIZE = 6;

export default function AllNews() {
  const [news, setNews] = useState<DisplayNewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const fetchNews = async (pageNumber: number, replace = false) => {
    if (!isSupabaseConfigured || !supabase) {
      setHasFetchError(true);
      if (replace) {
        setNews([]);
      }
      setHasMore(false);
      setLoading(false);
      return;
    }

    const client = supabase;

    setLoading(true);
    setHasFetchError(false);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await client
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data) {
      setHasFetchError(true);
      if (replace) {
        setNews([]);
      }
      setHasMore(false);
    } else {
      const normalized = normalizeNewsList(data);
      const source = normalized;

      if (replace) {
        setNews(source);
      } else {
        setNews((prev) => [...prev, ...source]);
      }

      setHasMore(source.length === PAGE_SIZE);
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
      {hasFetchError && (
        <p className="text-center text-sm text-red-600 mb-6">
          Ne mozemo ucitati vijesti trenutno.
        </p>
      )}
      {news.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="h-full flex"
            >
              <NewsCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500">
            Trenutno nema vijesti u bazi.
          </p>
        )
      )}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-0 mx-auto flex items-center justify-center bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg h-auto"
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
