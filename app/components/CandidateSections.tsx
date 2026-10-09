"use client";

import {
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  MoreVertical,
  Search,
  UserPlus,
} from "lucide-react";

const candidates = [
  {
    name: "Priya Verma",
    role: "Frontend Developer",
    location: "Noida, India",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85",
    skills: ["React", "Next.js", "Tailwind"],
    match: "95%",
  },
  {
    name: "Rahul Singh",
    role: "Full Stack Developer",
    location: "Lucknow, India",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85",
    skills: ["MERN", "TypeScript", "AWS"],
    match: "92%",
  },
  {
    name: "Ananya Sharma",
    role: "UI/UX Designer",
    location: "Delhi, India",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=85",
    skills: ["Figma", "Adobe XD", "UI/UX"],
    match: "88%",
  },
  {
    name: "Arjun Patel",
    role: "Backend Developer",
    location: "Jaipur, India",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=85",
    skills: ["Node.js", "Express", "MongoDB"],
    match: "90%",
  },
];

const categories = [
  {
    name: "Frontend Developer",
    count: "1,240",
    icon: "FE",
  },
  {
    name: "Full Stack Developer",
    count: "980",
    icon: "FS",
  },
  {
    name: "UI/UX Designer",
    count: "760",
    icon: "UX",
  },
  {
    name: "Backend Developer",
    count: "845",
    icon: "BE",
  },
];

export default function CandidateSections() {
  return (
    <section className="w-full bg-white">
      {/* =====================================================
          TOP CANDIDATES
      ====================================================== */}

      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-8 sm:px-8 lg:pt-10">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[#07945d]">
              Top Candidates
            </p>

            <h2 className="text-[25px] font-bold leading-tight tracking-[-0.7px] text-[#102d35]">
              Recommended Talent for Employers
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Discover skilled professionals who match your job requirements.
            </p>
          </div>

          <button className="hidden items-center gap-1 text-[10px] font-semibold text-[#078c59] transition hover:text-[#056d46] sm:flex">
            View all candidates
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.name}
              candidate={candidate}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          BROWSE BY CATEGORY
      ====================================================== */}

      <div className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[#07945d]">
              Browse by Category
            </p>

            <h2 className="text-[25px] font-bold leading-tight tracking-[-0.7px] text-[#102d35]">
              Explore Jobs by Skill
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Find opportunities in your area of expertise.
            </p>
          </div>

          <button className="hidden items-center gap-1 text-[10px] font-semibold text-[#078c59] transition hover:text-[#056d46] sm:flex">
            View all categories
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={`category-${candidate.name}`}
              candidate={{
                ...candidate,

                // Slightly different avatar for category section
                avatar: [
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=85",
                  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=85",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=85",
                ][index],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   CANDIDATE CARD
========================================================= */

function CandidateCard({
  candidate,
}: {
  candidate: {
    name: string;
    role: string;
    location: string;
    avatar: string;
    skills: string[];
    match: string;
  };
}) {
  return (
    <div className="group relative min-h-[187px] rounded-xl border border-[#e7eeeb] bg-white p-3.5 shadow-[0_2px_10px_rgba(20,60,50,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cde8dc] hover:shadow-[0_12px_28px_rgba(20,80,60,0.08)]">
      
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Avatar */}
        <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* More */}
        <button
          aria-label="More options"
          className="text-slate-300 transition hover:text-slate-500"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Name */}
      <h3 className="mt-2 text-[11px] font-bold text-[#17333a]">
        {candidate.name}
      </h3>

      {/* Role */}
      <p className="mt-0.5 text-[9px] font-medium text-slate-500">
        {candidate.role}
      </p>

      {/* Location */}
      <div className="mt-1.5 flex items-center gap-1 text-[8px] text-slate-500">
        <MapPin size={9} className="text-slate-400" />
        {candidate.location}
      </div>

      {/* Skills */}
      <div className="mt-2.5 flex flex-wrap gap-1">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#f3f7f6] px-1.5 py-[3px] text-[7px] font-medium text-slate-500"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Match */}
      <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#e9f8f0] px-2 py-[3px]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0aa663]" />

        <span className="text-[7px] font-bold text-[#078c59]">
          {candidate.match} match
        </span>
      </div>

      {/* Invite */}
      <div className="mt-2.5">
        <button className="inline-flex h-7 min-w-[63px] items-center justify-center gap-1 rounded-md bg-[#078c59] px-3 text-[8px] font-semibold text-white transition hover:bg-[#067b4e]">
          Invite
        </button>
      </div>
    </div>
  );
}