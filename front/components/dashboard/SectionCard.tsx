"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon: ReactNode;
  count?: number;
  onAdd?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function SectionCard({ title, icon, count, onAdd, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-brand-400">{icon}</span>
          <h3 className="font-display font-semibold text-white">{title}</h3>
          {count !== undefined && (
            <span className="badge text-xs">{count}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-400 hover:bg-brand-500/20 transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
          <ChevronDown
            size={18}
            className={cn("text-white/30 transition-transform duration-200", open && "rotate-180")}
          />
        </div>
      </div>
      {open && <div className="mt-6 space-y-4">{children}</div>}
    </div>
  );
}
