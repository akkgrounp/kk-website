import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { countries, services } from "../data/siteContent";
import { apiRequest, getAuthUser } from "../utils/apiClient";

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
  "minerals-mines": {
    variant: "split",
    heroTag: "Minerals & Mining Division",
    offerTitle: "Minerals and Mining Growth Framework",
    ctaLabel: "Consult Mining Desk",
    metrics: ["Resource-Led", "Export Ready", "Compliance First"],
    trust: [
      ["Operational", "Field-to-market coordination with structured execution controls"],
      ["Compliant", "Licensing, legal documentation and regulatory alignment support"],
      ["Scalable", "Expansion-focused mining and commodity trade planning"],
    ],
  },
};

const serviceStory = {
  "business-support": {
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "From company formation to post-launch compliance, we build a practical operating structure that keeps your entry into new markets controlled and audit-ready.",
    detailCopy: {
      "Legal & Documentation":
        "Contract packs, registrations and policy documentation aligned with local legal requirements.",
      "Business Consultancy":
        "Market-entry playbooks, operating models and risk checkpoints for early-stage and expanding firms.",
      "Import/Export Setup":
        "Trade licensing, customs workflow and supplier onboarding for secure cross-border execution.",
    },
  },
  "cars-sale-purchase": {
    featuredImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "We coordinate procurement, due diligence and delivery so each automotive transaction is documented, transparent and commercially efficient.",
    detailCopy: {
      "International Import":
        "Cross-border import handling with route planning, customs coordination and complete paperwork.",
      "Car Financing":
        "Funding and payment structuring support through vetted partners and transaction milestones.",
      "Auction Deals":
        "Auction sourcing with quality checks, bidding strategy and post-purchase logistics.",
    },
  },
  "real-estate": {
    featuredImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "Our real estate desk combines market intelligence, legal due diligence and transaction management to protect capital and accelerate deal closure.",
    detailCopy: {
      "Commercial Projects":
        "Site selection, lease structuring and project review for retail, office and mixed-use assets.",
      "Rental Management":
        "Tenant coordination, documentation and operational oversight to stabilize recurring returns.",
      "International Property Investment":
        "Cross-border acquisition support with jurisdiction-level compliance and portfolio alignment.",
    },
  },
  "interior-designing": {
    featuredImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "We deliver interior projects through structured design stages, realistic planning and controlled site execution from concept to handover.",
    detailCopy: {
      "Commercial Projects":
        "Workplace and retail design aligned with branding, flow optimization and operational usability.",
      "3D Design & Planning":
        "Visualization-led planning to reduce revisions and improve decision confidence before execution.",
      "Renovation & Execution":
        "Renovation scheduling, vendor control and finishing quality supervision for clean delivery.",
    },
  },
  "it-digital-services": {
    featuredImage:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "Our technology team builds reliable digital systems that support growth, customer acquisition and long-term operational continuity.",
    detailCopy: {
      "Mobile App Development":
        "User-focused app development with scalable backend connectivity and deployment readiness.",
      "E-commerce Setup":
        "Conversion-first storefront architecture with payments, catalog structure and analytics integration.",
      "SEO & Digital Marketing":
        "Search visibility and growth campaigns built on measurable KPIs and reporting discipline.",
      "Remote IT Support":
        "Managed support coverage for uptime, security patches and incident response workflows.",
    },
  },
  "import-export-services": {
    featuredImage:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "We structure trade operations end-to-end so sourcing, compliance and freight execution stay synchronized across every shipment cycle.",
    detailCopy: {
      "Trade Documentation & Compliance":
        "HS code, customs and regulatory documentation prepared with country-specific compliance checks.",
      "Customs Clearance Coordination":
        "Broker and authority coordination to reduce delays, penalties and clearance bottlenecks.",
      "International Shipping & Logistics":
        "Freight planning with milestone tracking from origin pick-up to destination delivery.",
      "Market Entry Support":
        "Importer setup and trade partner onboarding for controlled launch in target regions.",
    },
  },
  "investment-funding": {
    featuredImage:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "Our capital team designs investment structures with clear governance, risk controls and reporting clarity for long-term investor confidence.",
    detailCopy: {
      "Partnership Models":
        "Aligned partner frameworks based on mandate, capital profile and exit visibility.",
      "ROI Structure":
        "Performance models with milestone-based review and transparent financial assumptions.",
      "Risk Management":
        "Risk matrix design covering legal, operational and market-side exposure scenarios.",
      "Legal Agreements":
        "Contract architecture that protects all parties through enforceable governance terms.",
      "Investor Registration Form":
        "Structured intake process for investor profiling, compliance screening and onboarding.",
    },
  },
  "minerals-mines": {
    featuredImage:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1400&q=80",
    featuredSummary:
      "We support minerals and mining initiatives through compliant operations planning, commercial structuring and global trade execution.",
    detailCopy: {
      "Mining Operations Advisory":
        "Operational model advisory for extraction planning, field controls and execution governance.",
      "Commodity Trading & Export":
        "Offtake strategy, export documentation and buyer-side coordination for secure transactions.",
      "Licensing, Compliance & Legal Documentation":
        "Licensing pathway and legal documentation support aligned with regulatory frameworks.",
      "Equipment Sourcing & Logistics":
        "Vendor sourcing and logistics planning for mining equipment procurement and movement.",
    },
  },
};

function renderOfferLayout(service, design) {
  const story = serviceStory[service.slug] || {};

  return (
    <>
      <div className="service-featured-split">
        <div className="service-featured-media">
          <span aria-hidden="true" />
          <img src={story.featuredImage || service.image} alt={service.name} loading="lazy" />
        </div>
        <div className="service-featured-copy">
          <h3>{service.details[0]}</h3>
          <p>{story.featuredSummary || service.intro}</p>
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
                src={`https://picsum.photos/seed/${service.slug}-detail-${index + 1}/1200/700`}
                alt={item}
                loading="lazy"
              />
            </div>
            <h4>{item}</h4>
            <p>
              {story.detailCopy?.[item] ||
                "Structured delivery with compliance controls, defined milestones and operational transparency."}
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredRequirement: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setStatusMessage("");

      if (isInvestment) {
        const user = getAuthUser();
        if (!user || user.role !== "investor") {
          throw new Error("Please login as investor first from Investor Login page.");
        }

        await apiRequest("/investor/apply", {
          method: "POST",
          body: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            country: "UAE",
            investmentAmount: 0,
          },
        });
      } else {
        await apiRequest("/contact", {
          method: "POST",
          body: {
            name: formData.fullName,
            email: formData.email,
            serviceType: service.name,
            message: `${formData.message}\nPhone: ${formData.phone}\nRequirement: ${
              formData.preferredRequirement || service.details[0]
            }`,
          },
        });
      }

      setStatusType("success");
      setStatusMessage("Request submitted successfully. Our advisory team will respond within 24 hours.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredRequirement: service.details[0] || "",
        message: "",
      });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form className="contact-form investor-form" action="#" method="post" onSubmit={handleSubmit}>
            <h3>{isInvestment ? "Investor Registration Form" : `${service.shortName} Consultation Form`}</h3>
            <label>
              Full Name
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInput}
                placeholder="Your full name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInput}
                placeholder="yourname@example.com"
              />
            </label>
            <label>
              Phone / WhatsApp
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInput}
                placeholder="03185756022"
              />
            </label>
            <label>
              Preferred Requirement
              <input
                type="text"
                name="preferredRequirement"
                value={formData.preferredRequirement}
                onChange={handleInput}
                placeholder={service.details[0]}
              />
            </label>
            <label>
              Message
              <textarea
                rows="4"
                required
                name="message"
                value={formData.message}
                onChange={handleInput}
                placeholder={`Share your ${service.shortName.toLowerCase()} goals`}
              />
            </label>
            <button type="submit" className="btn gold" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isInvestment ? "Register as Investor" : "Submit Request"}
            </button>
            {statusMessage ? <p className={`form-status ${statusType}`}>{statusMessage}</p> : null}
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
