import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import { apiRequest, clearAuthSession, getAuthUser, setAuthSession } from "../utils/apiClient";

function AdminDashboardPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [investors, setInvestors] = useState([]);
  const pendingInvestors = investors.filter((investor) => investor.status === "pending").length;

  const isAdmin = authUser?.role === "admin";

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadAdminData = async () => {
    if (!isAdmin) return;
    try {
      setIsLoadingData(true);
      setStatusMessage("");
      const [dashboardRes, contactsRes, investorsRes] = await Promise.all([
        apiRequest("/admin/dashboard"),
        apiRequest("/admin/contacts"),
        apiRequest("/admin/investors"),
      ]);

      setDashboard(dashboardRes.data);
      setContacts(contactsRes.data || []);
      setInvestors(investorsRes.data || []);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to load admin data.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setStatusMessage("");
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: formData,
      });
      if (response?.data?.user?.role !== "admin") {
        throw new Error("Only admin account can access this page.");
      }
      setAuthSession(response.data.token, response.data.user);
      setAuthUser(response.data.user);
      setFormData({ email: "", password: "" });
      setStatusType("success");
      setStatusMessage("Admin login successful.");
    } catch (error) {
      clearAuthSession();
      setAuthUser(null);
      setStatusType("error");
      setStatusMessage(error.message || "Admin login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthUser(null);
    setDashboard(null);
    setContacts([]);
    setInvestors([]);
    setStatusType("success");
    setStatusMessage("Logged out successfully.");
  };

  const updateInvestorStatus = async (id, status) => {
    const target = investors.find((item) => item._id === id);
    if (target && target.status === status) {
      setStatusType("success");
      setStatusMessage(`Investor is already ${status}.`);
      return;
    }

    try {
      await apiRequest(`/admin/investor/${id}/${status}`, {
        method: "PUT",
      });
      setStatusType("success");
      setStatusMessage(`Investor application ${status}.`);
      await loadAdminData();
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to update investor status.");
    }
  };

  return (
    <>
      <Seo
        title="Admin Dashboard | KK Group of Companies"
        description="Admin operations dashboard with live contact and investor management."
      />
      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Operations, CRM and Lead Management</h1>
          <p>Manage website contacts, investor applications and approval workflows.</p>
        </div>
      </section>

      {!isAdmin ? (
        <section className="section">
          <div className="container narrow">
            <form className="contact-form" onSubmit={handleLogin}>
              <h3>Admin Login</h3>
              <label>
                Admin Email
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
                  placeholder="admin@company.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                  placeholder="Enter password"
                />
              </label>
              <button type="submit" className="btn gold" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login as Admin"}
              </button>
              {statusMessage ? <p className={`form-status ${statusType}`}>{statusMessage}</p> : null}
            </form>
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <div className="container admin-actions">
              <button type="button" className="btn outline-dark" onClick={loadAdminData} disabled={isLoadingData}>
                {isLoadingData ? "Refreshing..." : "Refresh Data"}
              </button>
              <button type="button" className="btn gold" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <div className="container admin-alert-strip">
              <article className="admin-alert-item">
                <span>New Contacts</span>
                <strong>{contacts.length}</strong>
              </article>
              <article className="admin-alert-item pending">
                <span>Pending Investors</span>
                <strong>{pendingInvestors}</strong>
              </article>
            </div>
            <div className="container grid three-col">
              <article className="info-card">
                <h3>Total Users</h3>
                <p className="admin-kpi">{dashboard?.totalUsers ?? 0}</p>
              </article>
              <article className="info-card">
                <h3>Total Contacts</h3>
                <p className="admin-kpi">{dashboard?.totalContacts ?? 0}</p>
              </article>
              <article className="info-card">
                <h3>Total Investors</h3>
                <p className="admin-kpi">{dashboard?.totalInvestors ?? 0}</p>
              </article>
            </div>
            <div className="container grid three-col" style={{ marginTop: "1rem" }}>
              <article className="info-card">
                <h3>Approved Investors</h3>
                <p className="admin-kpi">{dashboard?.approvedInvestors ?? 0}</p>
              </article>
            </div>
            {statusMessage ? <p className={`form-status ${statusType}`}>{statusMessage}</p> : null}
          </section>

          <section className="section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Contact Submissions</span>
                <h2>
                  Latest Contacts <span className="admin-badge">{contacts.length}</span>
                </h2>
              </div>
              <div className="admin-leads-wrap">
                {contacts.length === 0 ? (
                  <article className="info-card">
                    <p>No contact submissions found.</p>
                  </article>
                ) : (
                  contacts.map((contact) => (
                    <article className="info-card admin-lead-card" key={contact._id}>
                      <div className="admin-lead-head">
                        <h3>{contact.name}</h3>
                        <span>{new Date(contact.createdAt).toLocaleString()}</span>
                      </div>
                      <p>
                        <strong>Email:</strong> {contact.email}
                      </p>
                      <p>
                        <strong>Service:</strong> {contact.serviceType}
                      </p>
                      <p>
                        <strong>Message:</strong> {contact.message}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Investor Applications</span>
                <h2>
                  Review and Approve <span className="admin-badge warning">{pendingInvestors}</span>
                </h2>
              </div>
              <div className="admin-leads-wrap">
                {investors.length === 0 ? (
                  <article className="info-card">
                    <p>No investor applications found.</p>
                  </article>
                ) : (
                  investors.map((investor) => (
                    <article className="info-card admin-lead-card" key={investor._id}>
                      <div className="admin-lead-head">
                        <h3>{investor.name}</h3>
                        <span>{new Date(investor.createdAt).toLocaleString()}</span>
                      </div>
                      <p>
                        <strong>Email:</strong> {investor.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {investor.phone}
                      </p>
                      <p>
                        <strong>Country:</strong> {investor.country || "N/A"}
                      </p>
                      <p>
                        <strong>Investment:</strong> {investor.investmentAmount || 0}
                      </p>
                      <p>
                        <strong>Status:</strong> {investor.status}
                      </p>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="btn outline-dark"
                          onClick={() => updateInvestorStatus(investor._id, "approve")}
                          disabled={investor.status === "approved"}
                        >
                          {investor.status === "approved" ? "Approved" : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="btn gold"
                          onClick={() => updateInvestorStatus(investor._id, "reject")}
                          disabled={investor.status === "rejected"}
                        >
                          {investor.status === "rejected" ? "Rejected" : "Reject"}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default AdminDashboardPage;
