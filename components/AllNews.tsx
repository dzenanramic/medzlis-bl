"use client";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import NewsCard from "./NewsCard";
import Link from "next/link";
import { DisplayNewsItem, normalizeNewsList } from "@/lib/newsNormalize";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 6;

export default function AllNews() {
  const { t } = useTranslation();
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
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-center">
        {t("news.allNews")}
      </h1>
      {hasFetchError && (
        <p className="text-center text-sm text-red-600 mb-6">
          {t("news.fetchError")}
        </p>
      )}
      {news.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/view?id=${item.id}`}
              className="h-full flex"
            >
              <NewsCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500">{t("news.noNews")}</p>
        )
      )}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mx-auto flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-lg shadow-sm transition-all duration-300 text-base w-fit"
          >
            {loading ? t("news.loading") : t("news.loadMore")}
          </button>
        </div>
      )}
    </section>
  );
}
