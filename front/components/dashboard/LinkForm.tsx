"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { ExternalLink } from "@/types";

const schema = z.object({
  type: z.string().min(1, "Tipo obrigatório"),
  url:  z.string().url("URL inválida"),
});
type FormData = z.infer<typeof schema>;

const LINK_TYPES: { value: string; label: string; prefix: string }[] = [
  { value: "github",    label: "GitHub",    prefix: "https://github.com/" },
  { value: "linkedin",  label: "LinkedIn",  prefix: "https://linkedin.com/in/" },
  { value: "portfolio", label: "Portfolio", prefix: "https://" },
  { value: "twitter",   label: "Twitter/X", prefix: "https://x.com/" },
  { value: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
  { value: "youtube",   label: "YouTube",   prefix: "https://youtube.com/" },
  { value: "outro",     label: "Outro",     prefix: "https://" },
];

function getPrefixByType(type: string) {
  return LINK_TYPES.find((t) => t.value === type)?.prefix ?? "https://";
}

function isPrefixOnly(url: string) {
  return LINK_TYPES.some((t) => t.prefix === url || url === "https://");
}

interface Props {
  initial?: Partial<ExternalLink>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function LinkForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initial?.type ?? "github",
      url:  initial?.url  ?? getPrefixByType(initial?.type ?? "github"),
    },
  });

  // Se estiver editando, carrega o valor existente
  useEffect(() => {
    if (initial) reset({ type: initial.type ?? "github", url: initial.url ?? "" });
  }, [initial, reset]);

  // Quando o tipo muda, auto-completa o prefixo (só se URL estiver vazia ou só com prefixo)
  const selectedType = watch("type");
  useEffect(() => {
    if (initial?.url) return; // editando: não sobrescreve
    const currentUrl = watch("url");
    if (!currentUrl || isPrefixOnly(currentUrl)) {
      setValue("url", getPrefixByType(selectedType), { shouldDirty: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
      <div>
        <label className="label">Rede / Tipo <span className="required-mark">*</span></label>
        <select {...register("type")} className="input">
          {LINK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">URL <span className="required-mark">*</span></label>
        <input
          {...register("url")}
          className="input font-mono text-sm"
          placeholder="https://..."
          spellCheck={false}
        />
        {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Salvar"}
        </button>
      </div>
    </form>
  );
}
