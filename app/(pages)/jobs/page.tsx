"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  Clock3,
  BriefcaseBusiness,
  Bookmark,
  Grid2X2,
  List,
  Check,
  X,
  Sparkles,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Job = {
  id: number;
  company: string;
  companyShort: string;
  companyColor: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  skills: string[];
  description: string;
  posted: string;
  match: string;
};

/* =========================================================
   DATA
========================================================= */

const jobs: Job[] = [
  {
    id: 1,
    company: "TechCorp",
    companyShort: "T",
    companyColor: "#4B72FF",
    title: "Full Stack Developer (MERN)",
    location: "Bangalore, Karnataka",
    type: "Full Time",
    experience: "2-5 yrs",
    salary: "₹8L - ₹15L",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
    description:
      "Build scalable web applications with React and Node.js. Work with a dynamic team on exciting projects.",
    posted: "Posted 1 day ago",
    match: "94% Match",
  },
  {
    id: 2,
    company: "HealthPlus",
    companyShort: "+",
    companyColor: "#00B88A",
    title: "Frontend Developer (Next.js)",
    location: "Remote, India",
    type: "Full Time",
    experience: "1-3 yrs",
    salary: "₹6L - ₹12L",
    skills: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    description:
      "Develop modern, responsive web applications using Next.js and Tailwind CSS.",
    posted: "Posted 2 days ago",
    match: "91% Match",
  },
  {
    id: 3,
    company: "GreenTech",
    companyShort: "♧",
    companyColor: "#43B93A",
    title: "Backend Developer (Node.js)",
    location: "Hyderabad, Telangana",
    type: "Full Time",
    experience: "2-4 yrs",
    salary: "₹7L - ₹14L",
    skills: ["Node.js", "MongoDB", "APIs", "Express"],
    description:
      "Build robust backend services and APIs for a growing technology platform.",
    posted: "Posted 2 days ago",
    match: "89% Match",
  },
  {
    id: 4,
    company: "FinTech Corp",
    companyShort: "F",
    companyColor: "#396BFF",
    title: "Full Stack Engineer",
    location: "Pune, Maharashtra",
    type: "Full Time",
    experience: "3-6 yrs",
    salary: "₹10L - ₹18L",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    description:
      "Build and maintain financial applications with modern technologies in a fast-paced environment.",
    posted: "Posted 3 days ago",
    match: "87% Match",
  },
  {
    id: 5,
    company: "CloudStack",
    companyShort: "●",
    companyColor: "#1253A8",
    title: "UI/UX Developer",
    location: "Delhi NCR, India",
    type: "Full Time",
    experience: "1-4 yrs",
    salary: "₹5L - ₹10L",
    skills: ["React", "Figma", "Tailwind CSS", "JavaScript"],
    description:
      "Design and develop beautiful interfaces for our SaaS products and web applications.",
    posted: "Posted 3 days ago",
    match: "84% Match",
  },
  {
    id: 6,
    company: "BuildHub",
    companyShort: "B",
    companyColor: "#263A5A",
    title: "React Developer",
    location: "Mumbai, Maharashtra",
    type: "Full Time",
    experience: "2-5 yrs",
    salary: "₹7L - ₹13L",
    skills: ["React", "JavaScript", "Redux", "REST APIs"],
    description:
      "Work on high-performance applications and collaborate with product and design teams.",
    posted: "Posted 4 days ago",
    match: "82% Match",
  },
  {
    id: 7,
    company: "NextGen Labs",
    companyShort: "N",
    companyColor: "#163B69",
    title: "DevOps Engineer",
    location: "Bangalore, Karnataka",
    type: "Full Time",
    experience: "3-6 yrs",
    salary: "₹10L - ₹17L",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    description:
      "Manage cloud infrastructure and improve deployment pipelines for our applications.",
    posted: "Posted 5 days ago",
    match: "79% Match",
  },
  {
    id: 8,
    company: "CreativeDesk",
    companyShort: "C",
    companyColor: "#7259DC",
    title: "Graphic Designer",
    location: "Remote, India",
    type: "Full Time",
    experience: "1-3 yrs",
    salary: "₹4L - ₹8L",
    skills: ["Figma", "Photoshop", "Illustrator", "Canva"],
    description:
      "Create compelling visual designs for digital products, marketing campaigns and social media.",
    posted: "Posted 5 days ago",
    match: "77% Match",
  },
];

/* =========================================================
   FILTER COMPONENT
========================================================= */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#edf1f0] py-4 first:pt-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[10px] font-semibold text-[#263B42]">
          {title}
        </span>

        <ChevronDown
          size={12}
          className={`text-[#8ca0a4] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

/* =========================================================
   CHECKBOX
========================================================= */

function FilterCheckbox({
  label,
  count,
  checked = false,
}: {
  label: string;
  count?: string;
  checked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-[3px]">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-[11px] w-[11px] items-center justify-center rounded-[2px] border ${
            checked
              ? "border-[#07815f] bg-[#07815f]"
              : "border-[#cbd7d8] bg-white"
          }`}
        >
          {checked && (
            <Check size={8} strokeWidth={3} className="text-white" />
          )}
        </span>

        <span className="text-[8px] text-[#62767c]">{label}</span>
      </div>

      {count && (
        <span className="text-[7px] text-[#9aa9ac]">{count}</span>
      )}
    </label>
  );
}

/* =========================================================
   JOB CARD
========================================================= */

function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative border-b border-[#edf1f0] bg-white px-4 py-3 transition hover:bg-[#fcfefd]">
      <div className="flex gap-3">
        {/* Company Logo */}
        <div
          className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyShort}
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[10px] font-bold text-[#263D45] transition group-hover:text-[#087B60] sm:text-[11px]">
                {job.title}
              </h2>

              <p className="mt-[2px] text-[7px] text-[#89999d]">
                {job.company}
              </p>
            </div>

            {/* Match */}
            <span className="hidden shrink-0 rounded-full bg-[#e7f8f2] px-2 py-[3px] text-[6px] font-semibold text-[#15916f] sm:block">
              ✦ {job.match}
            </span>
          </div>

          {/* Description */}
          <p className="mt-[5px] max-w-[650px] text-[7px] leading-[1.55] text-[#819296]">
            {job.description}
          </p>

          {/* Metadata */}
          <div className="mt-[6px] flex flex-wrap items-center gap-x-3 gap-y-1 text-[7px] text-[#75888d]">
            <span className="flex items-center gap-1">
              <MapPin size={9} />
              {job.location}
            </span>

            <span className="flex items-center gap-1">
              <BriefcaseBusiness size={9} />
              {job.experience}
            </span>

            <span className="flex items-center gap-1">
              <span className="text-[8px]">₹</span>
              {job.salary}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-[6px] flex flex-wrap gap-1">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-[3px] bg-[#f3f7f7] px-2 py-[3px] text-[6px] font-medium text-[#66797e]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex shrink-0 flex-col items-end justify-between">
          <span className="hidden text-[6px] text-[#a3b0b3] sm:block">
            {job.posted}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              aria-label="Save job"
              className="hidden text-[#9aabad] transition hover:text-[#087B60] sm:block"
            >
              <Bookmark
                size={11}
                fill={saved ? "currentColor" : "none"}
              />
            </button>

            <button className="rounded-[4px] bg-[#087D5F] px-3 py-[5px] text-[6px] font-bold text-white transition hover:bg-[#05674f]">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile match */}
      <div className="mt-2 flex items-center justify-between sm:hidden">
        <span className="rounded-full bg-[#e7f8f2] px-2 py-[3px] text-[6px] font-semibold text-[#15916f]">
          ✦ {job.match}
        </span>

        <span className="text-[6px] text-[#a3b0b3]">
          {job.posted}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function FiltersSidebar() {
  return (
    <aside className="hidden w-[190px] shrink-0 rounded-[5px] border border-[#e4ebea] bg-white lg:block">
      <div className="flex items-center justify-between border-b border-[#edf1f0] px-3 py-3">
        <h2 className="text-[9px] font-bold text-[#30434a]">Filters</h2>

        <button className="text-[7px] font-medium text-[#078364]">
          Clear All
        </button>
      </div>

      <div className="px-3">
        <FilterSection title="Job Type">
          <FilterCheckbox label="Full Time" count="1,248" />
          <FilterCheckbox label="Part Time" count="126" />
          <FilterCheckbox label="Contract" count="187" />
          <FilterCheckbox label="Freelance" count="148" />
          <FilterCheckbox label="Internship" count="98" />
        </FilterSection>

        <FilterSection title="Experience Level">
          <FilterCheckbox label="Entry Level (0-2 years)" count="413" />
          <FilterCheckbox label="Mid Level (2-5 years)" count="756" checked />
          <FilterCheckbox
            label="Senior Level (5+ years)"
            count="432"
          />
        </FilterSection>

        <FilterSection title="Location">
          <div className="mb-2 flex h-[22px] items-center gap-1 rounded-[3px] border border-[#e4ebea] px-2">
            <Search size={9} className="text-[#9aabad]" />
            <input
              placeholder="Search location..."
              className="w-full bg-transparent text-[7px] outline-none placeholder:text-[#a5b1b4]"
            />
          </div>

          <FilterCheckbox label="Remote" count="642" checked />
          <FilterCheckbox label="Bangalore" count="138" />
          <FilterCheckbox label="Mumbai" count="98" />
          <FilterCheckbox label="Delhi" count="84" />
          <FilterCheckbox label="Hyderabad" count="81" />

          <button className="mt-1 text-[7px] font-semibold text-[#078364]">
            + More locations
          </button>
        </FilterSection>

        <FilterSection title="Salary Range">
          <p className="mb-2 text-[7px] text-[#7d8d91]">
            Salary Range (per annum)
          </p>

          <FilterCheckbox label="Up to ₹5 LPA" count="421" />
          <FilterCheckbox label="₹6 - ₹10 LPA" count="618" />
          <FilterCheckbox label="₹11 - ₹15 LPA" count="396" />
          <FilterCheckbox label="₹15+ LPA" count="207" />
        </FilterSection>

        <FilterSection title="Skills">
          <div className="mb-2 flex h-[22px] items-center gap-1 rounded-[3px] border border-[#e4ebea] px-2">
            <Search size={9} className="text-[#9aabad]" />
            <input
              placeholder="Search skills..."
              className="w-full bg-transparent text-[7px] outline-none placeholder:text-[#a5b1b4]"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "TypeScript",
              "JavaScript",
              "Next.js",
            ].map((skill) => (
              <button
                key={skill}
                className="rounded-[3px] bg-[#f1f7f5] px-2 py-[4px] text-[6px] text-[#4f7770]"
              >
                {skill}
              </button>
            ))}
          </div>

          <button className="mt-2 text-[7px] font-semibold text-[#078364]">
            + More skills
          </button>
        </FilterSection>
      </div>
    </aside>
  );
}

/* =========================================================
   MOBILE FILTERS
========================================================= */

function MobileFilters({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-[300px] overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e9eeee] bg-white px-5 py-4">
          <h2 className="text-sm font-bold text-[#263D45]">Filters</h2>

          <button onClick={onClose}>
            <X size={18} className="text-[#60757b]" />
          </button>
        </div>

        <div className="p-5">
          <FilterSection title="Job Type">
            <FilterCheckbox label="Full Time" count="1,248" />
            <FilterCheckbox label="Part Time" count="126" />
            <FilterCheckbox label="Contract" count="187" />
            <FilterCheckbox label="Freelance" count="148" />
          </FilterSection>

          <FilterSection title="Experience Level">
            <FilterCheckbox label="Entry Level" count="413" />
            <FilterCheckbox label="Mid Level" count="756" checked />
            <FilterCheckbox label="Senior Level" count="432" />
          </FilterSection>

          <FilterSection title="Location">
            <FilterCheckbox label="Remote" count="642" checked />
            <FilterCheckbox label="Bangalore" count="138" />
            <FilterCheckbox label="Mumbai" count="98" />
            <FilterCheckbox label="Delhi" count="84" />
            <FilterCheckbox label="Hyderabad" count="81" />
          </FilterSection>

          <FilterSection title="Salary Range">
            <FilterCheckbox label="Up to ₹5 LPA" count="421" />
            <FilterCheckbox label="₹6 - ₹10 LPA" count="618" />
            <FilterCheckbox label="₹11 - ₹15 LPA" count="396" />
            <FilterCheckbox label="₹15+ LPA" count="207" />
          </FilterSection>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function JobsPage() {
  const [mobileFilters, setMobileFilters] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <main className="min-h-screen bg-[#fafcfb]">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="border-b border-[#edf1f0] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex h-[34px] flex-1 items-center gap-2 rounded-[5px] border border-[#dfe8e6] bg-white px-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Search size={13} className="text-[#829498]" />

              <input
                placeholder="Search jobs, skills, or companies..."
                className="w-full bg-transparent text-[9px] text-[#33484e] outline-none placeholder:text-[#9da9ac]"
              />
            </div>

            {/* Location */}
            <div className="hidden h-[34px] w-[180px] items-center gap-2 rounded-[5px] border border-[#dfe8e6] px-3 sm:flex">
              <MapPin size={12} className="text-[#829498]" />

              <input
                placeholder="Location"
                className="w-full bg-transparent text-[9px] outline-none placeholder:text-[#9da9ac]"
              />
            </div>

            <button className="h-[34px] rounded-[5px] bg-[#087D5F] px-5 text-[9px] font-bold text-white transition hover:bg-[#05664e]">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-[1180px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-5">
          {/* Sidebar */}
          <FiltersSidebar />

          {/* Results */}
          <section className="min-w-0 flex-1">
            {/* Result header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-[12px] font-bold text-[#263D45]">
                  1,248 jobs found
                </h1>

                <button
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-1 rounded border border-[#e1e9e7] px-2 py-1 text-[8px] text-[#63777c] lg:hidden"
                >
                  <SlidersHorizontal size={10} />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative hidden sm:block">
                  <select className="h-[27px] appearance-none rounded-[4px] border border-[#e2e9e8] bg-white px-2 pr-6 text-[7px] text-[#66787d] outline-none">
                    <option>Most Relevant</option>
                    <option>Newest</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                  </select>

                  <ChevronDown
                    size={9}
                    className="pointer-events-none absolute right-2 top-[9px] text-[#89999d]"
                  />
                </div>

                {/* Views */}
                <div className="flex h-[27px] overflow-hidden rounded-[4px] border border-[#e2e9e8] bg-white">
                  <button
                    onClick={() => setView("list")}
                    className={`flex w-[28px] items-center justify-center ${
                      view === "list"
                        ? "bg-[#edf8f5] text-[#087D5F]"
                        : "text-[#8a999c]"
                    }`}
                  >
                    <List size={11} />
                  </button>

                  <button
                    onClick={() => setView("grid")}
                    className={`flex w-[28px] items-center justify-center ${
                      view === "grid"
                        ? "bg-[#edf8f5] text-[#087D5F]"
                        : "text-[#8a999c]"
                    }`}
                  >
                    <Grid2X2 size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Job list */}
            <div
              className={`overflow-hidden rounded-[5px] border border-[#e4ebea] bg-white ${
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2"
                  : "block"
              }`}
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 py-4">
              <button className="flex h-[22px] w-[22px] items-center justify-center rounded border border-[#e3eae9] bg-white text-[#a0adaf]">
                <ChevronLeft size={10} />
              </button>

              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded text-[7px] ${
                    page === 1
                      ? "bg-[#087D5F] font-bold text-white"
                      : "border border-[#e3eae9] bg-white text-[#718287]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-1 text-[8px] text-[#a0adaf]">...</span>

              <button className="flex h-[22px] w-[22px] items-center justify-center rounded border border-[#e3eae9] bg-white text-[7px] text-[#718287]">
                50
              </button>

              <button className="flex h-[22px] w-[22px] items-center justify-center rounded border border-[#e3eae9] bg-white text-[#718287]">
                <ChevronRight size={10} />
              </button>
            </div>

            {/* Bottom CTA */}
            <div className="flex flex-col gap-3 rounded-[6px] bg-[#ecf8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-[#d9f2eb]">
                  <Sparkles
                    size={14}
                    className="text-[#078364]"
                  />
                </div>

                <div>
                  <h3 className="text-[8px] font-bold text-[#31504e]">
                    Create a profile and let us find the best jobs for you!
                  </h3>

                  <p className="mt-[2px] text-[6px] text-[#77908d]">
                    Get personalized recommendations based on your skills and
                    experience.
                  </p>
                </div>
              </div>

              <button className="flex shrink-0 items-center justify-center gap-1 rounded-[4px] bg-[#087D5F] px-4 py-[6px] text-[7px] font-bold text-white hover:bg-[#05664e]">
                Build Your Profile
                <ChevronRight size={9} />
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilters
        open={mobileFilters}
        onClose={() => setMobileFilters(false)}
      />
    </main>
  );
}