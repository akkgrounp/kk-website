import Seo from "../components/Seo";
import { portfolioItems } from "../data/siteContent";

function PortfolioPage() {
  return (
    <>
      <Seo
        title="Portfolio | KK Group of Companies"
        description="Review our portfolio: IT projects, real estate deals, car transactions, interior projects and client testimonials."
      />
      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Portfolio</span>
          <h1>Selected Global Achievements</h1>
          <p>
            A cross-sector showcase of outcomes delivered through our international corporate
            ecosystem.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container portfolio-grid">
          {portfolioItems.map((item, index) => (
            <article className="portfolio-card" key={item.title}>
              <img src={item.image} alt={item.title} className="portfolio-image" loading="lazy" />
              <div className="portfolio-overlay">
                <h3>{item.title}</h3>
                <p>Verified results with transparent execution and client confidence.</p>
              </div>
              <span className="portfolio-index">0{index + 1}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default PortfolioPage;

