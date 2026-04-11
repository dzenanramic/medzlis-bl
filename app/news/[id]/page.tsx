"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Image from "next/image";
import AdditionalPhotos from "./AdditionalPhotos";
import { normalizeNewsItem, DisplayNewsItem } from "@/lib/newsNormalize";

const containsHtml = (value: string) => /<[^>]+>/.test(value);

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const [news, setNews] = useState<DisplayNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setNotFoundState(true);
      return;
    }

    const client = supabase;

    const fetchNewsById = async () => {
      setLoading(true);
      setNotFoundState(false);

      const { data, error } = await client
        .from("news")
        .select("id,title,summary,content,image_urls,file_url,created_at")
        .eq("id", id)
        .single();

      const normalized = normalizeNewsItem(data);

      if (error || !normalized) {
        setNews(null);
        setNotFoundState(true);
      } else {
        setNews(normalized);
      }

      setLoading(false);
    };

    fetchNewsById();
  }, [params?.id]);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-pulse">
        <div className="mb-8">
          <div className="h-10 w-3/4 rounded bg-gray-200 mb-4" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg mb-10">
          <div className="w-full aspect-video bg-gray-200" />
        </div>
      </section>
    );
  }

  if (notFoundState || !news) {
    return (
      <section className="max-w-3xl mx-auto py-20 px-4 sm:px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-gray-600">Vijest nije pronađena.</p>
      </section>
    );
  }

  const hasHtmlContent = containsHtml(news.content);

  return (
    <section className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      {/* Title + Date */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {news.title}
        </h1>
        <div className="flex items-center text-gray-500 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">
            {new Date(news.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-10 transition-all duration-300 hover:shadow-xl">
        <Image
          src={news.image_url}
          alt={news.title}
          width={800}
          height={450}
          className="w-full h-auto object-cover aspect-video"
          priority
        />
      </div>

      {/* Content */}
      {hasHtmlContent ? (
        <div
          className="max-w-none text-gray-700 leading-8 text-[1.04rem] [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-green-300 [&_blockquote]:pl-4 [&_a]:text-green-700 hover:[&_a]:text-green-800"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      ) : (
        <div className="whitespace-pre-wrap break-words text-gray-700 leading-8 text-[1.04rem] rounded-xl border border-gray-100 bg-gray-50/60 p-5">
          {news.content}
        </div>
      )}

      {/* Additional photos */}
      {Array.isArray(news.additional_images) &&
        news.additional_images.length > 0 && (
          <div className="mt-12">
            <AdditionalPhotos images={news.additional_images} />
          </div>
        )}
    </section>
  );
}
