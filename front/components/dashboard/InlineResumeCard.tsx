"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";
import type { Resume } from "@/types";

interface Props {
  resume: Resume | null;
  onSave: (summary: string) => Promise<void>;
}

export default function InlineResumeCard({ resume, onSave }: Props) {
  const [summary, setSummary] = useState(resume?.summary ?? "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync se o resumo mudar por fora (ex: fetch depois de salvar)
  useEffect(() => {
    setSummary(resume?.summary ?? "");
    setIsDirty(false);
  }, [resume]);

  const handleChange = (val: string) => {
    setSummary(val);
    setIsDirty(val !== (resume?.summary ?? ""));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(summary);
      setIsDirty(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!resume && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: "rgba(97,87,246,0.08)", border: "1px solid rgba(97,87,246,0.15)" }}>
          <FileText size={13} className="text-brand-400 flex-shrink-0" />
          <span className="text-brand-300/70">
            Escreva um parágrafo sobre você, suas experiências e objetivos profissionais.
          </span>
        </div>
      )}
      <textarea
        value={summary}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className="input resize-none"
        placeholder="Fale sobre você, suas habilidades e objetivos profissionais..."
      />
      <div className="flex justify-between items-center">
        <span className="text-white/25 text-xs tabular-nums">
          {summary.length} caracteres
        </span>
        <button
          onClick={handleSave}
          disabled={isSubmitting || !isDirty || summary.trim().length === 0}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isSubmitting
            ? <Loader2 size={16} className="animate-spin" />
            : resume ? "Salvar alterações" : "Criar resumo"
          }
        </button>
      </div>
    </div>
  );
}
