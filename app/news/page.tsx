import AllNews from "@/components/AllNews";
// import dynamic from "next/dynamic";

// const AllNews = dynamic(() => import("@/components/AllNews"), { ssr: false });

export default function NewsPage() {
  return <AllNews />;
}
