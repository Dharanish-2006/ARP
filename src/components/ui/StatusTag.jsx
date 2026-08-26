const STYLES = {
  "For Sale": "bg-emerald-900 text-paper",
  "For Lease": "bg-brass-500 text-ink",
  Pending: "bg-content text-surface",
  Sold: "bg-content-muted text-surface",
};

export default function StatusTag({ status, className = "" }) {
  return (
    <span
      className={`eyebrow inline-flex items-center px-2.5 py-1 ${STYLES[status] || "bg-ink text-paper"} ${className}`}
    >
      {status}
    </span>
  );
}
