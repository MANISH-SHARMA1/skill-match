
export type JobStatus = "Draft" | "Active" | "Paused" | "Closed";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  workplace: "On-site" | "Remote" | "Hybrid";
  employmentType: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "Yearly" | "Monthly";
  openings: number;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  benefits: string[];
  status: JobStatus;
  applicants: number;
  createdAt: string;
};

const STORAGE_KEY = "skillmatch-employer-jobs";

export function getJobs(): Job[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Job[] : [];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event("skillmatch-jobs-updated"));
}

export function saveJob(job: Job) {
  const jobs = getJobs();
  const index = jobs.findIndex((item) => item.id === job.id);

  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.unshift(job);
  }

  saveJobs(jobs);
}

export function deleteJob(id: string) {
  saveJobs(getJobs().filter((job) => job.id !== id));
}

export function formatSalary(job: Job) {
  const format = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 1,
      notation: amount >= 100000 ? "compact" : "standard",
    }).format(amount);

  return `₹${format(job.salaryMin)} – ₹${format(job.salaryMax)} ${
    job.salaryPeriod === "Yearly" ? "/ year" : "/ month"
  }`;
}