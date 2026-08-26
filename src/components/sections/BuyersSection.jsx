export default function BuyersSection() {
  return (
    <section id="buyers" className="bg-white py-12 md:py-16">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/buyers-image.jpg" alt="Buying a business" className="w-full h-auto object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] mb-6">Buyers</h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-4">
              We try to narrow down the search criteria for buyers in buying a business based on location, price, revenue, financing, budget, etc.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed mb-4">
              We're always looking to improve the site and our service so if you have any feedback or you are looking to sell your business, we'd love to hear from you.
            </p>
            <a href="#contact" className="inline-block text-[#1a5aa0] font-semibold hover:underline">Contact Us.</a>
          </div>
        </div>
      </div>
    </section>
  );
}
