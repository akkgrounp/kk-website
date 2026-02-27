import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { services } from "../data/siteContent";

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container nav-wrap">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png.jpeg" alt="KK Group of Companies logo" className="logo-mark" />
          <span className="logo-text">
            <strong>KK Group</strong>
            <em>of Companies</em>
          </span>
        </Link>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          Menu
        </button>

        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <div className="nav-dropdown">
            <a href="/#services" onClick={closeMenu}>
              Services
            </a>
            <div className="nav-dropdown-menu">
              {services.map((service) => (
                <NavLink key={service.slug} to={`/services/${service.slug}`} onClick={closeMenu}>
                  {service.shortName}
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink to="/portfolio" onClick={closeMenu}>
            Portfolio
          </NavLink>
          <NavLink to="/blog" onClick={closeMenu}>
            Blog
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
          <NavLink to="/investor-login" onClick={closeMenu} className="nav-cta">
            Investor Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;

