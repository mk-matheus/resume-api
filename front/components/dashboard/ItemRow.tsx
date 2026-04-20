"use client";

import { ReactNode, useState } from "react";
import { Trash2, ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  meta?: string;
  onDelete: () => void;
  onEdit: () => void;
  children?: ReactNode;
}

export default function ItemRow({ title, subtitle, meta, onDelete, onEdit, children }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/8 bg-surface-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-display font-medium text-white text-sm truncate">{title}</p>
          {subtitle && <p className="text-white/40 text-xs mt-0.5 truncate">{subtitle}</p>}
        </div>
        {meta && <span className="text-white/30 text-xs font-mono hidden sm:block flex-shrink-0">{meta}</span>}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-brand-400 hover:bg-brand-500/15 transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/15 transition-colors">
            <Trash2 size={13} />
          </button>
          {children && (
            <button onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
              <ChevronDown size={13} className={cn("transition-transform", expanded && "rotate-180")} />
            </button>
          )}
        </div>
      </div>
      {children && expanded && (
        <div className="px-4 pb-4 text-white/40 text-xs leading-relaxed border-t border-white/5 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
