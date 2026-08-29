import SEO from "../components/SEO";
import ContactSection from "../components/sections/ContactSection";

const CONTACT_DETAILS = [
  {
    label: "Address",
    value: "1700 Eureka Road, Roseville, CA 95661",
    href: "https://maps.google.com/?q=1700+Eureka+Road,+Roseville,+CA+95661",
    external: true,
  },
  {
    label: "Phone",
    value: "(916) 398-8282",
    href: "tel:+19163988282",
  },
  {
    label: "Email",
    value: "Sam@avatarrealtygroup.com",
    href: "mailto:Sam@avatarrealtygroup.com",
  },
];

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Avatar Realty Group to discuss buying, selling, or franchising your business."
        path="/contact"
      />

      <section className="bg-white pt-12 md:pt-16">
        <div className="container-wide">
          <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wide text-[#4a4a4a] md:text-3xl">
            Contact Information
          </h2>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
            {CONTACT_DETAILS.map((d) => (
              <a
                key={d.label}
                href={d.href}
                target={d.external ? "_blank" : undefined}
                rel={d.external ? "noreferrer" : undefined}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-5 text-center transition-colors hover:border-[#1a5aa0]"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[#1a5aa0]">
                  {d.label}
                </span>
                <span className="text-sm font-medium text-[#4a4a4a]">{d.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}