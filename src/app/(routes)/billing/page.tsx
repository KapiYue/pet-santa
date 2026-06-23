'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Coins, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSession } from '@/lib/auth/client';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  credits: number;
  status: string;
  createdAt: string | null;
}

interface CreditTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string | null;
}

interface BillingData {
  credits: number;
  payments: Payment[];
  transactions: CreditTransaction[];
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function BillingPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const searchParams = useSearchParams();
  const justPurchased = searchParams.get('success') === 'true';

  const [data, setData] = React.useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadBilling = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/billing', { cache: 'no-store' });
      if (res.status === 401) {
        setError('Please log in to view your billing.');
        setData(null);
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load billing.');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isSessionPending) return;
    void loadBilling();
  }, [isSessionPending, loadBilling]);

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-100 bg-white/90">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
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
            <Link href="/pricing" className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
              Buy Credits
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Billing</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your credits, view payment history and usage.
            </p>
          </div>
          <button
            onClick={() => void loadBilling()}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Just purchased banner */}
        {justPurchased && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Payment successful! 🎉</p>
              <p className="text-emerald-700">
                Your credits are being added. If they don't appear immediately, hit Refresh in a few seconds.
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600 font-semibold">{error}</p>
            {!session?.user && (
              <Link
                href="/signin"
                className="inline-block mt-4 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
              >
                Sign in
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Credits balance card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-7">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Coins className="w-4 h-4 text-amber-500" /> Credits remaining
                </div>
                <div className="mt-3 text-5xl font-black text-slate-900">
                  {isLoading && !data ? '—' : data?.credits ?? 0}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-semibold">
                  Each portrait generation uses 20 credits.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-7">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <CreditCard className="w-4 h-4 text-red-500" /> Total purchases
                </div>
                <div className="mt-3 text-5xl font-black text-slate-900">
                  {isLoading && !data ? '—' : data?.payments.length ?? 0}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-semibold">
                  Lifetime successful payments.
                </p>
              </div>
            </div>

            {/* Payment history (支付历史) */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Payment history</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3 font-bold">Date</th>
                      <th className="px-5 py-3 font-bold">Amount</th>
                      <th className="px-5 py-3 font-bold">Credits</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.payments.length ? (
                      data.payments.map((p) => (
                        <tr key={p.id} className="border-b border-slate-50 last:border-0">
                          <td className="px-5 py-3.5 text-slate-600">{formatDate(p.createdAt)}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900">
                            {formatMoney(p.amount, p.currency)}
                          </td>
                          <td className="px-5 py-3.5 text-emerald-600 font-semibold">+{p.credits}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 capitalize">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-slate-400 font-medium">
                          {isLoading ? 'Loading…' : 'No payments yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Credit usage (积分使用情况) */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Credit usage</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3 font-bold">Date</th>
                      <th className="px-5 py-3 font-bold">Type</th>
                      <th className="px-5 py-3 font-bold">Change</th>
                      <th className="px-5 py-3 font-bold">Balance</th>
                      <th className="px-5 py-3 font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.transactions.length ? (
                      data.transactions.map((t) => (
                        <tr key={t.id} className="border-b border-slate-50 last:border-0">
                          <td className="px-5 py-3.5 text-slate-600">{formatDate(t.createdAt)}</td>
                          <td className="px-5 py-3.5 capitalize text-slate-700 font-medium">{t.type}</td>
                          <td className={`px-5 py-3.5 font-semibold ${t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.amount >= 0 ? `+${t.amount}` : t.amount}
                          </td>
                          <td className="px-5 py-3.5 text-slate-900 font-semibold">{t.balanceAfter}</td>
                          <td className="px-5 py-3.5 text-slate-500">{t.description ?? '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-medium">
                          {isLoading ? 'Loading…' : 'No credit activity yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
