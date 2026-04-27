"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Education } from "@/types";

const STATUS_OPTIONS = ["Em andamento", "Concluído", "Trancado", "Pausado"];
const DEGREE_OPTIONS = [
  "Técnico",
  "Tecnólogo",
  "Graduação",
  "Pós-graduação",
  "Mestrado",
  "Doutorado",
  "Curso Livre",
  "Bootcamp",
];

const schema = z.object({
  institutionName: z.string().min(1, "Instituição obrigatória"),
  course:          z.string().min(1, "Curso obrigatório"),
  degree:          z.string().optional(),
  startDate:       z.string().optional(),
  endDate:         z.string().optional(),
  status:          z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "A data de fim não pode ser anterior à data de início.",
    path: ["endDate"],
  }
).refine(
  (data) => {
    const today = new Date().toISOString().split("T")[0];
    if (data.status === "Concluído" && data.endDate && data.endDate > today) {
      return false;
    }
    return true;
  },
  {
    message: 'Status "Concluído" não é compatível com data de fim no futuro.',
    path: ["status"],
  }
).refine(
  (data) => {
    const today = new Date().toISOString().split("T")[0];
    if (data.status === "Em andamento" && data.endDate && data.endDate < today) {
      return false;
    }
    return true;
  },
  {
    message: 'Status "Em andamento" não é compatível com data de fim no passado.',
    path: ["status"],
  }
);
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Education>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function EducationForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      institutionName: initial?.institutionName ?? "",
      course:          initial?.course          ?? "",
      degree:          initial?.degree          ?? "",
      startDate:       initial?.startDate       ?? "",
      endDate:         initial?.endDate         ?? "",
      status:          initial?.status          ?? "Em andamento",
    },
  });

  useEffect(() => {
    if (initial) reset({
      institutionName: initial.institutionName ?? "",
      course:          initial.course          ?? "",
      degree:          initial.degree          ?? "",
      startDate:       initial.startDate       ?? "",
      endDate:         initial.endDate         ?? "",
      status:          initial.status          ?? "Em andamento",
    });
  }, [initial, reset]);

  // Sanitiza datas vazias ("" → undefined) antes de enviar
  const handleSave = async (data: FormData) => {
    const sanitized = {
      ...data,
      startDate: data.startDate || undefined,
      endDate:   data.endDate   || undefined,
      degree:    data.degree    || undefined,
    };
    await onSave(sanitized);
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Instituição <span className="required-mark">*</span></label>
          <input {...register("institutionName")} className="input" placeholder="Nome da universidade" />
          {errors.institutionName && <p className="text-red-400 text-xs mt-1">{errors.institutionName.message}</p>}
        </div>
        <div>
          <label className="label">Curso <span className="required-mark">*</span></label>
          <input {...register("course")} className="input" placeholder="Ex: Ciência da Computação" />
          {errors.course && <p className="text-red-400 text-xs mt-1">{errors.course.message}</p>}
        </div>
        <div>
          <label className="label">Tipo de Formação</label>
          <select {...register("degree")} className="input">
            <option value="">Selecione...</option>
            {DEGREE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select {...register("status")} className="input">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}
        </div>
        <div>
          <label className="label">Início</label>
          <input {...register("startDate")} type="date" className="input" />
          {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="label">Fim</label>
          <input {...register("endDate")} type="date" className="input" />
          {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
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
