import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PricingSection from '@/components/pets-santa/pricing-section';

export const metadata = {
  title: 'Pricing - Pets Santa',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-100 bg-white/90">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
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
            <Link href="/billing" className="text-slate-600 hover:text-red-600 transition">
              Billing
            </Link>
          </div>
        </div>
      </header>

      <PricingSection isDarkMode={false} />
    </main>
  );
}
