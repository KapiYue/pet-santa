'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ChevronDown, Star, TreePine, 
  Download, Palette, Zap, ShieldCheck, Moon, Sun, CreditCard
} from 'lucide-react';
import { FEATURES, TESTIMONIALS, FAQS } from './data';
import PortraitStudio from './portrait-studio';
import BeforeAfterSlider from './before-after-slider';
import LoginModal from './login-modal';
import PricingSection from './pricing-section';
import { useSession, signOut } from '@/lib/auth/client';

export default function PetsSantaLanding() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Current authenticated user session
  const { data: session } = useSession();
  const user = session?.user;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Real-time local Clock state for standard UTC display
  const [utcTime, setUtcTime] = useState<string>('');
  
  // Custom theme mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Keep a beautiful live UTC indicator
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const scrollToCreator = () => {
    const el = document.getElementById('portrait-creator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to map dynamic Lucide icon strings from data.ts
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-red-500" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-red-500" />;
      case 'Download':
        return <Download className="w-5 h-5 text-red-500" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-red-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-red-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-red-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'}`}>
      
      {/* 1. Header (Navbar) */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group text-left cursor-pointer">
            <span className="text-2xl select-none filter drop-shadow-sm group-hover:rotate-12 transition-transform">🎅</span>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent font-serif italic">
                Pets Santa
              </span>
              <span className="block text-[8px] tracking-widest text-slate-400 font-mono font-bold uppercase">
                AI Portrait Studio
              </span>
            </div>
          </button>

          {/* Links Row */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-red-600 hover:text-red-700 transition"
            >
              Home
            </button>
            <button 
              onClick={scrollToPricing}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-red-600'} transition`}
            >
              Pricing
            </button>
            <button 
              onClick={scrollToCreator}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-red-600'} transition flex items-center gap-1`}
            >
              <span>Portrait Creator</span>
              <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">New</span>
            </button>
            <Link
              href="/billing"
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-red-600'} transition`}
            >
              Billing
            </Link>
          </nav>

          {/* Actions Desk */}
          <div className="flex items-center gap-4">
            {/* Live Clock Indicator */}
            <span className="hidden lg:inline-block text-[10px] text-slate-400 font-mono font-medium">
              🕒 {utcTime}
            </span>

            {/* Dark Mode toggle - Matches moon icon in screenshot */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme view"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Authenticated: avatar + name with dropdown. Otherwise: Log in button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-slate-800'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold uppercase text-white">
                      {user.name?.charAt(0) ?? 'U'}
                    </span>
                  )}
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {user.name}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border shadow-lg z-50 ${
                      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/billing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                        isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> Billing &amp; Credits
                    </Link>
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await signOut();
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                        isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Log in Button - Matches dark pill button */
              <button
                onClick={() => setIsLoginOpen(true)}
                className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm hover:shadow cursor-pointer ${
                  isDarkMode 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">

        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="max-w-3xl mx-auto mb-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
              🎄 <span>Make Your Furry Friend 2026 Season Icon!</span>
            </div>

            {/* Beautiful Custom styled header from images */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Create a <span className="text-red-600 font-serif italic font-normal tracking-wide bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent px-1">Christmas Portrait</span> <br /> of Your Pet
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mt-4 font-medium max-w-2xl mx-auto leading-relaxed">
              Upload a photo and instantly dress your pet in Santa, Elf, or Reindeer outfits—perfect for adorable holiday cards, stickers, and family letters.
            </p>
          </div>

          {/* Mount the primary Interactive Portrait Canvas & Editor Studio */}
          <div className="mb-20">
            <PortraitStudio />
          </div>
        </section>

        {/* 3. AI Christmas Pet Photo Templates comparison section */}
        <section className={`py-16 border-y ${
          isDarkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              AI Christmas Pet Photo Templates
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              Upload a photo of your pet and let AI turn it into a festive holiday portrait. Dress your pet in Santa, Elf, or Reindeer outfits, add cozy winter scenes, Christmas trees, lights, and gifts—no manual photoshop editing needed. Just upload, design, and download your Christmas card online completely free.
            </p>

            {/* Before-and-After Comparisons drag slider */}
            <div className="mt-8">
              <BeforeAfterSlider />
            </div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Features
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Everything you need to create festive pet portraits in seconds. Our AI handles the lighting, shadows, and composition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat) => (
              <div 
                key={feat.id} 
                className={`p-6 rounded-2xl border text-left flex flex-col justify-between hover:shadow-lg transition-all ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' 
                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className={`p-3 w-fit rounded-xl mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-red-50'}`}>
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <h4 className={`font-bold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100/10 text-right">
                  <span className="text-[10px] text-red-500 uppercase font-extrabold tracking-widest">Pets Santa Premium</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Styled Red Promo Banner (Made for Pet Lovers, Built for the Holidays) */}
        <section className="bg-red-600 text-white rounded-none relative overflow-hidden py-16 px-6">
          <div className="absolute top-0 right-0 text-white/5 text-9xl pointer-events-none select-none font-extrabold">
            🎄❄️
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Texts Description */}
            <div className="lg:col-span-7 text-left space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic leading-tight text-white font-semibold">
                Made for Pet Lovers, <br /> Built for the Holidays
              </h2>
              <p className="text-red-100 text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
                Pets Santa helps you turn everyday pet snaps into festive high-fidelity holiday portraits you&apos;ll actually want to share. No complicated canvas tools, editing skills, or layout experience—just upload and generate.
              </p>

              {/* Checklist bullets */}
              <div className="space-y-3 pt-2">
                {[
                  "Perfect for holiday greetings, card prints, and gifts",
                  "Great for sharing on social posts, family groups, and newsletters",
                  "Works seamlessly for dogs, cats, bunnies, birds, and other animals"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-red-600 font-extrabold text-xs shadow-sm">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-white font-bold tracking-wide">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Graphics and Floating Badge - Matches Beagle image and Badge in screenshot */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Main Beagle Photo */}
              <div className="relative aspect-[3/2] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-[1.02] transition-transform">
                <img 
                  src="/beagle_christmas_banner_1782113066947.jpg" 
                  alt="Cheerful Christmas Beagle near Fireplace" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Badge - Matches "Instant Magic" capsule in bottom left of dog portrait */}
                <div className="absolute bottom-4 left-4 bg-white text-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-[200px] border border-slate-100">
                  <div className="text-xl">🎁</div>
                  <div className="text-left">
                    <h5 className="text-[11px] font-extrabold text-slate-900 leading-none">Instant Magic</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-none font-bold">Perfect gift for owners</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. What Pet Owners Are Saying (Testimonials) */}
        <section className={`py-20 text-center ${
          isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/30'
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                What Pet Owners Are Saying
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">
                Adorable reviews from pet parents who decorated their holidays with our AI portraits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div 
                  key={t.id} 
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between hover:translate-y-[-4px] transition-all ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-900/60' 
                      : 'border-slate-100 bg-white shadow-sm'
                  }`}
                >
                  <div>
                    {/* Stars bar */}
                    <div className="flex items-center gap-0.5 text-yellow-500 mb-3.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {/* Quote text */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic font-medium">
                      {t.quote}
                    </p>
                  </div>

                  {/* Profile info block */}
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <img 
                      src={t.avatarUrl} 
                      alt={t.author} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <h5 className={`text-xs font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {t.author}
                      </h5>
                      <p className="text-[10px] text-red-500 uppercase font-extrabold tracking-widest">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Pricing Plans Section - Directly Embedded */}
        <div className={`border-t ${isDarkMode ? 'border-slate-900 bg-slate-950/20' : 'border-slate-150 bg-slate-50/20'}`}>
          <PricingSection isDarkMode={isDarkMode} />
        </div>

        {/* 7. Frequently Asked Questions (FAQ Accordions) */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Common questions about Pets Santa holiday portraits.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen 
                      ? isDarkMode ? 'border-red-600 bg-slate-900' : 'border-red-500 bg-red-50/10'
                      : isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-white'
                  }`}
                >
                  {/* Collapsible Trigger button */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4.5 flex items-center justify-between text-slate-800 text-left font-bold text-sm sm:text-base cursor-pointer"
                  >
                    <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`} />
                  </button>

                  {/* Collapse Answer frame */}
                  {isOpen && (
                    <div className={`px-6 pb-5 text-xs sm:text-sm leading-relaxed border-t ${
                      isDarkMode ? 'text-slate-300 border-slate-800' : 'text-slate-500 border-red-100/10'
                    }`}>
                      <p className="font-medium pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Bottom CTA Banner (Dark navy background) */}
        <section className="bg-slate-950 text-white rounded-none py-20 px-6 text-center relative overflow-hidden border-t border-slate-800">
          {/* background glowing ornaments */}
          <div className="absolute top-10 left-10 text-white/5 text-7xl select-none pointer-events-none">❄️</div>
          <div className="absolute bottom-10 right-10 text-white/5 text-8xl select-none pointer-events-none">🔔</div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-semibold">
              Ready to Make Your Pet&apos;s <br /> <span className="italic">Christmas Portrait</span>?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-semibold">
              Upload a photo of your cozy puppy, fluffy cat, or cute pet companion and generate your first festive card look in seconds.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={scrollToCreator}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-extrabold tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg glowing-btn-red cursor-pointer"
              >
                Upload & Generate
              </button>
              <button
                onClick={scrollToPricing}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs uppercase font-extrabold tracking-wider rounded-xl transition-all hover:bg-opacity-80 cursor-pointer"
              >
                See Pricing
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 font-bold tracking-wide">
              🔒 No credit card or registration required to try.
            </p>
          </div>
        </section>

      </main>

      {/* 9. Footer */}
      <footer className={`py-12 border-t transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-left text-xs">
          
          {/* Logo & Info column */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-1.5 font-bold font-serif italic text-lg text-red-600 leading-none">
              <span>🎅</span> <span>Pets Santa</span>
            </div>
            <p className="leading-relaxed max-w-sm font-semibold text-[11px] text-slate-400">
              Make beautiful, customizable holiday portraits in seconds. Dress your furry friends in standard high-fidelity Christmas outfits using the power of interactive browser design.
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              © 2026 Pets Santa. All rights registered. Made with holiday love 🐾
            </p>
          </div>

          {/* Product links */}
          <div className="md:col-span-3 space-y-2 text-left">
            <h5 className={`font-extrabold text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Product
            </h5>
            <ul className="space-y-1.5 font-bold">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-red-600">
                  Home / Creator
                </button>
              </li>
              <li>
                <button onClick={scrollToPricing} className="hover:text-red-600">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => setIsLoginOpen(true)} className="hover:text-red-600">
                  Log In Account
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3 space-y-2 text-left">
            <h5 className={`font-extrabold text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Legal Policies
            </h5>
            <ul className="space-y-1.5 font-bold">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy is fully protected under local sandbox standards.'); }} className="hover:text-red-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service are active for all sandboxed users.'); }} className="hover:text-red-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" onClick={(e) => { e.preventDefault(); alert('We respect cookie rules and strictly limit storage.'); }} className="hover:text-red-600">
                  Cookie Preferences
                </a>
              </li>
            </ul>
          </div>

        </div>
      </footer>

      {/* Account LogIn Mock Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}
