import HeroCarousel from "../components/sections/HeroCarousel";
import BusinessBuyingSelling from "../components/sections/BusinessBuyingSelling";
import CurrentListings from "../components/sections/CurrentListings";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Avatar Realty Group helps you buy, sell, or franchise your business. Expert guidance in valuation, due diligence, negotiation, and deal structuring."
        path="/"
      />
      <HeroCarousel />
      <BusinessBuyingSelling />
      <CurrentListings />
    </>
  );
}