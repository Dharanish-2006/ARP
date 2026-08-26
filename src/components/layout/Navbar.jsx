import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ backgroundColor: "#1a5aa0" }}
    >
      <nav className="container-wide flex items-center justify-between h-20 md:h-24">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/assets/profile-photo.png"
            alt="Sam Tami"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white"
          />
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-white text-xl md:text-2xl font-light tracking-wide uppercase">
            Sam Sells Biz.com
          </h1>
        </div>

        <div className="w-12 md:w-14" />
      </nav>
    </header>
  );
}
