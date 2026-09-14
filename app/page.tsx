"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// NOTE: keep in sync with the <section id="…"> elements in <main>.
// The "Skills" entry is intentionally absent while that section is commented out.
const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

type IconProps = { className?: string };

function GitHubIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  );
}

function MailIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  // Sticky bar on mobile; visually hidden (but still announced) from lg up.
  // Full-bleed via calc() rather than w-screen, which is 100vw and overflows
  // horizontally when a classic scrollbar is present.
  return (
    <div className="sticky top-0 z-20 -mx-6 mb-4 w-[calc(100%+3rem)] bg-[#0c3d52]/90 px-6 py-5 backdrop-blur md:-mx-12 md:w-[calc(100%+6rem)] md:px-12 lg:sr-only">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{children}</h2>
    </div>
  );
}

interface CardProps {
  /** Omit for cards without a timeline column — the body then spans the full grid. */
  date?: string;
  title: string;
  /** Rendered after the title, separated by a middot (e.g. the employer or school). */
  subtitle?: string;
  url: string;
  description?: string;
  skills?: string[];
  children?: React.ReactNode;
}

function Card({ date, title, subtitle, url, description, skills, children }: CardProps) {
  return (
    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:opacity-100! lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-xl transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
      {date && (
        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:col-span-2 sm:text-right">
          {date}
        </header>
      )}
      <div className={`z-10 ${date ? "sm:col-span-6" : "sm:col-span-8"}`}>
        <h3 className="font-medium leading-snug">
          <a href={url} target="_blank" rel="noreferrer noopener"
            className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-blue-200 focus-visible:text-blue-200 transition-colors duration-200">
            {subtitle ? `${title} · ${subtitle}` : title}
            <span className="ml-1 inline-block translate-y-px text-xs">↗</span>
          </a>
        </h3>
        {description && <p className="mt-2 text-sm leading-normal text-slate-400">{description}</p>}
        {children}
        {skills && skills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill}>
                <span className="flex items-center rounded-full bg-blue-300/10 px-3 py-1 text-xs font-medium leading-5 text-blue-200">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Thesis({ title, url }: { title: string; url?: string }) {
  return (
    <p className="mt-2 text-sm leading-normal text-slate-400">
      <span className="text-slate-300">Thesis: </span>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer noopener"
          className="italic hover:text-blue-200 transition-colors duration-200">
          {title}
        </a>
      ) : (
        <span className="italic">{title}</span>
      )}
    </p>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Track every intersecting section, then pick the topmost one. The observer
    // callback only reports sections whose visibility *changed*, so relying on
    // the last entry alone highlights the wrong link when two sections overlap.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const topmost = sections.find((el) => visible.has(el.id));
        if (topmost) setActiveSection(topmost.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#0c3d52] text-slate-400 leading-relaxed antialiased selection:bg-blue-200 selection:text-slate-900">
      <a href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-lg focus:bg-slate-800 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-200 focus:ring-1 focus:ring-slate-700/50">
        Skip to content
      </a>

      {/* Subtle top radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        aria-hidden="true"
        style={{ background: "radial-gradient(600px at 50% -40px, rgba(191,219,254,0.06), transparent 70%)" }}
      />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">

          {/* Sidebar */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-5/12 lg:flex-col lg:justify-between lg:py-24">
            <div>
              <div className="mb-6">
                <Image
                  src="/profile.jpg"
                  alt="Leopold Ormos"
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-2 ring-slate-600/50"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
                Leopold Ormos
              </h1>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-300">
                Software Architect at Bosch
              </h2>
              {/* <p className="mt-4 max-w-xs leading-normal">
                I build robust software systems and data pipelines at the intersection of software engineering and ML.
              </p> */}

              <nav aria-label="In-page jump links" className="hidden lg:block">
                <ul className="mt-16 w-max">
                  {NAV_ITEMS.map(({ id, label }) => (
                    <li key={id}>
                      <a href={`#${id}`} className="group flex items-center py-3">
                        <span className={`mr-4 h-px transition-all duration-200 motion-reduce:transition-none ${
                          activeSection === id
                            ? "w-16 bg-slate-200"
                            : "w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200"
                        }`} />
                        <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                          activeSection === id
                            ? "text-slate-200"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}>
                          {label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <ul className="ml-1 mt-8 flex items-center gap-5" aria-label="Social media">
              <li>
                <a href="https://github.com/gitpold" target="_blank" rel="noreferrer noopener"
                  aria-label="GitHub (opens in a new tab)"
                  className="block text-slate-400 hover:text-slate-200 transition-colors duration-200">
                  <GitHubIcon />
                </a>
              </li>
              <li>
                <a href="https://de.linkedin.com/in/leopold-ormos" target="_blank" rel="noreferrer noopener"
                  aria-label="LinkedIn (opens in a new tab)"
                  className="block text-slate-400 hover:text-slate-200 transition-colors duration-200">
                  <LinkedInIcon />
                </a>
              </li>
              <li>
                <a href="mailto:leopold.ormos@web.de" aria-label="Send email"
                  className="block text-slate-400 hover:text-slate-200 transition-colors duration-200">
                  <MailIcon />
                </a>
              </li>
            </ul>
          </header>

          {/* Main content */}
          <main id="content" className="pt-24 lg:w-7/12 lg:py-24">

            {/* About */}
            <section id="about" aria-label="About me" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>About</SectionHeading>
              {/* <div className="space-y-4">
                <p>
                  I&apos;m a software engineer based in Stuttgart, Germany, currently working at{" "}
                  <a href="https://www.bosch.com" target="_blank" rel="noreferrer noopener"
                    className="font-medium text-slate-200 hover:text-blue-200 transition-colors duration-200">
                    Robert Bosch GmbH
                  </a>
                  . I recently completed my Master&apos;s at the{" "}
                  <span className="font-medium text-slate-200">University of Stuttgart</span>
                  , where I researched MLOps practices and built production-oriented data product pipelines.
                </p>
                <p>
                  My work sits at the intersection of software engineering and machine learning — I care about building systems that are technically sound, maintainable, and actually useful to the people who rely on them.
                </p>
                <p>
                  When I&apos;m not at my desk, you&apos;ll find me on the handball court — playing and coaching in the Stuttgart area — or watching football with friends.
                </p>
              </div> */}
            </section>

            {/* Experience */}
            <section id="experience" aria-label="Work experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>Experience</SectionHeading>
              <div className="group/list space-y-12">
                <Card
                  date="Mar 2026 — Present"
                  title="Software Architect"
                  subtitle="Robert Bosch GmbH"
                  url="https://www.bosch.com"
                />
                <Card
                  date="Sept 2024 — Feb 2026"
                  title="MLOps Engineer"
                  subtitle="Robert Bosch GmbH"
                  url="https://www.bosch.com"
                />
                <Card
                  date="Apr 2022 — Sept 2024"
                  title="Software Engineer (Cloud & DevOps)"
                  subtitle="Robert Bosch GmbH"
                  url="https://www.bosch.com"
                />
                <Card
                  date="Oct 2019 — Mar 2022"
                  title="Software Engineer (Fullstack)"
                  subtitle="Robert Bosch GmbH"
                  url="https://www.bosch.com"
                />
                <Card
                  date="Oct 2016 — Sept 2019"
                  title="Dual Student — Applied Computer Science"
                  subtitle="Robert Bosch GmbH"
                  url="https://www.bosch.com"
                />
              </div>
            </section>

            {/* Education */}
            <section id="education" aria-label="Education" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>Education</SectionHeading>
              <div className="group/list space-y-12">
                <Card
                  date="Apr 2022 — Sept 2024"
                  title="M.Sc. Computer Science"
                  subtitle="University of Stuttgart"
                  url="https://www.uni-stuttgart.de"
                >
                  <Thesis
                    title="Evaluation of MLOps Approaches and Implementation of a Data Product Development Pipeline"
                    url="https://github.com/gitpold/master-thesis-mlops"
                  />
                </Card>
                <Card
                  date="Oct 2016 — Sept 2019"
                  title="B.Sc. Applied Computer Science"
                  subtitle="DHBW Baden-Württemberg"
                  url="https://www.dhbw.de"
                />
              </div>
            </section>

            {/* Skills — disabled. To re-enable: uncomment this block AND add
                { id: "skills", label: "Skills" } back to NAV_ITEMS above. */}
            {/* const SKILLS = {
              "Engineering": ["Python", "TypeScript", "Docker", "Git", "GitHub Actions", "CI/CD"],
              "ML & Data": ["MLOps", "Data Pipelines", "Machine Learning", "NLP", "Data Products"],
              "Practices": ["System Design", "Architecture (ADR)", "Agile", "Code Review"],
            };

            <section id="skills" aria-label="Skills" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>Skills</SectionHeading>
              <div className="space-y-8">
                {Object.entries(SKILLS).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {category}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <li key={skill}>
                          <span className="flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700/50">
                            {skill}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section> */}

            {/* Projects */}
            <section id="projects" aria-label="Projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>Projects</SectionHeading>
              <div className="group/list space-y-12">
                <Card
                  title="MLOps Thesis Pipeline"
                  url="https://github.com/gitpold/master-thesis-mlops"
                  // description="Master's thesis research evaluating MLOps approaches and implementing a data product development pipeline. Includes architecture decision records, CI/CD workflows, and user test protocols for ML-driven applications."
                  // skills={["MLOps", "Python", "CI/CD", "Data Pipelines", "Architecture"]}
                />
              </div>
            </section>

            {/* Contact */}
            <section id="contact" aria-label="Contact" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
              <SectionHeading>Contact</SectionHeading>
              <div className="space-y-4">
                {/* <p>
                  Always happy to connect — whether it&apos;s about a project, an opportunity, or just to exchange ideas.
                </p> */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="mailto:leopold.ormos@web.de"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-300/10 px-4 py-2 text-sm font-medium text-blue-200 ring-1 ring-blue-300/20 hover:bg-blue-300/20 transition-colors duration-200">
                    <MailIcon className="h-5 w-5" />
                    leopold.ormos@web.de
                  </a>
                  <a href="https://de.linkedin.com/in/leopold-ormos" target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-700/50 hover:bg-slate-700 hover:text-slate-200 transition-colors duration-200">
                    <LinkedInIcon className="h-5 w-5" />
                    LinkedIn
                  </a>
                  <a href="https://github.com/gitpold" target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-700/50 hover:bg-slate-700 hover:text-slate-200 transition-colors duration-200">
                    <GitHubIcon className="h-5 w-5" />
                    GitHub
                  </a>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
