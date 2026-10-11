
import {
    ArrowRight,
    Brain,
    Check,
    CirclePlay,
    Headphones,
    ShieldCheck,
    Target,
    TrendingUp,
    Zap,
    BriefcaseBusiness,
    Sparkles,
    MapPin,
} from "lucide-react";
import HowItWorks from "./HowItWorks";

const benefits = [
    "Skill-based candidate matching",
    "AI-powered recommendations",
    "Save time & reduce hiring costs",
    "Access to a diverse talent pool",
    "Easy job posting & tracking",
    "Dedicated employer support",
];

const features = [
    {
        title: "Skill-Based Matching",
        description:
            "Find candidates whose skills and experience truly match your job requirements.",
        icon: Target,
    },
    {
        title: "AI Recommendations",
        description:
            "Get personalized candidate suggestions based on your hiring needs.",
        icon: Brain,
    },
    {
        title: "Save Time",
        description:
            "Shortlist the best candidates faster with smart filters and pre-screened profiles.",
        icon: Zap,
    },
    {
        title: "Quality Talent Pool",
        description:
            "Access verified and active candidates from across different industries and locations.",
        icon: ShieldCheck,
    },
    {
        title: "Track & Manage",
        description:
            "Easily manage your jobs, applications and hiring pipeline — all in one place.",
        icon: TrendingUp,
    },
    {
        title: "Dedicated Support",
        description:
            "Our team is here to help you at every step of your hiring journey.",
        icon: Headphones,
    },
];

const candidates = [
    {
        name: "Aarav Sharma",
        role: "Full Stack Developer",
        skills: ["React", "Node.js", "TypeScript"],
        match: "98%",
        initials: "AS",
        color: "bg-emerald-100 text-emerald-800",
    },
    {
        name: "Priya Mehta",
        role: "Frontend Developer",
        skills: ["Next.js", "Tailwind", "JavaScript"],
        match: "95%",
        initials: "PM",
        color: "bg-rose-100 text-rose-700",
    },
    {
        name: "Rohit Verma",
        role: "Backend Developer",
        skills: ["Node.js", "Express", "MongoDB"],
        match: "91%",
        initials: "RV",
        color: "bg-amber-100 text-amber-800",
    },
];

function CandidateCard() {
    return (
        <div className="w-full rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur-md sm:p-5">
            <h3 className="mb-3 text-sm font-bold text-slate-800">
                Recommended Candidates
            </h3>

            <div className="divide-y divide-slate-100">
                {candidates.map((candidate) => (
                    <div key={candidate.name} className="flex gap-3 py-3 first:pt-1 last:pb-1">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${candidate.color}`}
                        >
                            {candidate.initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-bold text-slate-800">
                                    {candidate.name}
                                </p>
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                    {candidate.match} match
                                </span>
                            </div>

                            <p className="mt-1 text-[11px] text-slate-500">
                                {candidate.role}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {candidate.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-500"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HeroVisual() {
    return (
        <div className="relative mx-auto w-full max-w-[610px] pb-8 pt-10 lg:pt-0">
            {/* Decorative background */}
            <div className="absolute left-[12%] top-[5%] h-64 w-64 rounded-full bg-emerald-100/80 blur-[1px] sm:h-80 sm:w-80" />
            <div className="absolute bottom-[8%] right-[3%] h-40 w-40 rounded-full bg-amber-100/60 blur-2xl" />

            {/* Main hero photograph */}
            <div className="relative mx-auto h-[350px] w-full max-w-[490px] overflow-hidden rounded-[42%_42%_12%_12%] bg-gradient-to-br from-emerald-100 to-stone-100 sm:h-[430px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/images/employer-hero.jpg"
                        alt="Professional working on a laptop in a modern office"
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                {/* Image overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/30 to-transparent" />
            </div>

            {/* Floating qualified candidates card */}
            <div className="absolute left-0 top-4 z-10 w-[215px] rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg shadow-emerald-950/10 sm:left-2 sm:top-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
                        <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-slate-500">
                            Qualified Candidates
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-slate-800">
                                128
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600">
                                ↗ 42%
                            </span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                            Matching your job requirements
                        </p>
                    </div>
                </div>
            </div>

            {/* Candidate recommendations */}
            <div className="absolute right-0 top-[125px] z-10 w-[min(310px,78%)] sm:right-[-3px] sm:top-[65px] sm:w-[300px]">
                <CandidateCard />
            </div>

            {/* Handwritten-style tagline */}
            <div className="absolute bottom-2 left-1 z-10 -rotate-6 sm:bottom-1 sm:left-0">
                <p className="text-sm font-bold italic leading-5 text-slate-800">
                    Better people.
                    <br />
                    Stronger teams.
                </p>
                <div className="mt-2 h-1 w-12 -rotate-12 rounded-full bg-emerald-700" />
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen bg-white font-sans text-slate-800">
            {/* Hero section */}
            <section className="overflow-hidden bg-gradient-to-br from-[#f0faf6] via-[#f7fcfa] to-[#edf8f4]">
                <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10 lg:py-12">
                    {/* Left content */}
                    <div className="relative z-20">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                            <Sparkles size={13} />
                            For Employers
                        </span>

                        <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-[#173047] sm:text-5xl lg:text-[48px]">
                            Find the Right Talent,
                            <span className="block text-emerald-700">Faster.</span>
                        </h1>

                        <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                            Post your jobs, get matched with pre-screened candidates based
                            on skills, experience and career goals. Build your team with
                            less effort and better results.
                        </p>

                        <div className="mt-6 grid max-w-xl grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-2.5">
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
                                        <Check size={11} strokeWidth={3} />
                                    </span>
                                    <span className="text-xs leading-5 text-slate-600 sm:text-[13px]">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/employer/post-jobs"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-800/15 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                            >
                                Post a Job Now
                                <ArrowRight size={17} />
                            </a>

                            <a
                                href="#how-it-works"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-emerald-700/20 bg-white/50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                            >
                                <CirclePlay size={18} />
                                Watch How It Works
                            </a>
                        </div>
                    </div>

                    {/* Right visual */}
                    <HeroVisual />
                </div>
            </section>

            {/* Benefits section */}
            <section id="how-it-works" className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-9 max-w-2xl text-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#173047] sm:text-3xl">
                            Why Employers Choose{" "}
                            <span className="text-emerald-700">SkillMatch</span>
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Everything you need to hire the best, without the hassle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-900/5"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4f6ef] text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                                        <Icon size={25} strokeWidth={2} />
                                    </div>

                                    <h3 className="mt-4 text-sm font-bold text-[#173047]">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-xs leading-[1.65] text-slate-500 sm:text-[13px]">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <HowItWorks />
        </main>
    );
}