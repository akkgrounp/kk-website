import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { countries, services } from "../data/siteContent";

const serviceDesign = {
  "business-support": {
    variant: "split",
    heroTag: "Corporate Operations Division",
    offerTitle: "Operational Enablement Framework",
    ctaLabel: "Book Business Consultation",
    metrics: ["190+ Setups", "42 Jurisdictions", "24/7 Advisory"],
    trust: [
      ["Legally Aligned", "Jurisdiction-ready documentation and compliant setup pipelines"],
      ["Execution-Led", "From registration to launch under one accountable team"],
      ["Scalable", "Growth architecture for SMEs and multinational entities"],
    ],
  },
  "cars-sale-purchase": {
    variant: "split",
    heroTag: "Automotive Trading Division",
    offerTitle: "Automotive Trading Solutions",
    ctaLabel: "Speak to Auto Desk",
    metrics: ["12+ Markets", "Verified Supply", "Deal-to-Delivery"],
    trust: [
      ["Verified", "Seller checks, documentation and secure trade execution"],
      ["Global", "Cross-border sourcing and import coordination"],
      ["Transparent", "Clear pricing structures and milestone updates"],
    ],
  },
  "real-estate": {
    variant: "split",
    heroTag: "Property & Asset Division",
    offerTitle: "Property Growth Architecture",
    ctaLabel: "Explore Property Strategy",
    metrics: ["Prime Assets", "Commercial + Residential", "Investor Ready"],
    trust: [
      ["Market-Led", "Research-backed acquisition and pricing strategy"],
      ["Asset-Safe", "Legal diligence and contract-level protection"],
      ["Return-Focused", "Portfolio structuring for long-term value"],
    ],
  },
  "interior-designing": {
    variant: "split",
    heroTag: "Design & Build Division",
    offerTitle: "End-to-End Design Workflow",
    ctaLabel: "Start Design Planning",
    metrics: ["Concept to Build", "3D Planning", "Execution Control"],
    trust: [
      ["Precision", "Design governance, quality materials and finish control"],
      ["Functional", "Layouts that improve utility and visual value"],
      ["Reliable", "Timeline-driven execution with transparent milestones"],
    ],
  },
  "it-digital-services": {
    variant: "split",
    heroTag: "Technology Transformation Division",
    offerTitle: "Digital Product & Growth Stack",
    ctaLabel: "Plan Digital Roadmap",
    metrics: ["Web + Mobile", "Commerce Ready", "Growth Analytics"],
    trust: [
      ["Modern Stack", "Scalable architecture and secure deployment"],
      ["Revenue Driven", "Digital funnels built for conversion and growth"],
      ["Support Ready", "Maintenance, optimization and operational continuity"],
    ],
  },
  "import-export-services": {
    variant: "split",
    heroTag: "International Trade Division",
    offerTitle: "Global Trade Execution Flow",
    ctaLabel: "Launch Trade Operation",
    metrics: ["Customs Ready", "Route Optimized", "Compliance First"],
    trust: [
      ["Compliant", "Trade documentation and customs alignment"],
      ["Connected", "Supplier, freight and destination coordination"],
      ["Predictable", "Structured process control for low-risk movement"],
    ],
  },
  "investment-funding": {
    variant: "split",
    heroTag: "Capital & Partnerships Division",
    offerTitle: "Capital Structuring Solutions",
    ctaLabel: "Connect Investor Desk",
    metrics: ["ROI Structure", "Risk Controls", "Legal Framework"],
    trust: [
      ["Governed", "Institutional documentation and legal safeguards"],
      ["Structured", "Partnership models aligned with risk appetite"],
      ["Transparent", "Milestone reporting and investor communication"],
    ],
  },
};

function renderOfferLayout(service, design) {
  return (
    <>
      <div className="service-featured-split">
        <div className="service-featured-media">
          <span aria-hidden="true" />
          <img src={`https://picsum.photos/seed/${service.slug}-featured/920/620`} alt={service.name} loading="lazy" />
        </div>
        <div className="service-featured-copy">
          <h3>{service.details[0]}</h3>
          <p>
            Built for international execution with secure documentation, transparent coordination and
            cross-border delivery standards.
          </p>
          <ul>
            {service.details.slice(1, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className="btn gold" to="/contact">
            {design.ctaLabel}
          </Link>
        </div>
      </div>

      <div className="grid service-detail-grid service-detail-grid-compact">
        {service.details.slice(1).map((item, index) => (
          <article className="info-card service-detail-card-compact" key={item}>
            <div className="service-detail-compact-media">
              <img
                src={`https://picsum.photos/seed/${service.slug}-compact-${index + 2}/860/420`}
                alt={item}
                loading="lazy"
              />
            </div>
            <h4>{item}</h4>
            <p>
              Delivered for GCC, UK, Europe and South Asia markets with secure documentation,
              transparent coordination and cross-border execution.
            </p>
            <div className="service-detail-compact-tags">
              <span>Global Ready</span>
              <span>Market Focused</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function ServicePage() {
  const { serviceSlug } = useParams();
  const service = services.find((item) => item.slug === serviceSlug);

  if (!service) {
    return (
      <section className="section">
        <div className="container">
          <h1>Service not found</h1>
          <Link className="btn gold" to="/">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  const isInvestment = service.slug === "investment-funding";
  const baseDesign = serviceDesign["investment-funding"];
  const serviceSpecificDesign = serviceDesign[service.slug] || {};
  const design = { ...baseDesign, ...serviceSpecificDesign };

  return (
    <>
      <Seo
        title={`${service.name} | KK Group of Companies`}
        description={`${service.name} delivered with corporate-grade strategy, compliance and international execution.`}
      />
      <section className={`section inner-hero service-hero service-hero-${design.variant}`}>
        <div className="container service-hero-grid">
          <div>
            <span className="eyebrow">{design.heroTag}</span>
            <h1>{service.name}</h1>
            <p>{service.intro}</p>
            <div className="service-hero-tags">
              <span>International Standards</span>
              <span>Secure Agreements</span>
              <span>Dedicated Experts</span>
            </div>
            <div className="service-hero-kpis">
              {design.metrics.map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>
          </div>
          <div className="service-hero-media">
            <img src={service.image} alt={service.name} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section service-offer-section">
        <div className={`container service-offer-shell service-offer-shell-${design.variant}`}>
          <div className="section-head">
            <span className="eyebrow">What We Offer</span>
            <h2>{design.offerTitle}</h2>
          </div>
          {renderOfferLayout(service, design)}
        </div>
      </section>

      <section className="section service-trust-section">
        <div className="container service-trust-grid">
          {design.trust.map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section investment-panel">
        <div className="container two-col investment-panel-layout">
          <div className="investment-copy">
            <span className="eyebrow">{isInvestment ? "High Priority Section" : "Strategic Service Framework"}</span>
            <h2>
              {isInvestment
                ? "Professional Investment Framework"
                : `Professional ${service.shortName} Framework`}
            </h2>
            <p className="investment-intro">
              Structured cross-border delivery designed for global clients, investors and operational
              teams with compliance-first execution.
            </p>
            <ul className="feature-list feature-list-modern">
              {service.details.map((item) => (
                <li key={item}>
                  <h4>{item}</h4>
                  <p>Delivered with legal alignment, transparent milestones and enterprise-level coordination.</p>
                </li>
              ))}
            </ul>
          </div>
          <form className="contact-form investor-form" action="#" method="post">
            <h3>{isInvestment ? "Investor Registration Form" : `${service.shortName} Consultation Form`}</h3>
            <label>
              Full Name
              <input type="text" required placeholder="Your full name" />
            </label>
            <label>
              Email
              <input type="email" required placeholder="yourname@example.com" />
            </label>
            <label>
              Phone / WhatsApp
              <input type="text" required placeholder="03185756022" />
            </label>
            <label>
              Preferred Requirement
              <input type="text" placeholder={service.details[0]} />
            </label>
            <label>
              Message
              <textarea rows="4" placeholder={`Share your ${service.shortName.toLowerCase()} goals`} required />
            </label>
            <button type="submit" className="btn gold">
              {isInvestment ? "Register as Investor" : "Submit Request"}
            </button>
          </form>
        </div>
      </section>

      <section className="section service-final-cta">
        <div className="container service-final-cta-wrap">
          <div>
            <span className="eyebrow">Global Delivery Network</span>
            <h2>Ready to Execute {service.shortName} at International Scale?</h2>
            <p>
              Our teams coordinate across legal, technical and operational tracks to deliver
              transparent outcomes for clients and investors in multiple regions.
            </p>
            <div className="service-final-country-list">
              {countries.slice(0, 6).map((country) => (
                <span key={country}>{country}</span>
              ))}
            </div>
          </div>
          <div className="service-final-actions">
            <Link className="btn gold" to="/contact">
              Schedule Executive Call
            </Link>
            <Link className="btn outline-dark" to="/portfolio">
              Review Portfolio
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

export default ServicePage;
