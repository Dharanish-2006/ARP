import { useState } from "react";

const SOLD_LISTINGS = [
  { id: "sold-indian", title: "Indian Spice Restaurant", image: "/assets/sold-indian-spice.jpg" },
  { id: "sold-bawarchi", title: "Bawarchi Indian Cuisine", image: "/assets/sold-bawarchi.jpg" },
  { id: "sold-lakeside", title: "LakeSide Indian Cuisine", image: "/assets/sold-lakeside.jpg" },
  { id: "sold-subway", title: "SubWay", image: "/assets/listing-subway.jpg" },
  { id: "sold-taj", title: "Taj of Marin", image: "/assets/listing-taj-marin.jpg" },
];

function SoldCard({ listing }) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg group">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-3 left-3">
        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Sold</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="border-4 border-[#c41e3a] text-[#c41e3a] font-black text-3xl md:text-4xl uppercase px-4 py-2 rotate-[-12deg] opacity-90"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.15)" }}>
          SOLD
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-semibold">{listing.title}</h3>
      </div>
    </div>
  );
}

export default function SoldListings() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(SOLD_LISTINGS.length / itemsPerPage);
  const visibleListings = SOLD_LISTINGS.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="bg-[#f5f5f5] py-12 md:py-16">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] text-center mb-10">Sold Listing</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleListings.map((listing) => (
            <SoldCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentPage ? "bg-[#4a4a4a]" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
