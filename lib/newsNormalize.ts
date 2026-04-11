export type DisplayNewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
  additional_images?: string[];
  file_url?: string | null;
};

export type RawNewsRow = {
  id?: number | string;
  title?: string | null;
  summary?: string | null;
  content?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  additional_images?: string[] | null;
  date?: string | null;
  created_at?: string | null;
  file_url?: string | null;
};

const DEFAULT_IMAGE = "/hero-mosque2.jpg";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const clampPreview = (value: string, max = 170) => {
  const normalized = value.trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 3)}...`;
};

const buildSummary = (
  summary: string | null | undefined,
  content: string | null | undefined,
) => {
  if (summary && summary.trim().length > 0) return clampPreview(summary);
  if (!content) return "";

  const plain = stripHtml(content);
  return clampPreview(plain);
};

const toStringId = (id: number | string | undefined) => {
  if (id === undefined || id === null) return "";
  return String(id).trim();
};

export const normalizeNewsItem = (
  row?: RawNewsRow | null,
): DisplayNewsItem | null => {
  if (!row) {
    return null;
  }

  const id = toStringId(row.id);
  const title = row.title?.trim() ?? "";
  const content = row.content?.trim() ?? "";

  if (id.length === 0 || !title || !content) {
    return null;
  }

  const imageArray = Array.isArray(row.image_urls)
    ? row.image_urls.filter(
        (value) => typeof value === "string" && value.trim().length > 0,
      )
    : [];

  const firstImage = imageArray[0] || row.image_url || DEFAULT_IMAGE;
  const date = row.date || row.created_at || new Date().toISOString();

  return {
    id,
    title,
    summary: buildSummary(row.summary, content),
    content,
    image_url: firstImage,
    additional_images: row.additional_images ?? imageArray.slice(1),
    date,
    file_url: row.file_url ?? null,
  };
};

export const normalizeNewsList = (
  rows: RawNewsRow[] | null | undefined,
): DisplayNewsItem[] => {
  if (!rows) return [];

  return rows
    .map(normalizeNewsItem)
    .filter((item): item is DisplayNewsItem => Boolean(item));
};
