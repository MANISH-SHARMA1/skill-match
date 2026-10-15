
"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BriefcaseBusiness, MapPin, IndianRupee, Clock,
  Plus, X, Save, Send, Eye, CheckCircle2, FileText,
  Check
} from "lucide-react";
import { Job } from "../../../libs/jobs";
import {
  JobRecord,
  createEmployerJob,
  getEmployerJob,
  updateEmployerJob,
  fromJobRecord,
  JobFormInput,
} from "@/app/libs/api/jobsApi";

const initialForm = {
  title: "",
  department: "",
  location: "",
  workplace: "On-site" as JobRecord["workplace"],
  employmentType: "Full-time" as JobRecord["employmentType"],
  experience: "1–3 years" as JobRecord["experience"],
  salaryMin: "300000",
  salaryMax: "600000",
  salaryPeriod: "Yearly" as JobRecord["salary"]["period"],
  openings: "1",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: [] as string[],
  benefits: [] as string[],
};

const skillSuggestions = [
  "React", "Next.js", "TypeScript", "Node.js", "MongoDB",
  "Tailwind CSS", "REST APIs", "Git", "SQL", "AWS",
];

const benefitSuggestions = [
  "Health Insurance", "Remote Work", "Flexible Hours",
  "Paid Leave", "Learning Budget", "Performance Bonus",
];

function PostJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState<JobFormInput>(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("");

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadJob() {
      if (!editId) {
        setLoaded(true);
        return;
      }

      try {
        const job = await getEmployerJob(editId);

        if (cancelled) return;

        setForm(fromJobRecord(job));
      } catch (error) {
        if (cancelled) return;

        setMessage(
          "Unable to load this job. It may have been deleted or you may not have permission to edit it."
        );
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void loadJob();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  function setField<K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K]
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  }

  function toggleItem(
    key: "skills" | "benefits",
    item: string
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: previous[key].includes(item)
        ? previous[key].filter((value) => value !== item)
        : [...previous[key], item],
    }));
  }

  function addCustomSkill() {
    const skill = skillInput.trim();
    if (!skill) return;

    if (!form.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setField("skills", [...form.skills, skill]);
    }
    setSkillInput("");
  }

  function validate() {
    const next: Record<string, string> = {};

    if (!form.title.trim()) next.title = "Job title is required.";
    if (!form.department.trim()) next.department = "Department is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.description.trim()) next.description = "Add a job description.";
    if (!form.requirements.trim()) next.requirements = "Add the job requirements.";

    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);
    const openings = Number(form.openings);

    if (!form.salaryMin || min < 0 || !Number.isFinite(min)) {
      next.salaryMin = "Enter a valid minimum salary.";
    }
    if (!form.salaryMax || max < min || !Number.isFinite(max)) {
      next.salaryMax = "Maximum salary must be at least the minimum.";
    }
    if (!Number.isInteger(openings) || openings < 1) {
      next.openings = "Enter at least one opening.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submitJob(status: "Draft" | "Active") {
    if (saving) return;

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let response
      if (editId) {
        response = await updateEmployerJob(editId, form, status);
      } else {
        response = await createEmployerJob(form, status);
      }

      notify("Job created successfully")
      setForm(initialForm)
      // router.push("/employer/jobs");
      // router.refresh();
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setMessage(
        err.response?.data?.message ??
        err.message ??
        "Unable to save the job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading job form...
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-500 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">

        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <BriefcaseBusiness size={15} /> EMPLOYER WORKSPACE
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#17364b] sm:text-3xl">
              {editId ? "Edit Job" : "Post a New Job"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Find the right talent by sharing clear job requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            <Eye size={15} /> {preview ? "Back to Form" : "Preview Job"}
          </button>
        </header>

        {message && (
          <div role="status" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            {message}
          </div>
        )}

        {preview ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <BriefcaseBusiness size={26} />
              </div>
              <div>
                <h2 className="text-xl text-black font-bold">{form.title || "Job title"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {form.department || "Department"} · {form.employmentType}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={13} />{form.location || "Location"}</span>
                  <span className="flex items-center gap-1"><IndianRupee size={13} />{form.salaryMin || "0"} – {form.salaryMax || "0"} ({form.salaryPeriod})</span>
                  <span className="flex items-center gap-1"><Clock size={13} />{form.experience}</span>
                </div>
              </div>
            </div>
            <hr className="my-6 border-slate-100" />
            <h3 className="text-sm text-black font-bold">Job Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{form.description || "Your job description will appear here."}</p>
            <h3 className="mt-6 text-sm text-black font-bold">Responsibilities</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{form.responsibilities || "No responsibilities added."}</p>
            <h3 className="mt-6 text-sm text-black font-bold">Requirements</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{form.requirements || "Your requirements will appear here."}</p>
            <h3 className="mt-6 text-sm text-black font-bold">Required Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {form.skills.map((skill) => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">{skill}</span>)}
            </div>
            <h3 className="mt-6 text-sm text-black font-bold">Benefits</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {form.benefits.map((benefit) => <span key={benefit} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{benefit}</span>)}
            </div>
            <button type="button" onClick={() => setPreview(false)} className="mt-8 rounded-lg bg-emerald-800 px-5 py-3 text-xs font-semibold text-white">
              Continue Editing
            </button>
          </section>
        ) : (
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              submitJob("Active");
            }}
            className="space-y-5"
          >
            {/* Basic details */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><FileText size={19} /></div>
                <div>
                  <h2 className="text-black text-sm font-bold">Basic Information</h2>
                  <p className="mt-1 text-xs text-slate-500">Start with the role and team details.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Job Title *</label>
                  <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Senior Frontend Developer" className={inputClass} />
                  {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                </div>
                <div>
                  <label className={labelClass}>Department *</label>
                  <input value={form.department} onChange={(e) => setField("department", e.target.value)} placeholder="e.g. Engineering" className={inputClass} />
                  {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
                </div>
                <div>
                  <label className={labelClass}>Employment Type</label>
                  <select value={form.employmentType} onChange={(e) => setField("employmentType", e.target.value as JobRecord["employmentType"])} className={inputClass}>
                    {["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Workplace Type</label>
                  <select value={form.workplace} onChange={(e) => setField("workplace", e.target.value as Job["workplace"])} className={inputClass}>
                    {["On-site", "Remote", "Hybrid"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location *</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g. Bangalore, India" className={`${inputClass} pl-9`} />
                  </div>
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>
                <div>
                  <label className={labelClass}>Experience Required</label>
                  <select value={form.experience} onChange={(e) => setField("experience", e.target.value as JobRecord["experience"])} className={inputClass}>
                    {["Fresher", "0–1 years", "1–3 years", "3–5 years", "5–8 years", "8+ years"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Number of Openings</label>
                  <input type="number" min="1" value={form.openings} onChange={(e) => setField("openings", e.target.value)} className={inputClass} />
                  {errors.openings && <p className="mt-1 text-xs text-red-600">{errors.openings}</p>}
                </div>
              </div>
            </section>

            {/* Salary */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><IndianRupee size={19} /></div>
                <div>
                  <h2 className="text-black text-sm font-bold">Compensation</h2>
                  <p className="mt-1 text-xs text-slate-500">Enter a realistic salary range in INR.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Minimum Salary (₹)</label>
                  <input type="number" min="0" value={form.salaryMin} onChange={(e) => setField("salaryMin", e.target.value)} className={inputClass} />
                  {errors.salaryMin && <p className="mt-1 text-xs text-red-600">{errors.salaryMin}</p>}
                </div>
                <div>
                  <label className={labelClass}>Maximum Salary (₹)</label>
                  <input type="number" min="0" value={form.salaryMax} onChange={(e) => setField("salaryMax", e.target.value)} className={inputClass} />
                  {errors.salaryMax && <p className="mt-1 text-xs text-red-600">{errors.salaryMax}</p>}
                </div>
                <div>
                  <label className={labelClass}>Salary Period</label>
                  <select value={form.salaryPeriod} onChange={(e) => setField("salaryPeriod", e.target.value as Job["salaryPeriod"])} className={inputClass}>
                    <option>Yearly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-black text-sm font-bold">Job Description & Requirements</h2>
              <p className="mt-1 text-xs text-slate-500">Give candidates a clear picture of the role.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className={labelClass}>Job Description *</label>
                  <textarea rows={5} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the role, team, and what the candidate will work on..." className={inputClass} />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>
                <div>
                  <label className={labelClass}>Responsibilities</label>
                  <textarea rows={4} value={form.responsibilities} onChange={(e) => setField("responsibilities", e.target.value)} placeholder="What will the candidate do day to day?" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Requirements *</label>
                  <textarea rows={4} value={form.requirements} onChange={(e) => setField("requirements", e.target.value)} placeholder="Experience, education, qualifications, and other requirements..." className={inputClass} />
                  {errors.requirements && <p className="mt-1 text-xs text-red-600">{errors.requirements}</p>}
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><CheckCircle2 size={19} /></div>
                <div>
                  <h2 className="text-black text-sm font-bold">Skills & Benefits</h2>
                  <p className="mt-1 text-xs text-slate-500">Select relevant skills and workplace benefits.</p>
                </div>
              </div>

              <h3 className="mb-3 mt-5 text-xs font-semibold text-slate-700">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => {
                  const selected = form.skills.includes(skill);
                  return (
                    <button key={skill} type="button" onClick={() => toggleItem("skills", skill)} className={`rounded-full border px-3 py-2 text-xs transition ${selected ? "border-emerald-700 bg-emerald-50 font-semibold text-emerald-800" : "border-slate-200 text-slate-500 hover:border-emerald-300"}`}>
                      {selected ? "✓ " : "+ "}{skill}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }} placeholder="Add a custom skill" className={`${inputClass} max-w-sm`} />
                <button type="button" onClick={addCustomSkill} className="rounded-lg border border-emerald-200 px-3 text-emerald-800 hover:bg-emerald-50"><Plus size={17} /></button>
              </div>
              {form.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                      {skill}
                      <button type="button" onClick={() => toggleItem("skills", skill)} aria-label={`Remove ${skill}`}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}

              <h3 className="mb-3 mt-7 text-xs font-semibold text-slate-700">Benefits & Perks</h3>
              <div className="flex flex-wrap gap-2">
                {benefitSuggestions.map((benefit) => {
                  const selected = form.benefits.includes(benefit);
                  return (
                    <button key={benefit} type="button" onClick={() => toggleItem("benefits", benefit)} className={`rounded-full border px-3 py-2 text-xs transition ${selected ? "border-emerald-700 bg-emerald-50 font-semibold text-emerald-800" : "border-slate-200 text-slate-500 hover:border-emerald-300"}`}>
                      {selected ? "✓ " : "+ "}{benefit}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Actions */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-[#f6f9f8]/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={saving}
                onClick={() => submitJob("Draft")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900"
              >
                <Send size={15} />
                {saving
                  ? "Publishing..."
                  : editId
                    ? "Save & Publish"
                    : "Publish Job"}
              </button>
            </div>
          </form>
        )}
      </div>

      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-70 flex max-w-sm items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xl">
          <Check size={16} />
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f6f9f8]">
          <p className="text-base text-slate-500">
            Loading job form...
          </p>
        </div>
      }
    >
      <PostJobForm />
    </Suspense>
  );
}