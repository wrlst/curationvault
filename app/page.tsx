import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { collections } from "@/lib/collections";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <p className="eyebrow">A CURATED DIGITAL ARCHIVE</p>

        <h1>A collection of things worth discovering.</h1>

        <p className="hero-description">
          A considered archive of architecture, interior spaces, objects, and
          the ideas surrounding them.
        </p>
      </section>

      <section className="world-section" id="collections">
        <div className="section-label">
          <span>01—03</span>
          <span>EXPLORE THE VAULT</span>
        </div>

        <div className="world-list">
          {collections.map((collection) => (
            <Link
              href={`/${collection.slug}`}
              className="world-row"
              key={collection.slug}
            >
              <span className="world-number">{collection.number}</span>

              <div className="world-content">
                <h2>{collection.title}</h2>
                <p>{collection.description}</p>
              </div>

              <span className="world-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
