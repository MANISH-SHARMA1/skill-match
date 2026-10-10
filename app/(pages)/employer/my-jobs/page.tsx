
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness, Plus, Search, MapPin, Clock, Users,
  MoreHorizontal, Pencil, Copy, Pause, Play, XCircle,
  Trash2, Eye, ChevronDown, CheckCircle2, FileText,
  Building2, CalendarDays, Filter, RefreshCw
} from "lucide-react";
import {
  Job, JobStatus, getJobs, saveJobs, deleteJob, formatSalary
} from "../../../libs/jobs";

type FilterStatus = "All Jobs" | JobStatus;

const filters: FilterStatus[] = [
  "All Jobs", "Active", "Draft", "Paused", "Closed",
];

function StatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700",
    Draft: "bg-amber-50 text-amber-700",
    Paused: "bg-slate-100 text-slate-600",
    Closed: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#17364b]">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{description}</p>
    </div>
  );
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All Jobs");
  const [sort, setSort] = useState("newest");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setJobs(getJobs());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("skillmatch-jobs-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("skillmatch-jobs-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  function notify(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function updateStatus(job: Job, status: JobStatus) {
    saveJobs(jobs.map((item) => item.id === job.id ? { ...item, status } : item));
    setMenuId(null);
    notify(`Job ${status.toLowerCase()}.`);
  }

  function duplicateJob(job: Job) {
    const copy: Job = {
      ...job,
      id: crypto.randomUUID(),
      title: `${job.title} (Copy)`,
      status: "Draft",
      applicants: 0,
      createdAt: new Date().toISOString(),
    };

    saveJobs([copy, ...jobs]);
    setMenuId(null);
    notify("Job duplicated as a draft.");
  }

  function removeJob(id: string) {
    deleteJob(id);
    setJobs((previous) => previous.filter((job) => job.id !== id));
    setConfirmDelete(null);
    setMenuId(null);
    notify("Job deleted.");
  }

  const counts = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter((job) => job.status === "Active").length,
    drafts: jobs.filter((job) => job.status === "Draft").length,
    applicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
  }), [jobs]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.skills.some((skill: any) => skill.toLowerCase().includes(q));

      const matchesStatus =
        activeFilter === "All Jobs" || job.status === activeFilter;

      return matchesQuery && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sort === "oldest") {
        return a.createdAt.localeCompare(b.createdAt);
      }
      if (sort === "applicants") {
        return b.applicants - a.applicants;
      }
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [jobs, query, activeFilter, sort]);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500">
        <RefreshCw size={16} className="animate-spin" /> Loading your jobs...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Building2 size={15} /> EMPLOYER WORKSPACE
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#17364b] sm:text-3xl">
              My Jobs
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your job postings and track candidate applications.
            </p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-900"
          >
            <Plus size={16} /> Post a New Job
          </Link>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total Jobs" value={counts.total} description="All your postings" icon={BriefcaseBusiness} />
          <StatCard label="Active Jobs" value={counts.active} description="Currently published" icon={CheckCircle2} />
          <StatCard label="Drafts" value={counts.drafts} description="Not published yet" icon={FileText} />
          <StatCard label="Applications" value={counts.applicants} description="Across all postings" icon={Users} />
        </section>

        {/* Search and filters */}
        <section className="mt-6 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title, department, skill or location..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Filter size={14} className="text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort jobs"
                className="min-w-0 bg-transparent py-2.5 text-xs outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="applicants">Most applicants</option>
                <option value="title">Job title A–Z</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
              const count =
                filter === "All Jobs"
                  ? jobs.length
                  : jobs.filter((job) => job.status === filter).length;

              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "bg-emerald-800 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  {filter}
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    activeFilter === filter ? "bg-white/20" : "bg-white"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Job listings */}
        <section className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              {activeFilter === "All Jobs" ? "All Job Postings" : `${activeFilter} Jobs`}
              <span className="ml-2 font-normal text-slate-400">({filteredJobs.length})</span>
            </h2>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <BriefcaseBusiness size={25} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                {jobs.length === 0 ? "Your first job starts here" : "No jobs found"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                {jobs.length === 0
                  ? "Post your first opening to start finding qualified candidates for your company."
                  : "Try changing the search term or selecting another status filter."}
              </p>
              {jobs.length === 0 ? (
                <Link href="/employer/jobs/new" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-xs font-semibold text-white hover:bg-emerald-900">
                  <Plus size={15} /> Create Your First Job
                </Link>
              ) : (
                <button type="button" onClick={() => { setQuery(""); setActiveFilter("All Jobs"); }} className="mt-5 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <article key={job.id} className="relative rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-emerald-100 hover:shadow-md sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 sm:h-12 sm:w-12">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800 sm:text-base">{job.title}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{job.department} · {job.employmentType}</p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500 sm:text-xs">
                      <span className="flex items-center gap-1.5"><MapPin size={13} />{job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} />{job.experience}</span>
                      <span className="flex items-center gap-1.5"><Users size={13} />{job.openings} opening{job.openings === 1 ? "" : "s"}</span>
                    </div>

                    <p className="mt-3 text-xs font-bold text-emerald-800">{formatSalary(job)}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-600">{skill}</span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-500">+{job.skills.length - 5} more</span>
                      )}
                    </div>
                  </div>

                  {/* Job actions */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setMenuId(menuId === job.id ? null : job.id)}
                      aria-label={`Actions for ${job.title}`}
                      aria-expanded={menuId === job.id}
                      className="rounded-lg border border-slate-100 p-2 text-slate-500 hover:bg-slate-50"
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {menuId === job.id && (
                      <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                        <Link
                          href={`/employer/jobs/new?edit=${encodeURIComponent(job.id)}`}
                          onClick={() => setMenuId(null)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <Pencil size={14} /> Edit Job
                        </Link>

                        <button type="button" onClick={() => duplicateJob(job)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800">
                          <Copy size={14} /> Duplicate
                        </button>

                        {job.status === "Active" ? (
                          <button type="button" onClick={() => updateStatus(job, "Paused")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-600 hover:bg-amber-50 hover:text-amber-800">
                            <Pause size={14} /> Pause Job
                          </button>
                        ) : job.status === "Paused" || job.status === "Draft" ? (
                          <button type="button" onClick={() => updateStatus(job, "Active")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800">
                            <Play size={14} /> Publish / Reactivate
                          </button>
                        ) : job.status === "Closed" ? (
                          <button type="button" onClick={() => updateStatus(job, "Active")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-800">
                            <Play size={14} /> Reopen Job
                          </button>
                        ) : null}

                        {job.status !== "Closed" && (
                          <button type="button" onClick={() => updateStatus(job, "Closed")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-700">
                            <XCircle size={14} /> Close Job
                          </button>
                        )}

                        <div className="my-1 border-t border-slate-100" />

                        <button type="button" onClick={() => { setMenuId(null); setConfirmDelete(job.id); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-red-600 hover:bg-red-50">
                          <Trash2 size={14} /> Delete Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-emerald-700" />
                      <strong className="text-slate-700">{job.applicants}</strong> applicants
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="rounded-md bg-slate-50 px-2 py-1">{job.workplace}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/employer/jobs/new?edit=${encodeURIComponent(job.id)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
                      <Pencil size={12} /> Edit
                    </Link>
                    <Link href={`/employer/candidates?jobId=${encodeURIComponent(job.id)}`} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-2 text-[10px] font-semibold text-white hover:bg-emerald-900">
                      <Users size={12} /> View Candidates
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="py-6 text-center text-[10px] text-slate-400">
          SkillMatch Employer Portal · Job Management
        </footer>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <Trash2 size={20} />
            </div>
            <h2 className="mt-4 text-base font-bold">Delete this job?</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              This removes the posting from your local job list. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={() => removeJob(confirmDelete)} className="rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700">
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xl">
          <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} />{notice}</span>
        </div>
      )}

      {menuId && (
        <button type="button" aria-label="Close job actions menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuId(null)} />
      )}
    </main>
  );
}