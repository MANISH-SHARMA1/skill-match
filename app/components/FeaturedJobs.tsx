"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MapPin,
  Rocket,
  Settings2,
  UserRound,
} from "lucide-react";

const jobs = [
  {
    company: "TechNova Solutions",
    title: "Full Stack Developer",
    location: "Remote • India",
    salary: "₹6L - ₹12L / year",
    posted: "3d ago",
    logo: "TN",
    logoType: "dark",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    company: "PixelCraft Studio",
    title: "Frontend Developer",
    location: "Bangalore, India",
    salary: "₹4L - ₹8L / year",
    posted: "2d ago",
    logo: "P",
    logoType: "black",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    company: "DataForge Labs",
    title: "Backend Developer",
    location: "Hyderabad, India",
    salary: "₹5L - ₹10L / year",
    posted: "1d ago",
    logo: "D",
    logoType: "blue",
    tags: ["Node.js", "Express", "MongoDB"],
  },
  {
    company: "DesignHub",
    title: "UI/UX Designer",
    location: "Remote • India",
    salary: "₹4L - ₹8L / year",
    posted: "4d ago",
    logo: "✦",
    logoType: "gradient",
    tags: ["Figma", "UI/UX", "Product Design"],
  },
];

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description: "Add your skills, experience, location and career goals.",
    icon: UserRound,
  },
  {
    number: "2",
    title: "AI Matches You",
    description:
      "Our algorithm finds the best jobs and candidates based on your skills.",
    icon: Settings2,
  },
  {
    number: "3",
    title: "Apply or Connect",
    description:
      "Apply to jobs or get recommended candidates if you're an employer.",
    icon: FileText,
  },
  {
    number: "4",
    title: "Grow Together",
    description:
      "Land the right job or hire the best talent — faster.",
    icon: Rocket,
  },
];

export default function FeaturedJobs() {
  return (
    <section className="w-full bg-white">
      {/* =====================================================
          FEATURED JOBS
      ====================================================== */}
      <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-10 sm:px-8 lg:pt-12">
        
        {/* Section heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#07945d]">
              Featured Jobs
            </p>

            <h2 className="text-[27px] font-bold leading-tight tracking-[-0.8px] text-[#102d35] sm:text-[28px]">
              Top Opportunities for You
            </h2>

            <p className="mt-1.5 text-[12px] text-slate-500">
              Handpicked jobs that match your skills and career goals.
            </p>
          </div>

          <button className="mb-1 hidden items-center gap-1 text-[11px] font-semibold text-[#078c59] transition hover:text-[#056d46] sm:flex">
            View all jobs
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Mobile view all */}
        <button className="mb-5 flex items-center gap-1 text-[11px] font-semibold text-[#078c59] sm:hidden">
          View all jobs
          <ArrowRight size={13} />
        </button>

        {/* Job cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.title} job={job} />
          ))}
        </div>
      </div>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
            
            {/* Left content */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#07945d]">
                How It Works
              </p>

              <h2 className="max-w-[270px] text-[26px] font-bold leading-[1.12] tracking-[-0.8px] text-[#102d35]">
                From Your Skills to
                <br />
                Your Next Opportunity
              </h2>

              <p className="mt-3 max-w-[265px] text-[12px] leading-5 text-slate-500">
                Our AI-powered platform understands your skills, finds the
                right matches and recommends jobs where you can truly grow.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#078c59] px-5 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#067b4e]">
                Get Started
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Connector */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-[calc(50%+38px)] top-[40px] hidden w-[calc(100%-55px)] lg:block">
                        <div className="relative h-px bg-[#e6f0ec]">
                          <ArrowRight
                            size={12}
                            className="absolute -right-1 -top-[6px] text-[#d7ebe3]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Number */}
                    <div className="relative z-10 mb-[-2px] flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f6ef] text-[12px] font-bold text-[#078c59]">
                      {step.number}
                    </div>

                    {/* Icon circle */}
                    <div className="relative z-10 flex h-[58px] w-[58px] items-center justify-center rounded-full border-[7px] border-white bg-[#effaf6] shadow-sm">
                      <Icon
                        size={23}
                        strokeWidth={1.8}
                        className="text-[#078c59]"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 text-[12px] font-bold text-[#17333a]">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 max-w-[155px] text-[10px] leading-4 text-slate-400">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   JOB CARD
========================================================= */

function JobCard({
  job,
}: {
  job: {
    company: string;
    title: string;
    location: string;
    salary: string;
    posted: string;
    logo: string;
    logoType: string;
    tags: string[];
  };
}) {
  return (
    <div className="group relative flex min-h-[240px] flex-col rounded-xl border border-[#e7eeeb] bg-white p-4 shadow-[0_2px_12px_rgba(20,60,50,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#cfe8dc] hover:shadow-[0_12px_30px_rgba(20,80,60,0.09)]">
      
      {/* Top */}
      <div className="flex items-start justify-between">
        <CompanyLogo
          text={job.logo}
          type={job.logoType}
        />

        <span className="text-[9px] font-medium text-slate-400">
          {job.posted}
        </span>
      </div>

      {/* Job title */}
      <h3 className="mt-3 text-[13px] font-bold text-[#17333a]">
        {job.title}
      </h3>

      {/* Company */}
      <p className="mt-1 text-[10px] font-medium text-slate-500">
        {job.company}
      </p>

      {/* Location */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
        <MapPin size={11} className="text-slate-400" />
        {job.location}
      </div>

      {/* Salary */}
      <p className="mt-2 text-[10px] font-bold text-[#17333a]">
        {job.salary}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#f3f7f6] px-2 py-1 text-[8px] font-medium text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Apply button */}
      <div className="mt-auto pt-4">
        <button className="rounded-md bg-[#078c59] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#067b4e]">
          Apply Now
        </button>
      </div>
    </div>
  );
}


/* =========================================================
   COMPANY LOGO
========================================================= */

function CompanyLogo({
  text,
  type,
}: {
  text: string;
  type: string;
}) {
  const styles: Record<string, string> = {
    dark: "bg-[#112f3b] text-[#80d5b1]",
    black: "bg-[#1d2528] text-[#e5d9a6]",
    blue: "bg-[#073e69] text-[#8ce1d0]",
    gradient: "bg-gradient-to-br from-[#075e8d] via-[#18a6a1] to-[#7d55c9] text-white",
  };

  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-bold shadow-sm ${
        styles[type] || styles.dark
      }`}
    >
      {text}
    </div>
  );
}