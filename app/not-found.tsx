
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Home,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6faf8] px-5 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />

      <div className="relative w-full max-w-3xl">
        {/* Brand */}
        <Link
          href="/"
          className="mx-auto mb-10 flex w-fit items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md shadow-emerald-900/15">
            <BriefcaseBusiness size={21} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#17364b]">
            Skill<span className="text-emerald-700">Match</span>
          </span>
        </Link>

        {/* Main card */}
        <section className="overflow-hidden rounded-3xl border border-white bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
            {/* Illustration */}
            <div className="relative mx-auto mb-7 flex h-44 w-56 items-center justify-center">
              <div className="absolute inset-5 rounded-full bg-emerald-50" />

              <div className="absolute left-2 top-7 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                <Search size={19} />
              </div>

              <div className="absolute right-2 top-10 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                <Users size={19} />
              </div>

              <div className="relative flex h-32 w-36 flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-lg shadow-emerald-900/5">
                <span className="text-5xl font-black tracking-tight text-emerald-800">
                  404
                </span>
                <div className="mt-2 h-1.5 w-16 rounded-full bg-emerald-100" />
                <div className="mt-2 h-1.5 w-10 rounded-full bg-slate-100" />
              </div>

              <span className="absolute bottom-5 left-9 h-3 w-3 rounded-full bg-emerald-400" />
              <span className="absolute right-9 bottom-7 h-2 w-2 rounded-full bg-teal-300" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
              Page not found
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#17364b] sm:text-4xl">
              Looks like you took
              <br className="hidden sm:block" /> a wrong turn.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
              The page you’re looking for may have moved, been removed, or
              doesn’t exist. Let’s get you back on the right track.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                <Home size={16} />
                Back to Home
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </div>

          {/* Helpful links */}
          <div className="grid grid-cols-1 border-t border-slate-100 bg-slate-50/80 sm:grid-cols-3">
            <Link
              href="/jobs"
              className="group flex items-center gap-3 border-b border-slate-100 px-5 py-5 transition hover:bg-emerald-50 sm:border-b-0 sm:border-r"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <BriefcaseBusiness size={18} />
              </span>
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Find Jobs
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Explore opportunities
                </span>
              </span>
            </Link>

            <Link
              href="/employer/jobs"
              className="group flex items-center gap-3 border-b border-slate-100 px-5 py-5 transition hover:bg-emerald-50 sm:border-b-0 sm:border-r"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <Users size={18} />
              </span>
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Employer Portal
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Manage your jobs
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="group flex items-center gap-3 px-5 py-5 transition hover:bg-emerald-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <ShieldCheck size={18} />
              </span>
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  SkillMatch
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Your next step starts here
                </span>
              </span>
            </Link>
          </div>
        </section>

        <p className="mt-7 text-center text-[10px] text-slate-400">
          © {new Date().getFullYear()} SkillMatch. Find the right fit.
        </p>
      </div>
    </main>
  );
}