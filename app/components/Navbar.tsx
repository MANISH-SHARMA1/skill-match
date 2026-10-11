"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Zap } from "lucide-react";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "Candidates", href: "/candidates" },
    { label: "For Employers", href: "/employers" },
    { label: "For Job Seekers", href: "/job-seekers" },
];

function Navbar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2.5">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        <Zap
                            size={34}
                            strokeWidth={2.5}
                            className="fill-[#24D39B] text-[#24D39B]"
                        />
                    </div>

                    <div>
                        <div className="text-xl font-bold tracking-tight text-[#17333a]">
                            Skill<span className="text-[#07945d]">Match</span>
                        </div>
                        <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-500">
                            Skills. Jobs. Better Matches.
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 lg:flex xl:gap-8">
                    {navItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`relative flex h-20 items-center whitespace-nowrap text-sm font-semibold transition-colors duration-200 ${active
                                        ? "text-[#078b5a]"
                                        : "text-slate-600 hover:text-[#078b5a]"
                                    }`}
                            >
                                {item.label}

                                <span
                                    className={`absolute bottom-0 left-0 right-0 mx-auto h-[3px] rounded-t-full bg-[#078b5a] transition-all duration-200 ${active
                                            ? "w-full opacity-100"
                                            : "w-0 opacity-0"
                                        }`}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                    <Link
                        href="/login"
                        className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-[#07945d] hover:bg-emerald-50 hover:text-[#07945d] sm:flex"
                    >
                        <Search size={16} />
                        Login
                    </Link>

                    <Link
                        href="/signup"
                        className="flex h-10 items-center justify-center rounded-lg bg-[#078c59] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067b4e] hover:shadow-md"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;