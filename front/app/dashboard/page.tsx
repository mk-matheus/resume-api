"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Briefcase, GraduationCap, Zap, FileText,
  Link2, LogOut, ExternalLink as ExtLinkIcon, Loader2, Copy, Check,
  Menu, X, TrendingUp, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { Person, Experience, Education, Skill, Resume, ExternalLink } from "@/types";

import SectionCard from "@/components/dashboard/SectionCard";
import ItemRow from "@/components/dashboard/ItemRow";
import Modal from "@/components/dashboard/Modal";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import PersonForm from "@/components/dashboard/PersonForm";
import ExperienceForm from "@/components/dashboard/ExperienceForm";
import EducationForm from "@/components/dashboard/EducationForm";
import SkillForm from "@/components/dashboard/SkillForm";
import InlineResumeCard from "@/components/dashboard/InlineResumeCard";
import LinkForm from "@/components/dashboard/LinkForm";

type ModalType = "experience" | "education" | "skill" | "link" | null;
type ToastType = "success" | "error";

interface ConfirmState {
  title: string;
  message: string;
  onConfirm: () => void;
}

// Definição das seções para navegação
const SECTIONS = [
  { id: "personal",    label: "Dados Pessoais",       icon: User },
  { id: "resume",      label: "Resumo",               icon: FileText },
  { id: "experience",  label: "Experiências",         icon: Briefcase },
  { id: "education",   label: "Formação",             icon: GraduationCap },
  { id: "skills",      label: "Skills",               icon: Zap },
  { id: "links",       label: "Links",                icon: Link2 },
];

export default function DashboardPage() {
  const { user, personId, loading, logout } = useAuth();
  const router = useRouter();

  const [person, setPerson] = useState<Person | null>(null);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  // Redireciona se não logado
  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  const fetchPerson = useCallback(async () => {
    if (!personId) return;
    try {
      const { data } = await api.get<Person>(`/people/${personId}`);
      setPerson(data);
    } finally {
      setFetching(false);
    }
  }, [personId]);

  useEffect(() => { fetchPerson(); }, [fetchPerson]);

  // Calcular progresso de completude
  const completionData = useMemo(() => {
    if (!person) return { percent: 0, filled: 0, total: 6, items: [] };
    const items = [
      { label: "Dados pessoais",  done: !!(person.name && person.email && person.jobTitle) },
      { label: "Resumo",          done: (person.Resumes?.length ?? 0) > 0 },
      { label: "Experiências",    done: (person.Experiences?.length ?? 0) > 0 },
      { label: "Formação",        done: (person.Education?.length ?? 0) > 0 },
      { label: "Skills",          done: (person.Skills?.length ?? 0) > 0 },
      { label: "Links",           done: (person.ExternalLinks?.length ?? 0) > 0 },
    ];
    const filled = items.filter((i) => i.done).length;
    return { percent: Math.round((filled / items.length) * 100), filled, total: items.length, items };
  }, [person]);

  const showToast = (msg: string, type: ToastType = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/u/${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (type: ModalType, item?: any) => {
    setEditItem(item ?? null);
    setModal(type);
  };
  const closeModal = () => { setModal(null); setEditItem(null); };

  const confirmDelete = (title: string, onConfirm: () => void) => {
    setConfirm({
      title: `Excluir ${title}?`,
      message: "Essa ação não pode ser desfeita. Tem certeza que deseja continuar?",
      onConfirm: async () => {
        setConfirm(null);
        await onConfirm();
      },
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Handlers de save ──────────────────────────────────────────────

  const savePerson = async (data: Partial<Person>) => {
    try {
      await api.put(`/people/${personId}`, data);
      await fetchPerson();
      showToast("Perfil atualizado!");
    } catch {
      showToast("Erro ao atualizar perfil.", "error");
    }
  };

  const saveExperience = async (data: any) => {
    try {
      if (editItem?.objectId) {
        await api.put(`/people/${personId}/experiences/${editItem.objectId}`, data);
      } else {
        await api.post(`/people/${personId}/experiences`, data);
      }
      await fetchPerson(); closeModal(); showToast("Experiência salva!");
    } catch {
      showToast("Erro ao salvar experiência.", "error");
    }
  };

  const deleteExperience = async (id: string) => {
    confirmDelete("experiência", async () => {
      try {
        await api.delete(`/people/${personId}/experiences/${id}`);
        await fetchPerson(); showToast("Experiência removida.");
      } catch {
        showToast("Erro ao remover experiência.", "error");
      }
    });
  };

  const saveEducation = async (data: any) => {
    try {
      if (editItem?.objectId) {
        await api.put(`/people/${personId}/educations/${editItem.objectId}`, data);
      } else {
        await api.post(`/people/${personId}/educations`, data);
      }
      await fetchPerson(); closeModal(); showToast("Formação salva!");
    } catch {
      showToast("Erro ao salvar formação.", "error");
    }
  };

  const deleteEducation = async (id: string) => {
    confirmDelete("formação", async () => {
      try {
        await api.delete(`/people/${personId}/educations/${id}`);
        await fetchPerson(); showToast("Formação removida.");
      } catch {
        showToast("Erro ao remover formação.", "error");
      }
    });
  };

  const saveSkill = async (data: any) => {
    try {
      if (editItem?.objectId) {
        await api.put(`/people/${personId}/skills/${editItem.objectId}`, data);
      } else {
        await api.post(`/people/${personId}/skills`, data);
      }
      await fetchPerson(); closeModal(); showToast("Skill salva!");
    } catch {
      showToast("Erro ao salvar skill.", "error");
    }
  };

  const deleteSkill = async (id: string) => {
    confirmDelete("skill", async () => {
      try {
        await api.delete(`/people/${personId}/skills/${id}`);
        await fetchPerson(); showToast("Skill removida.");
      } catch {
        showToast("Erro ao remover skill.", "error");
      }
    });
  };

  const saveResume = async (summary: string) => {
    try {
      const existing = person?.Resumes?.[0];
      if (existing?.objectId) {
        await api.put(`/people/${personId}/resumes/${existing.objectId}`, {
          title: "Resumo Profissional",
          summary,
        });
      } else {
        await api.post(`/people/${personId}/resumes`, {
          title: "Resumo Profissional",
          summary,
        });
      }
      await fetchPerson();
      showToast("Resumo salvo!");
    } catch {
      showToast("Erro ao salvar resumo.", "error");
    }
  };

  const saveLink = async (data: any) => {
    try {
      if (editItem?.objectId) {
        await api.put(`/people/${personId}/externallinks/${editItem.objectId}`, data);
      } else {
        await api.post(`/people/${personId}/externallinks`, data);
      }
      await fetchPerson(); closeModal(); showToast("Link salvo!");
    } catch {
      showToast("Erro ao salvar link.", "error");
    }
  };

  const deleteLink = async (id: string) => {
    confirmDelete("link", async () => {
      try {
        await api.delete(`/people/${personId}/externallinks/${id}`);
        await fetchPerson(); showToast("Link removido.");
      } catch {
        showToast("Erro ao remover link.", "error");
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6157f6, #a855f7)" }}>
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
          <p className="text-white/40 text-sm font-display">Carregando seu currículo...</p>
        </div>
      </div>
    );
  }

  if (!person) return null;

  const publicUrl = `/u/${user?.username}`;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Glow decorativo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(97,87,246,0.08) 0%, transparent 70%)" }} />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border text-sm font-medium animate-fade-up flex items-center gap-2 ${
          toastType === "error"
            ? "bg-red-500/15 border-red-500/30 text-red-400"
            : "bg-brand-500/15 border-brand-500/30 text-brand-300"
        }`} style={{ boxShadow: toastType === "error" ? "0 0 20px rgba(239,68,68,0.2)" : "0 0 20px rgba(97,87,246,0.2)" }}>
          {toastType === "error" ? "✕" : "✓"} {toast}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Modals */}
      {modal === "experience" && (
        <Modal title={editItem ? "Editar Experiência" : "Nova Experiência"} onClose={closeModal}>
          <ExperienceForm initial={editItem} onSave={saveExperience} onCancel={closeModal} />
        </Modal>
      )}
      {modal === "education" && (
        <Modal title={editItem ? "Editar Formação" : "Nova Formação"} onClose={closeModal}>
          <EducationForm initial={editItem} onSave={saveEducation} onCancel={closeModal} />
        </Modal>
      )}
      {modal === "skill" && (
        <Modal title={editItem ? "Editar Skill" : "Nova Skill"} onClose={closeModal}>
          <SkillForm initial={editItem} onSave={saveSkill} onCancel={closeModal} />
        </Modal>
      )}
      {modal === "link" && (
        <Modal title={editItem ? "Editar Link" : "Novo Link"} onClose={closeModal}>
          <LinkForm initial={editItem} onSave={saveLink} onCancel={closeModal} />
        </Modal>
      )}

      {/* Mobile overlay menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 p-6 animate-fade-in" style={{ background: "var(--color-surface-1)" }}>
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-bold text-xl text-white">
                Resume<span className="text-gradient">Forge</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Avatar mobile */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: "var(--color-surface-2)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #6157f6, #a855f7)" }}>
                {getInitials(person.name)}
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">{person.name}</p>
                <p className="text-white/40 text-xs">@{user?.username}</p>
              </div>
            </div>

            {/* Navegação mobile */}
            <nav className="space-y-1 mb-6">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                    activeSection === s.id
                      ? "bg-brand-500/15 text-brand-400 font-medium"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <s.icon size={16} />
                  {s.label}
                </button>
              ))}
            </nav>

            {/* Links mobile */}
            <div className="space-y-1 border-t border-white/8 pt-4">
              <Link href={publicUrl} target="_blank"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                <ExtLinkIcon size={16} />
                Ver currículo público
              </Link>
              <button onClick={copyLink}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? "Copiado!" : "Copiar link"}
              </button>
            </div>

            <button onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-4">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      )}

      {/* Sidebar + Main layout */}
      <div className="flex min-h-screen">

        {/* Sidebar desktop */}
        <aside className="hidden lg:flex flex-col w-[272px] border-r border-white/6 fixed h-full z-10"
          style={{ background: "var(--color-surface-1)" }}>

          {/* Logo */}
          <div className="px-6 pt-6 pb-4">
            <span className="font-display font-bold text-xl text-white">
              Resume<span className="text-gradient">Forge</span>
            </span>
          </div>

          {/* Avatar + info */}
          <div className="mx-4 mb-4 p-4 rounded-2xl" style={{ background: "var(--color-surface-2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6157f6, #a855f7)" }}>
                {getInitials(person.name)}
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-white text-sm truncate">{person.name}</p>
                <p className="text-white/35 text-xs truncate">@{user?.username}</p>
              </div>
            </div>
            {person.jobTitle && (
              <p className="text-brand-400 text-xs mt-3 font-medium">{person.jobTitle}</p>
            )}
          </div>

          {/* Navegação por seções */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                  activeSection === s.id
                    ? "bg-brand-500/15 text-brand-400 font-medium border border-brand-500/20"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5 border border-transparent"
                )}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pb-4 space-y-1 border-t border-white/6 pt-4 mt-2">
            <Link href={publicUrl} target="_blank"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/5 transition-colors">
              <ExtLinkIcon size={15} />
              Ver currículo público
            </Link>
            <button onClick={copyLink}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/5 transition-colors">
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
              {copied ? "Copiado!" : "Copiar link"}
            </button>
            <button onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-[272px]">

          {/* Mobile header */}
          <div className="flex items-center justify-between px-5 py-4 lg:hidden border-b border-white/6"
            style={{ background: "var(--color-surface-1)" }}>
            <button onClick={() => setMobileMenuOpen(true)} className="text-white/60 hover:text-white transition-colors">
              <Menu size={22} />
            </button>
            <span className="font-display font-bold text-lg text-white">
              Resume<span className="text-gradient">Forge</span>
            </span>
            <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>

          <div className="max-w-3xl mx-auto px-5 py-8 lg:px-8">

            {/* Header com stats */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-brand-400 text-xs font-mono font-medium uppercase tracking-widest mb-2">Dashboard</p>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Meu Currículo</h1>
                  <p className="text-white/35 text-sm mt-1">
                    Edite suas informações abaixo. As mudanças aparecem instantaneamente no seu link público.
                  </p>
                </div>
              </div>

              {/* Barra de progresso de completude */}
              <div className="rounded-2xl border border-white/8 p-5" style={{
                background: "linear-gradient(135deg, rgba(97,87,246,0.06) 0%, rgba(168,85,247,0.04) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)"
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand-400" />
                    <span className="text-white font-display font-semibold text-sm">Completude do currículo</span>
                  </div>
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    completionData.percent === 100 ? "text-green-400" : "text-brand-400"
                  )}>
                    {completionData.percent}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${completionData.percent}%`,
                      background: completionData.percent === 100
                        ? "linear-gradient(90deg, #22c55e, #10b981)"
                        : "linear-gradient(90deg, #6157f6, #a855f7, #06b6d4)",
                    }}
                  />
                </div>
                {/* Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {completionData.items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={item.done ? "text-green-400" : "text-white/15"}
                      />
                      <span className={cn(
                        "text-xs",
                        item.done ? "text-white/60" : "text-white/25"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dados pessoais */}
            <SectionCard title="Dados Pessoais" icon={<User size={18} />} defaultOpen id="section-personal">
              <PersonForm person={person} onSave={savePerson} />
            </SectionCard>

            {/* Resumo profissional */}
            <SectionCard
              title="Resumo Profissional"
              icon={<FileText size={18} />}
              id="section-resume"
            >
              <InlineResumeCard
                resume={person.Resumes?.[0] ?? null}
                onSave={saveResume}
              />
            </SectionCard>

            {/* Experiências */}
            <SectionCard
              title="Experiências"
              icon={<Briefcase size={18} />}
              count={person.Experiences?.length ?? 0}
              onAdd={() => openModal("experience")}
              id="section-experience"
            >
              {person.Experiences?.length === 0 && (
                <div className="text-center py-8">
                  <Briefcase size={32} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">Nenhuma experiência ainda.</p>
                  <button onClick={() => openModal("experience")} className="text-brand-400 text-sm mt-1 hover:text-brand-300 transition-colors">
                    + Adicionar experiência
                  </button>
                </div>
              )}
              {person.Experiences?.map((e) => (
                <ItemRow
                  key={e.objectId}
                  title={e.role}
                  subtitle={e.companyName}
                  meta={e.startDate ? `${formatDate(e.startDate)} → ${e.endDate ? formatDate(e.endDate) : "Atual"}` : undefined}
                  onEdit={() => openModal("experience", e)}
                  onDelete={() => deleteExperience(e.objectId)}
                >
                  {e.description && <p>{e.description}</p>}
                </ItemRow>
              ))}
            </SectionCard>

            {/* Formação */}
            <SectionCard
              title="Formação Acadêmica"
              icon={<GraduationCap size={18} />}
              count={person.Education?.length ?? 0}
              onAdd={() => openModal("education")}
              id="section-education"
            >
              {person.Education?.length === 0 && (
                <div className="text-center py-8">
                  <GraduationCap size={32} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">Nenhuma formação ainda.</p>
                  <button onClick={() => openModal("education")} className="text-brand-400 text-sm mt-1 hover:text-brand-300 transition-colors">
                    + Adicionar formação
                  </button>
                </div>
              )}
              {person.Education?.map((ed) => (
                <ItemRow
                  key={ed.objectId}
                  title={ed.course}
                  subtitle={`${ed.institutionName}${ed.degree ? ` · ${ed.degree}` : ""}`}
                  meta={[
                    ed.status,
                    ed.startDate ? `${formatDate(ed.startDate)}${ed.endDate ? ` → ${formatDate(ed.endDate)}` : ""}` : null,
                  ].filter(Boolean).join(" · ") || undefined}
                  onEdit={() => openModal("education", ed)}
                  onDelete={() => deleteEducation(ed.objectId)}
                />
              ))}
            </SectionCard>

            {/* Skills */}
            <SectionCard
              title="Skills"
              icon={<Zap size={18} />}
              count={person.Skills?.length ?? 0}
              onAdd={() => openModal("skill")}
              id="section-skills"
            >
              {person.Skills?.length === 0 && (
                <div className="text-center py-8">
                  <Zap size={32} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">Nenhuma skill ainda.</p>
                  <button onClick={() => openModal("skill")} className="text-brand-400 text-sm mt-1 hover:text-brand-300 transition-colors">
                    + Adicionar skill
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {person.Skills?.map((s) => (
                  <div key={s.objectId}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/8 bg-white/[0.03] hover:border-brand-500/30 hover:bg-brand-500/5 text-sm transition-all duration-200">
                    <span className="text-white font-medium">{s.name}</span>
                    {s.level && (
                      <span className="text-white/25 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5">{s.level}</span>
                    )}
                    <div className="hidden group-hover:flex items-center gap-1 ml-0.5">
                      <button onClick={() => openModal("skill", s)} className="text-brand-400 hover:text-brand-300 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => deleteSkill(s.objectId)} className="text-red-400 hover:text-red-300 transition-colors">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Links externos */}
            <SectionCard
              title="Links & Redes"
              icon={<Link2 size={18} />}
              count={person.ExternalLinks?.length ?? 0}
              onAdd={() => openModal("link")}
              id="section-links"
            >
              {person.ExternalLinks?.length === 0 && (
                <div className="text-center py-8">
                  <Link2 size={32} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/30 text-sm">Nenhum link ainda.</p>
                  <button onClick={() => openModal("link")} className="text-brand-400 text-sm mt-1 hover:text-brand-300 transition-colors">
                    + Adicionar link
                  </button>
                </div>
              )}
              {person.ExternalLinks?.map((l) => (
                <ItemRow
                  key={l.objectId}
                  title={l.type.charAt(0).toUpperCase() + l.type.slice(1)}
                  subtitle={l.url}
                  onEdit={() => openModal("link", l)}
                  onDelete={() => deleteLink(l.objectId)}
                />
              ))}
            </SectionCard>

          </div>
        </main>
      </div>
    </div>
  );
}
