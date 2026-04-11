import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import Link from "next/link";
import NewsCard from "./NewsCard";
import { useTranslation } from "react-i18next";
import { DisplayNewsItem, normalizeNewsList } from "@/lib/newsNormalize";

// Cache configuration
const CACHE_KEY = "news_section_cache_v2";
const CACHE_DURATION = 60 * 60 * 1000;

type CacheData = {
  data: DisplayNewsItem[];
  timestamp: number;
};

export default function NewsSection() {
  const { t } = useTranslation();
  const [news, setNews] = useState<DisplayNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);

  const reportNewsError = useCallback((context: string, error: unknown) => {
    // Keep dev diagnostics without triggering Next.js console error overlay.
    console.warn(`[NewsSection] ${context}`, error);
  }, []);

  // Function to get cached data
  const getCachedData = useCallback((): DisplayNewsItem[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CacheData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      }

      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      reportNewsError("Error reading cache", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, [reportNewsError]);

  // Function to set cached data
  const setCachedData = useCallback(
    (data: DisplayNewsItem[]) => {
      try {
        const cacheData: CacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        reportNewsError("Error setting cache", error);
      }
    },
    [reportNewsError],
  );

  useEffect(() => {
    const fetchNews = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setNews([]);
        setHasFetchError(true);
        setLoading(false);
        return;
      }

      const client = supabase;

      setLoading(true);
      setHasFetchError(false);

      // Try to get cached data first
      const cachedNews = getCachedData();
      if (cachedNews && cachedNews.length > 0) {
        setNews(cachedNews);
      }

      // No valid cache, fetch from database
      try {
        const { data, error } = await client
          .from("news")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          reportNewsError("Error fetching news", error);
          setHasFetchError(true);
          setNews([]);
        } else {
          const normalized = normalizeNewsList(data);
          const nextNews = normalized.slice(0, 3);
          setNews(nextNews);
          // Cache only non-empty data so stale empty cache does not hide future news.
          if (nextNews.length > 0) {
            setCachedData(nextNews);
          } else {
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (error) {
        reportNewsError("Error fetching news", error);
        setHasFetchError(true);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [getCachedData, setCachedData, reportNewsError]);

  if (loading && news.length === 0) {
    return (
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3 text-gray-900">
            {t("news.latestTitle")}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-4">
            {t("news.latestDescription")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-3 text-gray-900">
          {t("news.latestTitle")}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          {t("news.latestDescription")}
        </p>
        {hasFetchError && (
          <p className="text-red-600 max-w-xl mx-auto mt-3 text-sm">
            {t("news.fetchError")}
          </p>
        )}
      </div>

      {news.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-10">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block h-full w-full"
            >
              <NewsCard item={item} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nema dostupnih vijesti.</p>
      )}

      <Link
        href="/news"
        className="mt-10 mx-auto flex items-center justify-center bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg h-auto"
        style={{ lineHeight: "1.5", minHeight: "3rem", width: "fit-content" }}
      >
        {t("news.showMore")}
      </Link>
    </section>
  );
}
