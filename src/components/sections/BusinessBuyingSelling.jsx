const POINTS = [
  "We navigate the process of buying or selling a business. When you're ready to sell, buy, or franchise your business, call us and we will help to connect both business buyers and sellers.",
  "We offer expertise in valuation, due diligence, negotiation, and deal structuring and also assist with marketing the business for sale, connecting with potential buyers, and ensuring a smooth transaction. There are always business owners looking to sell and we are here to help.",
  "We understand the needs of business owners and smoothly facilitate transaction for buyers and sellers based on our experience.",
];

export default function BusinessBuyingSelling() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-wide text-center">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] mb-8">
          Business Buying / Selling
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-left">
          {POINTS.map((point, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 mt-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a5aa0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
