'use client';

import React from 'react';

interface PricingSectionProps {
  isDarkMode: boolean;
}

export default function PricingSection({ isDarkMode }: PricingSectionProps) {
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
          Design cute printable holiday greeting cards, calendars, and digital keepsakes with no recurring subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left items-stretch">
        
        {/* Tier 1: Trial Pack */}
        <div className={`rounded-[2.5rem] p-10 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-slate-900/60 border border-slate-800 text-slate-100 shadow-xl' 
            : 'bg-white border border-slate-100 text-slate-800 shadow-xl shadow-slate-100'
        }`}>
          <div>
            <h3 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Trial Pack
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Try it out with a few free portraits.
            </p>
            
            <div className="my-8">
              <div className={`text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                $0
              </div>
              <div className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold mt-2">
                ONE-TIME PAYMENT
              </div>
            </div>

            <ul className="space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  2 Holiday Credits
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Standard quality downloads
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Limited styles
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  No credit card required
                </span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById('portrait-creator');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all mt-6 cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            Claim Free Credits
          </button>
        </div>

        {/* Tier 2: Holiday Pack (Best option overlap) */}
        <div className={`rounded-[2.5rem] p-10 relative flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] ${
          isDarkMode 
            ? 'bg-gradient-to-b from-red-950/30 to-red-950/10 border-2 border-red-500 shadow-2xl shadow-red-950/30' 
            : 'bg-white border-2 border-red-500 shadow-2xl shadow-red-100'
        }`}>
          {/* Best value Badge wrapper */}
          <span className="absolute -top-4 left-1/2 -transparent -translate-x-1/2 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-6 py-1.5 rounded-full shadow-lg">
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
                $9.99
              </div>
              <div className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold mt-2">
                ONE-TIME PAYMENT
              </div>
            </div>

            <ul className="space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  10 Holiday Credits
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  High-quality downloads
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  All Christmas styles
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Priority generation
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  No expiration
                </span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => alert('Opening Secure Stripe Checkout for Holiday Pack ($9.99)...')}
            className="w-full py-4.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide rounded-2xl transition-all mt-6 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer transform hover:scale-[1.01]"
          >
            Buy 10 Credits
          </button>
        </div>

        {/* Tier 3: Studio Pack */}
        <div className={`rounded-[2.5rem] p-10 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-slate-900/60 border border-slate-800 text-slate-100 shadow-xl' 
            : 'bg-white border border-slate-100 text-slate-800 shadow-xl shadow-slate-100'
        }`}>
          <div>
            <h3 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Studio Pack
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              For pet lovers who want all the options.
            </p>
            
            <div className="my-8">
              <div className={`text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                $24.99
              </div>
              <div className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold mt-2">
                ONE-TIME PAYMENT
              </div>
            </div>

            <ul className="space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  30 Holiday Credits
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Bulk generation
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Commercial-friendly usage
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  24/7 Priority Support
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  No expiration
                </span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => alert('Opening Secure Stripe Checkout for Studio Pack ($24.99)...')}
            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all mt-6 cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' 
                : 'bg-slate-55 shadow-sm text-slate-800 font-extrabold hover:bg-slate-100'
            }`}
          >
            Buy 30 Credits
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
