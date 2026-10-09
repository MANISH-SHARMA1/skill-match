"use client";

import {
  ArrowRight,
  Brain,
  Building2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import FeaturedJobs from "./components/FeaturedJobs";
import CandidateSections from "./components/CandidateSections";
import Testimonials from "./components/Testimonials";

const popularSearches = [
  "React Developer",
  "Full Stack",
  "UI/UX Designer",
  "Data Analyst",
  "Node.js",
];

const features = [
  {
    icon: Brain,
    title: "Smart Skill Matching",
    description:
      "Our AI analyzes your skills, experience and preferences to find the most relevant jobs.",
  },
  {
    icon: User,
    title: "Personalized Recommendations",
    description:
      "Get job suggestions tailored to your unique profile and career goals.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Career",
    description:
      "Access learning resources, skill insights and career guidance to reach your next milestone.",
  },
  {
    icon: Building2,
    title: "For Employers",
    description:
      "Find the right talent faster with skill-based matching and AI-powered recommendations.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#102d35]">
      

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-linear-to-b from-white via-white to-[#f8fcfa]">

        {/* subtle background glow */}
        <div className="pointer-events-none absolute -right-32 top-10 h-[430px] w-[430px] rounded-full bg-[#e5f7f0] opacity-50 blur-3xl" />

        <div className="relative mx-auto grid min-h-[425px] max-w-[1240px] grid-cols-1 items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-10">

          {/* LEFT */}
          <div className="relative z-10 max-w-[590px]">

            {/* AI Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9eee6] bg-[#f1faf6] px-3 py-1.5">
              <Sparkles
                size={13}
                fill="#078c59"
                className="text-[#078c59]"
              />
              <span className="text-[11px] font-semibold text-[#078c59]">
                AI-Powered Job Matching
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-[570px] text-[42px] font-bold leading-[1.08] tracking-[-1.7px] text-[#0c2931] sm:text-[48px] lg:text-[43px]">
              Your Skills.
              <br />
              The Right Jobs.
              <br />
              <span className="text-[#07945d]">Faster.</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[550px] text-[14px] leading-6 text-slate-500">
              We match you with the best job opportunities based on your
              skills, experience and career goals — not just keywords.
            </p>

            {/* Search */}
            <div
              id="jobs"
              className="mt-6 flex max-w-[620px] flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(20,70,55,0.08)] sm:flex-row"
            >
              {/* Search input */}
              <div className="flex h-[42px] flex-1 items-center gap-3 rounded-lg border border-slate-100 px-3">
                <Search size={17} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search jobs, skills, or job titles"
                  className="w-full bg-transparent text-[12px] text-slate-600 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Location */}
              <div className="flex h-[42px] w-full items-center gap-3 rounded-lg border border-slate-100 px-3 sm:w-[175px]">
                <MapPin
                  size={17}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Location"
                  className="w-full bg-transparent text-[12px] text-slate-600 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Button */}
              <button className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#078c59] px-5 text-[12px] font-semibold text-white transition hover:bg-[#067b4e]">
                Find Jobs
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Popular searches */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-medium text-slate-500">
                Popular searches:
              </span>

              {popularSearches.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[9px] font-medium text-slate-500 shadow-sm transition hover:border-[#ccebdd] hover:bg-[#f3fbf7] hover:text-[#078c59]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative mx-auto hidden h-[390px] w-full max-w-[530px] lg:block">

            {/* Green organic background */}
            <div className="absolute right-0 top-5 h-[300px] w-[390px] rotate-[16deg] rounded-[48%_52%_45%_55%] bg-[#dcefe8]" />

            <div className="absolute right-[10px] top-[35px] h-[275px] w-[360px] rotate-[16deg] rounded-[50%_45%_50%_48%] border-[22px] border-[#c5e6db]" />

            {/* Main image */}
            <div className="absolute bottom-[25px] right-[15px] h-[275px] w-[375px] overflow-hidden rounded-[48%_12%_48%_14%] bg-[#e6f1ed] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85"
                alt="Professional working on a laptop"
                className="h-full w-full object-cover"
              />

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Floating Match Card */}
            <div className="absolute left-0 top-[45px] z-20 flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f7f1]">
                <Sparkles size={12} className="text-[#078c59]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold text-slate-600">
                  Match based on
                </p>
                <p className="text-[9px] font-semibold text-slate-600">
                  Your Skills & Experience
                </p>
              </div>
            </div>

            {/* Better Match Card */}
            <div className="absolute right-0 top-[105px] z-20 flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f8f2]">
                <TrendingUp size={13} className="text-[#078c59]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold text-slate-600">
                  Better Matches
                </p>

                <p className="text-[9px] font-semibold text-slate-600">
                  Higher Chances
                </p>

                <p className="text-[9px] font-semibold text-slate-600">
                  of Getting Hired
                </p>

                <div className="mt-1 flex items-center gap-1">
                  <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-9/12 rounded-full bg-[#07945d]" />
                  </div>

                  <span className="text-[8px] font-bold text-[#07945d]">
                    82%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 px-5 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group flex flex-col items-center px-6 text-center ${index !== 0
                  ? "border-slate-100 sm:border-l"
                  : ""
                  } ${index >= 2
                    ? "border-t pt-8 sm:border-t-0 sm:pt-0 lg:border-l"
                    : ""
                  }`}
              >
                {/* Icon */}
                <div className="mb-3 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#edf9f5] transition duration-300 group-hover:scale-105 group-hover:bg-[#dff4eb]">
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#078c59]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[13px] font-bold text-[#17333a]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 max-w-[220px] text-[11px] leading-5 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <FeaturedJobs />
      <CandidateSections />
      <Testimonials />
    </main>
  );
}