"use client";

import Link from "next/link";
import {
  MapPin, Mail, Phone, Github, Linkedin, Globe,
  Twitter, Instagram, Youtube, Briefcase, GraduationCap,
  Zap, ArrowUpRight, Calendar,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import type { Person, ExternalLink } from "@/types";

const LEVEL_COLOR: Record<string, string> = {
  Básico:        "rgba(97,87,246,0.15)",
  Intermediário: "rgba(97,87,246,0.25)",
  Avançado:      "rgba(168,85,247,0.3)",
  Especialista:  "rgba(6,182,212,0.3)",
};

const LEVEL_TEXT: Record<string, string> = {
  Básico:        "#a8a8ff",
  Intermediário: "#c084fc",
  Avançado:      "#d946ef",
  Especialista:  "#22d3ee",
};

function getLinkIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "github")    return <Github size={16} />;
  if (t === "linkedin")  return <Linkedin size={16} />;
  if (t === "twitter")   return <Twitter size={16} />;
  if (t === "instagram") return <Instagram size={16} />;
  if (t === "youtube")   return <Youtube size={16} />;
  return <Globe size={16} />;
}

interface Props {
  person: Person;
  username: string;
}

export default function PublicResume({ person, username }: Props) {
  const mainResume = person.Resumes?.[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* Glow de fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb w-[700px] h-[400px] top-[-150px] left-[50%] -translate-x-1/2"
          style={{ background: "rgba(97,87,246,0.12)" }} />
      </div>

      {/* Hero header */}
      <header className="relative z-10 pt-16 pb-12 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Avatar + nome */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center font-display font-bold text-2xl text-white overflow-hidden"
              style={{ background: "linear-gradient(135deg, #6157f6, #a855f7)" }}>
              {person.avatarUrl
                ? <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                : getInitials(person.name)
              }
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight">
                    {person.name}
                  </h1>
                  {person.jobTitle && (
                    <p className="text-brand-400 font-display font-medium text-lg mt-1">{person.jobTitle}</p>
                  )}
                </div>
                <span className="text-white/20 font-mono text-xs mt-1">@{username}</span>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 mt-3">
                {person.location && (
                  <span className="flex items-center gap-1.5 text-white/40 text-sm">
                    <MapPin size={13} /> {person.location}
                  </span>
                )}
                {person.email && (
                  <a href={`mailto:${person.email}`}
                    className="flex items-center gap-1.5 text-white/40 hover:text-brand-400 text-sm transition-colors">
                    <Mail size={13} /> {person.email}
                  </a>
                )}
                {person.phone && (
                  <span className="flex items-center gap-1.5 text-white/40 text-sm">
                    <Phone size={13} /> {person.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links externos */}
          {person.ExternalLinks && person.ExternalLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {person.ExternalLinks.map((l) => (
                <a key={l.objectId} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-surface-1 text-white/50 hover:text-white hover:border-brand-500/40 text-sm transition-all">
                  {getLinkIcon(l.type)}
                  <span className="capitalize">{l.type}</span>
                  <ArrowUpRight size={12} className="opacity-40" />
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="relative z-10 px-6 pb-24 max-w-3xl mx-auto space-y-10">

        {/* Resumo */}
        {mainResume && (
          <section>
            <SectionTitle icon={<Globe size={16} />} title={mainResume.title || "Sobre mim"} />
            {mainResume.summary && (
              <p className="text-white/60 leading-relaxed text-[15px]">{mainResume.summary}</p>
            )}
          </section>
        )}

        {/* Experiências */}
        {person.Experiences && person.Experiences.length > 0 && (
          <section>
            <SectionTitle icon={<Briefcase size={16} />} title="Experiência Profissional" />
            <div className="space-y-6">
              {person.Experiences.map((exp, i) => (
                <div key={exp.objectId} className="relative pl-6 border-l border-white/10">
                  {/* Dot */}
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-brand-500"
                    style={{ background: "var(--color-bg)" }} />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h3 className="font-display font-semibold text-white">{exp.role}</h3>
                    {exp.startDate && (
                      <span className="flex items-center gap-1 text-white/30 text-xs font-mono">
                        <Calendar size={11} />
                        {formatDate(exp.startDate)} → {exp.endDate ? formatDate(exp.endDate) : "Atual"}
                      </span>
                    )}
                  </div>
                  <p className="text-brand-400 text-sm mb-2">{exp.companyName}</p>
                  {exp.description && (
                    <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formação */}
        {person.Education && person.Education.length > 0 && (
          <section>
            <SectionTitle icon={<GraduationCap size={16} />} title="Formação Acadêmica" />
            <div className="space-y-4">
              {person.Education.map((ed) => (
                <div key={ed.objectId} className="card py-4 px-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h3 className="font-display font-semibold text-white">{ed.course}</h3>
                    {ed.status && (
                      <span className="badge text-xs">{ed.status}</span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm mt-0.5">{ed.institutionName}</p>
                  {(ed.startDate || ed.endDate) && (
                    <p className="text-white/25 text-xs font-mono mt-1">
                      {formatDate(ed.startDate)} {ed.endDate ? `→ ${formatDate(ed.endDate)}` : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {person.Skills && person.Skills.length > 0 && (
          <section>
            <SectionTitle icon={<Zap size={16} />} title="Skills" />
            <div className="flex flex-wrap gap-2">
              {person.Skills.map((s) => (
                <span key={s.objectId}
                  className="px-4 py-2 rounded-xl text-sm font-medium border"
                  style={{
                    background: s.level ? LEVEL_COLOR[s.level] ?? "rgba(97,87,246,0.15)" : "rgba(97,87,246,0.1)",
                    borderColor: s.level ? (LEVEL_TEXT[s.level] ? LEVEL_TEXT[s.level] + "40" : "rgba(97,87,246,0.3)") : "rgba(97,87,246,0.2)",
                    color: s.level ? LEVEL_TEXT[s.level] ?? "#a8a8ff" : "#a8a8ff",
                  }}>
                  {s.name}
                  {s.level && <span className="ml-2 opacity-50 text-xs font-mono">{s.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-6 text-center">
        <p className="text-white/20 text-xs font-mono">
          Feito com{" "}
          <Link href="/" className="text-brand-400 hover:text-brand-300 transition-colors">ResumeForge</Link>
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-brand-400">{icon}</span>
      <h2 className="font-display font-bold text-lg text-white">{title}</h2>
      <div className="flex-1 h-px bg-white/8" />
    </div>
  );
}
