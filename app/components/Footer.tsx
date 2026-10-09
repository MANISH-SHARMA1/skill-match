"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Zap,
} from "lucide-react";
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
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-9 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-14">
          
          {/* Brand */}
          <div className="max-w-[310px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              {/* Logo */}
              <div className="relative flex h-7 w-7 items-center justify-center">
                <Zap
                  size={27}
                  strokeWidth={2.5}
                  className="fill-[#24D39B] text-[#24D39B]"
                />
              </div>

              <div className="-ml-1">
                <div className="text-[17px] font-bold leading-none tracking-[-0.04em]">
                  Skill<span className="text-[#E7EFF0]">Match</span>
                </div>

                <p className="mt-[3px] text-[6px] font-medium tracking-[0.03em] text-[#789095]">
                  Skills. Jobs. Better Matches.
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-[285px] text-[10px] leading-[1.75] text-[#B1C0C2]">
              We connect talented professionals with great opportunities
              through AI-powered skill matching and personalized
              recommendations.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-[#D0DADC] transition hover:text-[#28D49C]"
              >
                <FaLinkedinIn size={14} strokeWidth={2.2} />
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="text-[#D0DADC] transition hover:text-[#28D49C]"
              >
                <FaXTwitter size={13} strokeWidth={2.2} />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="text-[#D0DADC] transition hover:text-[#28D49C]"
              >
                <FaInstagram size={14} strokeWidth={2.2} />
              </Link>

              <Link
                href="#"
                aria-label="YouTube"
                className="text-[#D0DADC] transition hover:text-[#28D49C]"
              >
                <FaYoutube size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          {/* For Job Seekers */}
          <FooterColumn
            title="For Job Seekers"
            links={footerLinks.seekers}
          />

          {/* For Employers */}
          <FooterColumn
            title="For Employers"
            links={footerLinks.employers}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={footerLinks.company}
          />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#294044]" />

        {/* Bottom Footer */}
        <div className="flex min-h-[58px] flex-col justify-center gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <p className="text-[9px] text-[#A7B7BA]">
            © 2025 SkillMatch. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-[9px] text-[#A7B7BA] transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[9px] text-[#A7B7BA] transition hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------
   Footer Column
------------------------------------------- */

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
      <h3 className="mb-4 text-[10px] font-semibold text-[#E6EEEF]">
        {title}
      </h3>

      <ul className="space-y-[9px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-[9px] text-[#A9B9BB] transition hover:text-white"
            >
              {link.label}

              <ArrowUpRight
                size={8}
                className="ml-1 opacity-0 transition group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}