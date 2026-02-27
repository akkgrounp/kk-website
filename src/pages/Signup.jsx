import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Server connect nahi ho raha. 10 sec wait karke dobara try karein.");
      } else {
        setError(err.response?.data?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-panel">
      <h1 className="mb-6 text-2xl font-extrabold">Create your account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none"
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none"
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          className="w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="font-bold text-brand-700" to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Signup;
