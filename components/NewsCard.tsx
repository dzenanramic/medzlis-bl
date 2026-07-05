import Image from "next/image";
import { useTranslation } from "react-i18next";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  title_de?: string;
  summary_de?: string;
  content_de?: string;
  image_url: string;
  date: string;
};

type NewsCardProps = {
  item: NewsItem;
  badgeText?: string; // Optional badge (e.g. "Novost")
};

export default function NewsCard({ item, badgeText }: NewsCardProps) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === "de";
  const displayTitle = isDe && item.title_de ? item.title_de : item.title;
  const displaySummary =
    isDe && item.summary_de ? item.summary_de : item.summary;
  return (
    <div className="group w-full bg-card rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image_url}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full transition-transform duration-700 group-hover:scale-105"
        />
        {badgeText && (
          <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
            {badgeText}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <span>
            {new Date(item.date).toLocaleDateString(
              i18n.language === "de" ? "de-DE" : "bs-BA",
            )}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-3 group-hover:text-emerald-600 transition-colors">
          {displayTitle}
        </h3>
        <p className="text-muted-foreground mb-5">{displaySummary}</p>
        <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-2">
          Pročitaj više
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
