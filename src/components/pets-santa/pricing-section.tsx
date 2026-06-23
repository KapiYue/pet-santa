'use client';

import React from 'react';
import { useSession } from '@/lib/auth/client';
import { toast } from 'sonner';

interface PricingSectionProps {
  isDarkMode: boolean;
}

export default function PricingSection({ isDarkMode }: PricingSectionProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleBuy = async () => {
    if (!session?.user) {
      toast.error('Please log in to purchase credits.');
      // Send the user to sign in, then back to pricing afterwards.
      window.location.href = '/signin';
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Could not start checkout.');
      }

      // Redirect to Stripe-hosted Checkout.
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout failed:', err);
      toast.error(err instanceof Error ? err.message : 'Checkout failed.');
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing-plans" className="max-w-7xl mx-auto px-6 py-24 text-center scroll-mt-24">
      {/* section header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold uppercase mb-4 tracking-wider shadow-sm">
          <span>🎁 Holiday Special: 2026 Season</span>
        </div>
        <h2 className={`text-4xl sm:text-5xl font-serif italic tracking-tight font-extrabold ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Bring Christmas Joy to Your Pet's Photo
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          One simple pack. Top up your credits and generate festive portraits whenever inspiration strikes—no recurring subscriptions.
        </p>
      </div>

      <div className="flex justify-center">
        {/* Holiday Pack: the single $10 / 200 credits tier */}
        <div className={`w-full max-w-md rounded-[2.5rem] p-10 relative flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] ${
          isDarkMode
            ? 'bg-gradient-to-b from-red-950/30 to-red-950/10 border-2 border-red-500 shadow-2xl shadow-red-950/30'
            : 'bg-white border-2 border-red-500 shadow-2xl shadow-red-100'
        }`}>
          {/* Best value Badge wrapper */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-6 py-1.5 rounded-full shadow-lg">
            BEST VALUE
          </span>

          <div>
            <h3 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Holiday Pack
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Perfect for sharing with family and friends.
            </p>

            <div className="my-8">
              <div className={`text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                $10
              </div>
              <div className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold mt-2">
                ONE-TIME PAYMENT
              </div>
            </div>

            <ul className="space-y-4 my-8 text-sm">
              {[
                '200 Holiday Credits',
                'High-quality downloads',
                'All Christmas styles',
                'Priority generation',
                'No expiration',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleBuy}
            disabled={isLoading}
            className="w-full py-4.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide rounded-2xl transition-all mt-6 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer transform hover:scale-[1.01]"
          >
            {isLoading ? 'Redirecting to checkout…' : 'Buy 200 Credits'}
          </button>
        </div>
      </div>

      {/* Money Back Guarantee Disclaimer Block */}
      <div className={`mt-16 border-t pt-8 flex flex-col sm:flex-row items-center gap-4 text-left max-w-5xl mx-auto ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200/60'
      }`}>
        <span className="text-4xl select-none text-red-500">🛡️</span>
        <div>
          <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>100% Happiness Guarantee</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
            If the generated AI robes or custom sticker placements don't look completely adorable and festive on your furry companion, send us a ticket within 14 days and we'll issue a full, instant refund. No questions asked!
          </p>
        </div>
      </div>
    </section>
  );
}
