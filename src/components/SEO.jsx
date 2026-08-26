import { useEffect } from "react";

const SITE_NAME = "Avatar Realty Group";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets the document title + meta description/canonical/OG tags for the
 * current route. A real deployment could swap this for react-helmet-async
 * or framework-level metadata (Next.js, Remix) without changing callers.
 */
export default function SEO({ title, description, path = "" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Homes Represented With Precision`;
    document.title = fullTitle;
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://www.avatarrealtygroup.com${path}`);
  }, [title, description, path]);

  return null;
}
