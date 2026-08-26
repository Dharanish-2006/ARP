import { useState } from "react";

export default function PropertyGallery({ images, title }) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="flex h-[320px] w-full flex-col items-center justify-center gap-2 border border-dashed border-edge bg-surface-alt text-content-muted sm:h-[380px]">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
        <p className="text-sm">Photos coming soon</p>
      </div>
    );
  }

  return (
    <div>
      <div className="corner-frame overflow-hidden border border-edge bg-surface-alt">
        <img
          src={images[active]}
          alt={`${title} — photo ${active + 1} of ${images.length}`}
          className="h-[320px] w-full object-cover sm:h-[440px] md:h-[520px]"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`aspect-[4/3] overflow-hidden border transition-colors ${
                i === active ? "border-brass-500" : "border-edge hover:border-content-muted"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
