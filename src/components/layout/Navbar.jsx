import { useState, useEffect } from "react";
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
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-white text-2xl font-bold tracking-wide uppercase">
            Avatar Realty Group
          </h1>
        </div>

        <div className="w-12 md:w-14" />
      </nav>
    </header>
  );
}
