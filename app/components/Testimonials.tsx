"use client";

import Image from "next/image";
import { ArrowRight, Quote, Rocket } from "lucide-react";

const testimonials = [
  {
    quote:
      "SkillMatch helped me find a job that perfectly matches my React and Node.js skills. The recommendations were spot on!",
    name: "Ritika Singh",
    role: "Frontend Developer",
    image: "/images/testimonials/ritika.jpg",
  },
  {
    quote:
      "As an employer, I found highly skilled candidates within days. The skill-based matching is a game changer!",
    name: "Amit Kumar",
    role: "Hiring Manager",
    image: "/images/testimonials/amit.jpg",
  },
  {
    quote:
      "The platform is easy to use and the personalized suggestions really helped me grow my career.",
    name: "Neha Kapoor",
    role: "Full Stack Developer",
    image: "/images/testimonials/neha.jpg",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-[15px] leading-none text-[#F5B51B]"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-white px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#31B79D]">
              Success Stories
            </p>

            <h2 className="text-[27px] font-bold leading-tight tracking-[-0.03em] text-[#172B3A] sm:text-[30px]">
              What Our Users Say
            </h2>

            <p className="mt-2 text-[13px] text-[#78909C]">
              Real people. Real stories. Better careers.
            </p>
          </div>

          <button className="mb-1 hidden items-center gap-1.5 text-[11px] font-semibold text-[#087D65] transition hover:text-[#055B4B] sm:flex">
            View all categories
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile link */}
        <button className="mb-6 flex items-center gap-1.5 text-[11px] font-semibold text-[#087D65] sm:hidden">
          View all categories
          <ArrowRight size={13} />
        </button>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group relative min-h-[164px] rounded-[9px] border border-[#E8EEF0] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(25,55,70,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(25,55,70,0.10)]"
            >
              {/* Quote */}
              <Quote
                size={22}
                strokeWidth={3}
                className="mb-2 fill-[#39C4AD] text-[#39C4AD]"
              />

              <p className="max-w-[310px] text-[11px] leading-[1.65] text-[#536B76]">
                "{testimonial.quote}"
              </p>

              {/* User */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-[34px] w-[34px] overflow-hidden rounded-full border border-white shadow-sm">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold leading-tight text-[#253746]">
                      {testimonial.name}
                    </h3>

                    <p className="mt-[3px] text-[9px] text-[#82939B]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <Stars />
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="relative mt-7 overflow-hidden rounded-[9px] bg-[#EDF9F6] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Rocket */}
              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#E1F5F0]">
                <Rocket
                  size={28}
                  strokeWidth={1.8}
                  className="rotate-[-12deg] text-[#168C76]"
                />
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-[#1C3745] sm:text-[15px]">
                  Ready to find your next opportunity?
                </h3>

                <p className="mt-1 max-w-[450px] text-[10px] leading-[1.6] text-[#6C858D] sm:text-[11px]">
                  Join thousands of professionals who are building their dream
                  careers with SkillMatch.
                </p>
              </div>
            </div>

            {/* Button */}
            <button className="flex h-[34px] shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#08795F] px-5 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#06634F] sm:px-6">
              Create Free Account
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}