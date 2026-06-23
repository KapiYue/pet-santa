'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Sparkles, RefreshCw, Download, 
  Trash2, Plus, Minus, RotateCw, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { OUTFITS, BACKGROUNDS, PRESET_PETS } from './data';
import { Outfit, BackgroundOption, PresetPet, StickerInstance } from './types';

export default function PortraitStudio() {
  // Navigation & Core States
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit>(OUTFITS[0]);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(BACKGROUNDS[0]);
  const [petSource, setPetSource] = useState<'preset' | 'upload'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<PresetPet>(PRESET_PETS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Custom Card Studio states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isGeneratedState, setIsGeneratedState] = useState(false);
  const [cardHeading, setCardHeading] = useState('Merry Christmas!');
  const [cardTextColor, setCardTextColor] = useState('#ef4444'); // Default red
  const [cardFont, setCardFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [isPrivateTipOpen, setIsPrivateTipOpen] = useState(true);

  // Sticker/Accoutrements States
  const [stickers, setStickers] = useState<StickerInstance[]>([
    {
      id: 'default-hat',
      type: 'emoji',
      content: '🎅',
      label: 'Santa Hat',
      x: 50,
      y: 20,
      scale: 1.4,
      rotation: -10,
    }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>('default-hat');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-equip outfit-specific stickers when changing styles or entering states
  useEffect(() => {
    // Equips standard matching emojis based on the outfit selection
    const defaultStickerMap: Record<string, { emoji: string; name: string; y: number; scale: number }> = {
      santa: { emoji: '🎅', name: "Santa Hat", y: 22, scale: 1.4 },
      elf: { emoji: '🎄', name: "Elf Collar", y: 78, scale: 1.2 },
      reindeer: { emoji: '🦌', name: "Reindeer Antlers", y: 15, scale: 1.5 },
      sweater: { emoji: '🧣', name: "Warm Scarf", y: 74, scale: 1.3 },
      winter: { emoji: '❄️', name: "Winter Ear Muffs", y: 35, scale: 1.2 },
      gift: { emoji: '🎁', name: "Golden Collar Ribbon", y: 82, scale: 1.3 },
    };

    const config = defaultStickerMap[selectedOutfit.id] || { emoji: '🎅', name: "Santa Hat", y: 22, scale: 1.4 };
    
    // Add or swap the outfit sticker
    setStickers([
      {
        id: `outfit-${selectedOutfit.id}`,
        type: 'emoji',
        content: config.emoji,
        label: config.name,
        x: 50,
        y: config.y,
        scale: config.scale,
        rotation: 0
      }
    ]);
    setSelectedStickerId(`outfit-${selectedOutfit.id}`);
  }, [selectedOutfit]);

  // Upload a pet photo to Vercel Blob via our own API route (server-side upload).
  // The outbound request to Vercel Blob is made by the server, so it goes
  // through the proxy configured in instrumentation.ts instead of the browser
  // hitting vercel.com directly.
  const uploadPetImage = async (file: File) => {
    setPetSource('upload');
    setUploadError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed. Please try again.');
      }

      setUploadedImage(data.url);
    } catch (err) {
      console.error('Blob upload failed:', err);
      setUploadError(
        err instanceof Error ? err.message : 'Upload failed. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle uploaded picture files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void uploadPetImage(file);
    }
    // Allow re-selecting the same file twice in a row.
    e.target.value = '';
  };

  // Drag-and-drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      void uploadPetImage(file);
    }
  };

  // Spend credits, then run the AI generation pipeline. Credits are the source
  // of truth on the server (/api/generate), so we charge before rendering.
  const handleGenerateClick = async () => {
    try {
      const res = await fetch('/api/generate', { method: 'POST' });

      if (res.status === 401) {
        toast.error('Please log in to generate portraits.');
        window.location.href = '/signin';
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.status === 402) {
        toast.error('Not enough credits. Redirecting you to buy more…');
        window.location.href = '/pricing';
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Could not start generation.');
      }

      toast.success(`Generating! ${data.credits} credits remaining.`);
    } catch (err) {
      console.error('Generation charge failed:', err);
      toast.error(err instanceof Error ? err.message : 'Could not start generation.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);
    
    const steps = [
      "Analyzing pet facial structures ( ears, eyes, nose)...",
      "Drafting custom digital outfit layout patterns...",
      "Weaving custom lighting & holiday shadows...",
      "Blending pet fur & whiskers seamlessly with outfit fabric...",
      "Rendering final Christmas Portrait cards..."
    ];

    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setIsGeneratedState(true);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  // Preset Sticker library additions
  const addNewSticker = (emoji: string, label: string) => {
    const newId = `sticker-${Date.now()}`;
    const newSticker: StickerInstance = {
      id: newId,
      type: 'emoji',
      content: emoji,
      label,
      x: 50,
      y: 45,
      scale: 1.0,
      rotation: 0
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newId);
  };

  // Handle sticker updates via helper panel
  const updateSelectedSticker = (key: keyof StickerInstance, value: number) => {
    if (!selectedStickerId) return;
    setStickers(prev => prev.map(sticker => {
      if (sticker.id === selectedStickerId) {
        let currentVal = sticker[key] as number;
        // Clamp and safely adjust controls
        if (key === 'scale') {
          currentVal = Math.max(0.3, Math.min(3.5, currentVal + value));
        } else if (key === 'rotation') {
          currentVal = (currentVal + value + 360) % 360;
        } else if (key === 'x' || key === 'y') {
          currentVal = Math.max(5, Math.min(95, currentVal + value));
        }
        return { ...sticker, [key]: currentVal };
      }
      return sticker;
    }));
  };

  const deleteSelectedSticker = () => {
    if (!selectedStickerId) return;
    setStickers(prev => prev.filter(s => s.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  // Composite elements onto HTML Canvas and trigger standard JPEG download
  const downloadHolidayCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw gradient background
    const bg = selectedBackground;
    if (bg.id === 'fireplace') {
      const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(1, '#311005');
      ctx.fillStyle = gradient;
    } else if (bg.id === 'snowy-forest') {
      const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = gradient;
    } else if (bg.id === 'warm-lights') {
      const gradient = ctx.createRadialGradient(500, 500, 50, 500, 500, 700);
      gradient.addColorStop(0, '#270606');
      gradient.addColorStop(1, '#0c0202');
      ctx.fillStyle = gradient;
    } else if (bg.id === 'starry-night') {
      const gradient = ctx.createLinearGradient(0, 0, 1000, 0);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
    } else if (bg.id === 'candy-cane') {
      const gradient = ctx.createLinearGradient(120, 0, 880, 1000);
      gradient.addColorStop(0, '#7f1d1d');
      gradient.addColorStop(1, '#991b1b');
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
      gradient.addColorStop(0, '#451a03');
      gradient.addColorStop(1, '#78350f');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, 1000, 1000);

    // Write a beautiful snow flake texture pattern manually on canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 80; i++) {
      const sx = Math.sin(i * 9128.3) * 500 + 500;
      const sy = Math.cos(i * 3824.1) * 500 + 500;
      const sr = (Math.cos(i * 128) * 3) + 4;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Load pet portrait image and draw
    const petImg = new Image();
    petImg.crossOrigin = 'anonymous'; // Support external unsplash URLs without breaking
    petImg.onload = () => {
      // Draw centered circular or rounded-box pet image frame
      const cardSize = 640;
      const centerX = 500;
      const centerY = 480;

      ctx.save();
      
      // Draw rounded card frame clipping path for pet
      ctx.beginPath();
      ctx.roundRect(centerX - (cardSize / 2), centerY - (cardSize / 2), cardSize, cardSize, 32);
      ctx.clip();

      // Draw loaded image inside frame (calculating object-fit cover equivalent)
      const imgWidth = petImg.width;
      const imgHeight = petImg.height;
      const minDimension = Math.min(imgWidth, imgHeight);
      
      const sourceX = (imgWidth - minDimension) / 2;
      const sourceY = (imgHeight - minDimension) / 2;

      ctx.drawImage(
        petImg,
        sourceX, sourceY, minDimension, minDimension, // source rect
        centerX - (cardSize / 2), centerY - (cardSize / 2), cardSize, cardSize // dest rect
      );
      
      ctx.restore();

      // Draw decorative gold frame box
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.lineWidth = 6;
      ctx.strokeRect(centerX - (cardSize / 2) - 3, centerY - (cardSize / 2) - 3, cardSize + 6, cardSize + 6);

      // 3. Draw Stickers
      stickers.forEach(sticker => {
        // Calculate coordinate absolute offset
        const stickerX = centerX - (cardSize / 2) + (sticker.x / 100) * cardSize;
        const stickerY = centerY - (cardSize / 2) + (sticker.y / 100) * cardSize;
        const finalSize = 55 * sticker.scale;

        ctx.save();
        ctx.translate(stickerX, stickerY);
        ctx.rotate((sticker.rotation * Math.PI) / 180);

        ctx.font = `${finalSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.content, 0, 0);
        ctx.restore();
      });

      // 4. Draw Header/Footer Texts
      ctx.fillStyle = cardTextColor;
      ctx.textAlign = 'center';
      
      if (cardFont === 'serif') {
        ctx.font = '68px italic "Playfair Display", Georgia, serif';
      } else if (cardFont === 'script') {
        ctx.font = '78px "Dancing Script", cursive';
      } else {
        ctx.font = '700 62px "Plus Jakarta Sans", sans-serif';
      }
      
      // Write card message on top
      ctx.fillText(cardHeading, centerX, 110);

      // Draw bottom subtext
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`🎅 AI PORTRAIT BY PETS SANTA (2026 Collection) 🌲`, centerX, 930);

      // Trigger automatic safe browser download link
      try {
        const link = document.createElement('a');
        link.download = `Pets_Santa_Christmas_Card_${selectedPreset.name || 'Pet'}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Canvas export failed. This happens on raw image domain locks.", err);
        alert("Downloaded failed because of cross-origin image constraints on standard CDN URLs. Please upload a local image to bypass cross-origin browser locks!");
      }
    };

    // Determine the path to draw
    const imgSource = petSource === 'preset' ? selectedPreset.imageUrl : uploadedImage;
    if (imgSource) {
      petImg.src = imgSource;
    }
  };

  // Helper arrays for the editor stickers selection
  const stickerOptions = [
    { emoji: '🎅', label: 'Santa Hat' },
    { emoji: '🧝', label: 'Elf Hat' },
    { emoji: '🦌', label: 'Reindeer Horns' },
    { emoji: '🧣', label: 'Cozy Scarf' },
    { emoji: '🧥', label: 'Festive Coat' },
    { emoji: '💡', label: 'Twinkle Light' },
    { emoji: '🔔', label: 'Bell Collar' },
    { emoji: '🎁', label: 'Gift Box' },
    { emoji: '🎀', label: 'Large Bow' },
    { emoji: '❄️', label: 'Snowflake' },
    { emoji: '🍪', label: 'Dog Biscuit' },
    { emoji: '🍗', label: 'Tasty bone' },
    { emoji: '👓', label: 'Fun Spectacles' },
    { emoji: '👑', label: 'Luxe Crown' },
    { emoji: '⭐', label: 'Magic Star' }
  ];

  return (
    <div id="portrait-creator" className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Dynamic Private Photos Notice Badge */}
      {isPrivateTipOpen && (
        <div className="bg-red-50 text-red-800 px-6 py-3 border-b border-red-100 flex items-center justify-between text-xs sm:text-sm font-medium transition-all">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-semibold text-red-900">Your Photos Stay Protected:</span>
            <span>All pet portrait composition runs 100% locally inside your client sandbox. No files are stored.</span>
          </div>
          <button 
            onClick={() => setIsPrivateTipOpen(false)} 
            className="text-red-700 hover:text-red-900 font-bold ml-4 p-1 hover:bg-red-100 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Options on left, Preview/Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Side: Customization Core Panel (LG covers 5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-100 p-6 flex flex-col justify-between bg-slate-50/20">
          <div>
            {/* Steps & Selector Nav */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 mb-2">
                <Sparkles className="w-3 h-3" /> Step 1: Select Your Styling Outfit
              </span>
              <p className="text-slate-500 text-xs">Instantly fit festive Christmas wardrobes styled by AI.</p>
            </div>

            {/* Outfits Grid: Matches screenshot exactly */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {OUTFITS.map((outfit) => {
                const isSelected = selectedOutfit.id === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    onClick={() => {
                      setSelectedOutfit(outfit);
                      if (isGeneratedState) {
                        // Gently reset state to generate again
                        setIsGeneratedState(false);
                      }
                    }}
                    className={`group relative flex flex-col items-center justify-center p-3.5 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-900 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* Top small Badge Indicator */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white font-bold">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1.5 transform group-hover:scale-110 transition-transform">
                      {outfit.emoji}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-slate-950">
                      {outfit.tagline}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Background Style Select */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-600 tracking-wide uppercase mb-2">
                Step 2: Christmas Card Background
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUNDS.map((bg) => {
                  const isSelected = selectedBackground.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'border-slate-800 bg-slate-900 text-white font-semibold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">{bg.emoji}</span>
                      <span className="text-[10px] mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">
                        {bg.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pet Photo Source Selector */}
            <div className="mb-6 border-t border-slate-100 pt-5">
              <label className="block text-xs font-bold text-slate-600 tracking-wide uppercase mb-3">
                Step 3: Pick a Furry Model
              </label>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-3 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setPetSource('preset')}
                  className={`flex-1 py-1.5 text-center font-semibold rounded-md transition-all ${
                    petSource === 'preset' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Cute Presets (Try Instantly)
                </button>
                <button
                  onClick={() => {
                    setPetSource('upload');
                    if (!uploadedImage && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className={`flex-1 py-1.5 text-center font-semibold rounded-md transition-all ${
                    petSource === 'upload' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Upload Your Own Pet 📷
                </button>
              </div>

              {/* Presets List View */}
              {petSource === 'preset' ? (
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PETS.map((pet) => {
                    const isSelected = selectedPreset.id === pet.id;
                    return (
                      <button
                        key={pet.id}
                        onClick={() => {
                          setSelectedPreset(pet);
                          if (isGeneratedState) setIsGeneratedState(false);
                        }}
                        className={`group relative flex flex-col items-center p-1 border-2 rounded-xl overflow-hidden transition-all text-center ${
                          isSelected ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-bold mt-1 max-w-full truncate text-slate-700">
                          {pet.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Upload Button Action Box */
                <div>
                  {isUploading ? (
                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <RefreshCw className="w-5 h-5 text-red-500 animate-spin shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">Uploading to cloud…</p>
                        <p className="text-[10px] text-slate-500">Saving your pet photo to Vercel Blob</p>
                      </div>
                    </div>
                  ) : uploadedImage ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded pet" 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-emerald-900">Custom Pet Loaded</p>
                          <p className="text-[10px] text-emerald-700">Stored safely in the cloud</p>
                        </div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center py-4 border-2 border-dashed border-red-200 rounded-xl bg-red-50/20 hover:bg-red-50/40 text-red-600 transition-all text-center"
                    >
                      <UploadCloud className="w-6 h-6 mb-1 text-red-400" />
                      <span className="text-xs font-bold text-red-800">Choose Image File</span>
                      <span className="text-[9px] text-slate-400">JPG, PNG, WEBP or GIF · up to 4MB</span>
                    </button>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-[10px] font-semibold text-red-600">
                      ⚠️ {uploadError}
                    </p>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger Foot */}
          <div className="mt-8 border-t border-slate-100 pt-5">
            {!isGeneratedState ? (
              <button
                onClick={() => void handleGenerateClick()}
                className="w-full relative overflow-hidden bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 glowing-btn-red cursor-pointer"
              >
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Generate Christmas Look</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsGeneratedState(false)}
                  className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Outfit</span>
                </button>
                <button
                  onClick={downloadHolidayCard}
                  className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JPG</span>
                </button>
              </div>
            )}
            <p className="text-center text-[10px] text-slate-400 mt-2.5">
              💡 Drag, resize, and spin outfits on the right to fit your pet perfectly!
            </p>
          </div>
        </div>

        {/* Right Side: Preview, Canvas and DIY Sticker Accessories Panel (LG covers 7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-6 flex flex-col justify-between relative min-h-[500px]">
          
          {/* Main Visual Frame & Interactive Customizer */}
          <div className="flex-1 flex flex-col items-center justify-center">

            {/* Generating Loading State Overlays */}
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center text-white rounded-r-3xl">
                <div className="relative mb-6">
                  {/* Glowing Snowflake Animation */}
                  <span className="text-6xl animate-spin block" style={{ animationDuration: '6s' }}>❄️</span>
                  <span className="absolute inset-0 text-6xl text-white/45 blur-md animate-ping">❄️</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">Pets Santa AI in Progress...</h3>
                
                {/* Progress bar */}
                <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
                  <div 
                    className="h-full bg-red-500 transition-all duration-700 ease-out"
                    style={{ width: `${((generationStep + 1) / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Loading Status logger */}
                <p className="text-sm text-red-200 font-mono italic max-w-sm animate-pulse">
                  {generationStep === 0 && "Sensing canine/feline structural frames..."}
                  {generationStep === 1 && "Shoveling snow & fetching shiny outfits..."}
                  {generationStep === 2 && "Synthesizing custom velvet outfits on fur..."}
                  {generationStep === 3 && "Polishing glowing Christmas lights & shades..."}
                  {generationStep === 4 && "Wrapping card together perfectly..."}
                </p>

                <p className="text-[10px] text-slate-400 mt-12 tracking-wider">
                  DO NOT REFRESH • HIGH RESOLUTION PORTRAIT CREATION
                </p>
              </div>
            )}

            {/* Dashboard Display Case: Interactive Canvas Wrapper */}
            <div 
              ref={previewContainerRef}
              className="relative w-full max-w-[420px] aspect-square rounded-3xl shadow-xl overflow-hidden transition-all border-2 border-slate-200"
              style={{
                background: selectedBackground.style,
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Christmas Card Holiday Message Overlay */}
              <div className="absolute top-4 left-0 right-0 z-10 text-center">
                <h4 
                  style={{ 
                    color: cardTextColor,
                    fontFamily: cardFont === 'serif' ? 'Playfair Display' : cardFont === 'script' ? 'Dancing Script' : 'Plus Jakarta Sans',
                    fontWeight: cardFont === 'serif' ? '600' : 'bold'
                  }}
                  className={`text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide select-none ${
                    cardFont === 'script' ? 'text-4xl italic px-3 font-normal' : ''
                  }`}
                >
                  {cardHeading}
                </h4>
              </div>

              {/* Snowfall background decoration particles */}
              <div className="absolute inset-0 pointer-events-none opacity-40 select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]">
                <div className="text-white text-xs absolute top-[10%] left-[15%] animate-pulse">❄️</div>
                <div className="text-white text-lg absolute top-[30%] right-[10%] animate-pulse" style={{ animationDelay: '0.5s' }}>❄️</div>
                <div className="text-white text-md absolute bottom-[20%] left-[8%] animate-pulse" style={{ animationDelay: '1.2s' }}>❄️</div>
                <div className="text-white text-xs absolute bottom-[40%] right-[18%] animate-pulse" style={{ animationDelay: '1.8s' }}>❄️</div>
                <div className="text-white text-lg absolute top-[40%] left-[40%] opacity-20">❄️</div>
              </div>

              {/* Main Pet Image Core Frame */}
              <div className="absolute inset-x-8 top-16 bottom-16 rounded-2xl overflow-hidden border border-white/20 shadow-md bg-slate-900/10">
                {petSource === 'preset' ? (
                  <img
                    src={selectedPreset.imageUrl}
                    alt="Active pet avatar"
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                ) : isUploading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white/70 backdrop-blur-sm">
                    <RefreshCw className="w-8 h-8 mb-2 text-red-500 animate-spin" />
                    <p className="text-xs font-bold text-red-600">Uploading your pet photo…</p>
                    <p className="text-[10px] text-slate-400 mt-1">Saving to cloud storage</p>
                  </div>
                ) : uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded pet portrait"
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  /* Initial Empty Upload Box state inside card */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white/70 backdrop-blur-sm dashed-dropzone">
                    <span className="text-4xl mb-2 animate-bounce">🐶</span>
                    <p className="text-xs font-bold text-red-600">No custom photo uploaded yet</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                      Click "Cute Presets" or drag-and-drop a photo directly here to test!
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-extrabold uppercase shadow"
                    >
                      Browse Device
                    </button>
                  </div>
                )}
              </div>

              {/* STICKERS LAYER OVERLAY */}
              {stickers.map((sticker) => {
                const isSelected = selectedStickerId === sticker.id;
                return (
                  <div
                    key={sticker.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(sticker.id);
                    }}
                    style={{
                      left: `calc(32px + (${sticker.x / 100} * (100% - 64px)))`,
                      top: `calc(64px + (${sticker.y / 100} * (100% - 128px)))`,
                      transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                      cursor: 'move',
                    }}
                    className={`absolute z-20 select-none p-1.5 rounded-lg active:scale-105 transition-shadow ${
                      isSelected 
                        ? 'ring-2 ring-red-500 bg-white/60 backdrop-blur-sm shadow-lg' 
                        : 'hover:ring-1 hover:ring-slate-300'
                    }`}
                  >
                    <span className="text-4xl block leading-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                      {sticker.content}
                    </span>
                    
                    {/* Tiny delete visual anchor for chosen sticker */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSelectedSticker();
                        }}
                        className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-extrabold shadow"
                        title="Delete Accessory"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Watermark branding sign off footer */}
              <div className="absolute bottom-4 left-0 right-0 text-center select-none">
                <span className="text-[9px] tracking-widest text-white/50 uppercase font-mono">
                  🎄 Pets Santa AI Portrait Generator 🎄
                </span>
              </div>
            </div>

            {/* Sticker Studio Controls (Shown if we are in generated state or simply tweaking outfits!) */}
            <div className="w-full mt-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-600"></span>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Interactive Sticker Studio Tool
                  </h4>
                </div>
                {stickers.length > 0 && selectedStickerId && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                    Adjusting: {stickers.find(s => s.id === selectedStickerId)?.label || 'Selected Item'}
                  </span>
                )}
              </div>

              {selectedStickerId ? (
                /* Interactive adjustments deck */
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                    {/* Scale Controls */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Scale / Size</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateSelectedSticker('scale', -0.1)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Shrink"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateSelectedSticker('scale', 0.1)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Enlarge"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rotation Controls */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Spin / Rotate</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateSelectedSticker('rotation', -15)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Rotate Left"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateSelectedSticker('rotation', 15)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Rotate Right"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Fine coordinate X axis */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Move Left/Right</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateSelectedSticker('x', -3)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Move Left"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => updateSelectedSticker('x', 3)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Move Right"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Fine coordinate Y axis */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Move Up/Down</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateSelectedSticker('y', -3)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => updateSelectedSticker('y', 3)}
                          className="flex-1 py-1 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-xs flex justify-center"
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 text-xs">
                    <button
                      onClick={deleteSelectedSticker}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Accessory
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">
                      💡 Click anywhere else on the card to deselect.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2.5 text-center text-xs text-slate-400 font-medium">
                  Select any active outfit sticker on the image template above to unlock scaling, positioning, and rotation keys!
                </div>
              )}

              {/* Card Label Customization (Heading Text) */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Text entry field (covers 6 columns) */}
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Card Heading Text
                  </label>
                  <input
                    type="text"
                    value={cardHeading}
                    onChange={(e) => setCardHeading(e.target.value)}
                    placeholder="Enter greeting..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-slate-50/50 font-medium"
                  />
                </div>

                {/* Fonts (covers 4 columns) */}
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Heading Typeface
                  </label>
                  <div className="flex gap-1">
                    {(['serif', 'script', 'sans'] as const).map(font => (
                      <button
                        key={font}
                        onClick={() => setCardFont(font)}
                        className={`flex-1 py-1.5 border rounded-lg text-[10px] uppercase font-bold text-center capitalize ${
                          cardFont === font 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors (covers 4 columns) */}
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Text Theme Color
                  </label>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    {[
                      { hex: '#ef4444', label: 'Festive Red' },
                      { hex: '#16a34a', label: 'Pine Green' },
                      { hex: '#ca8a04', label: 'Warm gold' },
                      { hex: '#ffffff', label: 'Snow white' },
                      { hex: '#1e1b4b', label: 'Dark Navy' }
                    ].map(color => (
                      <button
                        key={color.hex}
                        onClick={() => setCardTextColor(color.hex)}
                        title={color.label}
                        className={`w-6 h-6 rounded-full border transition-transform ${
                          cardTextColor === color.hex ? 'scale-125 ring-2 ring-red-400' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stickers Add Chest */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                  Add Holiday Decorations (Tap to Place)
                </label>
                <div className="flex flex-wrap gap-2">
                  {stickerOptions.map((st) => (
                    <button
                      key={st.label}
                      onClick={() => addNewSticker(st.emoji, st.label)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-sm text-xs transition-all tracking-wide font-medium"
                    >
                      <span className="text-lg">{st.emoji}</span>
                      <span className="text-[10px] text-slate-600">{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
