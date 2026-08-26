export default function SellersSection() {
  return (
    <section id="sellers" className="bg-[#f5f5f5] py-12 md:py-16">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] mb-6">Sellers</h2>
            <p className="text-[#4a4a4a] leading-relaxed mb-4">
              We will help you sell your business while maximizing its value and connecting you with buyers that are interested to buy your business.
            </p>
            <p className="text-[#4a4a4a] leading-relaxed">
              We hold your hand through the process, step-by-step, and weed out non-serious buyers. We even transfer the business to the buyer so you don't have to worry about the complex legal or operational details—we handle everything to ensure a smooth, secure, and profitable exit for you.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="/assets/sellers-image.jpg" alt="Selling your business" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
