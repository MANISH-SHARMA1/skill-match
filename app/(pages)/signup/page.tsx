
"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Target,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  MapPin,
  Eye,
  EyeOff,
  UploadCloud,
  BriefcaseBusiness,
  GraduationCap,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { axiosClient } from "@/utils/axiosClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRole] = useState<"jobSeeker" | "employer">("jobSeeker");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    setSubmitting(true);

    try {
      console.log(formData, role)

      const response = await axiosClient.post("/api/auth/register", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role
      });
      console.log(response.data.result)

      setMessage("Account created successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: ""
      })

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-[1.18fr_1fr]">
        {/* LEFT: Promotional panel */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#effaf5] via-[#f5fcf9] to-[#e6f6ee] px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-800">
              Join 50,000+ professionals & companies
            </span>

            <h1 className="mt-4 max-w-lg text-3xl font-extrabold leading-[1.12] tracking-tight text-[#17354a] sm:text-4xl">
              Build Your Future
              <br />
              With the Right
              <br />
              <span className="text-emerald-700">Opportunities.</span>
            </h1>

            <p className="mt-4 max-w-md text-xs leading-[1.8] text-slate-600 sm:text-sm">
              SkillMatch connects you with the best job opportunities based
              on your skills, experience and career goals — not just keywords.
            </p>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                {
                  icon: Target,
                  title: "AI-Powered Matching",
                  description: "Get job recommendations that truly fit your skills.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verified Employers",
                  description: "Work with trusted and genuine companies.",
                },
                {
                  icon: Zap,
                  title: "Faster Hiring",
                  description: "Less time searching, more time growing.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-3 text-[11px] font-bold text-slate-800 sm:text-xs">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[10px] leading-[1.6] text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Hero image and floating cards */}
            <div className="relative mx-auto mt-7 max-w-lg pb-2">
              <div className="absolute left-[10%] top-5 h-52 w-52 rounded-full bg-[#bce6d2]/70 sm:h-64 sm:w-64" />

              <div className="relative mx-auto h-61.25 w-full overflow-hidden rounded-2xl sm:h-75">
                <img
                  src="/images/signup-hero.jpg"
                  alt="Professional using a laptop in a bright workspace"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950/20 via-transparent to-transparent" />
              </div>

              {/* Recommended job card */}
              <div className="absolute left-0 top-3 z-10 w-36.25 rounded-xl border border-white bg-white/95 p-3 shadow-lg sm:left-1 sm:w-41.25">
                <p className="text-[8px] font-semibold text-emerald-700">
                  Recommended for You
                </p>
                <div className="mt-2 flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <BriefcaseBusiness size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold">Frontend Developer</p>
                    <p className="text-[8px] text-slate-500">
                      NextTech Solutions
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-slate-100 px-1.5 py-1 text-[7px]">
                    React
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-1 text-[7px]">
                    Next.js
                  </span>
                </div>
                <span className="mt-2 inline-flex rounded bg-emerald-700 px-2 py-1 text-[8px] font-semibold text-white">
                  Apply Now
                </span>
              </div>

              {/* Skills card */}
              <div className="absolute bottom-5 right-0 z-10 w-28 rounded-xl border border-white bg-white/95 p-3 shadow-lg sm:right-1 sm:w-32.5">
                <p className="text-[9px] font-bold">Your Skills</p>
                {["React", "Node.js", "Tailwind CSS", "TypeScript"].map(
                  (skill) => (
                    <p
                      key={skill}
                      className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-600"
                    >
                      <Check size={10} className="text-emerald-600" />
                      {skill}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Signup form */}
        <section className="flex items-center justify-center bg-white px-5 py-8 sm:px-10 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Account type selector */}
            <div className="grid grid-cols-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setRole("jobSeeker")}
                className={`flex items-center justify-center gap-2 border-b-2 py-3 text-xs font-semibold transition ${role === "jobSeeker"
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
              >
                <UserRound size={15} />
                Job Seeker
              </button>

              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex items-center justify-center gap-2 border-b-2 py-3 text-xs font-semibold transition ${role === "employer"
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
              >
                <Users size={15} />
                Employer
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#17354a]">
                Create Your Account
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Join SkillMatch and take the next step in your career.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9+\-\s()]{7,20}"
                    placeholder="+91 98765 43210"
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-10 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="mt-1 text-[9px] text-slate-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Status message */}
              {message && (
                <p
                  role="status"
                  className={`rounded-lg px-3 py-2 text-xs ${message.includes("successfully")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                    }`}
                >
                  {message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating account..."
                  : role === "jobSeeker"
                    ? "Create Account"
                    : "Create Employer Account"}
                {!submitting && <ArrowRight size={15} />}
              </button>

              <p className="text-center text-[10px] leading-5 text-slate-400">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="font-semibold text-emerald-700 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="font-semibold text-emerald-700 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Social signup */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/google";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="font-bold text-sm text-blue-500">G</span>
                Google
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/linkedin";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="font-bold text-sm text-sky-700">in</span>
                LinkedIn
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/github";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="font-bold text-sm text-slate-800">⌘</span>
                GitHub
              </button>
            </div>

            <p className="mt-5 text-center text-[10px] text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}