import { useProperties } from "../../context/PropertyContext";
import ListingRow from "../listings/ListingRow";
import SectionHeading from "../ui/SectionHeading";

export default function CurrentListings() {
  const { properties, loading } = useProperties();
  const listings = properties.filter((p) => (p.listingCategory || "current") === "current");

  if (!loading && listings.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-wide">
        <SectionHeading
          eyebrow="On The Market"
          title="Current Listings"
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 space-y-5">
          {loading
            ? [0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-lg border border-edge bg-surface-alt sm:h-48" />
              ))
            : listings.map((p) => <ListingRow key={p.id} property={p} />)}
        </div>
      </div>
    </section>
  );
}