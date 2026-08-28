import SEO from "../components/SEO";
import SellersSection from "../components/sections/SellersSection";
import BuyersSection from "../components/sections/BuyersSection";
import FranchisingSection from "../components/sections/FranchisingSection";

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Learn how Avatar Realty Group helps business sellers, buyers, and franchisees through every step of the transaction."
        path="/about"
      />
      <SellersSection />
      <BuyersSection />
      <FranchisingSection />
    </>
  );
}