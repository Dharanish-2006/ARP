export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow mb-3 ${light ? "text-brass-400" : "text-brass-600"}`}>{eyebrow}</p>
      )}
      <h2
        className={`text-balance text-[2rem] leading-[1.15] sm:text-4xl md:text-[2.75rem] font-medium ${
          light ? "text-paper" : "text-content"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[1.05rem] leading-relaxed ${light ? "text-paper/70" : "text-content-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
