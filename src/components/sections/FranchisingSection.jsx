const POINTS = [
  "Trusted Brands",
  "Growth-Ready Markets",
  "Direct Franchisee Contact",
];

export default function FranchisingSection() {
  return (
    <section id="franchising" className="bg-[#f5f5f5] py-12 md:py-16">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] mb-6">Franchising</h2>
            <p className="text-[#4a4a4a] font-semibold mb-2">Discover Franchise Opportunities That Work</p>
            <p className="text-[#4a4a4a] leading-relaxed mb-6">
              Explore top-rated, verified franchise listings – from food and retail to education and services – across locations that matter to you.
            </p>
            <div className="space-y-3">
              {POINTS.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a5aa0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-[#4a4a4a]">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/franchising-image.jpg" alt="Franchising opportunities" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
