import { Github, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ensureUrl } from "@/lib/profile";

export const RESUME_TEMPLATES = [
  { id: "modern", name: "Modern", description: "Two-column layout with a dark sidebar for skills and contact details.", swatch: ["#0f172a", "#60a5fa"] },
  { id: "classic", name: "Classic", description: "Traditional single column with serif headings. Safe for any ATS.", swatch: ["#ffffff", "#1e293b"] },
  { id: "bold", name: "Bold", description: "Deep navy header band with blue and green accents. Confident and modern.", swatch: ["#0f2a4a", "#10b981"] },
  { id: "minimal", name: "Minimal", description: "Quiet typography and generous white space. Lets the content lead.", swatch: ["#fafafa", "#64748b"] },
];

const location = (p) => [p.city, p.country].filter(Boolean).join(", ");
const stripProtocol = (value = "") => value.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

function contacts(profile) {
  return [
    profile.email && { icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, text: profile.phone, href: `tel:${profile.phone}` },
    location(profile) && { icon: MapPin, text: location(profile) },
    profile.linkedIn && { icon: Linkedin, text: stripProtocol(profile.linkedIn), href: ensureUrl(profile.linkedIn) },
    profile.github && { icon: Github, text: stripProtocol(profile.github), href: ensureUrl(profile.github) },
    profile.website && { icon: Globe, text: stripProtocol(profile.website), href: ensureUrl(profile.website) },
  ].filter(Boolean);
}

function ContactLine({ item, className = "" }) {
  const Icon = item.icon;
  const content = (
    <>
      <Icon size={12} className="shrink-0" aria-hidden="true" />
      <span className="break-all">{item.text}</span>
    </>
  );
  return item.href ? (
    <a href={item.href} className={`flex items-center gap-1.5 ${className}`}>{content}</a>
  ) : (
    <span className={`flex items-center gap-1.5 ${className}`}>{content}</span>
  );
}

const Sheet = ({ className, children }) => (
  <div className={`resume-sheet mx-auto min-h-[1123px] w-full max-w-[794px] overflow-hidden rounded-lg shadow-2xl ${className}`}>{children}</div>
);

/* ---------------- Modern ---------------- */
function Modern({ profile }) {
  return (
    <Sheet className="grid grid-cols-[34%_66%] bg-white text-slate-800">
      <aside className="bg-slate-900 px-7 py-10 text-slate-200">
        <h1 className="text-[26px] font-bold leading-tight text-white">{profile.full_name}</h1>
        {profile.headline && <p className="mt-2 text-[13px] font-medium text-cyan-300">{profile.headline}</p>}
        <div className="mt-8 space-y-2 text-[11.5px] text-slate-300">
          {contacts(profile).map((item) => <ContactLine key={item.text} item={item} />)}
        </div>
        {profile.skills.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => <span key={skill} className="rounded bg-white/10 px-2 py-0.5 text-[11px]">{skill}</span>)}
            </div>
          </div>
        )}
        {profile.education.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Education</h2>
            <div className="space-y-3">
              {profile.education.map((item, index) => (
                <div key={index} className="text-[11.5px]">
                  <p className="font-semibold text-white">{item.degree}</p>
                  <p className="text-slate-400">{item.school}</p>
                  {item.year && <p className="text-slate-500">{item.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
      <main className="px-9 py-10">
        {profile.summary && (
          <section>
            <h2 className="mb-2 border-b-2 border-cyan-400 pb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900">Profile</h2>
            <p className="text-[12.5px] leading-relaxed text-slate-700">{profile.summary}</p>
          </section>
        )}
        {profile.experiences.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 border-b-2 border-cyan-400 pb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900">Experience</h2>
            <div className="space-y-5">
              {profile.experiences.map((role, index) => (
                <div key={index} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[14px] font-bold text-slate-900">{role.title}</h3>
                    <span className="shrink-0 text-[11px] text-slate-500">{role.dates}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-cyan-700">{role.company}</p>
                  {role.description && <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700">{role.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </Sheet>
  );
}

/* ---------------- Classic ---------------- */
function Classic({ profile }) {
  const heading = "mb-2 border-b border-slate-300 pb-1 font-serif text-[15px] font-bold uppercase tracking-[0.15em] text-slate-900";
  return (
    <Sheet className="bg-white px-14 py-12 text-slate-800">
      <header className="text-center">
        <h1 className="font-serif text-[32px] font-bold tracking-wide text-slate-900">{profile.full_name}</h1>
        {profile.headline && <p className="mt-1 font-serif text-[14px] italic text-slate-600">{profile.headline}</p>}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11.5px] text-slate-600">
          {contacts(profile).map((item) => <ContactLine key={item.text} item={item} />)}
        </div>
      </header>
      {profile.summary && (
        <section className="mt-8">
          <h2 className={heading}>Summary</h2>
          <p className="text-[12.5px] leading-relaxed">{profile.summary}</p>
        </section>
      )}
      {profile.experiences.length > 0 && (
        <section className="mt-7">
          <h2 className={heading}>Professional Experience</h2>
          <div className="space-y-4">
            {profile.experiences.map((role, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[13.5px]"><span className="font-bold text-slate-900">{role.title}</span>{role.company && <span className="text-slate-600">, {role.company}</span>}</p>
                  <span className="shrink-0 text-[11.5px] italic text-slate-500">{role.dates}</span>
                </div>
                {role.description && <p className="mt-1 text-[12.5px] leading-relaxed">{role.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {profile.education.length > 0 && (
        <section className="mt-7">
          <h2 className={heading}>Education</h2>
          <div className="space-y-2">
            {profile.education.map((item, index) => (
              <div key={index} className="flex items-baseline justify-between gap-4 text-[12.5px]">
                <p><span className="font-bold text-slate-900">{item.degree}</span>{item.school && <span className="text-slate-600"> — {item.school}</span>}</p>
                <span className="shrink-0 italic text-slate-500">{item.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {profile.skills.length > 0 && (
        <section className="mt-7">
          <h2 className={heading}>Skills</h2>
          <p className="text-[12.5px] leading-relaxed">{profile.skills.join(" · ")}</p>
        </section>
      )}
    </Sheet>
  );
}

/* ---------------- Bold ---------------- */
function Bold({ profile }) {
  const heading = "mb-3 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#60a5fa]";
  return (
    <Sheet className="relative bg-[#0f2a4a] px-12 py-12 text-slate-300">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#34d399]/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 rounded-full bg-[#60a5fa]/10 blur-3xl" aria-hidden="true" />
      <header className="relative border-b border-white/10 pb-8">
        <h1 className="font-display text-[34px] font-extrabold leading-none tracking-tight text-white" style={{ textShadow: "0 0 18px rgba(0,0,0,0)" }}>
          {profile.full_name}
        </h1>
        {profile.headline && <p className="mt-3 text-[14px] font-semibold text-[#34d399]" style={{ textShadow: "0 0 12px rgba(0,0,0,0)" }}>{profile.headline}</p>}
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11.5px] text-slate-400">
          {contacts(profile).map((item) => <ContactLine key={item.text} item={item} />)}
        </div>
      </header>
      <div className="relative mt-8 grid grid-cols-[1fr_200px] gap-10">
        <div className="space-y-8">
          {profile.summary && (
            <section>
              <h2 className={heading}>// About</h2>
              <p className="text-[12.5px] leading-relaxed text-slate-300">{profile.summary}</p>
            </section>
          )}
          {profile.experiences.length > 0 && (
            <section>
              <h2 className={heading}>// Experience</h2>
              <div className="space-y-5 border-l border-[#60a5fa]/40 pl-5">
                {profile.experiences.map((role, index) => (
                  <div key={index} className="relative break-inside-avoid">
                    <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[#60a5fa]" style={{ boxShadow: "0 0 10px #60a5fa" }} />
                    <h3 className="text-[14px] font-bold text-white">{role.title}</h3>
                    <p className="text-[11.5px] text-slate-400">{[role.company, role.dates].filter(Boolean).join(" · ")}</p>
                    {role.description && <p className="mt-1.5 text-[12px] leading-relaxed text-slate-300">{role.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-8">
          {profile.skills.length > 0 && (
            <section>
              <h2 className={heading}>// Stack</h2>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => <span key={skill} className="rounded border border-[#60a5fa]/40 px-2 py-0.5 text-[10.5px] text-cyan-100">{skill}</span>)}
              </div>
            </section>
          )}
          {profile.education.length > 0 && (
            <section>
              <h2 className={heading}>// Education</h2>
              <div className="space-y-3">
                {profile.education.map((item, index) => (
                  <div key={index} className="text-[11.5px]">
                    <p className="font-semibold text-white">{item.degree}</p>
                    <p className="text-slate-400">{item.school}</p>
                    {item.year && <p className="text-[#34d399]">{item.year}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Sheet>
  );
}

/* ---------------- Minimal ---------------- */
function Minimal({ profile }) {
  const label = "text-[10.5px] font-semibold uppercase tracking-[0.22em] text-slate-400";
  return (
    <Sheet className="bg-[#fafafa] px-16 py-14 text-slate-700">
      <header>
        <h1 className="text-[30px] font-light tracking-tight text-slate-900">{profile.full_name}</h1>
        {profile.headline && <p className="mt-1 text-[13.5px] text-slate-500">{profile.headline}</p>}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-slate-500">
          {contacts(profile).map((item) => <ContactLine key={item.text} item={item} />)}
        </div>
      </header>
      <div className="mt-12 space-y-10">
        {profile.summary && (
          <Row label="About" labelClass={label}><p className="text-[12.5px] leading-[1.8]">{profile.summary}</p></Row>
        )}
        {profile.experiences.length > 0 && (
          <Row label="Experience" labelClass={label}>
            <div className="space-y-6">
              {profile.experiences.map((role, index) => (
                <div key={index} className="break-inside-avoid">
                  <p className="text-[13.5px] font-medium text-slate-900">{role.title}</p>
                  <p className="text-[11.5px] text-slate-500">{[role.company, role.dates].filter(Boolean).join(" — ")}</p>
                  {role.description && <p className="mt-2 text-[12.5px] leading-[1.8]">{role.description}</p>}
                </div>
              ))}
            </div>
          </Row>
        )}
        {profile.education.length > 0 && (
          <Row label="Education" labelClass={label}>
            <div className="space-y-3">
              {profile.education.map((item, index) => (
                <div key={index}>
                  <p className="text-[13px] font-medium text-slate-900">{item.degree}</p>
                  <p className="text-[11.5px] text-slate-500">{[item.school, item.year].filter(Boolean).join(" — ")}</p>
                </div>
              ))}
            </div>
          </Row>
        )}
        {profile.skills.length > 0 && (
          <Row label="Skills" labelClass={label}><p className="text-[12.5px] leading-[1.9]">{profile.skills.join(", ")}</p></Row>
        )}
      </div>
    </Sheet>
  );
}

function Row({ label, labelClass, children }) {
  return (
    <section className="grid grid-cols-[120px_1fr] gap-8">
      <h2 className={`pt-0.5 ${labelClass}`}>{label}</h2>
      <div>{children}</div>
    </section>
  );
}

const RENDERERS = { modern: Modern, classic: Classic, bold: Bold, minimal: Minimal };

export function ResumeDocument({ template, profile }) {
  const Renderer = RENDERERS[template] || Modern;
  return <Renderer profile={profile} />;
}
