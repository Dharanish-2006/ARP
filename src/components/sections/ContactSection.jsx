import { useState } from "react";
import { api } from "../../lib/api";

export default function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("submitting");
    try {
      await api.post("/enquiries", form);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  if (status === "submitted") {
    return (
      <section id="contact" className="bg-white py-12 md:py-16">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold text-[#1a5aa0] mb-4">Thank you!</h2>
          <p className="text-[#4a4a4a]">Your enquiry has been received. We'll get back to you shortly.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-white py-12 md:py-16">
      <div className="container-wide max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#4a4a4a] text-center mb-10">Get In Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Your Name" required value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#1a5aa0] focus:outline-none" />
            <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#1a5aa0] focus:outline-none" />
          </div>
          <input name="email" type="email" placeholder="Email Address" required value={form.email} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#1a5aa0] focus:outline-none" />
          <textarea name="message" rows={4} placeholder="Your Message" value={form.message} onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#1a5aa0] focus:outline-none" />
          <button type="submit" disabled={status === "submitting"}
            className="w-full sm:w-auto px-8 py-3 bg-[#1a5aa0] text-white font-semibold rounded hover:bg-[#154a82] transition-colors disabled:opacity-60">
            {status === "submitting" ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
