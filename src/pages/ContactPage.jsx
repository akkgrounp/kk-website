import Seo from "../components/Seo";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Us | KK Group of Companies"
        description="Contact our global team for business support, investment and strategic consultation."
      />
      <section className="section inner-hero contact-hero">
        <div className="container contact-hero-grid">
          <div className="contact-hero-copy">
            <span className="eyebrow">Contact</span>
            <h1>Connect With Our International Team</h1>
            <p>
              Speak directly with our corporate advisors for business setup, investment planning and
              international service coordination.
            </p>
            <div className="contact-hero-actions">
              <a className="btn gold" href="https://wa.me/923185756022" target="_blank" rel="noreferrer">
                WhatsApp Direct
              </a>
              <Link className="btn outline-dark" to="/services/investment-funding">
                Investor Desk
              </Link>
            </div>
            <div className="contact-kpi-row">
              <article className="contact-kpi">
                <strong>24/7</strong>
                <span>Response Desk</span>
              </article>
              <article className="contact-kpi">
                <strong>05+</strong>
                <span>Global Regions</span>
              </article>
              <article className="contact-kpi">
                <strong>01</strong>
                <span>Unified Contact Point</span>
              </article>
            </div>
          </div>

          <div className="contact-hero-media-card">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
              alt="Corporate communication center"
              loading="lazy"
            />
            <div className="contact-hero-card">
              <h3>Regional Availability</h3>
              <p>Spain | UAE | UK | Pakistan | Expanding Worldwide</p>
              <ul>
                <li>Business Support & Compliance</li>
                <li>Investment and Funding Advisory</li>
                <li>IT, Real Estate and Trade Operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-main-section">
        <div className="container two-col contact-main-grid">
          <div>
            <div className="section-head">
              <span className="eyebrow">Direct Contact Channels</span>
              <h2>Reach the Right Team Quickly</h2>
            </div>
            <div className="contact-info-grid contact-channel-grid">
              <article className="info-card contact-info-card contact-channel-card">
                <h3>Office Address</h3>
                <p>KK Group of Companies, Business Bay, Dubai, UAE</p>
              </article>
              <article className="info-card contact-info-card contact-channel-card">
                <h3>Email</h3>
                <p>corporate@kkgroupofcompany.com</p>
              </article>
              <article className="info-card contact-info-card contact-channel-card">
                <h3>Phone</h3>
                <p>03185756022</p>
              </article>
              <article className="info-card contact-info-card contact-channel-card">
                <h3>WhatsApp</h3>
                <p>03185756022</p>
              </article>
            </div>
          </div>

          <form className="contact-form contact-form-modern" action="#" method="post">
            <h3>Send Us Your Requirement</h3>
            <div className="form-row">
              <label>
                Name
                <input type="text" required placeholder="Your full name" />
              </label>
              <label>
                Email
                <input type="email" required placeholder="your@email.com" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone
                <input type="tel" required placeholder="03185756022" />
              </label>
              <label>
                Subject
                <input type="text" required placeholder="How can we help?" />
              </label>
            </div>
            <label>
              Message
              <textarea rows="5" required placeholder="Write your message" />
            </label>
            <button type="submit" className="btn gold">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="section contact-map-section">
        <div className="container">
          <div className="contact-map-wrap">
            <div className="section-head">
              <span className="eyebrow">Location</span>
              <h2>Visit Our Office</h2>
            </div>
            <div className="map-embed">
              <iframe
                title="Office Map"
                src="https://maps.google.com/maps?q=Dubai%20Business%20Bay&t=&z=13&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;

