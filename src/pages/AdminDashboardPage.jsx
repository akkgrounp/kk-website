import Seo from "../components/Seo";

function AdminDashboardPage() {
  return (
    <>
      <Seo
        title="Admin Dashboard | KK Group of Companies"
        description="Future-ready admin and CRM architecture for lead and operations management."
      />
      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Operations, CRM and Lead Management</h1>
          <p>
            This frontend includes future-ready dashboard structure for secure admin control,
            investor onboarding and service workflow tracking.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid three-col">
          <article className="info-card">
            <h3>Lead CRM Integration</h3>
            <p>Ready to connect with HubSpot, Zoho or custom CRM APIs for pipeline management.</p>
          </article>
          <article className="info-card">
            <h3>Security & SSL</h3>
            <p>Production deployment should enforce HTTPS, secure headers and role-based access.</p>
          </article>
          <article className="info-card">
            <h3>Scalable Architecture</h3>
            <p>Service-first structure prepared for future mobile app and investor portal expansion.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default AdminDashboardPage;

