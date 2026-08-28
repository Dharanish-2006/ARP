import { Link } from "react-router-dom";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { label: "Twitter", href: "https://twitter.com", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { label: "YouTube", href: "https://youtube.com", icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a5aa0" }}>
      <div className="container-wide py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-lg font-semibold uppercase tracking-wide mb-4">
              Avatar Realty Groups
            </h3>
            <img
              src="/assets/footer-photo.jpg"
              alt="Sam Tami"
              className="w-24 h-24 rounded-full object-cover border-2 border-white"
            />
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/listings" className="hover:text-white">Listings</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="text-white font-medium">Sam Tami</li>
              <li><a href="mailto:sam@samsellsbiz.com" className="hover:text-white">sam@samsellsbiz.com</a></li>
              <li><a href="tel:+19164700909" className="hover:text-white">(916) 470-0909</a></li>
              <li>CA DRE# 01454398</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Avatar Reality Groups
          </p>
        </div>
      </div>
    </footer>
  );
}