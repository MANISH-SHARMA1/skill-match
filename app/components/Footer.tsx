"use client";

import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";

const footerLinks = {
  seekers: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Career Resources", href: "/resources" },
    { label: "Skill Guides", href: "/skill-guides" },
    { label: "Help & Support", href: "/support" },
  ],
  employers: [
    { label: "Post a Job", href: "/employers/post-job" },
    { label: "Find Talent", href: "/employers/talent" },
    { label: "Pricing", href: "/pricing" },
    { label: "Employer Resources", href: "/employers/resources" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#10282C] text-white">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-14 lg:py-14">

          {/* Brand */}
          <div className="max-w-[340px]">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Zap
                  size={34}
                  strokeWidth={2.5}
                  className="fill-[#24D39B] text-[#24D39B]"
                />
              </div>

              <div>
                <div className="text-2xl font-bold leading-tight tracking-tight">
                  Skill<span className="text-[#24D39B]">Match</span>
                </div>
                <p className="mt-1 text-xs font-medium tracking-wide text-[#9CB0B3]">
                  Skills. Jobs. Better Matches.
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-[320px] text-sm leading-7 text-[#B1C0C2]">
              We connect talented professionals with great opportunities
              through AI-powered skill matching and personalized
              recommendations.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="#" label="LinkedIn">
                <FaLinkedinIn size={18} />
              </SocialLink>

              <SocialLink href="#" label="X">
                <FaXTwitter size={18} />
              </SocialLink>

              <SocialLink href="#" label="Instagram">
                <FaInstagram size={18} />
              </SocialLink>

              <SocialLink href="#" label="YouTube">
                <FaYoutube size={19} />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="For Job Seekers" links={footerLinks.seekers} />
          <FooterColumn title="For Employers" links={footerLinks.employers} />
          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#294044]" />

        {/* Bottom Footer */}
        <div className="flex flex-col justify-center gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#A7B7BA] sm:text-sm">
            © {new Date().getFullYear()} SkillMatch. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/privacy-policy"
              className="text-xs text-[#B8C5C7] transition hover:text-[#24D39B] sm:text-sm"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-[#B8C5C7] transition hover:text-[#24D39B] sm:text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Social Link */
function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#365055] text-[#D0DADC] transition hover:border-[#24D39B] hover:bg-[#24D39B]/10 hover:text-[#24D39B]"
    >
      {children}
    </Link>
  );
}

/* Footer Column */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-base font-bold text-white sm:text-lg">
        {title}
      </h3>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-sm leading-6 text-[#B1C0C2] transition hover:text-[#24D39B]"
            >
              {link.label}
              <ArrowUpRight
                size={14}
                className="ml-1.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}