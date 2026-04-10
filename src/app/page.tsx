"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";

/* ------------------------------------------------------------------ */
/*  SCROLL-ANIMATION OBSERVER                                         */
/* ------------------------------------------------------------------ */
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/*  COUNTER ANIMATION                                                  */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1800;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ICONS (inline SVG)                                                 */
/* ------------------------------------------------------------------ */
function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function HomeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TrophyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function QuoteIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity={0.2}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LEAD FORM COMPONENT                                                */
/* ------------------------------------------------------------------ */
function LeadForm({ variant = "hero" }: { variant?: "hero" | "bottom" }) {
  const { status, errorMessage, submitLead, reset } = useMegaLeadForm({
    siteId: "801d6c22-681d-4880-ae6b-7ed377eb7cf0",
    customerId: "f1e8bf02-6761-48b1-a810-8264822affc5",
    siteKey: "sk_k8g0bijw_4adq0gds87c",
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const data: Record<string, string> = {};
      fd.forEach((val, key) => {
        data[key] = val.toString();
      });
      submitLead(data);
    },
    [submitLead]
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl border border-success/20">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-display text-2xl font-bold text-secondary mb-2">
          We Got Your Message!
        </h3>
        <p className="text-text-muted">
          A JSA buyer specialist will reach out shortly about private and off-market home opportunities.
        </p>
        <button
          onClick={reset}
          className="mt-4 text-sm text-primary underline hover:no-underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isHero ? "" : ""}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`name-${variant}`} className="sr-only">Full Name</label>
          <input
            id={`name-${variant}`}
            name="name"
            type="text"
            required
            placeholder="Full Name *"
            className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-text-primary placeholder:text-text-light transition-all duration-200 hover:border-primary/40 focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor={`phone-${variant}`} className="sr-only">Phone Number</label>
          <input
            id={`phone-${variant}`}
            name="phone"
            type="tel"
            required
            placeholder="Phone Number *"
            className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-text-primary placeholder:text-text-light transition-all duration-200 hover:border-primary/40 focus:border-primary"
          />
        </div>
      </div>
      <div>
        <label htmlFor={`email-${variant}`} className="sr-only">Email Address</label>
        <input
          id={`email-${variant}`}
          name="email"
          type="email"
          required
          placeholder="Email Address *"
          className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-text-primary placeholder:text-text-light transition-all duration-200 hover:border-primary/40 focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor={`address-${variant}`} className="sr-only">Property Address</label>
        <input
          id={`address-${variant}`}
          name="targetArea"
          type="text"
          placeholder="Target City or Neighborhood (optional)"
          className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-text-primary placeholder:text-text-light transition-all duration-200 hover:border-primary/40 focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor={`message-${variant}`} className="sr-only">What are you looking for?</label>
        <textarea
          id={`message-${variant}`}
          name="buyerCriteria"
          rows={3}
          placeholder="What are you looking for? (optional)"
          className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-text-primary placeholder:text-text-light transition-all duration-200 hover:border-primary/40 focus:border-primary resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed font-display tracking-wide"
      >
        {status === "submitting" ? "Sending..." : "Get Your Free Consultation"}
      </button>
      <p className="text-center text-xs text-text-light">
        No obligation. A team member will reach out within 24 hours.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  useScrollAnimations();

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Ferndale, MI",
      text: "Jim and his team made buying our first home an incredible experience. They guided us through every step and found us the perfect place in Ferndale. Could not recommend them enough!",
      rating: 5,
    },
    {
      name: "David & Lisa K.",
      location: "Royal Oak, MI",
      text: "Sold our home in Royal Oak in just 5 days, above asking price. The marketing they did was incredible. The whole process was stress-free and professional from start to finish.",
      rating: 5,
    },
    {
      name: "Marcus T.",
      location: "Oakland County, MI",
      text: "As a first-time buyer, I had so many questions. My agent on the JSA team was patient, knowledgeable, and helped me navigate the whole process. Found my dream home within budget!",
      rating: 5,
    },
  ];

  return (
    <main>
      {/* ====================== STICKY NAV ====================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-18">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.squarespace-cdn.com/content/v1/63f4a27209daad6cc72c6739/5fe5f8c2-4ff2-40b2-a505-ebfb2b3deac6/JSA-FINAL-LOGO.png?format=300w"
              alt="Jim Shaffer & Associates"
              className="h-10 sm:h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="tel:2482193782"
              className="flex items-center gap-2 rounded-full bg-primary px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5"
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="hidden sm:inline">(248) 219-3782</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ====================== HERO ====================== */}
      <section id="hero" className="relative pt-20 sm:pt-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary-dark to-secondary" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Copy */}
            <div className="text-white space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-warm-peach-light backdrop-blur-sm">
                <TrophyIcon className="w-4 h-4" />
                <span>#1 Real Estate Team in Oakland County</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Unlock Off-Market Homes
                <span className="block text-primary mt-1">in Metro Detroit</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                Get access to homes before they hit the public market. Jim Shaffer & Associates helps serious buyers find private, coming-soon, and off-market opportunities across Oakland, Macomb, and Wayne Counties.
              </p>

              {/* Trust Bar */}
              <div className="flex flex-wrap gap-6 sm:gap-8 pt-2">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-display text-accent">
                    <AnimatedCounter end={850} suffix="+" />
                  </div>
                  <div className="text-sm text-white/60 mt-1">Annual Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-display text-accent">
                    <AnimatedCounter end={2} prefix="$" suffix="B+" />
                  </div>
                  <div className="text-sm text-white/60 mt-1">Career Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-display text-accent">
                    <AnimatedCounter end={2700} suffix="+" />
                  </div>
                  <div className="text-sm text-white/60 mt-1">5-Star Reviews</div>
                </div>
              </div>

              {/* Google Reviews badge */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-accent" />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  Rated 5.0 on Google (2,700+ reviews)
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative">
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-white/10">
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-secondary">
                    Request Private Home Access
                  </h2>
                  <p className="text-text-muted mt-1.5 text-sm">
                    Tell us your buy box. A local specialist will follow up with next steps.
                  </p>
                </div>
                <LeadForm variant="hero" />
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V0c240 40 480 60 720 60s480-20 720-60v60H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ====================== WHY JSA ====================== */}
      <section id="why-jsa" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 animate-on-scroll">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
              Results That Speak for Themselves
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              Since 1999, we&apos;ve helped thousands of families across Oakland, Macomb, and Wayne Counties achieve their real estate goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <TrophyIcon className="w-7 h-7" />,
                title: "#1 in Oakland County",
                desc: "Ranked the top real estate team in Oakland County by transaction volume and sales.",
              },
              {
                icon: <UsersIcon className="w-7 h-7" />,
                title: "51-Agent Team",
                desc: "Specialized agents for buyers, sellers, investors, and commercial real estate.",
              },
              {
                icon: <HomeIcon className="w-7 h-7" />,
                title: "850+ Annual Sales",
                desc: "Closing over 850 transactions each year with a proven, stress-free process.",
              },
              {
                icon: <ShieldIcon className="w-7 h-7" />,
                title: "25+ Years Trusted",
                desc: "Serving Metro Detroit since 1999. Recognized by RealTrends and Hour Detroit.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`animate-on-scroll animate-delay-${(i + 1) * 100} group relative rounded-2xl bg-bg-light p-6 sm:p-8 border border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-secondary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== HOW IT WORKS ====================== */}
      <section id="process" className="py-16 sm:py-20 lg:py-24 bg-bg-cream relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 animate-on-scroll">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              How Private Home Access Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
              Three Steps to Hidden Inventory
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Schedule a Call",
                desc: "Fill out the form or give us a call. We'll connect you with a specialized agent who knows your target neighborhoods inside and out.",
              },
              {
                step: "02",
                title: "Make a Plan",
                desc: "Your agent handles the details so you don't have to. We walk you through every step of buying or selling, from financing to closing.",
              },
              {
                step: "03",
                title: "Celebrate!",
                desc: "Whether you bought your first home or sold for top dollar, we'll be there to celebrate this milestone with you.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`animate-on-scroll animate-delay-${(i + 1) * 100} relative text-center`}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg border-2 border-primary/20">
                  <span className="font-display text-3xl font-bold text-primary">
                    {item.step}
                  </span>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-6rem)] border-t-2 border-dashed border-primary/20" />
                )}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-secondary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-muted leading-relaxed max-w-sm mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SERVICES ====================== */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 animate-on-scroll">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Our Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
              Buying or Selling, We&apos;ve Got You Covered
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* Buying */}
            <div className="animate-on-scroll animate-left group relative rounded-2xl overflow-hidden bg-secondary p-8 sm:p-10 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-6">
                  <HomeIcon className="w-7 h-7 text-warm-peach" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                  Buying a Home
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    "Expert guidance through the entire buying process",
                    "Access to off-market listings and new inventory",
                    "Mortgage assistance with preferred lender connections",
                    "Skilled negotiation to get you the best deal",
                    "Offer positioning across 74+ Metro Detroit areas",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-white/85 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#hero"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:-translate-y-0.5"
                >
                  Find Your Home
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Selling */}
            <div className="animate-on-scroll animate-right group relative rounded-2xl overflow-hidden bg-gradient-to-br from-bg-light to-warm-peach-light p-8 sm:p-10">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <TrophyIcon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-secondary mb-4">
                  Selling Your Home
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    "#1 home selling team in Southeast Michigan",
                    "Professional photography and marketing strategy",
                    "Extensive buyer network from 850+ annual transactions",
                    "Free home valuation to price your property right",
                    "Proven system for faster sales at top dollar",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#hero"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary-dark hover:-translate-y-0.5"
                >
                  Get a Free Valuation
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 animate-on-scroll">
            <span className="inline-block text-warm-peach font-semibold text-sm tracking-widest uppercase mb-3">
              Client Reviews
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Thousands of Happy Homeowners
            </h2>
            <p className="mt-4 text-lg text-white/60">
              With 2,700+ Google reviews and a perfect 5-star rating, our clients&apos; success speaks for itself.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`animate-on-scroll animate-delay-${(i + 1) * 100} rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:bg-white/10`}
              >
                <QuoteIcon className="w-10 h-10 text-primary mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <StarIcon key={j} className="w-5 h-5 text-accent" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-white/50 text-sm flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Google review badge */}
          <div className="mt-10 text-center animate-on-scroll">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 px-6 py-3 backdrop-blur-sm">
              <div className="flex -space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-accent" />
                ))}
              </div>
              <span className="text-white/80 text-sm">
                5.0 Rating from 2,700+ Google Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== SERVICE AREAS ====================== */}
      <section id="areas" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              Service Areas
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
              Proudly Serving Metro Detroit
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              From Oakland to Wayne and Macomb Counties, our team knows every neighborhood.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 animate-on-scroll">
            {[
              "Ferndale",
              "Royal Oak",
              "Oak Park",
              "Hazel Park",
              "Berkley",
              "Pleasant Ridge",
              "Madison Heights",
              "Huntington Woods",
              "Troy",
              "Birmingham",
              "Southfield",
              "Clawson",
              "Lathrup Village",
              "St. Clair Shores",
              "Warren",
              "Grosse Pointe",
              "Livonia",
              "Macomb Twp.",
              "Sterling Heights",
              "Farmington Hills",
            ].map((area, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-bg-light border border-border/50 px-4 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
              >
                <MapPinIcon className="w-4 h-4 text-primary flex-shrink-0" />
                {area}
              </div>
            ))}
          </div>

          <p className="text-center text-text-light text-sm mt-6 animate-on-scroll">
            ...and all surrounding communities in Oakland, Macomb, and Wayne Counties.
          </p>
        </div>
      </section>

      {/* ====================== BOTTOM CTA ====================== */}
      <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-bg-cream relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-on-scroll animate-left">
              <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
                Ready to Move?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                Let&apos;s Make Your Real Estate Goals a Reality
              </h2>
              <p className="mt-4 text-lg text-text-muted leading-relaxed">
                Whether you&apos;re buying, selling, or just exploring your options, our team is ready to guide you every step of the way. Fill out the form or call us directly.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="tel:2482193782"
                  className="flex items-center gap-4 rounded-xl bg-white p-4 border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/30 group"
                >
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">(248) 219-3782</p>
                    <p className="text-sm text-text-muted">Call us for immediate assistance</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-xl bg-white p-4 border border-border shadow-sm">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">Metro Detroit, Michigan</p>
                    <p className="text-sm text-text-muted">Oakland, Macomb & Wayne Counties</p>
                  </div>
                </div>
              </div>

              {/* Awards */}
              <div className="mt-8 flex flex-wrap gap-4">
                {["RealTrends America's Best", "Hour Detroit All Stars", "Detroit Free Press Top Workplaces"].map(
                  (award, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary/5 border border-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary"
                    >
                      <TrophyIcon className="w-3.5 h-3.5" />
                      {award}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="animate-on-scroll animate-right">
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-border/50">
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl font-bold text-secondary">
                    Get Your Free Consultation
                  </h3>
                  <p className="text-text-muted mt-1.5 text-sm">
                    No pressure. Just expert real estate guidance.
                  </p>
                </div>
                <LeadForm variant="bottom" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-secondary-dark text-white/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.squarespace-cdn.com/content/v1/63f4a27209daad6cc72c6739/5fe5f8c2-4ff2-40b2-a505-ebfb2b3deac6/JSA-FINAL-LOGO.png?format=200w"
                alt="Jim Shaffer & Associates"
                className="h-8 w-auto brightness-0 invert opacity-60"
              />
            </div>
            <p className="text-sm text-center">
              Jim Shaffer and Associates, powered by Good Company. Serving Metro Detroit since 1999.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
