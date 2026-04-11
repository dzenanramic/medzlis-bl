"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

const IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_NEWS_IMAGE_BUCKET ?? "news-images";
const FILE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_NEWS_FILE_BUCKET ?? "news-files";

const ensureAbsoluteUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const buildUniqueFileName = (file: File) => {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : "bin";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${uniqueId}.${extension}`;
};

export default function AdminPage() {
  const [newsItems, setNewsItems] = useState<
    { id: string; title: string; created_at: string | null }[]
  >([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession ?? null);
      setLoadingSession(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      if (!session) {
        setNewsItems([]);
        return;
      }

      setLoadingNews(true);
      const { data, error } = await supabase
        .from("news")
        .select("id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        setStatus(`Greska pri ucitavanju vijesti: ${error.message}`);
      } else {
        setNewsItems(
          (data ?? []).map((item) => ({
            id: String(item.id),
            title: item.title ?? "(Bez naslova)",
            created_at: item.created_at ?? null,
          })),
        );
      }

      setLoadingNews(false);
    };

    fetchNews();
  }, [session]);

  const canSubmit = useMemo(() => {
    return title.trim() && summary.trim() && content.trim();
  }, [title, summary, content]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const uploadFiles = async (files: File[], bucket: string, folder: string) => {
    const urls: string[] = [];

    for (const file of files) {
      const path = `${folder}/${buildUniqueFileName(file)}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        throw new Error(
          `Upload greska (${bucket}): ${error.message}. Provjeri da bucket postoji i da je RLS policy ispravan.`,
        );
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  const uploadSingleFile = async (
    file: File,
    bucket: string,
    folder: string,
  ) => {
    const path = `${folder}/${buildUniqueFileName(file)}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(
        `Upload error (${bucket}): ${error.message}. Check bucket and RLS policies.`,
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const insertLinkIntoSelectedText = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = content.slice(selectionStart, selectionEnd).trim();

    if (!selectedText) {
      setStatus(
        "Selektuj tekst u polju Sadrzaj pa klikni na 'Add link to text'.",
      );
      return;
    }

    const rawUrl = window.prompt("Unesi URL:", "https://");
    if (!rawUrl) return;

    const url = ensureAbsoluteUrl(rawUrl);
    const linked = `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${selectedText}</a>`;

    const nextContent =
      content.slice(0, selectionStart) + linked + content.slice(selectionEnd);

    setContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const nextCursor = selectionStart + linked.length;
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const buildFinalContent = (
    baseContent: string,
    documentUrl: string | null,
  ) => {
    let html = baseContent.trim();

    if (documentUrl) {
      const fileName = documentFile?.name ?? "Dokument";
      html += `<h3>Dokument</h3><ul><li><a href=\"${documentUrl}\" target=\"_blank\" rel=\"noopener noreferrer\">${fileName}</a></li></ul>`;
    }

    return html;
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setSelectedImages([]);
    setDocumentFile(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSaving(true);
    setStatus(null);

    try {
      if (!session?.user?.id) {
        throw new Error("User is not authenticated.");
      }

      const imageUrls =
        selectedImages.length > 0
          ? await uploadFiles(selectedImages, IMAGE_BUCKET, "news")
          : [];

      const fileUrl = documentFile
        ? await uploadSingleFile(documentFile, FILE_BUCKET, "news")
        : null;

      const finalContent = buildFinalContent(content, fileUrl);

      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        content: finalContent,
        image_urls: imageUrls,
        file_url: fileUrl,
        author_id: session.user.id,
      };

      const { error } = await supabase.from("news").insert(payload);

      if (error) {
        throw new Error(error.message);
      }

      // Clear homepage news cache so the newly published item appears immediately.
      localStorage.removeItem("news_section_cache_v2");

      const { data: insertedNews, error: refreshError } = await supabase
        .from("news")
        .select("id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!refreshError) {
        setNewsItems(
          (insertedNews ?? []).map((item) => ({
            id: String(item.id),
            title: item.title ?? "(Bez naslova)",
            created_at: item.created_at ?? null,
          })),
        );
      }

      setStatus("Vijest je uspjesno objavljena.");
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepoznata greska";
      setStatus(`Greska: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    const shouldDelete = window.confirm(
      "Da li sigurno zelis obrisati ovu vijest?",
    );
    if (!shouldDelete) return;

    setDeletingNewsId(id);
    setStatus(null);

    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }

      setNewsItems((current) => current.filter((item) => item.id !== id));
      localStorage.removeItem("news_section_cache_v2");
      setStatus("Vijest je obrisana.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepoznata greska";
      setStatus(`Greska: ${message}`);
    } finally {
      setDeletingNewsId(null);
    }
  };

  if (loadingSession) {
    return (
      <main className="min-h-[70vh] grid place-items-center px-4">
        <p className="text-gray-600">Ucitavanje admin panela...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-[70vh] grid place-items-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin login</h1>
          <p className="text-sm text-gray-600 mb-6">
            Prijavi se sa admin korisnikom iz Supabase Auth.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-4 h-11 w-full rounded-lg border border-gray-300 px-3"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-5 h-11 w-full rounded-lg border border-gray-300 px-3"
            required
          />

          {authError && (
            <p className="mb-4 text-sm text-red-600">{authError}</p>
          )}

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
          >
            Prijava
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin panel - Dodaj vijest
        </h1>
        <button
          onClick={handleLogout}
          className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Naslov
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Kratki opis (summary)
          </label>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Slike (vise fajlova)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) =>
              setSelectedImages(
                event.target.files ? Array.from(event.target.files) : [],
              )
            }
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Dokument (opciono)
          </label>
          <input
            type="file"
            onChange={(event) =>
              setDocumentFile(event.target.files?.[0] ?? null)
            }
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Sadrzaj vijesti (plain text ili HTML)
            </label>
            <button
              type="button"
              onClick={insertLinkIntoSelectedText}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              Add link to text
            </button>
          </div>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Ako uneses HTML (&lt;p&gt;, &lt;h2&gt;, &lt;a&gt;...), prikazace se
            kao rich text. Ako uneses obican tekst, sacuvat ce se paragrafi i
            uvlacenja.
          </p>
        </div>

        {status && (
          <p
            className={`text-sm ${
              status.startsWith("Greska") ? "text-red-600" : "text-green-700"
            }`}
          >
            {status}
          </p>
        )}

        <button
          disabled={!canSubmit || isSaving}
          type="submit"
          className="h-11 rounded-lg bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 px-5 font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? "Objavljujem..." : "Objavi vijest"}
        </button>
      </form>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Postojece vijesti
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Ovdje mozes obrisati vec objavljene vijesti.
        </p>

        {loadingNews ? (
          <p className="mt-4 text-sm text-gray-600">Ucitavanje vijesti...</p>
        ) : newsItems.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">Trenutno nema vijesti.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {newsItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("bs-BA")
                      : "Bez datuma"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteNews(item.id)}
                  disabled={deletingNewsId === item.id}
                  className="h-9 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {deletingNewsId === item.id ? "Brisem..." : "Obrisi"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
