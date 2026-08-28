import SEO from "../components/SEO";
import ContactSection from "../components/sections/ContactSection";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Avatar Realty Group to discuss buying, selling, or franchising your business."
        path="/contact"
      />
      <ContactSection />
    </>
  );
}