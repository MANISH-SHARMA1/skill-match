
import {
  ArrowRight,
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  MessageSquare,
  Settings,
  Zap,
  ChevronRight,
  TrendingUp,
  Sprout,
  Leaf,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    title: "Post Your Job",
    description:
      "Add job details, skills, location and requirements.",
  },
  {
    title: "Get Matched Candidates",
    description:
      "Our AI matches you with the best-fit candidates based on skills and goals.",
  },
  {
    title: "Review & Shortlist",
    description:
      "Explore profiles, check skills, and shortlist your favorites.",
  },
  {
    title: "Hire & Grow",
    description:
      "Connect with your chosen candidate and build your dream team.",
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Jobs", icon: BriefcaseBusiness },
  { label: "Candidates", icon: Users },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

const applications = [
  {
    name: "Aarav Sharma",
    role: "Full Stack Developer",
    initials: "AS",
    match: "96%",
    time: "Applied 2h ago",
    color: "bg-amber-100 text-amber-800",
  },
  {
    name: "Priya Mehta",
    role: "Frontend Developer",
    initials: "PM",
    match: "93%",
    time: "Applied 4h ago",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Rohit Verma",
    role: "Backend Developer",
    initials: "RV",
    match: "91%",
    time: "Applied 6h ago",
    color: "bg-sky-100 text-sky-800",
  },
];

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
      <p className="truncate text-[10px] text-slate-500 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-800 sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 sm:text-xs">
        <TrendingUp size={12} />
        {change}
      </p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[650px]">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-emerald-900/10">
        {/* Browser toolbar */}
        <div className="flex h-9 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <div className="ml-4 h-4 flex-1 rounded-md bg-white/80" />
        </div>

        <div className="grid min-h-[310px] grid-cols-[100px_minmax(0,1fr)] sm:grid-cols-[125px_minmax(0,1fr)] md:grid-cols-[145px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="bg-gradient-to-b from-[#075b46] to-[#073a32] p-2 text-white sm:p-3">
            <div className="mb-5 flex items-center gap-1.5 px-1 text-[10px] font-bold sm:text-xs">
              <Zap size={15} className="shrink-0 text-emerald-300" />
              <span>SkillMatch</span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 text-[9px] sm:text-[10px] ${
                      item.active
                        ? "bg-emerald-500/40 font-semibold text-white"
                        : "text-emerald-100/80"
                    }`}
                  >
                    <Icon size={12} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Dashboard content */}
          <div className="min-w-0 bg-[#f8fbfa] p-3 sm:p-4 md:p-5">
            <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
              Job Dashboard
            </h3>

            {/* Metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <MetricCard
                label="Total Jobs"
                value="12"
                change="2 this week"
              />
              <MetricCard
                label="Total Applications"
                value="248"
                change="42%"
              />
              <MetricCard
                label="Hired"
                value="5"
                change="67%"
              />
            </div>

            {/* Applications */}
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-100 bg-white p-3">
              <h4 className="mb-2 text-[10px] font-bold text-slate-700 sm:text-xs">
                Recent Applications
              </h4>

              <div className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <div
                    key={application.name}
                    className="flex items-center gap-2 py-2"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold sm:h-8 sm:w-8 ${application.color}`}
                    >
                      {application.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[9px] font-bold text-slate-800 sm:text-[10px]">
                        {application.name}
                      </p>
                      <p className="truncate text-[8px] text-slate-500 sm:text-[9px]">
                        {application.role}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-1 text-[8px] font-bold text-emerald-700 sm:text-[9px]">
                      {application.match} match
                    </span>

                    <span className="hidden whitespace-nowrap text-[8px] text-slate-400 lg:block">
                      {application.time}
                    </span>

                    <ChevronRight
                      size={12}
                      className="shrink-0 text-slate-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="overflow-hidden bg-gradient-to-br from-white via-[#fbfefd] to-[#f2faf6] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.65fr] lg:gap-12">
        {/* Left: steps */}
        <div className="w-full">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Simple & Effective
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#173047] sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Get started in just a few easy steps and find the right talent,
            faster.
          </p>

          <div className="relative mt-6 space-y-5">
            {/* Connecting line */}
            <div className="absolute bottom-7 left-[14px] top-4 w-px bg-emerald-100" />

            {steps.map((step, index) => (
              <div key={step.title} className="relative flex gap-4">
                <div className="relative z-10 flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-900/20">
                  {index + 1}
                </div>

                <div className="pt-0.5">
                  <h3 className="text-sm font-bold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs leading-[1.7] text-slate-500 sm:text-[13px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/employer/post-jobs"
            className="mt-7 inline-flex items-center justify-center gap-3 rounded-lg bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Post a Job Now
            <ArrowRight size={15} />
          </a>
        </div>

        {/* Right: dashboard and promotional card */}
        <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1fr)_170px]">
          <div className="flex min-w-0 items-center">
            <DashboardPreview />
          </div>

          {/* Promotional card */}
          <aside className="relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-emerald-50 bg-gradient-to-b from-[#f0faf6] to-[#eaf7f1] p-5 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck size={25} strokeWidth={2} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold leading-tight tracking-tight text-[#173047]">
              Smarter Hiring.
              <br />
              Greater Impact.
            </h3>

            <p className="mt-4 text-xs leading-[1.8] text-slate-500">
              Build high-performing teams with candidates who are not just
              qualified, but truly the right fit.
            </p>

            <div className="mt-3 h-0.5 w-12 -rotate-3 rounded-full bg-emerald-700" />

            {/* Decorative botanical illustration */}
            <div className="relative mt-auto flex h-24 items-end justify-center overflow-hidden">
              <div className="absolute -bottom-7.5 h-20 w-32 rounded-t-full bg-emerald-100/70" />
              <Sprout
                size={80}
                strokeWidth={1.3}
                className="relative z-10 text-emerald-700"
              />
              <Leaf
                size={24}
                className="absolute bottom-8 right-6 rotate-[-25deg] text-emerald-600"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}