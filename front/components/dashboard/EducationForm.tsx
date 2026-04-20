"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Education } from "@/types";

const schema = z.object({
  institutionName: z.string().min(1, "Instituição obrigatória"),
  course:          z.string().min(1, "Curso obrigatório"),
  startDate:       z.string().optional(),
  endDate:         z.string().optional(),
  status:          z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Education>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

const STATUS_OPTIONS = ["Em andamento", "Concluído", "Trancado", "Pausado"];

export default function EducationForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      institutionName: initial?.institutionName ?? "",
      course:          initial?.course          ?? "",
      startDate:       initial?.startDate        ?? "",
      endDate:         initial?.endDate          ?? "",
      status:          initial?.status           ?? "Em andamento",
    },
  });

  useEffect(() => { if (initial) reset(initial as FormData); }, [initial]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Instituição</label>
          <input {...register("institutionName")} className="input" placeholder="Nome da universidade" />
          {errors.institutionName && <p className="text-red-400 text-xs mt-1">{errors.institutionName.message}</p>}
        </div>
        <div>
          <label className="label">Curso</label>
          <input {...register("course")} className="input" placeholder="Ex: Ciência da Computação" />
          {errors.course && <p className="text-red-400 text-xs mt-1">{errors.course.message}</p>}
        </div>
        <div>
          <label className="label">Início</label>
          <input {...register("startDate")} type="date" className="input" />
        </div>
        <div>
          <label className="label">Fim</label>
          <input {...register("endDate")} type="date" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Status</label>
        <select {...register("status")} className="input">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
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
