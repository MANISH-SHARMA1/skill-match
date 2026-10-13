
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  UserRound, FileText, BriefcaseBusiness, GraduationCap,
  Code2, Plus, X, Check, Pencil, Trash2, Eye, Download,
  Upload, MoreVertical, Lightbulb, ShieldCheck,
  ChevronRight, Save, Sparkles, CalendarDays, Building2,
  MapPin, Link as FileCheck2,
} from "lucide-react";
import { CATEGORY_TO_GROUP, createCandidateSkill, deleteCandidateSkill, fetchCandidateSkills, GROUP_TO_CATEGORY, SkillCategory } from "@/app/libs/api/candidateSkills";
import {
  fetchCandidateExperience,
  createCandidateExperience,
  updateCandidateExperience,
  deleteCandidateExperience,
  fetchCandidateEducation,
  createCandidateEducation,
  updateCandidateEducation,
  deleteCandidateEducation,
} from "@/app/libs/api/candidateExperienceEducation";

type Tab = "skills" | "resume" | "experience" | "education";

type SkillGroup = {
  id: string;
  title: string;
  skills: string[];
};

type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

type Education = {
  id: string;
  degree: string;
  school: string;
  field: string;
  start: string;
  end: string;
  description: string;
};

type ResumeInfo = {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl: string;
};

const initialGroups: SkillGroup[] = [
  {
    id: "technical",
    title: "Technical Skills",
    skills: [
      "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
      "Express.js", "MongoDB", "Tailwind CSS", "Git", "GitHub",
      "Redux Toolkit", "Framer Motion", "GSAP",
    ],
  },
  {
    id: "tools",
    title: "Tools & Other Skills",
    skills: [
      "Postman", "VS Code", "Figma", "Docker", "Linux",
      "AWS (Basic)", "REST APIs", "Problem Solving",
      "Communication", "Team Collaboration",
    ],
  },
];

const tabs: { id: Tab; label: string; icon: typeof Code2 }[] = [
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", icon: GraduationCap },
];

const emptyExperience: Omit<Experience, "id"> = {
  title: "",
  company: "",
  location: "",
  start: "",
  end: "",
  current: false,
  description: "",
};

const emptyEducation: Omit<Education, "id"> = {
  degree: "",
  school: "",
  field: "",
  start: "",
  end: "",
  description: "",
};

const STORAGE_KEY = "skillmatch-profile-settings-v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("skills");
  const [groups, setGroups] = useState<SkillGroup[]>(initialGroups);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [resume, setResume] = useState<ResumeInfo | null>(null);

  const [newSkill, setNewSkill] = useState("");
  const [skillGroup, setSkillGroup] = useState("technical");
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);


  const [skillIds, setSkillIds] = useState<Record<string, string>>({});
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsSaving, setSkillsSaving] = useState(false);

  function skillKey(category: SkillCategory, name: string) {
    return `${category}:${name.trim().toLowerCase()}`;
  }


  const [experienceForm, setExperienceForm] =
    useState<Omit<Experience, "id">>(emptyExperience);
  const [educationForm, setEducationForm] =
    useState<Omit<Education, "id">>(emptyEducation);

  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);

  const [menuResume, setMenuResume] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const resumeUrlRef = useRef<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const savedSkills = await fetchCandidateSkills();

        if (cancelled) return;

        const nextIds: Record<string, string> = {};

        const nextGroups: SkillGroup[] = [
          { id: "technical", title: "Technical Skills", skills: [] },
          { id: "tools", title: "Tools", skills: [] },
          { id: "soft-skills", title: "Soft Skills", skills: [] },
          { id: "other", title: "Other", skills: [] },
        ];

        for (const skill of savedSkills) {
          const groupId = CATEGORY_TO_GROUP[skill.category];
          const group = nextGroups.find((item) => item.id === groupId);

          if (!group) continue;

          group.skills.push(skill.name);
          nextIds[skillKey(skill.category, skill.name)] = skill._id;
        }

        setGroups(nextGroups);
        setSkillIds(nextIds);
      } catch (err) {
        if (!cancelled) {
          setNotice(
            err instanceof Error ? err.message : "Unable to load skills"
          );
        }
      } finally {
        if (!cancelled) setSkillsLoading(false);
      }
    }

    async function loadExperienceAndEducation() {
      try {
        const [savedExperience, savedEducation] = await Promise.all([
          fetchCandidateExperience(),
          fetchCandidateEducation(),
        ])

        if (cancelled) return;

        setExperience(
          savedExperience.map((item) => ({
            id: item._id,
            title: item.jobTitle,
            company: item.companyName,
            location: item.location ?? "",
            start: item.startDate
              ? item.startDate.slice(0, 10)
              : "",
            end: item.endDate ? item.endDate.slice(0, 10) : "",
            current: item.isCurrent,
            description: item.description ?? ""
          }))
        );

        setEducation(
          savedEducation.map((item) => ({
            id: item._id,
            degree: item.degree ?? "",
            school: item.institution,
            field: item.fieldOfStudy ?? "",
            start: item.startDate ? item.startDate.slice(0, 10) : "",
            end: item.endDate ? item.endDate.slice(0, 10) : "",
            description: item.description ?? ""
          }))
        )
      } catch (err) {
        if (!cancelled) {
          setNotice(
            err instanceof Error
              ? err.message
              : "Unable to load experience and education"
          );
        }
      }
    }

    void loadSkills();
    void loadExperienceAndEducation();

    return () => {
      cancelled = true;
    };
  }, []);


  // Load saved browser data.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.groups)) setGroups(data.groups);
        if (Array.isArray(data.experience)) setExperience(data.experience);
        if (Array.isArray(data.education)) setEducation(data.education);
        if (data.resume) setResume(data.resume);
      }
    } catch {
      setNotice("Saved data could not be loaded.");
    }

    setHydrated(true);
  }, []);

  // Persist all profile data locally.
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ groups, experience, education, resume })
      );
    } catch {
      setNotice("Browser storage is full. Try a smaller resume file.");
    }
  }, [groups, experience, education, resume, hydrated]);

  useEffect(() => {
    return () => {
      if (resumeUrlRef.current) URL.revokeObjectURL(resumeUrlRef.current);
    };
  }, []);

  const totalSkills = groups.reduce((sum, group) => sum + group.skills.length, 0);

  const profileScore = useMemo(() => {
    const checks = [
      totalSkills >= 5,
      Boolean(resume),
      experience.length > 0,
      education.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [totalSkills, resume, experience.length, education.length]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  async function addSkill() {
    const name = newSkill.trim();

    if (!name) return;

    const target = groups.find((group) => group.id === skillGroup);

    if (!target) return;

    if (
      target.skills.some(
        (skill) => skill.toLowerCase() === name.toLowerCase()
      )
    ) {
      notify("This skill already exists.");
      return;
    }

    const category = GROUP_TO_CATEGORY[skillGroup];

    if (!category) {
      notify("Invalid skill category.");
      return;
    }

    setSkillsSaving(true);

    try {
      const savedSkill = await createCandidateSkill({
        name,
        category,
        level: "Intermediate",
      });

      setGroups((previous) =>
        previous.map((group) =>
          group.id === skillGroup
            ? { ...group, skills: [...group.skills, savedSkill.name] }
            : group
        )
      );

      setSkillIds((previous) => ({
        ...previous,
        [skillKey(savedSkill.category, savedSkill.name)]: savedSkill._id,
      }));

      setNewSkill("");
      notify("Skill added successfully.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to add skill."
      );
    } finally {
      setSkillsSaving(false);
    }
  }

  async function removeSkill(groupId: string, name: string) {
    const category = GROUP_TO_CATEGORY[groupId];

    if (!category) {
      notify("Invalid skill category.");
      return;
    }

    const key = skillKey(category, name);
    const skillId = skillIds[key];

    if (!skillId) {
      notify("Could not identify this saved skill. Reload the page.");
      return;
    }

    try {
      await deleteCandidateSkill(skillId);

      setGroups((previous) =>
        previous.map((group) =>
          group.id === groupId
            ? {
              ...group,
              skills: group.skills.filter((skill) => skill !== name),
            }
            : group
        )
      );

      setSkillIds((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });

      notify("Skill removed.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to remove skill."
      );
    }
  }

  function renameGroup(groupId: string) {
    const title = window.prompt("Enter a new group name:");
    if (!title?.trim()) return;

    setGroups((prev) =>
      prev.map((g) => g.id === groupId ? { ...g, title: title.trim() } : g)
    );
    notify("Skill group updated.");
  }

  function addSkillGroup() {
    const title = newGroupTitle.trim();
    if (!title) return;

    setGroups((prev) => [...prev, { id: uid(), title, skills: [] }]);
    setNewGroupTitle("");
    setShowNewGroup(false);
    notify("Skill group created.");
  }

  async function uploadResume(file?: File) {
    if (!file) return;

    const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowed) {
      notify("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("The resume must be 5 MB or smaller.");
      return;
    }

    try {
      // Store the file locally as a data URL for this demo.
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read file."));
        reader.readAsDataURL(file);
      });

      setResume({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl,
      });

      setMenuResume(false);
      notify("Resume uploaded successfully.");
    } catch {
      notify("Could not read the selected file.");
    }
  }

  function downloadResume() {
    if (!resume) return;
    const a = document.createElement("a");
    a.href = resume.dataUrl;
    a.download = resume.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function openResumePreview() {
    if (!resume) return;

    if (resume.name.toLowerCase().endsWith(".pdf")) {
      if (resumeUrlRef.current) URL.revokeObjectURL(resumeUrlRef.current);
      const blob = new Blob(
        [Uint8Array.from(atob(resume.dataUrl.split(",")[1]), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      resumeUrlRef.current = URL.createObjectURL(blob);
      window.open(resumeUrlRef.current, "_blank", "noopener,noreferrer");
    } else {
      notify("Download the DOC/DOCX file to preview it in a document viewer.");
    }
  }

  async function saveExperience(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = {
      title: experienceForm.title.trim(),
      company: experienceForm.company.trim(),
      location: experienceForm.location.trim(),
      start: experienceForm.start,
      end: experienceForm.current ? "" : experienceForm.end,
      current: experienceForm.current,
      description: experienceForm.description.trim(),
    };

    if (!input.title || !input.company || !input.start) {
      notify("Job title, company, and start date are required.");
      return;
    }

    try {
      if (editingExperience) {
        const saved = await updateCandidateExperience(
          editingExperience,
          input
        );

        setExperience((prev) =>
          prev.map((item) =>
            item.id === editingExperience
              ? {
                ...item,
                id: saved._id,
                title: saved.jobTitle,
                company: saved.companyName,
                location: saved.location ?? "",
                start: saved.startDate.slice(0, 10),
                end: saved.endDate?.slice(0, 10) ?? "",
                current: saved.isCurrent,
                description: saved.description ?? "",
              }
              : item
          )
        );

        notify("Experience updated.");
      } else {
        const saved = await createCandidateExperience(input);

        setExperience((prev) => [
          ...prev,
          {
            id: saved._id,
            title: saved.jobTitle,
            company: saved.companyName,
            location: saved.location ?? "",
            start: saved.startDate.slice(0, 10),
            end: saved.endDate?.slice(0, 10) ?? "",
            current: saved.isCurrent,
            description: saved.description ?? "",
          },
        ]);

        notify("Experience added.");
      }

      setExperienceForm(emptyExperience);
      setEditingExperience(null);
      setShowExperienceForm(false);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to save experience."
      );
    }
  }

  function editExperience(item: Experience) {
    setExperienceForm({
      title: item.title,
      company: item.company,
      location: item.location,
      start: item.start,
      end: item.end,
      current: item.current,
      description: item.description,
    });
    setEditingExperience(item.id);
    setShowExperienceForm(true);
  }

  async function removeExperience(id: string) {
    try {
      await deleteCandidateExperience(id);

      setExperience((prev) => prev.filter((item) => item.id !== id));
      notify("Experience deleted.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to delete experience."
      );
    }
  }

  async function saveEducation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = {
      degree: educationForm.degree.trim(),
      school: educationForm.school.trim(),
      field: educationForm.field.trim(),
      start: educationForm.start,
      end: educationForm.end,
      description: educationForm.description.trim(),
    };

    if (!input.school) {
      notify("Institution name is required.");
      return;
    }

    try {
      if (editingEducation) {
        const saved = await updateCandidateEducation(
          editingEducation,
          input
        );

        setEducation((prev) =>
          prev.map((item) =>
            item.id === editingEducation
              ? {
                id: saved._id,
                degree: saved.degree ?? "",
                school: saved.institution,
                field: saved.fieldOfStudy ?? "",
                start: saved.startDate?.slice(0, 10) ?? "",
                end: saved.endDate?.slice(0, 10) ?? "",
                description: saved.description ?? "",
              }
              : item
          )
        );

        notify("Education updated.");
      } else {
        const saved = await createCandidateEducation(input);

        setEducation((prev) => [
          ...prev,
          {
            id: saved._id,
            degree: saved.degree ?? "",
            school: saved.institution,
            field: saved.fieldOfStudy ?? "",
            start: saved.startDate?.slice(0, 10) ?? "",
            end: saved.endDate?.slice(0, 10) ?? "",
            description: saved.description ?? "",
          },
        ]);

        notify("Education added.");
      }

      setEducationForm(emptyEducation);
      setEditingEducation(null);
      setShowEducationForm(false);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to save education."
      );
    }
  }

  function editEducation(item: Education) {
    setEducationForm({
      degree: item.degree,
      school: item.school,
      field: item.field,
      start: item.start,
      end: item.end,
      description: item.description,
    });
    setEditingEducation(item.id);
    setShowEducationForm(true);
  }


  async function removeEducation(id: string) {
    try {
      await deleteCandidateEducation(id);

      setEducation((prev) => prev.filter((item) => item.id !== id));
      notify("Education deleted.");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Unable to delete education."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] font-sans text-slate-800">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-emerald-50 bg-gradient-to-r from-white via-[#f4fbf7] to-[#eaf8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-6 sm:px-8 lg:px-10">
          <div className="relative z-10">
            <p className="text-xs font-bold text-emerald-700">Profile Settings</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#17354a] sm:text-3xl">
              Update Your Skills & Resume
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
              Keep your profile up to date so employers can find you easily.
              <br className="hidden sm:block" />
              Add your skills, experience and resume to get better job matches.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-emerald-800 md:flex">
            <div className="relative flex h-20 w-36 items-center justify-center rounded-2xl bg-emerald-50">
              <div className="absolute right-3 top-2 h-12 w-12 rounded-full bg-emerald-100/80" />
              <FileCheck2 size={55} strokeWidth={1.4} className="relative z-10" />
              <Sparkles size={18} className="absolute left-3 top-2 text-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8 lg:px-10">
        {/* Tabs */}
        <nav className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm sm:grid-cols-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center justify-center gap-2 border-b-2 px-3 py-4 text-xs font-semibold transition sm:text-sm ${activeTab === id
                ? "border-emerald-700 bg-emerald-50/40 text-emerald-800"
                : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {notice && (
          <div
            role="status"
            className="fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-xl"
          >
            <Check size={17} />
            {notice}
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <section className="mt-5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 font-bold text-slate-800">
                  <Code2 size={19} className="text-emerald-700" />
                  Your Skills
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add the skills you have to get matched with relevant jobs.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
                Total Skills: {totalSkills}
              </span>
            </div>

            {/* Add skill form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSkill();
              }}
              className="mt-5 flex flex-col gap-2 sm:flex-row"
            >
              <select
                value={skillGroup}
                onChange={(e) => setSkillGroup(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-emerald-600"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.title}
                  </option>
                ))}
              </select>
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill, e.g. React"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                disabled={skillsSaving}
                className={'inline-flex items-center ' + (skillsSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-800") + " justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white"}
              >
                <Plus size={15} /> Add New Skill
              </button>
            </form>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {groups.map((group) => (
                <div key={group.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <BriefcaseBusiness size={15} className="text-emerald-700" />
                      {group.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => renameGroup(group.id)}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Edit group
                    </button>
                  </div>

                  <div className="mt-4 flex min-h-14 flex-wrap content-start gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 py-1.5 pl-3 pr-1.5 text-[11px] font-medium text-slate-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(group.id, skill)}
                          aria-label={`Remove ${skill}`}
                          className="rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {group.skills.length === 0 && (
                      <p className="text-xs text-slate-400">No skills added yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showNewGroup ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addSkillGroup();
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="New group name"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                />
                <button className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewGroup(false)}
                  className="rounded-lg border px-3 py-2 text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewGroup(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
              >
                <Plus size={15} /> Create skill group
              </button>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-lg bg-emerald-50/80 p-3 text-xs leading-5 text-slate-600">
              <Lightbulb size={17} className="shrink-0 text-amber-500" />
              Tip: Highlighting relevant skills increases your chances of getting
              noticed by employers and matching with better opportunities.
            </div>
          </section>
        )}

        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <section className="mt-5 space-y-5">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-bold">
                    <FileText size={19} className="text-emerald-700" />
                    Resume
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Upload or update your resume. Supported formats: PDF, DOC, DOCX (Max 5MB).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <Upload size={15} />
                  {resume ? "Replace Resume" : "Upload New Resume"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => uploadResume(e.target.files?.[0])}
                />
              </div>

              {!resume ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-5 flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
                >
                  <Upload size={27} className="text-emerald-700" />
                  <p className="mt-3 text-sm font-semibold">Upload your resume</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose a PDF, DOC or DOCX file up to 5 MB.
                  </p>
                </button>
              ) : (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-bold">{resume.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatSize(resume.size)} · Uploaded{" "}
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      <Check size={11} /> Active
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Preview PDF"
                      onClick={openResumePreview}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      type="button"
                      title="Download resume"
                      onClick={downloadResume}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                    >
                      <Download size={17} />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        title="More options"
                        onClick={() => setMenuResume((v) => !v)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <MoreVertical size={17} />
                      </button>
                      {menuResume && (
                        <div className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-slate-100 bg-white p-1 shadow-xl">
                          <button
                            type="button"
                            onClick={() => {
                              setResume(null);
                              setMenuResume(false);
                              notify("Resume removed.");
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Remove resume
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Lightbulb size={17} className="text-emerald-700" />
                Resume Tips
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Use a clean and professional format.",
                  "Include relevant skills and experience.",
                  "Keep it updated with your latest projects.",
                  "Use keywords related to the job you want.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check size={14} className="shrink-0 text-emerald-600" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <section className="mt-5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-bold">
                  <BriefcaseBusiness size={19} className="text-emerald-700" />
                  Work Experience
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Showcase your professional background and achievements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExperienceForm(emptyExperience);
                  setEditingExperience(null);
                  setShowExperienceForm((v) => !v);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                <Plus size={15} /> Add Experience
              </button>
            </div>

            {showExperienceForm && (
              <form onSubmit={saveExperience} className="mt-5 space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <h3 className="font-bold">
                  {editingExperience ? "Edit Experience" : "New Experience"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Job Title" value={experienceForm.title} onChange={(v) => setExperienceForm((s) => ({ ...s, title: v }))} placeholder="Frontend Developer" required />
                  <Field label="Company" value={experienceForm.company} onChange={(v) => setExperienceForm((s) => ({ ...s, company: v }))} placeholder="Company name" required />
                  <Field label="Location" value={experienceForm.location} onChange={(v) => setExperienceForm((s) => ({ ...s, location: v }))} placeholder="City, Country or Remote" />
                  <Field label="Start Date" type="month" value={experienceForm.start} onChange={(v) => setExperienceForm((s) => ({ ...s, start: v }))} required />
                  {!experienceForm.current && (
                    <Field label="End Date" type="month" value={experienceForm.end} onChange={(v) => setExperienceForm((s) => ({ ...s, end: v }))} required />
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={experienceForm.current}
                    onChange={(e) => setExperienceForm((s) => ({ ...s, current: e.target.checked, end: "" }))}
                    className="accent-emerald-700"
                  />
                  I currently work here
                </label>
                <TextAreaField label="Description & Achievements" value={experienceForm.description} onChange={(v) => setExperienceForm((s) => ({ ...s, description: v }))} placeholder="Describe your responsibilities and achievements..." />
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white">
                    <Save size={14} /> Save Experience
                  </button>
                  <button type="button" onClick={() => setShowExperienceForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 space-y-3">
              {experience.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.company}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                        <CalendarDays size={12} />
                        {item.start || "Start date"} — {item.current ? "Present" : item.end || "End date"}
                        {item.location && <><MapPin size={12} />{item.location}</>}
                      </p>
                      {item.description && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => editExperience(item)} aria-label="Edit experience" className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700">
                        <Pencil size={15} />
                      </button>
                      <button type="button" onClick={() => removeExperience(item.id)} aria-label="Delete experience" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {experience.length === 0 && !showExperienceForm && (
                <div className="rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
                  <BriefcaseBusiness size={28} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-semibold">No experience added yet</p>
                  <p className="mt-1 text-xs text-slate-500">Add your current or previous jobs to strengthen your profile.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <section className="mt-5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-bold">
                  <GraduationCap size={19} className="text-emerald-700" />
                  Education
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add your qualifications, degrees and academic achievements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEducationForm(emptyEducation);
                  setEditingEducation(null);
                  setShowEducationForm((v) => !v);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                <Plus size={15} /> Add Education
              </button>
            </div>

            {showEducationForm && (
              <form onSubmit={saveEducation} className="mt-5 space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <h3 className="font-bold">
                  {editingEducation ? "Edit Education" : "New Education"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Degree / Qualification" value={educationForm.degree} onChange={(v) => setEducationForm((s) => ({ ...s, degree: v }))} placeholder="B.Tech, BCA, MCA..." required />
                  <Field label="School / Institution" value={educationForm.school} onChange={(v) => setEducationForm((s) => ({ ...s, school: v }))} placeholder="Institution name" required />
                  <Field label="Field of Study" value={educationForm.field} onChange={(v) => setEducationForm((s) => ({ ...s, field: v }))} placeholder="Computer Science" />
                  <Field label="Start Date" type="month" value={educationForm.start} onChange={(v) => setEducationForm((s) => ({ ...s, start: v }))} required />
                  <Field label="End Date" type="month" value={educationForm.end} onChange={(v) => setEducationForm((s) => ({ ...s, end: v }))} />
                </div>
                <TextAreaField label="Additional Details" value={educationForm.description} onChange={(v) => setEducationForm((s) => ({ ...s, description: v }))} placeholder="Achievements, coursework, grades..." />
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white">
                    <Save size={14} /> Save Education
                  </button>
                  <button type="button" onClick={() => setShowEducationForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 space-y-3">
              {education.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <GraduationCap size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{item.degree}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.school}</p>
                      {item.field && <p className="mt-1 text-xs text-slate-500">{item.field}</p>}
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={12} />
                        {item.start || "Start date"} — {item.end || "Present"}
                      </p>
                      {item.description && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => editEducation(item)} aria-label="Edit education" className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700">
                        <Pencil size={15} />
                      </button>
                      <button type="button" onClick={() => removeEducation(item.id)} aria-label="Delete education" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {education.length === 0 && !showEducationForm && (
                <div className="rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
                  <GraduationCap size={28} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-semibold">No education added yet</p>
                  <p className="mt-1 text-xs text-slate-500">Add your qualifications to help employers understand your background.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* PROFILE PREVIEW */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <UserRound size={25} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Your Professional Profile</h2>
                <p className="mt-1 text-xs text-slate-500">A summary of the information you have added.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-700">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {groups.flatMap((g) => g.skills).slice(0, 12).map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">
                      {skill}
                    </span>
                  ))}
                  {totalSkills === 0 && <span className="text-xs text-slate-400">Add skills to display them here.</span>}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-700">Latest Experience</p>
                {experience.length ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {experience[experience.length - 1].title} at {experience[experience.length - 1].company}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">No experience added yet.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-700">Education</p>
                {education.length ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {education[education.length - 1].degree} — {education[education.length - 1].school}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">No education added yet.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-700">Resume</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <FileText size={15} className="text-emerald-700" />
                  {resume ? resume.name : "No resume uploaded"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="font-bold">Profile Strength</h2>
                <p className="mt-1 text-xs text-slate-500">Complete your profile to improve your visibility.</p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <span className="text-3xl font-extrabold text-emerald-700">{profileScore}%</span>
              <span className="text-xs text-slate-500">
                {profileScore === 100 ? "Profile complete!" : "Keep going"}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "Add at least 5 skills", complete: totalSkills >= 5, tab: "skills" as Tab },
                { label: "Upload your resume", complete: !!resume, tab: "resume" as Tab },
                { label: "Add work experience", complete: experience.length > 0, tab: "experience" as Tab },
                { label: "Add education details", complete: education.length > 0, tab: "education" as Tab },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                  className="flex w-full items-center gap-2 text-left text-xs text-slate-600 hover:text-emerald-700"
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full ${item.complete ? "bg-emerald-600 text-white" : "border border-slate-300 text-transparent"}`}>
                    <Check size={10} />
                  </span>
                  <span className={item.complete ? "text-slate-400 line-through" : ""}>{item.label}</span>
                  <ChevronRight size={14} className="ml-auto" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const nextTab: Tab = totalSkills < 5
                  ? "skills"
                  : !resume
                    ? "resume"
                    : experience.length === 0
                      ? "experience"
                      : "education";
                setActiveTab(nextTab);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              Complete Your Profile <ChevronRight size={15} />
            </button>
          </div>
        </section>

        <footer className="py-6 text-center text-[11px] text-slate-400">
          SkillMatch · Profile
        </footer>
      </div>
    </main>
  );
}