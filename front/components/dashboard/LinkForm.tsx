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

const LINK_TYPES = ["github", "linkedin", "portfolio", "twitter", "instagram", "youtube", "outro"];

interface Props {
  initial?: Partial<ExternalLink>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function LinkForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: initial?.type ?? "github", url: initial?.url ?? "" },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Tipo</label>
          <select {...register("type")} className="input">
            {LINK_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="label">URL</label>
          <input {...register("url")} className="input" placeholder="https://..." />
          {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>}
        </div>
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
