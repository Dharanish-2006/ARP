import { useProperties } from "../../context/PropertyContext";
import ListingRow from "../listings/ListingRow";
import SectionHeading from "../ui/SectionHeading";

const STATIC_SOLD = [];

export default function SoldListings() {
  const { properties } = useProperties();
  const dbSold = properties.filter((p) => p.listingCategory === "sold");
  const listings = dbSold.length > 0 ? dbSold : STATIC_SOLD;

  return (
    <section className="bg-[#f5f5f5] py-14 md:py-20">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Sold Listings"
          title="Sold Listings"
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 space-y-5">
          {listings.map((p) => <ListingRow key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
}