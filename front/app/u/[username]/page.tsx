import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Person } from "@/types";
import PublicResume from "@/components/resume/PublicResume";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getPerson(username: string): Promise<Person | null> {
  try {
    const res = await fetch(`${API_URL}/people/u/${username}`, {
      next: { revalidate: 60 }, // ISR: revalida a cada 60s
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata> {
  const person = await getPerson(params.username);
  if (!person) return { title: "Currículo não encontrado" };
  return {
    title: `${person.name} — Currículo`,
    description: person.Resumes?.[0]?.summary ?? `Currículo profissional de ${person.name}`,
    openGraph: {
      title: `${person.name} — ResumeForge`,
      description: person.Resumes?.[0]?.summary ?? "",
      images: person.avatarUrl ? [person.avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const person = await getPerson(params.username);
  if (!person) notFound();
  return <PublicResume person={person} username={params.username} />;
}
