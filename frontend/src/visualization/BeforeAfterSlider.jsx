import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * BeforeAfterSlider
 * Overlays two images with a draggable divider.
 * Props:
 *   beforeSrc: base64 or URL string for the "before" (original) image
 *   afterSrc:  base64 or URL string for the "after" (predicted) image
 *   beforeLabel: label string (default "Original")
 *   afterLabel: label string (default "Predicted")
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "Predicted",
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0–100
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const onMouseDown = (e) => {
    dragging.current = true;
    updatePosition(e.clientX);
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onMouseUp = () => { dragging.current = false; };

  const onTouchMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
      className="relative w-full aspect-square rounded-2xl overflow-hidden
                 cursor-col-resize select-none shadow-lifted border border-white/60"
    >
      {/* After (back layer — full width) */}
      <img
        src={`data:image/png;base64,${afterSrc}`}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Before (clipped to left of slider) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={`data:image/png;base64,${beforeSrc}`}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${10000 / sliderPos}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]
                   pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={(e) => { dragging.current = true; updatePosition(e.touches[0].clientX); }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20
                   w-10 h-10 rounded-full bg-white shadow-lifted
                   border-2 border-violet-400 flex items-center justify-center
                   cursor-col-resize"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="flex gap-0.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="block w-1 h-1 rounded-full bg-violet-400" />
              <span className="block w-1 h-1 rounded-full bg-violet-400" />
              <span className="block w-1 h-1 rounded-full bg-violet-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <span className="bg-black/50 backdrop-blur-sm text-white text-xs
                         font-medium px-2.5 py-1 rounded-lg">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-3 right-3 pointer-events-none">
        <span className="bg-black/50 backdrop-blur-sm text-white text-xs
                         font-medium px-2.5 py-1 rounded-lg">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
