"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Skill } from "@/types";

const schema = z.object({
  name:  z.string().min(1, "Nome da skill obrigatório"),
  level: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const LEVELS = ["Básico", "Intermediário", "Avançado", "Especialista"];

interface Props {
  initial?: Partial<Skill>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function SkillForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: initial?.name ?? "", level: initial?.level ?? "Intermediário" },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Skill</label>
          <input {...register("name")} className="input" placeholder="Ex: React, Node.js, SQL..." />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Nível</label>
          <select {...register("level")} className="input">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
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
