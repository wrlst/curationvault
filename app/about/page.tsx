import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />

      <section className="about-page">
        <div className="section-label">
          <span>About</span>
          <span>Curation Vault</span>
        </div>

        <h1>CURATION VAULT</h1>

        <p>
          A considered digital archive of architecture, interior spaces,
          objects, and visual references worth returning to.
        </p>

        <p>
          The project is about discovery, selection, and preserving things
          that feel worth keeping.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
