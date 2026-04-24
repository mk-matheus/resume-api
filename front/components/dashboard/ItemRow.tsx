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
    <div className="group rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3.5 gap-4">
        {/* Left indicator */}
        <div className="w-1 h-8 rounded-full bg-brand-500/30 group-hover:bg-brand-500/60 transition-colors duration-200 flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-medium text-white text-sm truncate">{title}</p>
          {subtitle && (
            <p className="text-white/35 text-xs mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {/* Meta */}
        {meta && (
          <span className="text-white/25 text-[11px] font-mono hidden sm:block flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5">
            {meta}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
              <ChevronDown size={13} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable content */}
      {children && expanded && (
        <div className="px-4 pb-4 text-white/40 text-xs leading-relaxed border-t border-white/5 pt-3 ml-5">
          {children}
        </div>
      )}
    </div>
  );
}
