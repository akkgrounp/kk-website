import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6 md:grid-cols-2 md:gap-8 md:p-12">
      <div className="space-y-5">
        <p className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
          Professional Resume Writing with AI
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Build job-ready resumes in minutes.
        </h1>
        <p className="max-w-xl text-base text-slate-600 sm:text-lg">
          Enter your profile details, generate an ATS-friendly resume, and track every version from your dashboard.
        </p>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Link className="w-full rounded-lg bg-brand-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-brand-700 sm:w-auto" to="/signup">
            Start Free
          </Link>
          <Link className="w-full rounded-lg border border-slate-300 px-6 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-100 sm:w-auto" to="/login">
            Login
          </Link>
        </div>
      </div>
      <div className="rounded-xl bg-slate-950 p-6 text-slate-100">
        <h2 className="mb-3 text-lg font-bold">What you get</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li>- AI-generated summary, experience, and skills sections</li>
          <li>- Secure user auth with JWT</li>
          <li>- Resume history saved in MongoDB</li>
          <li>- Clean, export-ready plain text resume output</li>
        </ul>
      </div>
    </section>
  );
}

export default Home;
