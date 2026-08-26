import { motion } from "framer-motion";

const VARIANTS = {
  skyline: (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
      <rect x="20" y="150" width="46" height="130" fill="currentColor" opacity="0.9" />
      <rect x="76" y="90" width="34" height="190" fill="currentColor" opacity="0.75" />
      <rect x="120" y="120" width="52" height="160" fill="currentColor" />
      <rect x="182" y="60" width="30" height="220" fill="currentColor" opacity="0.65" />
      <rect x="222" y="140" width="46" height="140" fill="currentColor" opacity="0.85" />
      <rect x="278" y="100" width="36" height="180" fill="currentColor" opacity="0.7" />
      <rect x="324" y="170" width="56" height="110" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.8">
        <rect x="40" y="40" width="320" height="220" />
        <line x1="180" y1="40" x2="180" y2="150" />
        <line x1="180" y1="150" x2="360" y2="150" />
        <line x1="260" y1="150" x2="260" y2="260" />
        <circle cx="90" cy="90" r="14" />
        <circle cx="90" cy="90" r="2" fill="currentColor" />
      </g>
    </svg>
  ),
  keys: (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.85">
        <circle cx="150" cy="150" r="46" />
        <line x1="196" y1="150" x2="320" y2="150" />
        <line x1="270" y1="150" x2="270" y2="180" />
        <line x1="300" y1="150" x2="300" y2="190" />
      </g>
    </svg>
  ),
};

/**
 * Textured, on-brand generative panel used anywhere the site would
 * otherwise need stock photography (hero, about, team, locations). Avoids
 * placeholder photo services entirely — every visual here is drawn, not
 * fetched — and doubles as the site's "interactive" ambient motif.
 */
export default function AbstractPanel({
  variant = "skyline",
  tone = "emerald",
  className = "",
  animated = true,
}) {
  const toneClasses =
    tone === "emerald"
      ? "bg-[radial-gradient(circle_at_30%_20%,var(--color-emerald-700),var(--color-emerald-950)_70%)] text-brass-400"
      : tone === "brass"
      ? "bg-[radial-gradient(circle_at_70%_30%,var(--color-brass-200),var(--color-brass-600)_75%)] text-emerald-950"
      : "bg-[radial-gradient(circle_at_50%_10%,var(--color-surface-alt),var(--color-surface)_75%)] text-content/70";

  return (
    <div className={`relative overflow-hidden ${toneClasses} ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={animated ? { opacity: 0, scale: 1.06 } : false}
        whileInView={animated ? { opacity: 1, scale: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
      >
        {VARIANTS[variant]}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.25)_100%)]" />
    </div>
  );
}
