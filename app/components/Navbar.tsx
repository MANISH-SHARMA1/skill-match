import { Search } from 'lucide-react'
import Link from 'next/link'

function Navbar() {
    return (
        <nav className="border-b border-slate-100 bg-white">
            <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="relative flex h-9 w-8 items-center justify-center">
                        <div className="absolute h-8 w-5 -skew-x-[18deg] rounded-[5px] bg-[#07945d]" />
                        <div className="absolute left-[12px] top-[3px] h-6 w-[5px] rotate-[24deg] rounded-full bg-white" />
                    </div>

                    <div>
                        <div className="text-[18px] font-bold tracking-[-0.5px] text-[#17333a]">
                            Skill<span className="text-[#07945d]">Match</span>
                        </div>

                        <p className="-mt-0.5 text-[8px] font-medium tracking-wide text-slate-400">
                            Skills. Jobs. Better Matches.
                        </p>
                    </div>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-9 md:flex">
                    <a
                        href="#"
                        className="relative py-7 text-[13px] font-semibold text-[#078b5a]"
                    >
                        Home
                        <span className="absolute bottom-0 left-0 right-0 mx-auto h-[2px] w-5 rounded-full bg-[#078b5a]" />
                    </a>

                    <a
                        href="/jobs"
                        className="text-[13px] font-medium text-slate-500 transition hover:text-[#078b5a]"
                    >
                        Jobs
                    </a>

                    <a
                        href="#candidates"
                        className="text-[13px] font-medium text-slate-500 transition hover:text-[#078b5a]"
                    >
                        Candidates
                    </a>

                    <a
                        href="/employers"
                        className="text-[13px] font-medium text-slate-500 transition hover:text-[#078b5a]"
                    >
                        For Employers
                    </a>

                    <a
                        href="#seekers"
                        className="text-[13px] font-medium text-slate-500 transition hover:text-[#078b5a]"
                    >
                        For Job Seekers
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 transition hover:border-[#07945d] hover:text-[#07945d] sm:flex">
                        <Search size={14} />
                        Login
                    </Link>

                    <Link
                        href="/signup"
                        className="flex items-center h-9 rounded-lg bg-[#078c59] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#067b4e]"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar