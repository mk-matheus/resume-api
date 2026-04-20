"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  username: z
    .string()
    .min(3, "Username deve ter ao menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/i, "Apenas letras, números e hífen"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const username = watch("username", "");

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await authRegister(data);
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--color-bg)" }}>
      <div className="glow-orb w-[500px] h-[500px] top-[-100px] right-[-100px]"
        style={{ background: "rgba(168,85,247,0.12)" }} />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="card">
          <div className="mb-8">
            <span className="font-display font-bold text-2xl text-white">
              Resume<span className="text-gradient">Forge</span>
            </span>
            <h1 className="font-display font-bold text-2xl text-white mt-4 mb-1">Crie sua conta</h1>
            <p className="text-white/40 text-sm">Gratuito. Sem cartão de crédito.</p>
          </div>

          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="label">Nome completo</label>
              <input {...register("name")} type="text" placeholder="Seu Nome" className="input" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Username</label>
              <input {...register("username")} type="text" placeholder="seu-username" className="input" />
              {errors.username
                ? <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
                : username && (
                  <p className="text-white/30 text-xs mt-1 font-mono">
                    Seu link: /u/<span className="text-brand-400">{username.toLowerCase()}</span>
                  </p>
                )
              }
            </div>

            <div>
              <label className="label">E-mail</label>
              <input {...register("email")} type="email" placeholder="voce@email.com" className="input" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Senha</label>
              <input {...register("password")} type="password" placeholder="Mínimo 6 caracteres" className="input" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
