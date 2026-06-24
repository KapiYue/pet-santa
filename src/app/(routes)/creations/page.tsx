'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { OUTFITS, BACKGROUNDS } from '@/components/pets-santa/data';

interface CreationTask {
  id: string;
  status: string;
  outfitId: string | null;
  backgroundId: string | null;
  originalImageUrl: string;
  generatedImageUrl: string | null;
  failMsg: string | null;
  creditsDeducted: boolean;
  creditsCost: number;
  createdAt: string | null;
  completedAt: string | null;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function getOutfitLabel(outfitId: string | null) {
  if (!outfitId) return 'Portrait';
  return OUTFITS.find((item) => item.id === outfitId)?.name ?? outfitId;
}

function getBackgroundLabel(backgroundId: string | null) {
  if (!backgroundId) return 'Holiday scene';
  return BACKGROUNDS.find((item) => item.id === backgroundId)?.name ?? backgroundId;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
        Completed
      </span>
    );
  }
  if (status === 'fail') {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
      <Loader2 className="h-3 w-3 animate-spin" /> Generating
    </span>
  );
}

export default function CreationsPage() {
  const [tasks, setTasks] = React.useState<CreationTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadCreations = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/creations', { cache: 'no-store' });
      if (res.status === 401) {
        setError('Please log in to view your creations.');
        setTasks([]);
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load creations.');
      setTasks(json.tasks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load creations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCreations();
  }, [loadCreations]);

  React.useEffect(() => {
    const hasPending = tasks.some(
      (task) => task.status === 'waiting' || task.status === 'pending',
    );
    if (!hasPending) return;

    const interval = setInterval(() => {
      void loadCreations();
    }, 4000);

    return () => clearInterval(interval);
  }, [tasks, loadCreations]);

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800">
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-100 bg-white/90">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl select-none group-hover:rotate-12 transition-transform">🎅</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent font-serif italic">
              Pets Santa
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition">
              <ArrowLeft className="w-4 h-4" /> Back home
            </Link>
            <Link href="/billing" className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
              Billing
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-red-500" /> My Creations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your AI-generated pet portraits, including works in progress.
            </p>
          </div>
          <button
            onClick={() => void loadCreations()}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600 font-semibold">{error}</p>
            <Link
              href="/signin"
              className="inline-block mt-4 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
            >
              Sign in
            </Link>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-600 font-semibold">
              {isLoading ? 'Loading your creations…' : 'No portraits yet.'}
            </p>
            {!isLoading && (
              <Link
                href="/#portrait-creator"
                className="inline-block mt-4 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
              >
                Create your first portrait
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-0.5 bg-slate-100">
                  <div className="relative aspect-square bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={task.originalImageUrl}
                      alt="Original pet"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                      Original
                    </span>
                  </div>
                  <div className="relative aspect-square bg-slate-50">
                    {task.generatedImageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={task.generatedImageUrl}
                          alt="Generated portrait"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 left-2 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                          AI Result
                        </span>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                        {(task.status === 'waiting' || task.status === 'pending') && (
                          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                        )}
                        <p className="text-xs font-semibold text-slate-500">
                          {task.status === 'fail'
                            ? task.failMsg ?? 'Generation failed'
                            : 'Generating your portrait…'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={task.status} />
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {getOutfitLabel(task.outfitId)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getBackgroundLabel(task.backgroundId)}
                  </p>
                  {task.creditsDeducted && (
                    <p className="text-[10px] font-semibold text-red-500">
                      −{task.creditsCost} credits
                    </p>
                  )}
                  {task.generatedImageUrl && (
                    <a
                      href={task.generatedImageUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
