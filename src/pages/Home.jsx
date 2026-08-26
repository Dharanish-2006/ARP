import HeroCarousel from "../components/sections/HeroCarousel";
import BusinessBuyingSelling from "../components/sections/BusinessBuyingSelling";
import SellersSection from "../components/sections/SellersSection";
import BuyersSection from "../components/sections/BuyersSection";
import FranchisingSection from "../components/sections/FranchisingSection";
import CurrentListings from "../components/sections/CurrentListings";
import SoldListings from "../components/sections/SoldListings";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <BusinessBuyingSelling />
      <SellersSection />
      <BuyersSection />
      <FranchisingSection />
      <CurrentListings />
      <SoldListings />
      <ContactSection />
    </>
  );
}
