import { useState } from "react";
import Seo from "../components/Seo";
import { apiRequest, setAuthSession } from "../utils/apiClient";

function InvestorLoginPage() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setStatusMessage("");

      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const body =
        mode === "register"
          ? { name: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password };

      const response = await apiRequest(endpoint, {
        method: "POST",
        body,
      });

      setAuthSession(response.data.token, response.data.user);
      setStatusType("success");
      setStatusMessage(
        mode === "register"
          ? "Investor account created and logged in successfully."
          : "Login successful. You can now submit investment applications."
      );
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Investor Login | KK Group of Companies"
        description="Future-ready investor login structure for secure access to investment dashboards and reports."
      />
      <section className="section inner-hero">
        <div className="container">
          <span className="eyebrow">Investor Panel</span>
          <h1>Investor Access Portal</h1>
          <p>
            Register or login as an investor to submit funding applications and track status.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <div className="admin-actions">
            <button
              type="button"
              className={`btn ${mode === "login" ? "gold" : "outline-dark"}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`btn ${mode === "register" ? "gold" : "outline-dark"}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form className="contact-form" action="#" method="post" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label>
                Full Name
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInput}
                  placeholder="Your full name"
                />
              </label>
            ) : null}
            <label>
              Investor Email
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInput}
                placeholder="investor@email.com"
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
                placeholder="Enter secure password"
              />
            </label>
            <button type="submit" className="btn gold">
              {isSubmitting ? "Processing..." : mode === "register" ? "Create Account" : "Login"}
            </button>
            {statusMessage ? <p className={`form-status ${statusType}`}>{statusMessage}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}

export default InvestorLoginPage;

