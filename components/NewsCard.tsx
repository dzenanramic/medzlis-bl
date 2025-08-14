import Image from "next/image";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
};

type NewsCardProps = {
  item: NewsItem;
  badgeText?: string; // Optional badge (e.g. "Novost")
};

export default function NewsCard({ item, badgeText }: NewsCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover w-full transition-transform duration-700 group-hover:scale-110"
        />
        {badgeText && (
          <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
            {badgeText}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>{new Date(item.date).toLocaleDateString("bs-BA")}</span>
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-green-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600 mb-5">{item.summary}</p>
        <button className="text-green-700 font-medium hover:underline flex items-center gap-2">
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
