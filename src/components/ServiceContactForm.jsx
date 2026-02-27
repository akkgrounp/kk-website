function ServiceContactForm({ serviceName, title = "Request Consultation" }) {
  return (
    <section className="section form-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Contact {serviceName}</span>
          <h2>{title}</h2>
        </div>
        <form className="contact-form" action="#" method="post">
          <label>
            Full Name
            <input type="text" name="name" placeholder="Enter your full name" required />
          </label>
          <label>
            Company Name
            <input type="text" name="company" placeholder="Company / Organization" />
          </label>
          <label>
            Email Address
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            Phone / WhatsApp
            <input type="tel" name="phone" placeholder="03185756022" required />
          </label>
          <label>
            Service Requirement
            <textarea
              name="message"
              rows="4"
              placeholder={`Tell us your ${serviceName} requirement`}
              required
            />
          </label>
          <button type="submit" className="btn gold">
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}

export default ServiceContactForm;
