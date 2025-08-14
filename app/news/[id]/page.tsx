import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import AdditionalPhotos from "./AdditionalPhotos";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
  additional_images?: string[];
};

// Fixed: params is now always a Promise in Next.js 15+
type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const news: NewsItem = data;

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
      <div
        className="prose prose-lg max-w-none text-gray-700 
                  prose-headings:font-semibold prose-headings:text-gray-900
                  prose-a:text-blue-600 hover:prose-a:text-blue-800
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4
                  prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

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
