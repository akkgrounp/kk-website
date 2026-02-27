import Seo from "../components/Seo";

function InvestorLoginPage() {
  return (
    <>
      <Seo
        title="Investor Login | KK Group of Companies"
        description="Future-ready investor login structure for secure access to investment dashboards and reports."
      />
      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Investor Panel</span>
          <h1>Investor Login (Future Ready)</h1>
          <p>
            Secure investor access portal can be connected to JWT/OAuth with document vault and ROI
            reporting dashboard.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <form className="contact-form" action="#" method="post">
            <label>
              Investor Email
              <input type="email" required placeholder="investor@email.com" />
            </label>
            <label>
              Password
              <input type="password" required placeholder="Enter secure password" />
            </label>
            <button type="submit" className="btn gold">
              Login
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default InvestorLoginPage;

