import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "var(--color-bg)" }}>
      <p className="font-mono text-brand-500 text-sm mb-4">404</p>
      <h1 className="font-display font-extrabold text-4xl text-white mb-3">Página não encontrada</h1>
      <p className="text-white/40 mb-8">O currículo ou página que você procura não existe.</p>
      <Link href="/" className="btn-primary">Voltar ao início</Link>
    </div>
  );
}
