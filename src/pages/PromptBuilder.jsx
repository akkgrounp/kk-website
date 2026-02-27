import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ResumePreview, { RESUME_TEMPLATES } from "../components/ResumePreview";

const PROMPT_EXAMPLES = [
  {
    label: "Software Engineer",
    prompt:
      "Name: Khan Malik\nRole: Software Engineer\nExperience: 3 years building web applications using React, Node.js, MongoDB, and REST APIs.\nAchievements: Reduced API response time by 40%, improved Lighthouse score from 62 to 91.\nProjects: E-commerce platform, admin dashboard, CRM module.\nEducation: BS Computer Science.\nStyle: Corporate and ATS-friendly CV for international remote jobs.",
  },
  {
    label: "UI/UX Designer",
    prompt:
      "Name: Ayesha Noor\nRole: UI/UX Designer\nExperience: 4 years designing mobile and web products.\nSkills: Figma, Design Systems, Wireframing, Prototyping, User Research.\nAchievements: Increased onboarding conversion by 22% through UX redesign.\nProjects: Fintech app redesign, healthcare dashboard, SaaS design system.\nStyle: Modern professional CV with measurable impact.",
  },
  {
    label: "Teacher",
    prompt:
      "Name: Sara Ahmed\nRole: Secondary School Teacher\nExperience: 5 years teaching English and Social Studies.\nSkills: Lesson Planning, Classroom Management, Student Assessment, Parent Communication.\nAchievements: Improved class pass rate from 78% to 92% in one academic year.\nCertifications: B.Ed, classroom management training.\nStyle: Clean, formal, ATS-ready education CV.",
  },
  {
    label: "Marketing Specialist",
    prompt:
      "Name: Ali Raza\nRole: Digital Marketing Specialist\nExperience: 3 years in SEO, Google Ads, Meta Ads, content strategy.\nAchievements: Increased organic traffic by 65% and reduced CPC by 28%.\nProjects: Lead generation campaigns, e-commerce growth campaigns.\nStyle: Results-focused CV with strong metrics and action verbs.",
  },
];

function PromptBuilder() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(() => localStorage.getItem("resumeTemplate") || "corporate");
  const [promptStyle, setPromptStyle] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [onePageMode, setOnePageMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("resumeTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const parsePromptStyle = (promptValue) => {
    const lower = String(promptValue || "").toLowerCase();
    const colorMap = {
      blue: "#2563eb",
      navy: "#1e3a8a",
      green: "#10b981",
      emerald: "#059669",
      red: "#dc2626",
      rose: "#e11d48",
      orange: "#f97316",
      purple: "#7c3aed",
      pink: "#db2777",
      teal: "#0f766e",
      black: "#111827",
      gray: "#334155",
      gold: "#b45309",
    };

    const hexMatches = String(promptValue || "").match(/#(?:[0-9a-fA-F]{3}){1,2}/g) || [];
    const detected = Object.entries(colorMap).find(([name]) => lower.includes(name));

    let template = "corporate";
    if (lower.includes("minimal")) template = "minimal";
    if (lower.includes("modern") || lower.includes("creative")) template = "modern";
    if (lower.includes("corporate") || lower.includes("executive")) template = "corporate";

    const primary = hexMatches[0] || detected?.[1] || (template === "modern" ? "#10b981" : template === "minimal" ? "#334155" : "#2563eb");
    const secondary = hexMatches[1] || (template === "modern" ? "#0f766e" : "#0f172a");
    const background = lower.includes("dark background") ? "#0b1220" : hexMatches[2] || (template === "modern" ? "#ecfeff" : "#f8fafc");
    const textColor = lower.includes("light text") ? "#f8fafc" : "#0f172a";
    const fontFamily = lower.includes("serif")
      ? "Georgia, Cambria, 'Times New Roman', Times, serif"
      : lower.includes("mono")
      ? "'Courier New', Courier, monospace"
      : "inherit";

    return { template, style: { primary, secondary, background, text: textColor, fontFamily } };
  };

  const handleGenerateFromPrompt = async (e) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (prompt.trim().length < 20) {
      setError("Please write a detailed prompt (at least 20 characters)");
      return;
    }

    setLoading(true);
    try {
      let finalPrompt = prompt;
      try {
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;
        const hasEmailInPrompt = /(?:^|\n)\s*email\s*:/i.test(prompt);
        if (user?.email && !hasEmailInPrompt) {
          finalPrompt = `${prompt.trim()}\nEmail: ${user.email}`;
        }
      } catch {
        // Ignore local storage parse issues.
      }

      const parsedDesign = parsePromptStyle(prompt);
      setSelectedTemplate(parsedDesign.template);
      setPromptStyle(parsedDesign.style);

      const response = await axiosInstance.post("/resumes/generate-from-prompt", { prompt: finalPrompt });
      setGeneratedResume(response.data.resume.generatedResume);
      setIsEditMode(false);
      const provider = response.data.aiProvider ? ` (${response.data.aiProvider})` : "";
      setStatusMessage(`${response.data.message || "CV generated"}${provider}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate CV from prompt");
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

  const updatePromptStyle = (field, value) => {
    setPromptStyle((prev) => ({
      ...(prev || {
        primary: "#2563eb",
        secondary: "#0f172a",
        background: "#f8fafc",
        text: "#0f172a",
        fontFamily: "inherit",
      }),
      [field]: value,
    }));
  };

  const resetStyleFromTemplate = () => {
    const defaults = {
      corporate: { primary: "#2563eb", secondary: "#0f172a", background: "#f8fafc", text: "#0f172a", fontFamily: "inherit" },
      modern: { primary: "#10b981", secondary: "#0f766e", background: "#ecfeff", text: "#0f172a", fontFamily: "inherit" },
      minimal: { primary: "#334155", secondary: "#0f172a", background: "#ffffff", text: "#111827", fontFamily: "inherit" },
    };
    setPromptStyle(defaults[selectedTemplate] || defaults.corporate);
    setStatusMessage("Style reset to template default");
  };

  const applyExample = (examplePrompt) => {
    setPrompt(examplePrompt);
    const parsedDesign = parsePromptStyle(examplePrompt);
    setSelectedTemplate(parsedDesign.template);
    setPromptStyle(parsedDesign.style);
    setStatusMessage("Example prompt loaded. You can edit and generate.");
    setError("");
  };

  return (
    <section className="space-y-6">
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6">
        <h1 className="mb-2 text-2xl font-extrabold">Prompt CV Builder</h1>
        <p className="mb-4 text-sm text-slate-600">
          Jo style chahiye seedha prompt mein likhein. App usi prompt ke mutabiq professional, ATS-friendly CV generate karega.
        </p>

        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Ready-made Prompt Examples</p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {PROMPT_EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => applyExample(example.prompt)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerateFromPrompt} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-40 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 focus:border-brand-500 focus:outline-none"
            placeholder="Example: Name: Khan Malik, Role: Frontend Developer, 2 years freelance experience, React/Node/MongoDB skills, want corporate style CV focused on measurable achievements and remote jobs."
            required
          />

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          {statusMessage && <p className="text-sm font-semibold text-emerald-700">{statusMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 sm:w-auto"
          >
            {loading ? "Generating from Prompt..." : "Generate CV from Prompt"}
          </button>
        </form>
      </div>

      {generatedResume && (
        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">Prompt Generated CV</h2>
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

          <div className="no-print rounded-2xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">Style Controls</p>
              <button
                type="button"
                onClick={resetStyleFromTemplate}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reset
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Primary
                <input
                  type="color"
                  value={promptStyle?.primary || "#2563eb"}
                  onChange={(e) => updatePromptStyle("primary", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white p-1"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Secondary
                <input
                  type="color"
                  value={promptStyle?.secondary || "#0f172a"}
                  onChange={(e) => updatePromptStyle("secondary", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white p-1"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Background
                <input
                  type="color"
                  value={promptStyle?.background || "#f8fafc"}
                  onChange={(e) => updatePromptStyle("background", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white p-1"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Text
                <input
                  type="color"
                  value={promptStyle?.text || "#0f172a"}
                  onChange={(e) => updatePromptStyle("text", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white p-1"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Font
                <select
                  value={promptStyle?.fontFamily || "inherit"}
                  onChange={(e) => updatePromptStyle("fontFamily", e.target.value)}
                  className="h-10 rounded border border-slate-300 px-2 text-sm text-slate-700"
                >
                  <option value="inherit">Default</option>
                  <option value="Georgia, Cambria, 'Times New Roman', Times, serif">Serif</option>
                  <option value="'Courier New', Courier, monospace">Monospace</option>
                  <option value="'Trebuchet MS', 'Segoe UI', sans-serif">Modern Sans</option>
                </select>
              </label>
            </div>
          </div>

          <div className="resume-print-area">
            <ResumePreview
              resumeText={resumeToRender}
              template={selectedTemplate}
              styleConfig={promptStyle}
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

export default PromptBuilder;
