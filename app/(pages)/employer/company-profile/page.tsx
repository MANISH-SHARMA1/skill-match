
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, Users, UserRound,
  ShieldCheck, Building2, Settings, MapPin,
  Globe, Mail, Phone, CalendarDays, Pencil, Check, X,
  ExternalLink, Plus, ChevronRight, Menu, Lightbulb,
  Network, HeartHandshake, Rocket, Sparkles,
  GraduationCap, Wallet, Leaf, Save, ArrowUpRight,
  BadgeCheck, Building,
} from "lucide-react";
import { CompanyRecord } from "@/app/libs/api/companyProfileApi";
import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  getCompanyTeam,
  addCompanyTeamMember,
  deleteCompanyTeamMember,
} from "@/app/libs/api/companyProfileApi";

type Tab = "Overview" | "About" | "Team" | "Benefits" | "Social Links";

type Company = {
  name: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  founded: string;
  size: string;
  industry: string;
  description: string;
  about: string;
  mission: string;
  linkedin: string;
  twitter: string;
  instagram: string;
};


const initialCompany: Company = {
  name: "TechNova Solutions",
  website: "https://www.technova.com",
  email: "hr@technova.com",
  phone: "+91 98765 43210",
  location: "Bangalore, Karnataka, India",
  founded: "2018",
  size: "11–50 employees",
  industry: "IT Services & Consulting",
  description:
    "TechNova Solutions is a fast-growing technology company focused on building scalable web and mobile applications for businesses across different industries. We believe in innovation, collaboration and creating meaningful impact through technology.",
  about:
    "We help businesses transform their ideas into digital products through modern engineering, thoughtful design and reliable technology solutions.",
  mission:
    "To empower businesses through accessible, innovative and dependable digital solutions.",
  linkedin: "https://linkedin.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/employer/dashboard" },
  { label: "Post a Job", icon: BriefcaseBusiness, href: "/employer/post-jobs" },
  { label: "My Jobs", icon: Building, href: "/employer/my-jobs" },
  { label: "Candidates", icon: Users, href: "/employer/candidates" },
  { label: "Shortlisted", icon: ShieldCheck, href: "/employer/shortlisted" },
  { label: "Company Profile", icon: Building2, href: "/employer/company-profile" },
  { label: "Settings", icon: Settings, href: "/employer/settings" },
];

const tabs: Tab[] = [
  "Overview",
  "About",
  "Team",
  "Benefits",
  "Social Links",
];

const initialValues = [
  {
    title: "Innovation",
    text: "We turn ideas into real solutions.",
    icon: Lightbulb,
  },
  {
    title: "Collaboration",
    text: "We grow together as a team.",
    icon: Network,
  },
  {
    title: "Customer Focus",
    text: "We build for our users.",
    icon: HeartHandshake,
  },
  {
    title: "Integrity",
    text: "We do what's right, always.",
    icon: ShieldCheck,
  },
];

const initialBenefits = [
  {
    title: "Flexible Work Culture",
    description: "Hybrid work options and remote opportunities.",
    icon: HeartHandshake,
  },
  {
    title: "Learning & Growth",
    description: "Upskilling programs and career development.",
    icon: GraduationCap,
  },
  {
    title: "Supportive Team",
    description: "A collaborative and friendly environment.",
    icon: Users,
  },
  {
    title: "Competitive Pay",
    description: "We value your skills and contributions.",
    icon: Wallet,
  },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function SectionHeading({
  title,
  onEdit,
}: {
  title: string;
  onEdit?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          <Pencil size={12} /> Edit
        </button>
      )}
    </div>
  );
}

function mapCompanyToUI(record: CompanyRecord): Company {
  return {
    ...initialCompany,
    name: record.name,
    location: record.location,
    website: record.website,
    founded: record.foundedYear?.toString() ?? "",
    email: record.email,
    size: record.companySize,
    phone: record.phone,
    industry: record.industry,
    about: record.about,
  };
}

const iconMap = {
  Sparkles,
  Leaf,
  Building2,
  Users,
} as const;

type CompanyIconName = keyof typeof iconMap;

function mapBenefitsToUI(benefits: string[]) {
  return benefits.map((title) => ({
    title,
    description: "",
    icon: Sparkles,
  }));
}

function mapValuesToUI(
  values: CompanyRecord["values"]
) {
  return values.map((item) => ({
    title: item.title,
    text: item.description,
    icon:
      item.icon in iconMap
        ? iconMap[item.icon as CompanyIconName]
        : Leaf,
  }));
}

function mapBenefitsToAPI(
  benefits: typeof initialBenefits
): string[] {
  return benefits.map((item) => item.title.trim()).filter(Boolean);
}

function mapValuesToAPI(
  values: typeof initialValues
) {
  return values.map((item) => ({
    title: item.title.trim(),
    description: item.text.trim(),
    icon: "Leaf",
  }));
}

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company>(initialCompany);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<Company>(initialCompany);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [team, setTeam] = useState([
    { id: "1", name: "Rahul Sharma", role: "Founder & CEO", email: "rahul@technova.com" },
    { id: "2", name: "Priya Mehta", role: "HR Manager", email: "priya@technova.com" },
    { id: "3", name: "Aarav Verma", role: "Engineering Lead", email: "aarav@technova.com" },
  ]);

  const [benefits, setBenefits] = useState(initialBenefits);
  const [values, setValues] = useState(initialValues);
  const [newItem, setNewItem] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamDraft, setTeamDraft] = useState({
    name: "",
    role: "",
    email: "",
  });


  useEffect(() => {
    let cancelled = false;

    async function loadCompany() {
      try {
        const record = await getCompanyProfile();

        if (cancelled) return;

        setCompany(mapCompanyToUI(record));
        setEditDraft(mapCompanyToUI(record));
        setBenefits(mapBenefitsToUI(record.benefits));
        setValues(mapValuesToUI(record.values));

        setTeam(
          record.team.map((member) => ({
            id: member._id,
            name: member.name,
            role: member.designation,
            email: member.email ?? "",
          }))
        );
      } catch (err) {
        if (cancelled) return;

        const status = (
          err as { response?: { status?: number } }
        )?.response?.status;

        if (status === 404) {
          setNotice("Create your company profile to get started.");
        } else {
          setNotice("Unable to load company profile.");
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    void loadCompany();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "skillmatch-company-profile",
        JSON.stringify({ company, team, benefits, values })
      );
    } catch {
      // A storage failure does not prevent editing the current page.
    }
  }, [company, team, benefits, values, hydrated]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function startEditing() {
    setEditDraft({ ...company });
    setEditing(true);
  }


  async function saveCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editDraft.name.trim() || !editDraft.industry.trim()) {
      notify("Company name and industry are required.");
      return;
    }

    try {
      const record = await updateCompanyProfile({
        name: editDraft.name.trim(),
        location: editDraft.location.trim(),
        website: editDraft.website.trim(),
        email: editDraft.email.trim(),
        phone: editDraft.phone.trim(),
        industry: editDraft.industry.trim(),
        companySize: editDraft.size,
        foundedYear: editDraft.founded
          ? Number(editDraft.founded)
          : null,
        about: editDraft.about,
      });

      const mapped = mapCompanyToUI(record);

      setCompany(mapped);
      setEditDraft(mapped);
      setEditing(false);

      notify("Company profile updated successfully.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to update company."
      );
    }
  }

  async function createInitialCompany() {
    try {
      const record = await createCompanyProfile({
        name: editDraft.name.trim(),
        industry: editDraft.industry.trim(),
        location: editDraft.location.trim(),
        website: editDraft.website.trim(),
        email: editDraft.email.trim(),
        phone: editDraft.phone.trim(),
        companySize: editDraft.size || "1-10 employees",
        foundedYear: editDraft.founded
          ? Number(editDraft.founded)
          : undefined,
        about: editDraft.about,
      });

      const mapped = mapCompanyToUI(record);

      setCompany(mapped);
      setEditDraft(mapped);
      setEditing(false);

      notify("Company profile created successfully.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to create company."
      );
    }
  }

  async function removeTeamMember(id: string) {
    try {
      await deleteCompanyTeamMember(id);

      setTeam((previous) => previous.filter((member) => member.id !== id));

      notify("Team member removed.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to remove team member."
      );
    }
  }

  function cancelEditing() {
    setEditDraft({ ...company });
    setEditing(false);
  }

  async function addTeamMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!teamDraft.name.trim() || !teamDraft.role.trim()) {
      notify("Enter the team member's name and role.");
      return;
    }

    try {
      const member = await addCompanyTeamMember({
        name: teamDraft.name.trim(),
        role: teamDraft.role.trim(),
        email: teamDraft.email.trim(),
      });

      setTeam((previous) => [
        ...previous,
        {
          id: member._id,
          name: member.name,
          role: member.designation,
          email: member.email ?? "",
        },
      ]);

      setTeamDraft({ name: "", role: "", email: "" });
      setShowAddTeam(false);

      notify("Team member added.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to add team member."
      );
    }
  }

  async function addBenefit() {
    const title = newBenefit.trim();

    if (!title) return;

    const updated = [...benefits, {
      title,
      description: "Add a description for this benefit.",
      icon: Sparkles,
    }];

    try {
      const record = await updateCompanyProfile({
        benefits: mapBenefitsToAPI(updated),
      });

      setBenefits(mapBenefitsToUI(record.benefits));
      setNewBenefit("");

      notify("Benefit added.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to add benefit."
      );
    }
  }

  async function addValue() {
    const title = newItem.trim();

    if (!title) return;

    const updated = [
      ...values,
      {
        title,
        text: "Add your company value description.",
        icon: Leaf,
      },
    ];

    try {
      const record = await updateCompanyProfile({
        values: mapValuesToAPI(updated),
      });

      setValues(mapValuesToUI(record.values));
      setNewItem("");

      notify("Company value added.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to add company value."
      );
    }
  }

  async function saveBenefitsAndValues() {
    try {
      const record = await updateCompanyProfile({
        benefits: mapBenefitsToAPI(benefits),
        values: mapValuesToAPI(values),
      });

      setBenefits(mapBenefitsToUI(record.benefits));
      setValues(mapValuesToUI(record.values));

      notify("Benefits and company values saved.");
    } catch (err) {
      notify(
        err instanceof Error
          ? err.message
          : "Unable to save benefits and values."
      );
    }
  }

  function updateValue(index: number, field: "title" | "text", value: string) {
    setValues((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function updateBenefit(
    index: number,
    field: "title" | "description",
    value: string
  ) {
    setBenefits((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  const companyFields: {
    label: string;
    key: keyof Company;
    icon: typeof Building2;
  }[] = [
      { label: "Company Name", key: "name", icon: Building2 },
      { label: "Location", key: "location", icon: MapPin },
      { label: "Website", key: "website", icon: Globe },
      { label: "Founded", key: "founded", icon: CalendarDays },
      { label: "Email", key: "email", icon: Mail },
      { label: "Company Size", key: "size", icon: Users },
      { label: "Phone", key: "phone", icon: Phone },
      { label: "Industry", key: "industry", icon: BriefcaseBusiness },
    ];

  return (
    <div className="min-h-screen bg-[#f6f9f8] font-sans text-slate-800">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-white">
            <ShieldCheck size={19} />
          </div>
          <span className="text-sm font-bold">{company.name}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebar((v) => !v)}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          {mobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 flex w-64 flex-col border-r border-slate-100 bg-white p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0 ${mobileSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="hidden items-center gap-3 px-2 py-3 lg:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
              <ShieldCheck size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">{company.name}</p>
              <p className="mt-1 text-[10px] text-slate-400">Employer Account</p>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map(({ label, icon: Icon, href }) => {
              const selected = label === "Company Profile";
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setMobileSidebar(false);
                    if (selected) return;
                    // Navigate to the relevant application route.
                    window.location.href = href;
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${selected
                    ? "bg-[#e7f5ee] text-emerald-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto overflow-hidden rounded-xl bg-gradient-to-br from-[#e7f8ef] to-[#f4fbf7] p-4">
            <div className="relative z-10">
              <p className="text-sm font-bold leading-5 text-emerald-900">
                Find the Right Talent, Faster
              </p>
              <p className="mt-2 text-[10px] leading-4 text-slate-500">
                Update your company profile to attract better candidates and
                build your dream team.
              </p>
              <button
                type="button"
                onClick={() => (window.location.href = "/employer/jobs/new")}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-[10px] font-semibold text-white hover:bg-emerald-900"
              >
                View Job Posts <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="mt-4 flex justify-center text-emerald-700/50">
              <Building2 size={60} strokeWidth={0.8} />
            </div>
            <p className="mt-2 text-[10px] font-semibold text-emerald-800">
              Better Teams
              <br />
              Build a Brighter Future
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          {/* Company banner */}
          <section className="relative overflow-hidden rounded-xl border border-emerald-50 bg-gradient-to-r from-[#e2f6eb] via-[#f0fbf5] to-[#b8e8d3] p-5 sm:p-7">
            <div className="absolute -right-8 -top-20 h-64 w-64 rounded-full bg-white/40 blur-2xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-4 border-white bg-emerald-900 text-white shadow-sm">
                <ShieldCheck size={33} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-[#17364b] sm:text-2xl">
                    {company.name}
                  </h1>
                  <BadgeCheck size={17} className="fill-emerald-700 text-white" />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Building innovative digital solutions for a smarter tomorrow.
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={12} className="text-emerald-700" />
                    {company.industry}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-emerald-700" />
                    {company.location}
                  </span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-emerald-800"
                  >
                    <Globe size={12} className="text-emerald-700" />
                    {company.website.replace(/^https?:\/\//, "")}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={startEditing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white/90 px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-sm hover:bg-white"
              >
                <Pencil size={13} /> Edit Profile
              </button>
            </div>
          </section>

          {/* Company tabs */}
          <div className="mt-3 flex gap-1 overflow-x-auto rounded-xl border border-slate-100 bg-white px-2 pt-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === tab
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "Overview" && (
            <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-white p-4 sm:p-6">
              <section>
                <SectionHeading title="Company Overview" onEdit={startEditing} />
                <div className="grid gap-5 md:grid-cols-[1fr_0.65fr]">
                  <p className="text-xs leading-6 text-slate-500">
                    {company.description}
                  </p>
                  <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200">
                    <div className="text-center">
                      <Building2 size={54} strokeWidth={1} className="mx-auto text-emerald-800" />
                      <p className="mt-2 text-sm font-bold text-emerald-950">
                        {company.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Our workplace
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-b border-slate-100 pb-5 sm:grid-cols-3">
                  {[
                    { label: "Founded", value: company.founded, icon: CalendarDays },
                    { label: "Company Size", value: company.size, icon: Users },
                    { label: "Industry", value: company.industry, icon: BriefcaseBusiness },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 text-emerald-700">
                        <Icon size={15} />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-700">
                          {value || "Not specified"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-b border-slate-100 py-1 pb-5">
                <SectionHeading title="Company Details" onEdit={startEditing} />
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {companyFields.map(({ label, key, icon: Icon }) => (
                    <div key={key} className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-100 text-emerald-700">
                        <Icon size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400">{label}</p>
                        {key === "website" ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 flex items-center gap-1 break-all text-[11px] text-slate-600 hover:text-emerald-700"
                          >
                            {company.website}
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <p className="mt-1 break-words text-[11px] font-medium text-slate-700">
                            {company[key] || "Not specified"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="py-1">
                <SectionHeading title="Our Values" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {values.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="group rounded-xl border border-emerald-50 bg-gradient-to-br from-[#f4fbf7] to-white p-4"
                      >
                        {/* <Icon size={21} className="text-emerald-700" /> */}
                        <input
                          value={item.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          aria-label="Company value title"
                          className="mt-3 w-full bg-transparent text-xs font-bold outline-none focus:text-emerald-800"
                        />
                        <textarea
                          value={item.text}
                          onChange={(e) => updateValue(index, "text", e.target.value)}
                          aria-label="Company value description"
                          rows={2}
                          className="mt-1 w-full resize-none bg-transparent text-[10px] leading-4 text-slate-500 outline-none focus:text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setValues((prev) => prev.filter((_, i) => i !== index));
                            notify("Value removed.");
                          }}
                          className="mt-2 text-[10px] text-slate-400 hover:text-red-600"
                        >
                          Remove value
                        </button>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addValue();
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a company value..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                  <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">
                    <Plus size={13} /> Add
                  </button>
                </form>
              </section>

              <section className="border-t border-slate-100 pt-4">
                <SectionHeading title="Why Work With Us?" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {benefits.map(({ title, description, icon: Icon }, index) => (
                    <div key={`${title}-${index}`} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                        {/* <Icon size={16} /> */}
                      </span>
                      <div className="min-w-0 flex-1">
                        <input
                          value={title}
                          onChange={(e) => updateBenefit(index, "title", e.target.value)}
                          aria-label="Benefit title"
                          className="w-full bg-transparent text-[10px] font-bold outline-none"
                        />
                        <textarea
                          value={description}
                          onChange={(e) => updateBenefit(index, "description", e.target.value)}
                          aria-label="Benefit description"
                          rows={2}
                          className="mt-1 w-full resize-none bg-transparent text-[10px] leading-4 text-slate-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBenefits((prev) => prev.filter((_, i) => i !== index));
                            notify("Benefit removed.");
                          }}
                          className="mt-1 text-[10px] text-slate-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addBenefit();
                  }}
                  className="mt-4 flex gap-2"
                >
                  <input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add another benefit..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                  <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">
                    <Plus size={13} /> Add
                  </button>
                </form>
              </section>

              <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-[#e7f7ee] to-[#f0faf5] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700">
                    <Rocket size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Ready to build your dream team?</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Update your company profile, post a job and find the right talent.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/employer/jobs/new")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900"
                >
                  Post a Job <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* About tab */}
          {activeTab === "About" && (
            <section className="mt-3 rounded-xl border border-slate-100 bg-white p-5 sm:p-7">
              <SectionHeading title="About Our Company" onEdit={startEditing} />
              <p className="text-sm leading-7 text-slate-600">{company.about}</p>
              <div className="mt-6 rounded-xl bg-emerald-50/70 p-5">
                <h3 className="text-sm font-bold text-emerald-900">Our Mission</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{company.mission}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Founded", value: company.founded },
                  { label: "Team Size", value: company.size },
                  { label: "Industry", value: company.industry },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Team tab */}
          {activeTab === "Team" && (
            <section className="mt-3 rounded-xl border border-slate-100 bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold">Meet Our Team</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Manage the people representing your company.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTeam((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900"
                >
                  <Plus size={14} /> Add Member
                </button>
              </div>

              {showAddTeam && (
                <form onSubmit={addTeamMember} className="mt-5 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 sm:grid-cols-2">
                  <Field label="Full Name" value={teamDraft.name} onChange={(v) => setTeamDraft((s) => ({ ...s, name: v }))} placeholder="Full name" />
                  <Field label="Job Title" value={teamDraft.role} onChange={(v) => setTeamDraft((s) => ({ ...s, role: v }))} placeholder="Job title" />
                  <Field label="Email" type="email" value={teamDraft.email} onChange={(v) => setTeamDraft((s) => ({ ...s, email: v }))} placeholder="name@company.com" />
                  <div className="flex items-end gap-2">
                    <button className="rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white">
                      Save Member
                    </button>
                    <button type="button" onClick={() => setShowAddTeam(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {team.map((member) => (
                  <article key={member.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                        <UserRound size={22} />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTeam((prev) => prev.filter((x) => x.id !== member.id));
                          notify("Team member removed.");
                        }}
                        aria-label={`Remove ${member.name}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <h3 className="mt-4 text-sm font-bold">{member.name}</h3>
                    <p className="mt-1 text-xs text-emerald-700">{member.role}</p>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="mt-3 flex items-center gap-2 break-all text-xs text-slate-500 hover:text-emerald-700">
                        <Mail size={13} /> {member.email}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Benefits tab */}
          {activeTab === "Benefits" && (
            <section className="mt-3 rounded-xl border border-slate-100 bg-white p-5 sm:p-7">
              <h2 className="text-sm font-bold">Benefits & Perks</h2>
              <p className="mt-1 text-xs text-slate-500">
                Edit the benefits your company offers to candidates.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {benefits.map(({ title, description, icon: Icon }, index) => (
                  <article key={`${title}-${index}`} className="rounded-xl border border-slate-100 p-5">
                    {/* <Icon size={23} className="text-emerald-700" /> */}
                    <input
                      value={title}
                      onChange={(e) => updateBenefit(index, "title", e.target.value)}
                      aria-label="Benefit title"
                      className="mt-3 w-full bg-transparent text-sm font-bold outline-none focus:text-emerald-800"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => updateBenefit(index, "description", e.target.value)}
                      aria-label="Benefit description"
                      rows={3}
                      className="mt-2 w-full resize-none bg-transparent text-xs leading-5 text-slate-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setBenefits((prev) => prev.filter((_, i) => i !== index))}
                      className="mt-2 text-xs text-red-500 hover:underline"
                    >
                      Remove benefit
                    </button>
                  </article>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); addBenefit(); }} className="mt-5 flex gap-2">
                <input value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} placeholder="New benefit title" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white">
                  <Plus size={14} /> Add
                </button>
              </form>
            </section>
          )}

          {/* Social Links tab */}
          {activeTab === "Social Links" && (
            <section className="mt-3 rounded-xl border border-slate-100 bg-white p-5 sm:p-7">
              <h2 className="text-sm font-bold">Social Media & Website</h2>
              <p className="mt-1 text-xs text-slate-500">
                Keep your company links current so candidates can learn more.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setCompany((prev) => ({ ...prev, linkedin: editDraft.linkedin, twitter: editDraft.twitter, instagram: editDraft.instagram })); notify("Social links updated."); }} className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600"><Globe size={14} /> Company Website</span>
                  <input value={company.website} readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" />
                </label>
                <Field label="LinkedIn URL" value={editDraft.linkedin} onChange={(v) => setEditDraft((s) => ({ ...s, linkedin: v }))} placeholder="https://linkedin.com/company/..." />
                <Field label="X / Twitter URL" value={editDraft.twitter} onChange={(v) => setEditDraft((s) => ({ ...s, twitter: v }))} placeholder="https://x.com/..." />
                <Field label="Instagram URL" value={editDraft.instagram} onChange={(v) => setEditDraft((s) => ({ ...s, instagram: v }))} placeholder="https://instagram.com/..." />
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-xs font-semibold text-white hover:bg-emerald-900">
                  <Save size={14} /> Save Social Links
                </button>
              </form>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                {[
                  { label: "LinkedIn", url: company.linkedin },
                  { label: "X / Twitter", url: company.twitter },
                  { label: "Instagram", url: company.instagram },
                ].map((item) => (
                  <a key={item.label} href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-800">
                    <ExternalLink size={13} /> {item.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          <footer className="py-5 text-center text-[10px] text-slate-400">
            SkillMatch Employer Portal · Company Profile
          </footer>
        </main>
      </div>

      {/* Edit company modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cancelEditing();
          }}
        >
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-bold">Edit Company Profile</h2>
                <p className="mt-1 text-xs text-slate-500">Update your company information.</p>
              </div>
              <button type="button" onClick={cancelEditing} aria-label="Close modal" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveCompany} className="max-h-[75vh] space-y-4 overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company Name" value={editDraft.name} onChange={(v) => setEditDraft((s) => ({ ...s, name: v }))} />
                <Field label="Website" value={editDraft.website} onChange={(v) => setEditDraft((s) => ({ ...s, website: v }))} />
                <Field label="Email" type="email" value={editDraft.email} onChange={(v) => setEditDraft((s) => ({ ...s, email: v }))} />
                <Field label="Phone" value={editDraft.phone} onChange={(v) => setEditDraft((s) => ({ ...s, phone: v }))} />
                <Field label="Location" value={editDraft.location} onChange={(v) => setEditDraft((s) => ({ ...s, location: v }))} />
                <Field label="Founded Year" value={editDraft.founded} onChange={(v) => setEditDraft((s) => ({ ...s, founded: v }))} />
                <Field label="Company Size" value={editDraft.size} onChange={(v) => setEditDraft((s) => ({ ...s, size: v }))} />
                <Field label="Industry" value={editDraft.industry} onChange={(v) => setEditDraft((s) => ({ ...s, industry: v }))} />
              </div>
              <TextArea label="Company Overview" value={editDraft.description} onChange={(v) => setEditDraft((s) => ({ ...s, description: v }))} />
              <TextArea label="About the Company" value={editDraft.about} onChange={(v) => setEditDraft((s) => ({ ...s, about: v }))} />
              <TextArea label="Our Mission" value={editDraft.mission} onChange={(v) => setEditDraft((s) => ({ ...s, mission: v }))} />

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={cancelEditing} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900">
                  <Check size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xl">
          <Check size={16} />
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}