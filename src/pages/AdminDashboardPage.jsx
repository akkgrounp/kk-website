import { useEffect, useMemo, useState } from "react";
import Seo from "../components/Seo";
import { apiRequest } from "../utils/api";

function formatDate(value) {
  if (!value) return "Not available";
  try {
    return new Date(value).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(value);
  }
}

function getSnippet(value, maxLength = 180) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "No message provided.";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function StatusPill({ status }) {
  const normalized = String(status || "pending").toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return <span className={`admin-pill ${normalized}`}>{label}</span>;
}

function MiniChip({ children }) {
  return <span className="admin-mini-chip">{children}</span>;
}

function AdminDashboardPage() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    let user = null;
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
      user = null;
    }
    return { token, user };
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const isAdmin = useMemo(() => auth.token && auth.user?.role === "admin", [auth]);

  const loadDashboard = async (token = auth.token) => {
    if (!token) return;

    setPageLoading(true);
    setPageError("");
    try {
      const [dashboardResponse, contactsResponse, investorsResponse] = await Promise.all([
        apiRequest("/admin/dashboard", { token }),
        apiRequest("/admin/contacts", { token }),
        apiRequest("/admin/investors", { token }),
      ]);

      setDashboard(dashboardResponse.data || null);
      setContacts(contactsResponse.data || []);
      setInvestors(investorsResponse.data || []);
    } catch (error) {
      setPageError(error.message || "Failed to load admin data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
    }
  }, [isAdmin]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: loginForm,
      });

      const user = response?.data?.user;
      const token = response?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid login response from server");
      }

      if (user.role !== "admin") {
        throw new Error("This account is not an admin account.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth({ token, user });
      setLoginForm({ email: "", password: "" });
      await loadDashboard(token);
    } catch (error) {
      setLoginError(error.message || "Admin login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
    setDashboard(null);
    setContacts([]);
    setInvestors([]);
    setPageError("");
    setLoginError("");
  };

  const handleInvestorAction = async (id, status) => {
    if (!auth.token) return;
    setActionLoadingId(id);
    setPageError("");

    try {
      await apiRequest(`/admin/investor/${id}/${status}`, {
        method: "PUT",
        token: auth.token,
      });
      await loadDashboard(auth.token);
    } catch (error) {
      setPageError(error.message || "Failed to update investor status");
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <>
      <Seo
        title="Admin Dashboard | KK Group of Companies"
        description="Secure admin login and dashboard for KK Group contacts, investor applications, and approvals."
      />

      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Secure Operations and Lead Management</h1>
          <p>
            Sign in with the admin account to review contact submissions, manage investor
            applications, and keep approvals under one secure panel.
          </p>
        </div>
      </section>

      {!isAdmin ? (
        <section className="section">
          <div className="container admin-auth-layout">
            <article className="contact-form admin-auth-card">
              <div className="admin-card-head">
                <div>
                  <span className="eyebrow">Admin Login</span>
                  <h2>Sign in to continue</h2>
                </div>
                <span className="admin-login-chip">Restricted Access</span>
              </div>

              <form className="stack-form" onSubmit={handleLogin}>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter admin password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                </label>

                {loginError ? <p className="form-alert error">{loginError}</p> : null}

                <button className="btn gold" type="submit" disabled={loginLoading}>
                  {loginLoading ? "Signing in..." : "Login to Admin"}
                </button>
              </form>
            </article>

            <aside className="info-card admin-auth-side">
              <span className="eyebrow">What the client can do</span>
              <h3>Single place for all incoming business activity</h3>
              <ul className="feature-list-modern admin-side-list">
                <li>
                  <h4>Contact Leads</h4>
                  <p>View every contact form submission from the website.</p>
                </li>
                <li>
                  <h4>Investor Requests</h4>
                  <p>Review pending investor applications and update approval status.</p>
                </li>
                <li>
                  <h4>Secure Access</h4>
                  <p>Only accounts with admin role can access this dashboard.</p>
                </li>
              </ul>
            </aside>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container admin-dashboard-shell">
            <div className="admin-dashboard-top">
              <div>
                <span className="eyebrow">Signed in as admin</span>
                <h2>{auth.user?.name || "Administrator"}</h2>
                <p>{auth.user?.email}</p>
              </div>

              <div className="admin-dashboard-actions">
                <button type="button" className="btn light" onClick={() => loadDashboard()}>
                  Refresh Data
                </button>
                <button type="button" className="btn outline-dark" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="admin-note-card info-card">
              <div>
                <span className="eyebrow">Quick Review Panel</span>
                <h3>Simple workspace for contacts, investors, and approvals.</h3>
              </div>
              <p>
                Refresh whenever you want the latest submissions. Review contact leads first,
                then approve or reject investor applications from the same screen.
              </p>
            </div>

            {pageError ? <p className="form-alert error">{pageError}</p> : null}
            {pageLoading ? <p className="admin-loading">Loading admin data...</p> : null}

            <div className="admin-stat-grid">
              <article className="info-card admin-stat-card">
                <span className="eyebrow">Total Users</span>
                <strong>{dashboard?.totalUsers ?? 0}</strong>
              </article>
              <article className="info-card admin-stat-card">
                <span className="eyebrow">Total Contacts</span>
                <strong>{dashboard?.totalContacts ?? 0}</strong>
              </article>
              <article className="info-card admin-stat-card">
                <span className="eyebrow">Total Investors</span>
                <strong>{dashboard?.totalInvestors ?? 0}</strong>
              </article>
              <article className="info-card admin-stat-card">
                <span className="eyebrow">Approved Investors</span>
                <strong>{dashboard?.approvedInvestors ?? 0}</strong>
              </article>
            </div>

            <section className="admin-section">
              <div className="admin-section-head">
                <div>
                  <span className="eyebrow">Contact Submissions</span>
                  <h3>{contacts.length} recent messages</h3>
                </div>
                <p className="admin-section-note">Newest entries appear first.</p>
              </div>

              {contacts.length === 0 ? (
                <p className="admin-empty-state">No contact submissions yet.</p>
              ) : (
                <div className="admin-stack-list">
                  {contacts.map((contact) => (
                    <article className="info-card admin-list-card" key={contact._id}>
                      <div className="admin-list-head">
                        <div>
                          <h4>{contact.name}</h4>
                          <p>{contact.email}</p>
                        </div>
                        <div className="admin-list-side">
                          <MiniChip>{contact.serviceType || "General"}</MiniChip>
                          <span className="admin-record-time">{formatDate(contact.createdAt)}</span>
                        </div>
                      </div>
                      <div className="admin-list-meta">
                        {contact.phone ? <span>Phone: {contact.phone}</span> : null}
                        <span>Service: {contact.serviceType || "General"}</span>
                      </div>
                      <p className="admin-list-message">{getSnippet(contact.message)}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-section">
              <div className="admin-section-head">
                <div>
                  <span className="eyebrow">Investor Applications</span>
                  <h3>{investors.length} applications</h3>
                </div>
                <p className="admin-section-note">Approve or reject directly from each application card.</p>
              </div>

              {investors.length === 0 ? (
                <p className="admin-empty-state">No investor applications yet.</p>
              ) : (
                <div className="admin-stack-list">
                  {investors.map((investor) => (
                    <article className="info-card admin-list-card" key={investor._id}>
                      <div className="admin-list-head">
                        <div>
                          <h4>{investor.name}</h4>
                          <p>{investor.email}</p>
                        </div>
                        <StatusPill status={investor.status} />
                      </div>
                      <div className="admin-list-meta">
                        <span>Phone: {investor.phone}</span>
                        {investor.country ? <span>Country: {investor.country}</span> : null}
                        {investor.investmentAmount ? (
                          <span>
                            Investment: {Number(investor.investmentAmount).toLocaleString()}
                          </span>
                        ) : null}
                        <span>{formatDate(investor.createdAt)}</span>
                      </div>
                      <p className="admin-list-message">
                        {investor.country
                          ? `Application received from ${investor.country}.`
                          : "Investor application received and ready for review."}
                      </p>
                      <div className="admin-compact-actions">
                        <button
                          type="button"
                          className="btn outline-dark"
                          onClick={() => handleInvestorAction(investor._id, "approve")}
                          disabled={actionLoadingId === investor._id || investor.status === "approved"}
                        >
                          {actionLoadingId === investor._id ? "Working..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="btn gold"
                          onClick={() => handleInvestorAction(investor._id, "reject")}
                          disabled={actionLoadingId === investor._id || investor.status === "rejected"}
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      )}
    </>
  );
}

export default AdminDashboardPage;
