"use client";

import Link from "next/link";
import { ArrowRight, Zap, Globe, Lock, Sparkles, ChevronRight } from "lucide-react";

const features = [
  {
    icon: <Zap size={20} />,
    title: "Setup em minutos",
    desc: "Crie sua conta, preencha seu currículo e tenha uma página profissional ao vivo em menos de 5 minutos.",
  },
  {
    icon: <Globe size={20} />,
    title: "Link público compartilhável",
    desc: "Cada currículo ganha uma URL única. Mande para recrutadores, coloque no LinkedIn ou na bio do GitHub.",
  },
  {
    icon: <Lock size={20} />,
    title: "Você no controle",
    desc: "Só você pode editar seu currículo. Autenticação JWT garante que seus dados são só seus.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Visual que impressiona",
    desc: "Design moderno e responsivo que mostra seu perfil de forma clara e elegante em qualquer dispositivo.",
  },
];

const steps = [
  { n: "01", title: "Crie sua conta", desc: "Escolha um username único que vira sua URL pública." },
  { n: "02", title: "Preencha seu perfil", desc: "Adicione experiências, formações, skills e links." },
  { n: "03", title: "Compartilhe", desc: "Envie o link para recrutadores ou cole no LinkedIn." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--color-bg)" }}>
      {/* Orbs decorativos */}
      <div className="glow-orb w-[600px] h-[600px] top-[-200px] left-[-100px]"
        style={{ background: "rgba(97,87,246,0.18)" }} />
      <div className="glow-orb w-[400px] h-[400px] top-[200px] right-[-100px]"
        style={{ background: "rgba(168,85,247,0.12)" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display font-bold text-xl text-white">
          Resume<span className="text-gradient">Forge</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2">
            Entrar
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm px-4 py-2">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 badge mb-8 animate-fade-in">
          <Sparkles size={12} />
          <span>Portfólio profissional em minutos</span>
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-[1.05] mb-6"
          style={{ animationDelay: "0.1s" }}>
          Seu currículo.
          <br />
          <span className="text-gradient">Seu link.</span>
          <br />
          Sua marca.
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10 font-body leading-relaxed"
          style={{ animationDelay: "0.2s" }}>
          Crie um currículo digital moderno, ganhe uma URL pública e compartilhe com recrutadores de qualquer lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}>
          <Link href="/auth/register" className="btn-primary px-8 py-4 text-base">
            Criar meu currículo <ArrowRight size={18} />
          </Link>
          <Link href="/auth/login" className="btn-ghost px-8 py-4 text-base">
            Já tenho conta
          </Link>
        </div>

        {/* Preview URL mockup */}
        <div className="mt-16 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-surface-1">
          <span className="text-white/30 text-sm font-mono">resumeforge.vercel.app/u/</span>
          <span className="text-brand-400 font-mono font-medium text-sm">seu-username</span>
          <ChevronRight size={14} className="text-white/20" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <p className="text-center text-white/30 text-xs font-mono uppercase tracking-widest mb-4">Por que ResumeForge</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white text-center mb-16">
          Tudo que você precisa,<br />
          <span className="text-gradient">nada que você não precisa.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-hover group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-brand-400"
                  style={{ background: "rgba(97,87,246,0.15)", border: "1px solid rgba(97,87,246,0.25)" }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <p className="text-center text-white/30 text-xs font-mono uppercase tracking-widest mb-4">Como funciona</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white text-center mb-16">
          Três passos para <span className="text-gradient">se destacar</span>
        </h2>

        <div className="relative">
          {/* Linha conectora */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-brand-500 via-purple-500 to-transparent hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-lg text-brand-400 relative z-10"
                  style={{ background: "var(--color-surface2)", border: "1px solid rgba(97,87,246,0.3)" }}>
                  {s.n}
                </div>
                <div className="pt-3">
                  <h3 className="font-display font-semibold text-white text-xl mb-1">{s.title}</h3>
                  <p className="text-white/50 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-6 py-32 text-center">
        <div className="glow-orb w-[500px] h-[300px] inset-x-0 mx-auto bottom-0"
          style={{ background: "rgba(97,87,246,0.2)" }} />
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-6 relative z-10">
          Pronto para criar seu<br />
          <span className="text-gradient">currículo profissional?</span>
        </h2>
        <p className="text-white/40 mb-10 text-lg relative z-10">
          Gratuito. Sem cartão de crédito. Online em minutos.
        </p>
        <Link href="/auth/register" className="btn-primary px-10 py-4 text-base relative z-10">
          Começar agora <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-8 text-center text-white/20 text-sm font-mono">
        ResumeForge © {new Date().getFullYear()} — by{" "}
        <a href="https://github.com/mk-matheus" className="text-brand-400 hover:text-brand-300 transition-colors">
          mk-matheus
        </a>
      </footer>
    </div>
  );
}
