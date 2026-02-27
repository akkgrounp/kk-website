import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ResumePreview, { RESUME_TEMPLATES } from "../components/ResumePreview";

const QUICK_FORM = {
  fullName: "",
  jobTitle: "",
  skills: "",
  experience: "",
  education: "",
  quickProfile: "",
};

const ADVANCED_FORM = {
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  professionalSummary: "",
  coreCompetencies: "",
  technicalSkills: "",
  toolsAndPlatforms: "",
  softSkills: "",
  projects: "",
  internships: "",
  research: "",
  leadership: "",
  volunteerWork: "",
  certifications: "",
  affiliations: "",
  publications: "",
  awards: "",
  languages: "",
  achievements: "",
};

function Dashboard() {
  const [quickForm, setQuickForm] = useState(QUICK_FORM);
  const [advancedForm, setAdvancedForm] = useState(ADVANCED_FORM);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [systemStatus, setSystemStatus] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => localStorage.getItem("resumeTemplate") || "corporate");
  const [isEditMode, setIsEditMode] = useState(false);
  const [onePageMode, setOnePageMode] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axiosInstance.get("/health");
        setSystemStatus(response.data);
      } catch {
        setSystemStatus(null);
      }
    };

    fetchHealth();
  }, []);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return;
      const user = JSON.parse(rawUser);

      if (user?.name) {
        setQuickForm((prev) => ({
          ...prev,
          fullName: prev.fullName || user.name,
        }));
      }

      if (user?.email) {
        setAdvancedForm((prev) => ({
          ...prev,
          email: prev.email || user.email,
        }));
      }
    } catch {
      // Ignore invalid local user payload.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const inputClass = "rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none";
  const areaClass = "min-h-24 rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-500 focus:outline-none";

  const handleQuickChange = (e) => {
    setQuickForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdvancedChange = (e) => {
    setAdvancedForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");
    setGeneratedResume("");
    setLoading(true);

    try {
      const payload = { ...quickForm, ...advancedForm };
      const response = await axiosInstance.post("/resumes/generate", payload);
      setGeneratedResume(response.data.resume.generatedResume);
      setIsEditMode(false);
      const provider = response.data.aiProvider ? ` (${response.data.aiProvider})` : "";
      setStatusMessage(`${response.data.message || "Resume generated successfully"}${provider}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedResume) return;
    await navigator.clipboard.writeText(generatedResume);
    setStatusMessage("CV text copied");
  };

  const handlePrintResume = () => {
    const cleanup = () => {
      document.body.classList.remove("printing-resume");
      window.removeEventListener("afterprint", cleanup);
    };
    document.body.classList.add("printing-resume");
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => window.print(), 50);
  };

  const compactResumeForOnePage = (text) => {
    if (!text) return "";
    const lines = text.split("\n").map((line) => line.trim());
    const output = [];
    let currentHeading = "";
    let count = 0;

    const maxMap = {
      "PROFESSIONAL SUMMARY": 2,
      "WORK EXPERIENCE": 3,
      PROJECTS: 3,
      "TECHNICAL SKILLS": 4,
      "CORE COMPETENCIES": 4,
    };

    lines.forEach((line) => {
      if (!line) return;
      const normalized = line.toUpperCase().replace(/:/g, "").trim();
      const isHeading = /^[A-Z][A-Z\s/&()-]{2,}$/.test(normalized);
      if (isHeading) {
        currentHeading = normalized;
        count = 0;
        output.push(line);
        return;
      }

      const limit = maxMap[currentHeading] || 2;
      count += 1;
      if (count > limit) return;

      const trimmed = line.length > 110 ? `${line.slice(0, 107)}...` : line;
      output.push(trimmed.startsWith("- ") ? trimmed : `- ${trimmed}`);
    });

    return output.join("\n");
  };

  const resumeToRender = onePageMode ? compactResumeForOnePage(generatedResume) : generatedResume;

  return (
    <section className="space-y-6">
      {systemStatus && (
        <div className="no-print rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold">System Status</p>
          <p>- AI mode: {systemStatus.aiMode || "unknown"}</p>
          <p>- Storage: {systemStatus.storageMode || "unknown"}</p>
        </div>
      )}

      <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6">
        <h1 className="mb-2 text-2xl font-extrabold">Quick Professional CV Builder</h1>
        <p className="mb-6 text-sm text-slate-600">Just add basics, and app automatically writes summary, competencies, and professional sections.</p>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} name="fullName" placeholder="Full Name" value={quickForm.fullName} onChange={handleQuickChange} required />
          <input className={inputClass} name="jobTitle" placeholder="Target Job Title" value={quickForm.jobTitle} onChange={handleQuickChange} required />
          <textarea className={`${areaClass} md:col-span-2`} name="skills" placeholder="Skills (e.g. React, Node.js, MongoDB, SEO, Communication)" value={quickForm.skills} onChange={handleQuickChange} required />
          <textarea className={`${areaClass} md:col-span-2`} name="experience" placeholder="Experience / projects / internships (simple points are fine)" value={quickForm.experience} onChange={handleQuickChange} />
          <textarea className={`${areaClass} md:col-span-2`} name="education" placeholder="Education (degree, institute, year)" value={quickForm.education} onChange={handleQuickChange} />
          <textarea className={`${areaClass} md:col-span-2`} name="quickProfile" placeholder="Anything else about your profile (optional). If you skip, app will infer." value={quickForm.quickProfile} onChange={handleQuickChange} />

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="text-sm font-semibold text-slate-700 underline"
            >
              {showAdvanced ? "Hide Advanced Details" : "Add Advanced Details (Optional)"}
            </button>

            {showAdvanced && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className={inputClass} name="email" placeholder="Professional Email" value={advancedForm.email} onChange={handleAdvancedChange} />
                <input className={inputClass} name="phone" placeholder="Phone" value={advancedForm.phone} onChange={handleAdvancedChange} />
                <input className={inputClass} name="location" placeholder="City, Country" value={advancedForm.location} onChange={handleAdvancedChange} />
                <input className={inputClass} name="linkedin" placeholder="LinkedIn URL" value={advancedForm.linkedin} onChange={handleAdvancedChange} />
                <input className={inputClass} name="github" placeholder="GitHub URL" value={advancedForm.github} onChange={handleAdvancedChange} />
                <input className={inputClass} name="portfolio" placeholder="Portfolio URL" value={advancedForm.portfolio} onChange={handleAdvancedChange} />
                <textarea className={areaClass} name="projects" placeholder="Projects" value={advancedForm.projects} onChange={handleAdvancedChange} />
                <textarea className={areaClass} name="certifications" placeholder="Certifications" value={advancedForm.certifications} onChange={handleAdvancedChange} />
                <textarea className={areaClass} name="awards" placeholder="Awards" value={advancedForm.awards} onChange={handleAdvancedChange} />
                <textarea className={areaClass} name="languages" placeholder="Languages" value={advancedForm.languages} onChange={handleAdvancedChange} />
              </div>
            )}
          </div>

          {error && <p className="md:col-span-2 text-sm font-semibold text-red-600">{error}</p>}
          {statusMessage && <p className="md:col-span-2 text-sm font-semibold text-emerald-700">{statusMessage}</p>}

          <button
            className="md:col-span-2 rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating CV..." : "Generate CV in 1 Click"}
          </button>
        </form>
      </div>

      {generatedResume && (
        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">Generated CV</h2>
            <div className="grid w-full gap-2 sm:flex sm:w-auto">
              <button
                type="button"
                onClick={() => setOnePageMode((prev) => !prev)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {onePageMode ? "Normal Mode" : "One Page Mode"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode((prev) => !prev)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {isEditMode ? "Done Editing" : "Edit CV"}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Copy Text
              </button>
              <button
                type="button"
                onClick={handlePrintResume}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Print / Save PDF
              </button>
            </div>
          </div>

          <div className="no-print rounded-2xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">Choose Premium Template</p>
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

          <div className="resume-print-area">
            <ResumePreview
              resumeText={resumeToRender}
              template={selectedTemplate}
              editable={isEditMode}
              onResumeChange={setGeneratedResume}
              onNotify={setStatusMessage}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
