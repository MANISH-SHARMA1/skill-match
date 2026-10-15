"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  BriefcaseBusiness,
  Bookmark,
  Grid2X2,
  List,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import {
  getPublicJobs,
  type JobRecord,
  type PublicJobParams,
} from "@/app/libs/api/jobsApi";
import Link from "next/link";

/* =========================================================
   TYPES & CONSTANTS
========================================================= */

type JobFilters = {
  search: string;
  city: string;
  employmentType: string;
  experience: string;
  workplace: string;
  skill: string;
  salaryMin?: number;
  salaryMax?: number;
};

type SortOption = "relevant" | "newest" | "salary-desc" | "salary-asc";

const EMPTY_FILTERS: JobFilters = {
  search: "",
  city: "",
  employmentType: "",
  experience: "",
  workplace: "",
  skill: "",
};

const JOB_TYPES = [
  { label: "Full Time", value: "Full-time" },
  { label: "Part Time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Freelance", value: "Freelance" },
  { label: "Internship", value: "Internship" },
  { label: "Temporary", value: "Temporary" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Fresher", value: "Fresher" },
  { label: "0–1 years", value: "0–1 years" },
  { label: "1–3 years", value: "1–3 years" },
  { label: "3–5 years", value: "3–5 years" },
  { label: "5–8 years", value: "5–8 years" },
  { label: "8+ years", value: "8+ years" },
];

type LocationOption = { label: string; city?: string; workplace?: string };

const LOCATION_OPTIONS: LocationOption[] = [
  { label: "Remote", workplace: "Remote" },
  { label: "Bangalore", city: "Bangalore" },
  { label: "Mumbai", city: "Mumbai" },
  { label: "Delhi", city: "Delhi" },
  { label: "Hyderabad", city: "Hyderabad" },
];

const MORE_LOCATION_OPTIONS: LocationOption[] = [
  { label: "Pune", city: "Pune" },
  { label: "Chennai", city: "Chennai" },
  { label: "Kolkata", city: "Kolkata" },
  { label: "Gurgaon", city: "Gurgaon" },
  { label: "Noida", city: "Noida" },
  { label: "Ahmedabad", city: "Ahmedabad" },
];

const SALARY_OPTIONS: {
  label: string;
  min: number | undefined;
  max: number | undefined;
}[] = [
  { label: "Up to ₹5 LPA", min: undefined, max: 500000 },
  { label: "₹6 - ₹10 LPA", min: 500000, max: 1000000 },
  { label: "₹11 - ₹15 LPA", min: 1000000, max: 1500000 },
  { label: "₹15+ LPA", min: 1500000, max: undefined },
];

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "JavaScript",
  "Next.js",
];

const MORE_SKILL_OPTIONS = [
  "Python",
  "Java",
  "Express",
  "Tailwind CSS",
  "PostgreSQL",
  "AWS",
  "Docker",
  "GraphQL",
];

/* =========================================================
   HELPERS
========================================================= */

function getCompanyName(job: JobRecord) {
  return typeof job.company === "string"
    ? "Company"
    : job.company?.name || "Company";
}

function getCompanyLogo(job: JobRecord) {
  return typeof job.company === "string" ? undefined : job.company?.logo;
}

function getLocation(job: JobRecord) {
  if (job.workplace === "Remote") {
    return [job.location?.city, job.location?.state, "Remote"]
      .filter(Boolean)
      .join(", ");
  }

  return [job.location?.city, job.location?.state, job.location?.country]
    .filter(Boolean)
    .join(", ");
}

function getSalary(job: JobRecord) {
  if (!job.salary?.isDisclosed) return "Not disclosed";

  const format = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: job.salary.currency || "INR",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);

  return `${format(job.salary.min)} - ${format(job.salary.max)} / ${
    job.salary.period === "Monthly" ? "month" : "year"
  }`;
}

function getPostedDate(date?: string | null) {
  if (!date) return "Recently posted";

  const timestamp = new Date(date).getTime();

  if (!Number.isFinite(timestamp)) return "Recently posted";

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));

  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 30) return `Posted ${days} days ago`;

  return `Posted ${Math.floor(days / 30)} months ago`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) result.push("...");
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total - 1) result.push("...");

  result.push(total);
  return result;
}

/* =========================================================
   SMALL COMPONENTS
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
    <div className="border-b border-[#edf1f0] py-5 first:pt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[15px] font-semibold text-[#263B42]">
          {title}
        </span>

        <ChevronDown
          size={12}
          className={`text-[#8ca0a4] transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  count,
  checked = false,
  onChange,
}: {
  label: string;
  count?: string;
  checked?: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-[3px]">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />

        <span
          className={`flex h-2.75 w-2.75 items-center justify-center rounded-[2px] border ${
            checked
              ? "border-[#07815f] bg-[#07815f]"
              : "border-[#cbd7d8] bg-white"
          }`}
        >
          {checked && <Check size={8} strokeWidth={3} className="text-white" />}
        </span>

        <span className="text-[13px] text-[#62767c]">{label}</span>
      </div>

      {count && <span className="text-[13px] text-[#9aa9ac]">{count}</span>}
    </label>
  );
}

function JobCard({ job }: { job: JobRecord }) {
  const [saved, setSaved] = useState(false);

  const companyName = getCompanyName(job);
  const companyLogo = getCompanyLogo(job);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("savedJobIds");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setSaved(ids.includes(job._id));
    } catch {
      setSaved(false);
    }
  }, [job._id]);

  function toggleSaved() {
    try {
      const stored = localStorage.getItem("savedJobIds");
      const ids: string[] = stored ? JSON.parse(stored) : [];

      const next = saved
        ? ids.filter((id) => id !== job._id)
        : [...new Set([...ids, job._id])];

      localStorage.setItem("savedJobIds", JSON.stringify(next));
      setSaved(!saved);
    } catch {
      setSaved(!saved);
    }
  }

  return (
    <article className="group relative border-b border-[#edf1f0] bg-white px-6 py-5 transition hover:bg-[#fcfefd]">
      <div className="flex gap-4">
        <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e7f8f2] text-[16px] font-bold text-[#087D5F]">
          {companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            companyName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/jobs/${job._id}`}
                className="text-[15px] font-bold text-[#263D45] transition group-hover:text-[#087B60] sm:text-[16px]"
              >
                {job.title}
              </Link>

              <p className="mt-1 text-[14px] text-[#89999d]">{companyName}</p>
            </div>
          </div>

          <p className="mt-3 max-w-[650px] text-[14px] leading-6 text-[#819296]">
            {job.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#75888d]">
            <span className="flex items-center gap-1">
              <MapPin size={9} />
              {getLocation(job)}
            </span>

            <span className="flex items-center gap-1">
              <BriefcaseBusiness size={9} />
              {job.experience}
            </span>

            <span className="flex items-center gap-1">
              <span className="text-[13px]">₹</span>
              {getSalary(job)}
            </span>

            <span>{job.employmentType}</span>
          </div>

          <div className="mt-[6px] flex flex-wrap gap-1">
            {job.skills?.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-[#f3f7f7] px-3 py-1.5 text-[12px] font-medium text-[#66797e]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between">
          <span className="hidden text-[12px] text-[#a3b0b3] sm:block">
            {getPostedDate(job.publishedAt || job.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSaved}
              aria-label={saved ? "Unsave job" : "Save job"}
              aria-pressed={saved}
              className="hidden text-[#9aabad] transition hover:text-[#087B60] sm:block"
            >
              <Bookmark size={11} fill={saved ? "currentColor" : "none"} />
            </button>

            <Link
              href={`/jobs/${job._id}`}
              className="rounded-md bg-[#087D5F] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#05674f]"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between sm:hidden">
        <span className="text-[12px] text-[#a3b0b3]">
          {getPostedDate(job.publishedAt || job.createdAt)}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   FILTERS (shared by sidebar + mobile drawer)
========================================================= */

type FilterPanelProps = {
  filters: JobFilters;
  onToggle: (key: "employmentType" | "experience", value: string) => void;
  onSalary: (min: number | undefined, max: number | undefined) => void;
  onLocation: (option: LocationOption) => void;
  onCustomCity: (city: string) => void;
  onSkill: (skill: string) => void;
};

function FilterPanel({
  filters,
  onToggle,
  onSalary,
  onLocation,
  onCustomCity,
  onSkill,
}: FilterPanelProps) {
  const [locationQuery, setLocationQuery] = useState("");
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [showMoreSkills, setShowMoreSkills] = useState(false);

  const allLocations = [...LOCATION_OPTIONS, ...MORE_LOCATION_OPTIONS];
  const locationQ = locationQuery.trim().toLowerCase();
  const visibleLocations = locationQ
    ? allLocations.filter((o) => o.label.toLowerCase().includes(locationQ))
    : showMoreLocations
      ? allLocations
      : LOCATION_OPTIONS;

  const allSkills = [...SKILL_OPTIONS, ...MORE_SKILL_OPTIONS];
  const skillQ = skillQuery.trim().toLowerCase();
  const baseSkills = skillQ
    ? allSkills.filter((s) => s.toLowerCase().includes(skillQ))
    : showMoreSkills
      ? allSkills
      : SKILL_OPTIONS;
  // keep a custom (typed) skill visible while it is selected
  const visibleSkills =
    filters.skill && !baseSkills.includes(filters.skill)
      ? [filters.skill, ...baseSkills]
      : baseSkills;

  function isLocationChecked(option: LocationOption) {
    if (option.workplace) return filters.workplace === option.workplace;
    return (
      !!option.city &&
      filters.city.trim().toLowerCase() === option.city.toLowerCase()
    );
  }

  return (
    <div className="px-3">
      <FilterSection title="Job Type">
        {JOB_TYPES.slice(0, 5).map((type) => (
          <FilterCheckbox
            key={type.value}
            label={type.label}
            checked={filters.employmentType === type.value}
            onChange={() => onToggle("employmentType", type.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Experience Level">
        {EXPERIENCE_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            label={option.label}
            checked={filters.experience === option.value}
            onChange={() => onToggle("experience", option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        <div className="mb-2 flex h-[22px] items-center gap-1 rounded-[3px] border border-[#e4ebea] px-2">
          <Search size={9} className="text-[#9aabad]" />
          <input
            placeholder="Search location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && locationQuery.trim()) {
                e.preventDefault();
                onCustomCity(locationQuery.trim());
                setLocationQuery("");
              }
            }}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#a5b1b4]"
          />
        </div>

        {visibleLocations.map((option) => (
          <FilterCheckbox
            key={option.label}
            label={option.label}
            checked={isLocationChecked(option)}
            onChange={() => onLocation(option)}
          />
        ))}

        {!locationQ && (
          <button
            type="button"
            onClick={() => setShowMoreLocations((v) => !v)}
            className="mt-1 text-[13px] font-semibold text-[#078364]"
          >
            {showMoreLocations ? "- Fewer locations" : "+ More locations"}
          </button>
        )}
      </FilterSection>

      <FilterSection title="Salary Range">
        <p className="mb-2 text-[13px] text-[#7d8d91]">
          Salary Range (per annum)
        </p>

        {SALARY_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.label}
            label={option.label}
            checked={
              filters.salaryMin === option.min &&
              filters.salaryMax === option.max
            }
            onChange={() => onSalary(option.min, option.max)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Skills">
        <div className="mb-2 flex h-[22px] items-center gap-1 rounded-[3px] border border-[#e4ebea] px-2">
          <Search size={9} className="text-[#9aabad]" />
          <input
            placeholder="Search skills..."
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && skillQuery.trim()) {
                e.preventDefault();
                onSkill(skillQuery.trim());
                setSkillQuery("");
              }
            }}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#a5b1b4]"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {visibleSkills.map((skill) => {
            const active = filters.skill === skill;

            return (
              <button
                type="button"
                key={skill}
                onClick={() => onSkill(skill)}
                aria-pressed={active}
                className={`rounded-[3px] px-2 py-1 text-[12px] transition ${
                  active
                    ? "bg-[#087D5F] text-white"
                    : "bg-[#f1f7f5] text-[#4f7770] hover:bg-[#e3f1ed]"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        {!skillQ && (
          <button
            type="button"
            onClick={() => setShowMoreSkills((v) => !v)}
            className="mt-2 text-[13px] font-semibold text-[#078364]"
          >
            {showMoreSkills ? "- Fewer skills" : "+ More skills"}
          </button>
        )}
      </FilterSection>
    </div>
  );
}

function FiltersSidebar({
  onClear,
  ...panelProps
}: FilterPanelProps & { onClear: () => void }) {
  return (
    <aside className="hidden w-65 shrink-0 rounded-[5px] border border-[#e4ebea] bg-white lg:block">
      <div className="flex items-center justify-between border-b border-[#edf1f0] px-4 py-4">
        <h2 className="text-[14px] font-bold text-[#30434a]">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[13px] font-medium text-[#078364]"
        >
          Clear All
        </button>
      </div>

      <FilterPanel {...panelProps} />
    </aside>
  );
}

function MobileFilters({
  open,
  onClose,
  onClear,
  ...panelProps
}: FilterPanelProps & {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-[300px] overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e9eeee] bg-white px-5 py-4">
          <h2 className="text-sm font-bold text-[#263D45]">Filters</h2>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClear}
              className="text-[13px] font-medium text-[#078364]"
            >
              Clear All
            </button>

            <button type="button" onClick={onClose} aria-label="Close filters">
              <X size={18} className="text-[#60757b]" />
            </button>
          </div>
        </div>

        <div className="p-2">
          <FilterPanel {...panelProps} />
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

  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("relevant");

  const requestId = useRef(0);

  /* ---------- data fetching ---------- */

  const fetchJobs = useCallback(async () => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setErrorMessage("");

    const params: PublicJobParams = {
      page,
      limit,
      sort: sortOption === "relevant" ? "newest" : sortOption,
    };

    if (filters.search) params.search = filters.search;
    if (filters.city) params.city = filters.city;
    if (filters.employmentType) params.employmentType = filters.employmentType;
    if (filters.experience) params.experience = filters.experience;
    if (filters.workplace) params.workplace = filters.workplace;
    if (filters.skill) params.skill = filters.skill;
    if (filters.salaryMin !== undefined) params.salaryMin = filters.salaryMin;
    if (filters.salaryMax !== undefined) params.salaryMax = filters.salaryMax;

    try {
      const result = await getPublicJobs(params);

      // ignore stale responses
      if (currentRequest !== requestId.current) return;

      setJobs(result.data ?? []);
      setTotal(result.pagination?.total ?? 0);
      setPages(result.pagination?.pages ?? 0);
    } catch (error) {
      if (currentRequest !== requestId.current) return;

      setJobs([]);
      setTotal(0);
      setPages(0);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load jobs.",
      );
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [page, limit, filters, sortOption]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  /* ---------- filter handlers ---------- */

  function handleSearch() {
    setPage(1);
    setFilters((previous) => ({
      ...previous,
      search: searchInput.trim(),
      city: cityInput.trim(),
      // typing a city in the header replaces a "Remote" sidebar pick
      workplace: cityInput.trim() ? "" : previous.workplace,
    }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setCityInput("");
    setSortOption("relevant");
    setPage(1);
  }

  function toggleSingleFilter(
    key: "employmentType" | "experience",
    value: string,
  ) {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key] === value ? "" : value,
    }));
    setPage(1);
  }

  function toggleSalaryRange(
    min: number | undefined,
    max: number | undefined,
  ) {
    setFilters((previous) => {
      const alreadySelected =
        previous.salaryMin === min && previous.salaryMax === max;

      return {
        ...previous,
        salaryMin: alreadySelected ? undefined : min,
        salaryMax: alreadySelected ? undefined : max,
      };
    });
    setPage(1);
  }

  function toggleLocation(option: LocationOption) {
    setFilters((previous) => {
      if (option.workplace) {
        const active = previous.workplace === option.workplace;
        return { ...previous, workplace: active ? "" : option.workplace };
      }

      const active =
        previous.city.trim().toLowerCase() === option.city?.toLowerCase();
      return { ...previous, city: active ? "" : (option.city ?? "") };
    });

    // keep the header location input in sync
    if (!option.workplace) {
      setCityInput((current) =>
        current.trim().toLowerCase() === option.city?.toLowerCase()
          ? ""
          : (option.city ?? ""),
      );
    }

    setPage(1);
  }

  function applyCustomCity(city: string) {
    setFilters((previous) => ({ ...previous, city, workplace: "" }));
    setCityInput(city);
    setPage(1);
  }

  function toggleSkill(skill: string) {
    setFilters((previous) => ({
      ...previous,
      skill: previous.skill === skill ? "" : skill,
    }));
    setPage(1);
  }

  function goToPage(next: number) {
    if (next < 1 || next > pages || next === page) return;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const panelProps: FilterPanelProps = {
    filters,
    onToggle: toggleSingleFilter,
    onSalary: toggleSalaryRange,
    onLocation: toggleLocation,
    onCustomCity: applyCustomCity,
    onSkill: toggleSkill,
  };

  return (
    <main className="min-h-screen bg-[#fafcfb]">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="border-b border-[#edf1f0] bg-white">
        <div className="mx-auto max-w-350 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex h-11.5 flex-1 items-center gap-2 rounded-[5px] border border-[#dfe8e6] bg-white px-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Search size={13} className="text-[#829498]" />
              <input
                placeholder="Search jobs, skills, or companies..."
                className="w-full bg-transparent text-[14px] text-[#33484e] outline-none placeholder:text-[#9da9ac]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Location */}
            <div className="hidden h-11.5 w-45 items-center gap-2 rounded-[5px] border border-[#dfe8e6] px-3 sm:flex">
              <MapPin size={12} className="text-[#829498]" />
              <input
                placeholder="Location"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9da9ac]"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="h-11.5 rounded-[5px] bg-[#087D5F] px-5 text-[14px] font-bold text-white transition hover:bg-[#05664e]"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start gap-5">
          {/* Sidebar */}
          <FiltersSidebar {...panelProps} onClear={clearFilters} />

          {/* Results */}
          <section className="min-w-0 flex-1">
            {/* Result header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-[24px] font-bold text-[#263D45]">
                  {total} jobs found
                </h1>

                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-1 rounded border border-[#e1e9e7] px-2 py-1 text-[13px] text-[#63777c] lg:hidden"
                >
                  <SlidersHorizontal size={10} />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative hidden sm:block">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      setPage(1);
                    }}
                    className="h-9.5 appearance-none rounded-sm border border-[#e2e9e8] bg-white px-2 pr-6 text-[13px] text-[#66787d] outline-none"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="salary-desc">Salary: High to Low</option>
                    <option value="salary-asc">Salary: Low to High</option>
                  </select>

                  <ChevronDown
                    size={9}
                    className="pointer-events-none absolute right-2 top-2.25 text-[#89999d]"
                  />
                </div>

                {/* Views */}
                <div className="flex h-9.5 overflow-hidden rounded-sm border border-[#e2e9e8] bg-white">
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`flex w-9.5 items-center justify-center ${
                      view === "list"
                        ? "bg-[#edf8f5] text-[#087D5F]"
                        : "text-[#8a999c]"
                    }`}
                  >
                    <List size={11} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`flex w-9.5 items-center justify-center ${
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
                view === "grid" && jobs.length > 0 && !loading
                  ? "grid grid-cols-1 md:grid-cols-2"
                  : "block"
              }`}
            >
              {loading && (
                <p className="px-6 py-12 text-center text-[14px] text-[#89999d]">
                  Loading jobs...
                </p>
              )}

              {!loading && errorMessage && (
                <div className="px-6 py-12 text-center">
                  <p className="text-[14px] text-[#b42318]">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => void fetchJobs()}
                    className="mt-3 rounded-md bg-[#087D5F] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#05674f]"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !errorMessage && jobs.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-[14px] text-[#89999d]">
                    No jobs match your filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 text-[13px] font-semibold text-[#078364]"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {!loading &&
                !errorMessage &&
                jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-1 py-4">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="flex h-8.5 w-8.5 items-center justify-center rounded border border-[#e3eae9] bg-white text-[#a0adaf] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={10} />
                </button>

                {getPageNumbers(page, pages).map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 text-[13px] text-[#a0adaf]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      onClick={() => goToPage(item)}
                      aria-current={item === page ? "page" : undefined}
                      className={`flex h-8.5 w-8.5 items-center justify-center rounded text-[13px] ${
                        item === page
                          ? "bg-[#087D5F] font-bold text-white"
                          : "border border-[#e3eae9] bg-white text-[#718287]"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === pages}
                  aria-label="Next page"
                  className="flex h-8.5 w-8.5 items-center justify-center rounded border border-[#e3eae9] bg-white text-[#718287] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight size={10} />
                </button>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-4 flex flex-col gap-3 rounded-[6px] bg-[#ecf8f4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-[#d9f2eb]">
                  <Sparkles size={14} className="text-[#078364]" />
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-[#31504e]">
                    Create a profile and let us find the best jobs for you!
                  </h3>

                  <p className="mt-[2px] text-[12px] text-[#77908d]">
                    Get personalized recommendations based on your skills and
                    experience.
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                className="flex shrink-0 items-center justify-center gap-1 rounded-sm bg-[#087D5F] px-4 py-[6px] text-[13px] font-bold text-white hover:bg-[#05664e]"
              >
                Build Your Profile
                <ChevronRight size={9} />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilters
        {...panelProps}
        open={mobileFilters}
        onClose={() => setMobileFilters(false)}
        onClear={clearFilters}
      />
    </main>
  );
}