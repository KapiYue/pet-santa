'use client';

import React, { useState, useRef } from 'react';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  // General coordinate math
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return; // Only trigger on mouse press or touch
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
        className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 select-none cursor-ew-resize touch-none"
      >
        {/* Underlay / Before: Regular Puppy */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop" 
            alt="Before AI Christmas Outfit" 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          {/* Label bottom left */}
          <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white tracking-widest uppercase">
            Original Photo 🐶
          </div>
        </div>

        {/* Overlay / After: Christmas Dressed Puppy */}
        <div 
          className="absolute inset-0 select-none overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop" 
            alt="After AI Christmas Outfit" 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          {/* Label bottom left */}
          <div className="absolute bottom-4 left-4 bg-red-600 px-3 py-1 rounded-full text-xs font-semibold text-white tracking-widest uppercase">
            Christmas AI Portrait 🎅
          </div>
        </div>

        {/* Slider central line dragging element */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex items-center justify-center shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="h-10 w-10 rounded-full bg-white ring-4 ring-red-500 shadow-md flex items-center justify-center text-red-600 font-extrabold text-sm select-none">
            ↔
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-400 mt-3 font-semibold">
        Drag or swipe the red handle left and right to inspect the furry Christmas portrait transformation!
      </p>
    </div>
  );
}
