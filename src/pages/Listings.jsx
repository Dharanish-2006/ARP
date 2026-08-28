import SEO from "../components/SEO";
import CurrentListings from "../components/sections/CurrentListings";
import SoldListings from "../components/sections/SoldListings";

export default function Listings() {
  return (
    <>
      <SEO
        title="Listings"
        description="Browse current and sold business listings represented by Avatar Realty Group."
        path="/listings"
      />
      <CurrentListings />
      <SoldListings />
    </>
  );
}