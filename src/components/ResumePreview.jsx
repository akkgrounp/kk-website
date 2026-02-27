import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const RESUME_TEMPLATES = {
  corporate: { label: "Corporate", badge: "Executive" },
  modern: { label: "Modern", badge: "Creative Pro" },
  minimal: { label: "Minimal", badge: "Clean ATS" },
};

const TEMPLATE_DEFAULT_STYLE = {
  corporate: { primary: "#2563eb", secondary: "#0f172a", background: "#f8fafc", text: "#0f172a", fontFamily: "inherit" },
  modern: { primary: "#10b981", secondary: "#0f766e", background: "#ecfeff", text: "#0f172a", fontFamily: "inherit" },
  minimal: { primary: "#334155", secondary: "#0f172a", background: "#ffffff", text: "#111827", fontFamily: "inherit" },
};

const BASE_SECTION_META = [
  ["contact", "Contact", "side"],
  ["summary", "Professional Summary", "main"],
  ["coreCompetencies", "Core Competencies", "side"],
  ["technicalSkills", "Technical Skills", "side"],
  ["tools", "Tools and Platforms", "side"],
  ["softSkills", "Soft Skills", "side"],
  ["experience", "Work Experience", "main"],
  ["projects", "Projects", "main"],
  ["internships", "Internships", "main"],
  ["research", "Research", "main"],
  ["leadership", "Leadership", "main"],
  ["volunteer", "Volunteer Work", "main"],
  ["education", "Education", "side"],
  ["certifications", "Certifications", "side"],
  ["affiliations", "Professional Affiliations", "main"],
  ["publications", "Publications", "main"],
  ["awards", "Awards", "main"],
  ["languages", "Languages", "side"],
  ["achievements", "Achievements", "main"],
];

const SECTION_KEYWORDS = {
  contact: ["CONTACT"],
  summary: ["SUMMARY", "PROFESSIONAL SUMMARY"],
  coreCompetencies: ["CORE COMPETENCIES", "COMPETENCIES"],
  technicalSkills: ["TECHNICAL SKILLS", "SKILLS"],
  tools: ["TOOLS AND PLATFORMS", "TOOLS", "PLATFORMS"],
  softSkills: ["SOFT SKILLS"],
  experience: ["WORK EXPERIENCE", "EXPERIENCE"],
  projects: ["PROJECTS", "PROJECT PORTFOLIO"],
  internships: ["INTERNSHIPS"],
  research: ["RESEARCH"],
  leadership: ["LEADERSHIP"],
  volunteer: ["VOLUNTEER WORK", "VOLUNTEER"],
  education: ["EDUCATION"],
  certifications: ["CERTIFICATIONS"],
  affiliations: ["PROFESSIONAL AFFILIATIONS", "AFFILIATIONS"],
  publications: ["PUBLICATIONS"],
  awards: ["AWARDS", "RECOGNITIONS"],
  languages: ["LANGUAGES", "LANGUAGE PROFICIENCY"],
  achievements: ["ACHIEVEMENTS"],
};

const CUSTOM_PREFIX = "custom__";

const emptySections = () =>
  Object.keys(SECTION_KEYWORDS).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

const cleanLine = (line) =>
  String(line || "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^#{1,6}\s*/g, "")
    .replace(/^[-*�]\s*/g, "")
    .replace(/^\d+[.)]\s*/g, "")
    .trim();

const parseHeaderValue = (line, key) => {
  const upper = line.toUpperCase();
  if (!upper.startsWith(`${key}:`)) return "";
  return line.slice(key.length + 1).trim();
};

const matchSectionKey = (line) => {
  const normalized = line.toUpperCase().replace(/:/g, "").trim();
  for (const [key, patterns] of Object.entries(SECTION_KEYWORDS)) {
    if (patterns.some((pattern) => normalized === pattern || normalized.includes(pattern))) return key;
  }
  return "";
};

const isLikelyHeading = (line) => {
  const normalized = line.replace(/:/g, "").trim();
  if (!normalized || normalized.length > 45) return false;
  return /^[A-Z][A-Z\s/&()\-]+$/.test(normalized);
};

const toCustomKey = (heading) => {
  const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${CUSTOM_PREFIX}${slug || "extra"}`;
};

const labelFromKey = (key) => {
  const base = BASE_SECTION_META.find(([k]) => k === key);
  if (base) return base[1];
  if (key.startsWith(CUSTOM_PREFIX)) {
    const raw = key.replace(CUSTOM_PREFIX, "").replace(/_/g, " ").trim();
    return raw ? raw.replace(/\b\w/g, (ch) => ch.toUpperCase()) : "Additional Section";
  }
  return key;
};

const headingFromKey = (key) => {
  const known = Object.entries(SECTION_KEYWORDS).find(([k]) => k === key);
  if (known) return SECTION_KEYWORDS[key][0];
  return labelFromKey(key).toUpperCase();
};

function parseResume(raw = "") {
  const lines = String(raw)
    .split("\n")
    .map((line) => cleanLine(line))
    .filter(Boolean);

  const nameFromHeading = lines.map((line) => parseHeaderValue(line, "NAME")).find(Boolean);
  const roleFromHeading = lines.map((line) => parseHeaderValue(line, "ROLE")).find(Boolean);

  const fullName = nameFromHeading || lines[0] || "Candidate Name";
  const jobTitle = roleFromHeading || lines[1] || "Target Role";

  const sections = emptySections();
  const customMeta = [];
  let current = "summary";

  lines.forEach((line) => {
    if (line === fullName || line === jobTitle || parseHeaderValue(line, "NAME") || parseHeaderValue(line, "ROLE")) return;

    const known = matchSectionKey(line);
    if (known) {
      current = known;
      return;
    }

    if (isLikelyHeading(line)) {
      const customKey = toCustomKey(line.replace(/:/g, "").trim());
      if (!sections[customKey]) sections[customKey] = [];
      if (!customMeta.some((item) => item.key === customKey)) {
        customMeta.push({ key: customKey, label: line.replace(/:/g, "").trim(), column: "main" });
      }
      current = customKey;
      return;
    }

    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  });

  return { fullName, jobTitle, sections, customMeta };
}

function serializeResume(parsed) {
  const lines = [parsed.fullName, parsed.jobTitle];
  const orderedKeys = [...BASE_SECTION_META.map(([key]) => key), ...(parsed.customMeta || []).map((item) => item.key)];

  orderedKeys.forEach((key) => {
    const items = parsed.sections[key] || [];
    if (!items.length) return;
    lines.push("", headingFromKey(key), ...items.map((item) => `- ${item}`));
  });

  return lines.join("\n").trim();
}

function SectionView({ title, items, markerColor = "#334155", card = false, sectionStyle = {} }) {
  if (!items || !items.length) return null;

  const dot = { backgroundColor: markerColor };

  if (card) {
    return (
      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4" style={sectionStyle}>
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
        <ul className="space-y-1.5 break-words text-sm leading-6 text-slate-700">
          {items.map((item, idx) => (
            <li key={`${title}-${idx}`} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full" style={dot} />
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mb-5">
      <h3 className="mb-2 border-b border-slate-200 pb-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <ul className="space-y-1.5 break-words text-sm leading-6 text-slate-700">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full" style={dot} />
            <span className="break-words">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionEditor({ title, value, onChange, onImprove, improving }) {
  return (
    <section className="mb-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">{title}</label>
        <button
          type="button"
          onClick={onImprove}
          disabled={improving}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {improving ? "Improving..." : "Improve with AI"}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-6 text-slate-700 focus:border-brand-500 focus:outline-none"
        placeholder={`Edit ${title.toLowerCase()}...`}
      />
    </section>
  );
}

function ResumePreview({ resumeText, template = "corporate", editable = false, onResumeChange, onNotify, styleConfig = null }) {
  const parsedFromText = useMemo(() => parseResume(resumeText), [resumeText]);
  const [parsed, setParsed] = useState(parsedFromText);
  const [improvingSection, setImprovingSection] = useState("");

  const design = useMemo(() => {
    const base = TEMPLATE_DEFAULT_STYLE[template] || TEMPLATE_DEFAULT_STYLE.corporate;
    return { ...base, ...(styleConfig || {}) };
  }, [template, styleConfig]);

  useEffect(() => {
    setParsed(parsedFromText);
  }, [parsedFromText]);

  const updateParsed = (updater) => {
    setParsed((prev) => {
      const next = updater(prev);
      if (onResumeChange) onResumeChange(serializeResume(next));
      return next;
    });
  };

  const updateSection = (key, textValue) => {
    const items = String(textValue)
      .split("\n")
      .map((line) => cleanLine(line))
      .filter(Boolean);

    updateParsed((prev) => ({ ...prev, sections: { ...prev.sections, [key]: items } }));
  };

  const improveSection = async (key) => {
    const currentText = (parsed.sections[key] || []).join("\n");
    setImprovingSection(key);

    try {
      const response = await axiosInstance.post("/resumes/improve-section", {
        sectionKey: key,
        currentText,
        fullResumeText: serializeResume(parsed),
        targetRole: parsed.jobTitle,
      });

      const improved = (response.data?.improvedText || "")
        .split("\n")
        .map((line) => cleanLine(line))
        .filter(Boolean)
        .join("\n");

      if (improved) updateSection(key, improved);
      if (onNotify) onNotify(`Section improved${response.data?.aiProvider ? ` (${response.data.aiProvider})` : ""}`);
    } catch (error) {
      if (onNotify) onNotify(error.response?.data?.message || "Failed to improve section");
    } finally {
      setImprovingSection("");
    }
  };

  const sideSections = BASE_SECTION_META.filter(([, , col]) => col === "side");
  const mainSections = BASE_SECTION_META.filter(([, , col]) => col === "main");
  const customSections = (parsed.customMeta || []).map((item) => [item.key, item.label, item.column || "main"]);

  const renderSection = (key, label, asCard = false) =>
    editable ? (
      <SectionEditor
        key={key}
        title={labelFromKey(key) || label}
        value={(parsed.sections[key] || []).join("\n")}
        onChange={(value) => updateSection(key, value)}
        onImprove={() => improveSection(key)}
        improving={improvingSection === key}
      />
    ) : (
      <SectionView
        key={key}
        title={labelFromKey(key) || label}
        items={parsed.sections[key]}
        markerColor={design.primary}
        card={asCard}
        sectionStyle={asCard ? { borderColor: `${design.primary}44` } : {}}
      />
    );

  const rootStyle = { backgroundColor: design.background, color: design.text, fontFamily: design.fontFamily };
  const heroStyle = { background: `linear-gradient(90deg, ${design.secondary}, ${design.primary})` };

  if (template === "minimal") {
    return (
      <article className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-panel" style={rootStyle}>
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="break-words text-xl font-black text-slate-900 sm:text-2xl">{parsed.fullName}</h2>
          <p className="break-words text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:text-sm sm:tracking-[0.14em]">{parsed.jobTitle}</p>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>{sideSections.map(([key, label]) => renderSection(key, label))}</div>
          <div>{[...mainSections, ...customSections].map(([key, label]) => renderSection(key, label))}</div>
        </div>
      </article>
    );
  }

  if (template === "modern") {
    return (
      <article className="overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50 to-white shadow-panel" style={rootStyle}>
        <div className="px-6 py-6 text-white" style={heroStyle}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="break-words text-xl font-black sm:text-2xl">{parsed.fullName}</h2>
              <p className="break-words text-xs font-semibold uppercase tracking-[0.12em] opacity-90 sm:text-sm sm:tracking-[0.16em]">{parsed.jobTitle}</p>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{RESUME_TEMPLATES.modern.badge}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            {sideSections.map(([key, label]) => renderSection(key, label, true))}
          </div>
          <div className="grid gap-4">{[...mainSections, ...customSections].map(([key, label]) => renderSection(key, label, true))}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel" style={rootStyle}>
      <div className="px-6 py-6 text-white" style={heroStyle}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-2xl">
            {editable ? (
              <>
                <input
                  value={parsed.fullName}
                  onChange={(e) => updateParsed((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-transparent break-words text-xl font-extrabold tracking-tight sm:text-2xl placeholder:opacity-70 focus:outline-none"
                  placeholder="Candidate Name"
                />
                <input
                  value={parsed.jobTitle}
                  onChange={(e) => updateParsed((prev) => ({ ...prev, jobTitle: e.target.value }))}
                  className="mt-1 w-full break-words bg-transparent text-xs font-semibold uppercase tracking-[0.12em] placeholder:opacity-70 focus:outline-none sm:text-sm sm:tracking-[0.16em]"
                  placeholder="Target Role"
                />
              </>
            ) : (
              <>
                <h2 className="break-words text-xl font-extrabold tracking-tight sm:text-2xl">{parsed.fullName}</h2>
                <p className="mt-1 break-words text-xs font-semibold uppercase tracking-[0.12em] opacity-80 sm:text-sm sm:tracking-[0.16em]">{parsed.jobTitle}</p>
              </>
            )}
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{RESUME_TEMPLATES.corporate.badge}</span>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" style={{ borderColor: `${design.primary}44` }}>
          {sideSections.map(([key, label]) => renderSection(key, label))}
        </div>
        <div>{[...mainSections, ...customSections].map(([key, label]) => renderSection(key, label))}</div>
      </div>
    </article>
  );
}

export { RESUME_TEMPLATES };
export default ResumePreview;
