"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Erro ao entrar. Verifique suas credenciais.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div className="glow-orb w-[500px] h-[500px] top-[-100px] left-[-100px]"
        style={{ background: "rgba(97,87,246,0.15)" }} />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="card">
          <div className="mb-8">
            <span className="font-display font-bold text-2xl text-white">
              Resume<span className="text-gradient">Forge</span>
            </span>
            <h1 className="font-display font-bold text-2xl text-white mt-4 mb-1">Bem-vindo de volta</h1>
            <p className="text-white/40 text-sm">Entre na sua conta para editar seu currículo</p>
          </div>

          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="label">E-mail</label>
              <input
                {...register("email")}
                type="email"
                placeholder="voce@email.com"
                className="input"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Senha</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="input"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Entrar"}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Não tem conta?{" "}
            <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
