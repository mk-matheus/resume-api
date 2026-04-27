"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Experience } from "@/types";

const schema = z.object({
  companyName: z.string().min(1, "Empresa obrigatória"),
  role:        z.string().min(1, "Cargo obrigatório"),
  description: z.string().min(10, "Descreva sua função (mínimo 10 caracteres)"),
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
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
);
type FormData = z.infer<typeof schema>;

interface Props {
  initial?: Partial<Experience>;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function ExperienceForm({ initial, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      role:        initial?.role        ?? "",
      description: initial?.description ?? "",
      startDate:   initial?.startDate   ?? "",
      endDate:     initial?.endDate     ?? "",
    },
  });

  useEffect(() => {
    if (initial) reset({
      companyName: initial.companyName ?? "",
      role:        initial.role        ?? "",
      description: initial.description ?? "",
      startDate:   initial.startDate   ?? "",
      endDate:     initial.endDate     ?? "",
    });
  }, [initial, reset]);

  // Sanitiza datas vazias ("" → undefined) antes de enviar
  const handleSave = async (data: FormData) => {
    const sanitized = {
      ...data,
      startDate: data.startDate || undefined,
      endDate:   data.endDate   || undefined,
    };
    await onSave(sanitized);
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Empresa <span className="required-mark">*</span></label>
          <input {...register("companyName")} className="input" placeholder="Nome da empresa" />
          {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <label className="label">Cargo <span className="required-mark">*</span></label>
          <input {...register("role")} className="input" placeholder="Ex: Dev Full Stack" />
          {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
        </div>
        <div>
          <label className="label">Início</label>
          <input {...register("startDate")} type="date" className="input" />
          {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="label">Fim (deixe vazio se atual)</label>
          <input {...register("endDate")} type="date" className="input" />
          {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
        </div>
      </div>
      <div>
        <label className="label">
          Descrição <span className="required-mark">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="input resize-none"
          placeholder="Descreva suas responsabilidades e conquistas nesta posição..."
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
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
