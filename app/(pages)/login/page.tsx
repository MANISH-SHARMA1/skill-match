
"use client";

import { useState } from "react";
import {
  ArrowRight,
  UserRound,
  Users,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Target,
  Zap,
  Check,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/utils/axiosClient";
import { useAuth } from "@/context/AuthContext";

interface FormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or mobile number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const response = await axiosClient.post("/api/auth/login", {
        identifier: formData.identifier.trim().toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
      // console.log(response.data.result)
      login(response.data.result.accessToken)

      setFormData({
        identifier: "",
        password: "",
        rememberMe: false,
      });

      if (response.data.result.role === "jobSeeker") {
        router.push("/profile")
      } else if (response.data.result.role === "employer") {
        router.push("/employer/company-profile")
      }
    } catch { }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-[1.18fr_1fr]">
        {/* LEFT PROMOTIONAL PANEL */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#effaf5] via-[#f5fcf9] to-[#e6f6ee] px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-800">
              <Sparkles size={12} />
              Your next opportunity awaits
            </span>

            <h1 className="mt-4 max-w-lg text-3xl font-extrabold leading-[1.12] tracking-tight text-[#17354a] sm:text-4xl">
              Welcome Back!
              <br />
              Your Future Starts
              <br />
              <span className="text-emerald-700">Right Here.</span>
            </h1>

            <p className="mt-4 max-w-md text-xs leading-[1.8] text-slate-600 sm:text-sm">
              Sign in to discover relevant jobs, connect with trusted
              employers, and take the next step in your professional journey.
            </p>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                {
                  icon: Target,
                  title: "Smart Matching",
                  description: "Opportunities tailored to your skills.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trusted Platform",
                  description: "Connect with verified employers.",
                },
                {
                  icon: Zap,
                  title: "Career Growth",
                  description: "Move closer to your goals.",
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

            {/* Hero visual */}
            <div className="relative mx-auto mt-7 max-w-lg pb-2">
              <div className="absolute left-[10%] top-5 h-52 w-52 rounded-full bg-[#bce6d2]/70 sm:h-64 sm:w-64" />

              <div className="relative mx-auto h-61.25 w-full overflow-hidden rounded-2xl bg-emerald-50 sm:h-75">
                <img
                  src="/images/signup-hero.jpg"
                  alt="Professional working on a laptop"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950/20 via-transparent to-transparent" />
              </div>

              {/* Floating profile card */}
              <div className="absolute left-0 top-3 z-10 w-37.5 rounded-xl border border-white bg-white/95 p-3 shadow-lg sm:left-1 sm:w-42.5">
                <p className="text-[8px] font-semibold text-emerald-700">
                  YOUR CAREER PROFILE
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <UserRound size={17} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800">
                      Your Profile
                    </p>
                    <p className="text-[8px] text-slate-500">
                      Ready for new roles
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[85%] rounded-full bg-emerald-600" />
                </div>
                <p className="mt-1 text-right text-[8px] text-emerald-700">
                  Profile strength 85%
                </p>
              </div>

              {/* Skills card */}
              <div className="absolute bottom-5 right-0 z-10 w-30 rounded-xl border border-white bg-white/95 p-3 shadow-lg sm:right-1 sm:w-33.75">
                <p className="text-[9px] font-bold text-slate-800">
                  Your Skills
                </p>
                {["React", "Node.js", "Next.js", "TypeScript"].map(
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

        {/* RIGHT LOGIN FORM */}
        <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Role selector */}
            <div className="grid grid-cols-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setRole("seeker")}
                className={`flex items-center justify-center gap-2 border-b-2 py-3 text-xs font-semibold transition ${role === "seeker"
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

            <div className="mt-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#17354a]">
                Welcome Back
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {role === "seeker"
                  ? "Log in to find your next opportunity and manage your career."
                  : "Log in to manage your jobs and find the right talent."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold text-slate-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    name="identifier"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-semibold text-slate-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>

                  <a
                    href="/forgot-password"
                    className="text-[10px] font-semibold text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-10 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 accent-emerald-700"
                  />
                  Remember me
                </label>

                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Secure login
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign In"}
                {!submitting && <ArrowRight size={15} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] text-slate-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Social login */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/google";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="text-sm font-bold text-blue-500">G</span>
                Google
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/linkedin";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="text-sm font-bold text-sky-700">in</span>
                LinkedIn
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/github";
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <span className="text-sm font-bold text-slate-800">⌘</span>
                GitHub
              </button>
            </div>

            {/* Signup link */}
            <p className="mt-8 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-bold text-emerald-700 hover:underline"
              >
                Create an account
              </a>
            </p>

            <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
              By continuing, you agree to our{" "}
              <a
                href="/terms"
                className="font-semibold text-emerald-700 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-emerald-700 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}