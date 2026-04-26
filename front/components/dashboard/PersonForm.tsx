"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Person } from "@/types";

// Formata dígitos para (XX) XXXXX-XXXX
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const schema = z.object({
  name:     z.string().min(2, "Nome obrigatório"),
  email:    z.string().email("E-mail inválido"),
  phone:    z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  person: Person;
  onSave: (data: Partial<Person>) => Promise<void>;
}

export default function PersonForm({ person, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     person.name,
      email:    person.email,
      phone:    person.phone    ?? "",
      jobTitle: person.jobTitle ?? "",
      location: person.location ?? "",
    },
  });

  useEffect(() => {
    reset({
      name:     person.name,
      email:    person.email,
      phone:    person.phone    ?? "",
      jobTitle: person.jobTitle ?? "",
      location: person.location ?? "",
    });
  }, [person, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave(data);
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="label">Nome completo</label>
        <input {...register("name")} className="input" placeholder="Seu Nome" />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">E-mail</label>
        <input {...register("email")} type="email" className="input" placeholder="voce@email.com" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Cargo / Título</label>
        <input {...register("jobTitle")} className="input" placeholder="Ex: Desenvolvedor Full Stack" />
      </div>
      <div>
        <label className="label">Localização</label>
        <input {...register("location")} className="input" placeholder="Ex: Recife, PE" />
      </div>
      <div>
        <label className="label">Telefone</label>
        <input
          value={watch("phone") ?? ""}
          onChange={(e) => setValue("phone", formatPhone(e.target.value), { shouldDirty: true })}
          className="input"
          placeholder="(81) 99999-9999"
          maxLength={15}
          inputMode="numeric"
        />
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
