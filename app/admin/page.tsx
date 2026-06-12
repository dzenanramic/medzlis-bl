"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons (inline to avoid deps) ──────────────────────────────────────────

const Icons = {
  dashboard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  news: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-4 0v-9" />
      <line x1="10" y1="8" x2="18" y2="8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  payments: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="1" y="5" width="22" height="14" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="8"
        fill="currentColor"
        stroke="none"
      >
        $
      </text>
    </svg>
  ),
  settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  logout: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

// ─── Constants ──────────────────────────────────────────────────────────────

const IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_NEWS_IMAGE_BUCKET ?? "news-images";
const FILE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_NEWS_FILE_BUCKET ?? "news-files";

type Tab = "dashboard" | "news" | "transactions";

interface NavItem {
  id: Tab;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "news", label: "News", icon: Icons.news },
  { id: "transactions", label: "Transactions", icon: Icons.payments },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("bs-BA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col p-4 gap-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="flex flex-col gap-2 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── Toast Component ────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <span className="text-lg">{type === "success" ? "✅" : "⚠️"}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p
          className={`text-xs mt-1 ${trend.positive ? "text-green-600" : "text-red-500"}`}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        {description}
      </p>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────────────

export default function AdminPage() {
  // ── State ──
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // News
  const [newsItems, setNewsItems] = useState<
    { id: string; title: string; created_at: string | null }[]
  >([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  // Payments
  const [payments, setPayments] = useState<
    {
      id: string;
      amount: number;
      currency: string;
      status: string;
      provider: string;
      payer_email: string | null;
      payer_name: string | null;
      payment_type: string;
      created_at: string | null;
    }[]
  >([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });
  const closeToast = () => setToast(null);

  // ── Auth ──
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoadingSession(false);
      return;
    }
    const client = supabase;
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await client.auth.getSession();
      setSession(currentSession ?? null);
      setLoadingSession(false);
    };
    fetchSession();
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch news ──
  useEffect(() => {
    if (!session || !supabase) return;
    const client = supabase;
    const fetchNews = async () => {
      setLoadingNews(true);
      const { data, error } = await client
        .from("news")
        .select("id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        showToast(`Greška: ${error.message}`, "error");
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

  // ── Fetch payments ──
  useEffect(() => {
    if (!session || !supabase) {
      setPayments([]);
      return;
    }
    const client = supabase;
    const fetchPayments = async () => {
      setLoadingPayments(true);
      const { data, error } = await client
        .from("payments")
        .select(
          "id,amount,currency,status,provider,payer_email,payer_name,payment_type,created_at",
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(
          (data ?? []).map((item) => ({
            id: String(item.id),
            amount: item.amount ?? 0,
            currency: item.currency ?? "EUR",
            status: item.status ?? "UNKNOWN",
            provider: item.provider ?? "unknown",
            payer_email: item.payer_email ?? null,
            payer_name: item.payer_name ?? null,
            payment_type: item.payment_type ?? "unknown",
            created_at: item.created_at ?? null,
          })),
        );
      }
      setLoadingPayments(false);
    };
    fetchPayments();
  }, [session]);

  // ── Computed ──
  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const latestPayment = payments.length > 0 ? payments[0] : null;
  const canSubmit = useMemo(
    () => title.trim() && summary.trim() && content.trim(),
    [title, summary, content],
  );

  // ── Handlers ──
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      setAuthError("Supabase nije konfigurisan.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const uploadFiles = async (files: File[], bucket: string, folder: string) => {
    if (!supabase) throw new Error("Supabase nije konfigurisan.");
    const client = supabase;
    const urls: string[] = [];
    for (const file of files) {
      const path = `${folder}/${buildUniqueFileName(file)}`;
      const { error } = await client.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw new Error(`Upload error: ${error.message}`);
      const { data } = client.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const uploadSingleFile = async (
    file: File,
    bucket: string,
    folder: string,
  ) => {
    if (!supabase) throw new Error("Supabase nije konfigurisan.");
    const path = `${folder}/${buildUniqueFileName(file)}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(`Upload error: ${error.message}`);
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
      showToast("Selektuj tekst pa klikni na 'Add link'.", "error");
      return;
    }
    const rawUrl = window.prompt("Unesi URL:", "https://");
    if (!rawUrl) return;
    const url = ensureAbsoluteUrl(rawUrl);
    const linked = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
    const nextContent =
      content.slice(0, selectionStart) + linked + content.slice(selectionEnd);
    setContent(nextContent);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + linked.length,
        selectionStart + linked.length,
      );
    });
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
    if (!canSubmit || !supabase || !session) return;
    setIsSaving(true);
    try {
      const imageUrls =
        selectedImages.length > 0
          ? await uploadFiles(selectedImages, IMAGE_BUCKET, "news")
          : [];
      const fileUrl = documentFile
        ? await uploadSingleFile(documentFile, FILE_BUCKET, "news")
        : null;
      const finalContent = (() => {
        let html = content.trim();
        if (fileUrl) {
          html += `<h3>Dokument</h3><ul><li><a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${documentFile?.name ?? "Dokument"}</a></li></ul>`;
        }
        return html;
      })();
      const { error } = await supabase.from("news").insert({
        title: title.trim(),
        summary: summary.trim(),
        content: finalContent,
        image_urls: imageUrls,
        file_url: fileUrl,
        author_id: session.user.id,
      });
      if (error) throw new Error(error.message);
      localStorage.removeItem("news_section_cache_v2");
      const { data: refreshed } = await supabase
        .from("news")
        .select("id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (refreshed)
        setNewsItems(
          refreshed.map((item) => ({
            id: String(item.id),
            title: item.title ?? "(Bez naslova)",
            created_at: item.created_at ?? null,
          })),
        );
      showToast("Vijest je uspješno objavljena! 🎉", "success");
      resetForm();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Nepoznata greška",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Da li sigurno želiš obrisati ovu vijest?")) return;
    setDeletingNewsId(id);
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setNewsItems((current) => current.filter((item) => item.id !== id));
      localStorage.removeItem("news_section_cache_v2");
      showToast("Vijest je obrisana.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Greška", "error");
    } finally {
      setDeletingNewsId(null);
    }
  };

  // ── Loading State ──
  if (loadingSession) return <LoadingSkeleton />;

  // ── Not Configured ──
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Configuration Required
          </h1>
          <p className="text-sm text-gray-600">
            Set{" "}
            <code className="bg-amber-50 px-2 py-0.5 rounded text-amber-800">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="bg-amber-50 px-2 py-0.5 rounded text-amber-800">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            in your{" "}
            <code className="bg-amber-50 px-2 py-0.5 rounded text-amber-800">
              .env.local
            </code>
            .
          </p>
        </div>
      </div>
    );
  }

  // ── Login Screen ──
  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to manage your content
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {authError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
                >
                  {authError}
                </motion.p>
              )}
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold hover:from-green-700 hover:to-emerald-800 active:scale-[0.98] transition-all shadow-md"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">Medžlis BL</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all"
          >
            <Icons.logout className="w-5 h-5" />
            Logout
          </button>
          <div className="px-4 pt-3 text-[10px] text-gray-400">
            {session.user?.email}
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 capitalize">
              {activeTab === "dashboard"
                ? "Dashboard"
                : activeTab === "news"
                  ? "News Management"
                  : "Transactions"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-400">
              {session.user?.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {session.user?.email?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    label="Total Revenue"
                    value={formatCurrency(totalRevenue, "EUR")}
                    icon={<Icons.payments className="w-5 h-5" />}
                  />
                  <StatCard
                    label="Payments"
                    value={payments.length}
                    icon={<Icons.users className="w-5 h-5" />}
                    trend={{
                      value: `${payments.filter((p) => p.status === "COMPLETED").length} completed`,
                      positive: true,
                    }}
                  />
                  <StatCard
                    label="News Articles"
                    value={newsItems.length}
                    icon={<Icons.news className="w-5 h-5" />}
                  />
                  <StatCard
                    label="Latest Payment"
                    value={
                      latestPayment
                        ? formatCurrency(
                            latestPayment.amount,
                            latestPayment.currency,
                          )
                        : "—"
                    }
                    icon={<Icons.settings className="w-5 h-5" />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent news */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-gray-900">
                        Recent News
                      </h2>
                      <button
                        onClick={() => setActiveTab("news")}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        View all →
                      </button>
                    </div>
                    {newsItems.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">
                        No news articles yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {newsItems.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <span className="text-sm text-gray-700 truncate max-w-[200px]">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent payments */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-gray-900">
                        Recent Payments
                      </h2>
                      <button
                        onClick={() => setActiveTab("transactions")}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        View all →
                      </button>
                    </div>
                    {payments.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">
                        No payments yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {payments.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <span className="text-sm text-gray-700 font-medium">
                                {formatCurrency(p.amount, p.currency)}
                              </span>
                              <span
                                className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  p.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : p.status === "REFUNDED"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {p.status === "COMPLETED"
                                  ? "Paid"
                                  : p.status === "REFUNDED"
                                    ? "Refunded"
                                    : "Pending"}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {formatDate(p.created_at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Create News Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">
                      Create News Article
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Publish a new article to the homepage
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                          Title *
                        </label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                          placeholder="Article title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                          Images
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            setSelectedImages(
                              e.target.files ? Array.from(e.target.files) : [],
                            )
                          }
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                        Summary *
                      </label>
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="Brief summary of the article"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Content *
                        </label>
                        <button
                          type="button"
                          onClick={insertLinkIntoSelectedText}
                          className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                          Add Link
                        </button>
                      </div>
                      <textarea
                        ref={contentRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={14}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="Write your article content here... (plain text or HTML)"
                        required
                      />
                      <p className="mt-1.5 text-[11px] text-gray-400">
                        {"Supports plain text and HTML (<p>, <h2>, <a>...)"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                        Document (optional)
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setDocumentFile(e.target.files?.[0] ?? null)
                        }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {newsItems.length} articles published
                      </span>
                      <button
                        type="submit"
                        disabled={!canSubmit || isSaving}
                        className="h-11 px-8 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold hover:from-green-700 hover:to-emerald-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
                      >
                        {isSaving ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Publishing...
                          </span>
                        ) : (
                          "Publish Article"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing News */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">
                          Published Articles
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Manage your published news articles
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                        {newsItems.length} total
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {loadingNews ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-16 bg-gray-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : newsItems.length === 0 ? (
                      <EmptyState
                        title="No articles yet"
                        description="Your published news articles will appear here."
                      />
                    ) : (
                      <div className="space-y-2">
                        {newsItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDate(item.created_at)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteNews(item.id)}
                              disabled={deletingNewsId === item.id}
                              className="ml-4 h-9 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-all flex items-center gap-1.5"
                            >
                              {deletingNewsId === item.id ? (
                                <svg
                                  className="animate-spin h-3.5 w-3.5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                              )}
                              {deletingNewsId === item.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "transactions" && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(totalRevenue, "EUR")}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {payments.filter((p) => p.status === "COMPLETED").length}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      Pending / Refunded
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {payments.filter((p) => p.status !== "COMPLETED").length}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">
                          Payment History
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          All PayPal membership transactions
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                        {payments.length} total
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {loadingPayments ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-12 bg-gray-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : payments.length === 0 ? (
                      <EmptyState
                        title="No transactions yet"
                        description="PayPal membership payments will appear here once members start paying."
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect x="1" y="5" width="22" height="14" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        }
                      />
                    ) : (
                      <div className="overflow-x-auto -mx-6">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                Date
                              </th>
                              <th className="text-left py-3 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="text-left py-3 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-left py-3 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                Payer
                              </th>
                              <th className="text-left py-3 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment, idx) => (
                              <motion.tr
                                key={payment.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                              >
                                <td className="py-4 px-6 text-gray-600 whitespace-nowrap text-xs">
                                  {formatDate(payment.created_at)}
                                </td>
                                <td className="py-4 px-6 font-mono font-semibold text-gray-900">
                                  {formatCurrency(
                                    payment.amount,
                                    payment.currency,
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                      payment.status === "COMPLETED"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : payment.status === "REFUNDED"
                                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                          : payment.status === "PENDING"
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "bg-gray-50 text-gray-600 border border-gray-200"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        payment.status === "COMPLETED"
                                          ? "bg-green-500"
                                          : payment.status === "REFUNDED"
                                            ? "bg-yellow-500"
                                            : payment.status === "PENDING"
                                              ? "bg-blue-500"
                                              : "bg-gray-400"
                                      }`}
                                    />
                                    {payment.status === "COMPLETED"
                                      ? "Completed"
                                      : payment.status === "REFUNDED"
                                        ? "Refunded"
                                        : payment.status === "PENDING"
                                          ? "Pending"
                                          : payment.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-gray-700 max-w-[180px] truncate text-sm">
                                  {payment.payer_name ||
                                    payment.payer_email ||
                                    "—"}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md capitalize">
                                    {payment.payment_type === "membership"
                                      ? "Membership"
                                      : payment.payment_type}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
