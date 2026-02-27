import Seo from "../components/Seo";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      <Seo
        title="About Us | KK Group of Companies"
        description="Learn about our mission, values, leadership and international operations across multiple business sectors."
      />
      <section className="section inner-hero about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow">About Us</span>
            <h1>KK Group of Companies</h1>
            <p>
              We are a multi-national corporate group that unifies business support, automobiles,
              real estate, interior design, digital services and investment solutions under one
              trusted platform.
            </p>
            <div className="about-hero-actions">
              <Link className="btn gold" to="/contact">
                Book Strategic Meeting
              </Link>
              <Link className="btn outline-dark" to="/portfolio">
                View Portfolio
              </Link>
            </div>
            <div className="about-hero-metrics">
              <article>
                <strong>06</strong>
                <span>Specialized Business Divisions</span>
              </article>
              <article>
                <strong>05+</strong>
                <span>Operational Regions</span>
              </article>
              <article>
                <strong>24/7</strong>
                <span>Client and Investor Coordination</span>
              </article>
            </div>
          </div>

          <div className="about-hero-media">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="International corporate building"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
              alt="Corporate leadership discussion"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section about-foundation">
        <div className="container grid three-col about-foundation-grid">
          <article className="info-card about-foundation-card">
            <h3>Company Introduction</h3>
            <p>
              We operate through specialized divisions with centralized governance, compliance
              controls and measurable performance standards for international delivery.
            </p>
          </article>
          <article className="info-card about-foundation-card">
            <h3>Mission & Vision</h3>
            <p>
              Our mission is to simplify cross-sector expansion for businesses and investors. Our
              vision is to become a globally trusted holding brand built on transparency and
              execution quality.
            </p>
          </article>
          <article className="info-card about-foundation-card">
            <h3>Core Values</h3>
            <p>
              Integrity, accountability, transparency and long-term value creation guide every
              partnership, investment and strategic decision.
            </p>
          </article>
        </div>
      </section>

      <section className="section about-leadership">
        <div className="container two-col about-leadership-grid">
          <div className="about-leadership-copy">
            <span className="eyebrow">Leadership Message</span>
            <h2>Investor-Focused Leadership</h2>
            <p>
              Our leadership model is built around governance, disciplined growth and risk-managed
              execution. Every division is monitored through legal safeguards and performance KPIs.
            </p>
            <ul>
              <li>Executive-level governance with audit-driven controls</li>
              <li>Risk-screened strategic expansion across priority markets</li>
              <li>Long-term partnerships built on measurable outcomes</li>
            </ul>
          </div>
          <div className="about-leadership-media">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1100&q=80"
              alt="Leadership strategy planning"
              loading="lazy"
            />
            <div className="stat-card">
              <h3>International Operations</h3>
              <p>
                We manage regional partnerships and cross-border operations across Europe, the Middle
                East and South Asia through structured local teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-global">
        <div className="container about-global-wrap">
          <div>
            <span className="eyebrow">International Operations</span>
            <h2>Globally Coordinated, Regionally Executed</h2>
            <p>
              We align legal frameworks, field execution and capital planning so clients can scale
              across borders with confidence.
            </p>
          </div>
          <div className="about-global-card">
            <h3>Regional Footprint</h3>
            <p>
              Active operations in Spain, UAE, UK and Pakistan with expansion in additional
              international markets.
            </p>
            <div className="about-global-tags">
              <span>Spain</span>
              <span>UAE</span>
              <span>UK</span>
              <span>Pakistan</span>
              <span>Expanding Worldwide</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;

