import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ResumePreview, { RESUME_TEMPLATES } from "../components/ResumePreview";

function History() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [systemStatus, setSystemStatus] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => localStorage.getItem("resumeTemplate") || "corporate");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, healthResponse] = await Promise.all([
          axiosInstance.get("/resumes/history"),
          axiosInstance.get("/health"),
        ]);

        setResumes(historyResponse.data.resumes || []);
        setSystemStatus(healthResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeTemplate", selectedTemplate);
  }, [selectedTemplate]);

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <h1 className="mb-1 text-2xl font-extrabold">Resume History</h1>
      <p className="text-sm text-slate-600">Your previously generated resumes are listed below.</p>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Template</p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(RESUME_TEMPLATES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTemplate(key)}
              className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                selectedTemplate === key ? "border-slate-800 bg-slate-100" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {systemStatus && !systemStatus.dbConnected && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          History is currently stored in local fallback file mode (MongoDB not connected).
        </div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading history...</p>}
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      {!loading && !error && resumes.length === 0 && (
        <p className="text-sm text-slate-600">No resumes found yet. Generate your first resume from Dashboard.</p>
      )}

      <div className="space-y-5">
        {resumes.map((item) => (
          <article key={item._id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Generated on {new Date(item.createdAt).toLocaleString()}
            </p>
            <ResumePreview resumeText={item.generatedResume} template={selectedTemplate} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default History;
