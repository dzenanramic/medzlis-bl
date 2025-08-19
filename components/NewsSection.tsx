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

// Cache configuration
const CACHE_KEY = "news_section_cache";
const CACHE_DURATION = 60 * 60 * 1000;

type CacheData = {
  data: NewsItem[];
  timestamp: number;
};

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get cached data
  const getCachedData = (): NewsItem[] | null => {
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
      console.error("Error reading cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // Function to set cached data
  const setCachedData = (data: NewsItem[]) => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      // Try to get cached data first
      const cachedNews = getCachedData();
      if (cachedNews) {
        setNews(cachedNews);
        setLoading(false);
        return;
      }

      // No valid cache, fetch from database
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("date", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching news:", error);
        } else {
          setNews(data);
          // Cache the fresh data
          setCachedData(data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Function to manually refresh data (bypass cache)
  const refreshNews = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching news:", error);
      } else {
        setNews(data);
        setCachedData(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && news.length === 0) {
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
          Najnovije Vijesti
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          Pratite najnovije dešavanja i aktivnosti u našoj zajednici
        </p>
        {/* Optional refresh button */}
        <button
          onClick={refreshNews}
          disabled={loading}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          {loading ? "Osvežava..." : "Osvežи vijesti"}
        </button>
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
        className="mt-10 mx-auto flex items-center justify-center bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 text-lg h-auto"
        style={{ lineHeight: "1.5", minHeight: "3rem", width: "fit-content" }}
      >
        Prikaži više vijesti
      </Link>
    </section>
  );
}
