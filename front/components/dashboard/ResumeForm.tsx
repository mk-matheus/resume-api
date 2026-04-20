"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Resume } from "@/types";

const schema = z.object({
  title:   z.string().min(1, "Título obrigatório"),
  summary: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Resume>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function ResumeForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: initial?.title ?? "", summary: initial?.summary ?? "" },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
      <div>
        <label className="label">Título</label>
        <input {...register("title")} className="input" placeholder="Ex: Desenvolvedor Full Stack" />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="label">Resumo profissional</label>
        <textarea {...register("summary")} rows={5} className="input resize-none"
          placeholder="Fale sobre você, suas experiências e objetivos profissionais..." />
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
