"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Briefcase, GraduationCap, Zap, FileText,
  Link2, LogOut, ExternalLink as ExtLinkIcon, Loader2, Copy, Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import type { Person, Experience, Education, Skill, Resume, ExternalLink } from "@/types";

import SectionCard from "@/components/dashboard/SectionCard";
import ItemRow from "@/components/dashboard/ItemRow";
import Modal from "@/components/dashboard/Modal";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import PersonForm from "@/components/dashboard/PersonForm";
import ExperienceForm from "@/components/dashboard/ExperienceForm";
import EducationForm from "@/components/dashboard/EducationForm";
import SkillForm from "@/components/dashboard/SkillForm";
import ResumeForm from "@/components/dashboard/ResumeForm";
import LinkForm from "@/components/dashboard/LinkForm";

type ModalType = "experience" | "education" | "skill" | "resume" | "link" | null;
type ToastType = "success" | "error";

interface ConfirmState {
  title: string;
  message: string;
  onConfirm: () => void;
}

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

  // Helper para confirmar antes de deletar
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

  const saveResume = async (data: any) => {
    try {
      if (editItem?.objectId) {
        await api.put(`/people/${personId}/resumes/${editItem.objectId}`, data);
      } else {
        await api.post(`/people/${personId}/resumes`, data);
      }
      await fetchPerson(); closeModal(); showToast("Resumo salvo!");
    } catch {
      showToast("Erro ao salvar resumo.", "error");
    }
  };

  const deleteResume = async (id: string) => {
    confirmDelete("resumo", async () => {
      try {
        await api.delete(`/people/${personId}/resumes/${id}`);
        await fetchPerson(); showToast("Resumo removido.");
      } catch {
        showToast("Erro ao remover resumo.", "error");
      }
    });
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
        <Loader2 size={32} className="animate-spin text-brand-400" />
      </div>
    );
  }

  if (!person) return null;

  const publicUrl = `/u/${user?.username}`;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border text-sm font-medium shadow-glow animate-fade-up ${
          toastType === "error"
            ? "bg-red-500/15 border-red-500/30 text-red-400"
            : "bg-surface-2 border-brand-500/30 text-white"
        }`}>
          {toast}
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
      {modal === "resume" && (
        <Modal title={editItem ? "Editar Resumo" : "Novo Resumo"} onClose={closeModal}>
          <ResumeForm initial={editItem} onSave={saveResume} onCancel={closeModal} />
        </Modal>
      )}
      {modal === "link" && (
        <Modal title={editItem ? "Editar Link" : "Novo Link"} onClose={closeModal}>
          <LinkForm initial={editItem} onSave={saveLink} onCancel={closeModal} />
        </Modal>
      )}

      {/* Sidebar + Main layout */}
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/8 p-6 fixed h-full"
          style={{ background: "var(--color-surface-1)" }}>
          <span className="font-display font-bold text-xl text-white mb-8">
            Resume<span className="text-gradient">Forge</span>
          </span>

          {/* Avatar + info */}
          <div className="flex flex-col items-center text-center mb-8 p-4 rounded-2xl"
            style={{ background: "var(--color-surface-2)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white mb-3"
              style={{ background: "linear-gradient(135deg, #6157f6, #a855f7)" }}>
              {getInitials(person.name)}
            </div>
            <p className="font-display font-semibold text-white text-sm">{person.name}</p>
            <p className="text-white/40 text-xs mt-0.5">@{user?.username}</p>
            {person.jobTitle && <p className="text-brand-400 text-xs mt-1">{person.jobTitle}</p>}
          </div>

          {/* Link público */}
          <div className="mb-8 space-y-2">
            <Link href={publicUrl} target="_blank"
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              <ExtLinkIcon size={15} />
              Ver currículo público
            </Link>
            <button onClick={copyLink}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
              {copied ? "Copiado!" : "Copiar link"}
            </button>
          </div>

          <div className="mt-auto">
            <button onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-6 max-w-3xl">

          {/* Mobile header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="font-display font-bold text-xl text-white">
              Resume<span className="text-gradient">Forge</span>
            </span>
            <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-white mb-1">Meu Currículo</h1>
            <p className="text-white/40 text-sm">
              Edite suas informações abaixo. As mudanças aparecem instantaneamente no seu link público.
            </p>
          </div>

          {/* Dados pessoais */}
          <SectionCard title="Dados Pessoais" icon={<User size={18} />} defaultOpen>
            <PersonForm person={person} onSave={savePerson} />
          </SectionCard>

          {/* Resumo profissional */}
          <SectionCard
            title="Resumo Profissional"
            icon={<FileText size={18} />}
            count={person.Resumes?.length ?? 0}
            onAdd={() => openModal("resume")}
          >
            {person.Resumes?.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">Nenhum resumo ainda. Clique no + para adicionar.</p>
            )}
            {person.Resumes?.map((r) => (
              <ItemRow
                key={r.objectId}
                title={r.title}
                onEdit={() => openModal("resume", r)}
                onDelete={() => deleteResume(r.objectId)}
              >
                {r.summary && <p>{r.summary}</p>}
              </ItemRow>
            ))}
          </SectionCard>

          {/* Experiências */}
          <SectionCard
            title="Experiências"
            icon={<Briefcase size={18} />}
            count={person.Experiences?.length ?? 0}
            onAdd={() => openModal("experience")}
          >
            {person.Experiences?.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">Nenhuma experiência ainda.</p>
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
          >
            {person.Education?.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">Nenhuma formação ainda.</p>
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
          >
            {person.Skills?.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">Nenhuma skill ainda.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {person.Skills?.map((s) => (
                <div key={s.objectId}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-surface-2 text-sm">
                  <span className="text-white font-medium">{s.name}</span>
                  {s.level && <span className="text-white/30 text-xs font-mono">{s.level}</span>}
                  <div className="hidden group-hover:flex items-center gap-1 ml-1">
                    <button onClick={() => openModal("skill", s)} className="text-brand-400 hover:text-brand-300">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteSkill(s.objectId)} className="text-red-400 hover:text-red-300">
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
          >
            {person.ExternalLinks?.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">Nenhum link ainda.</p>
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

        </main>
      </div>
    </div>
  );
}
