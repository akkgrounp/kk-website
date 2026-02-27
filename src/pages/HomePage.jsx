import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { countries, services, whyChooseUs } from "../data/siteContent";

function HomePage() {
  return (
    <>
      <Seo
        title="KK Group of Companies | Complete Business Solutions Worldwide"
        description="One global company providing business support, real estate, cars trading, interior designing, IT solutions and investment services."
      />

      <section className="hero section" id="top">
        <div className="container hero-shell">
          <div className="hero-content">
            <p className="eyebrow">International Corporate Group</p>
            <h1>
              Unified Global Enterprise <span>- Strategic Business Solutions Across Borders</span>
            </h1>
            <p>
              We deliver integrated business support, real estate, automotive, digital and
              investment services through one trusted corporate platform built for global growth.
            </p>
            <div className="hero-actions">
              <a className="btn gold" href="#services">
                Explore Services
              </a>
              <Link className="btn light" to="/services/investment-funding">
                Become an Investor
              </Link>
              <Link className="btn light" to="/contact">
                Get Consultation
              </Link>
            </div>
            <div className="hero-badges">
              <span>Cross-Sector Expertise</span>
              <span>International Compliance</span>
              <span>Investor-Focused Model</span>
            </div>
          </div>
          <div className="hero-panel">
            <h3>Corporate Performance Snapshot</h3>
            <div className="hero-metrics">
              <article>
                <strong>06</strong>
                <p>Strategic Business Divisions</p>
              </article>
              <article>
                <strong>05+</strong>
                <p>Regional Operational Networks</p>
              </article>
              <article>
                <strong>24/7</strong>
                <p>Client & Investor Coordination</p>
              </article>
            </div>
            <div className="hero-note">
              Built for global expansion with secure legal structures, transparent agreements and
              long-term business partnerships.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container seo-profile">
          <div className="seo-profile-image-wrap">
            <div className="seo-tag">International SEO Division</div>
            <img src="/seo.png" alt="SEO Specialist" className="seo-profile-image" />
            <div className="seo-image-overlay">
              <h3>Mr. Kamran Ali Khan</h3>
              <p>CEO - Global Operations</p>
            </div>
          </div>
          <div className="seo-profile-content">
            <span className="eyebrow">SEO Leadership</span>
            <h2>Meet our CEO, Mr. Kamran Ali Khan</h2>
            <p>
              Meet our CEO, Mr. Kamran Ali khan, leading our global operations with 18+ years of
              experience in IT, real estate, automobiles, import/export, and investment sectors.
            </p>
            <div className="seo-pill-row">
              <span>18+ Years Experience</span>
              <span>Global Operations</span>
              <span>International Markets</span>
              <span>Growth Leadership</span>
            </div>
            <ul className="seo-points">
              <li>
                Providing international IT solutions, real estate investment, automobile trading,
                and import/export services worldwide.
              </li>
              <li>
                We deliver international-standard business solutions, helping clients expand and
                succeed globally.
              </li>
              <li>Partner with us for international growth.</li>
            </ul>
            <div className="seo-metrics">
              <article>
                <strong>18+</strong>
                <span>Years of Leadership</span>
              </article>
              <article>
                <strong>05+</strong>
                <span>Core Global Sectors</span>
              </article>
              <article>
                <strong>Global</strong>
                <span>International Service Reach</span>
              </article>
            </div>
            <div className="seo-cta-row">
              <Link className="btn gold" to="/contact">
                Book a free consultation today
              </Link>
              <Link className="btn outline-dark" to="/portfolio">
                Explore our global services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container services-shell">
          <div className="services-head">
            <div className="section-head">
              <span className="eyebrow">Our Services</span>
              <h2>Integrated Corporate Services</h2>
              <p>
                Built for enterprises, investors and growth-focused companies seeking trusted
                international execution under one corporate umbrella.
              </p>
            </div>
            <div className="services-highlight">
              <h3>All-in-One Global Platform</h3>
              <p>
                From market setup to investment growth, we deliver unified services through
                professional teams, transparent processes and scalable execution models.
              </p>
            </div>
          </div>

          <div className="grid cards-grid services-grid-modern">
            {services.map((service, index) => (
              <article className="service-card service-card-modern" key={service.slug}>
                <span className="service-number">0{index + 1}</span>
                <img className="service-thumb" src={service.image} alt={service.shortName} loading="lazy" />
                <span className="service-icon">{service.icon}</span>
                <h3>{service.shortName}</h3>
                <p>{service.intro}</p>
                <ul className="service-mini-list">
                  {service.details.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link className="service-link-btn" to={`/services/${service.slug}`}>
                  View Details
                </Link>
              </article>
            ))}
            <article className="service-card service-card-modern service-cta-card">
              <h3>Need a Custom Global Solution?</h3>
              <p>
                Talk to our corporate team for a tailored strategy across business setup, trade,
                technology and investment.
              </p>
              <ul className="service-mini-list">
                <li>Dedicated international consultation</li>
                <li>Structured expansion roadmap</li>
              </ul>
              <div className="service-cta-actions">
                <Link className="service-link-btn" to="/contact">
                  Get Consultation
                </Link>
                <Link className="service-link-btn secondary" to="/services/investment-funding">
                  Investor Desk
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section why-us">
        <div className="container why-shell">
          <div className="section-head why-head">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Built for Corporate Reliability</h2>
            <p>
              Trusted by growth-focused clients and investors for secure execution, transparent
              processes and long-term business value.
            </p>
          </div>
          <div className="grid why-grid why-grid-modern">
            {whyChooseUs.map((item, index) => (
              <div className="why-card" key={item}>
                <span className="why-index">0{index + 1}</span>
                <h3>{item}</h3>
                <p>Corporate-grade planning, risk control and performance-led execution.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col global-shell">
          <div>
            <span className="eyebrow">Global Presence</span>
            <h2>Operating Across International Markets</h2>
            <p className="global-copy">
              Our cross-border operations framework enables clients and investors to scale with
              confidence across key global regions.
            </p>
            <ul className="country-list">
              {countries.map((country) => (
                <li key={country}>{country}</li>
              ))}
            </ul>
            <div className="global-metrics">
              <article>
                <strong>7+</strong>
                <span>Active Countries</span>
              </article>
              <article>
                <strong>Multi-Sector</strong>
                <span>Integrated Delivery Model</span>
              </article>
            </div>
          </div>
          <div className="map-visual" aria-label="World map visual" />
        </div>
      </section>

      <section className="section cta-strip">
        <div className="container cta-wrap cta-wrap-modern">
          <div>
            <span className="eyebrow">Strategic Growth Support</span>
            <h2>Ready to Expand with a Trusted Global Partner?</h2>
            <p>Plan your next move with a corporate team built for international execution.</p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn gold">
              Book Free Consultation
            </Link>
            <Link to="/services/investment-funding" className="btn light">
              Become an Investor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

