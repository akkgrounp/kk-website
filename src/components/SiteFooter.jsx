import { Link } from "react-router-dom";

function SiteFooter() {
  const socialLinks = [
    { label: "LinkedIn", short: "IN", href: "https://www.linkedin.com/" },
    { label: "Facebook", short: "FB", href: "https://www.facebook.com/" },
    { label: "Instagram", short: "IG", href: "https://www.instagram.com/" },
    { label: "YouTube", short: "YT", href: "https://www.youtube.com/" },
    { label: "WhatsApp", short: "WA", href: "https://wa.me/923185756022" },
  ];

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <button className="footer-badge" type="button">
          <span>Get Started</span>
        </button>

        <div className="footer-brand-row">
          <h3>
            K<span>K</span> Group
          </h3>
          <p>Global Corporate Platform</p>
        </div>

        <div className="footer-top">
          <div className="footer-links">
            <h4>Insights</h4>
            <ul>
              <li>
                <Link to="/blog">Corporate Blog</Link>
              </li>
              <li>
                <Link to="/portfolio">Case Studies</Link>
              </li>
              <li>
                <Link to="/services/it-digital-services">Digital Reports</Link>
              </li>
              <li>
                <Link to="/services/investment-funding">Investor Updates</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/services/business-support">Operations</Link>
              </li>
              <li>
                <Link to="/services/real-estate">Global Offices</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>What We Do</h4>
            <ul>
              <li>
                <Link to="/services/business-support">Business Support</Link>
              </li>
              <li>
                <Link to="/services/cars-sale-purchase">Cars Trading</Link>
              </li>
              <li>
                <Link to="/services/real-estate">Real Estate</Link>
              </li>
              <li>
                <Link to="/services/it-digital-services">IT & Digital</Link>
              </li>
            </ul>
          </div>

          <aside className="footer-contact">
            <div className="footer-newsletter">
              <h4>Subscribe to our newsletter</h4>
              <form onSubmit={(event) => event.preventDefault()}>
                <input type="email" placeholder="E-mail" aria-label="Email address" />
                <button type="submit" aria-label="Subscribe">{">"}</button>
              </form>
            </div>

            <div className="footer-contact-list">
              <h4>Contact Us</h4>
              <p>
                <strong>Email:</strong> corporate@kkgroupofcompany.com
              </p>
              <p>
                <strong>Phone:</strong> 03185756022
              </p>
              <p>
                <strong>Offices:</strong> Spain | UAE | UK | Pakistan
              </p>
            </div>
          </aside>
        </div>

        <div className="footer-social-bar">
          <div className="social-list">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                <span>{social.short}</span>
                {social.label}
              </a>
            ))}
          </div>
          <span className="footer-copy">
            Copyright {new Date().getFullYear()} KK Group of Companies. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

