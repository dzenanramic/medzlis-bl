export default function LoadingNewsDetail() {
  return (
    <section className="max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-pulse">
      <div className="mb-8">
        <div className="h-10 w-3/4 rounded bg-gray-200 mb-4" />
        <div className="h-4 w-40 rounded bg-gray-200" />
      </div>

      <div className="rounded-xl overflow-hidden shadow-lg mb-10">
        <div className="w-full aspect-video bg-gray-200" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-11/12 rounded bg-gray-200" />
        <div className="h-4 w-10/12 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-9/12 rounded bg-gray-200" />
      </div>
    </section>
  );
}
