"use client";

import { ReactNode, useState, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon: ReactNode;
  count?: number;
  onAdd?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

export default function SectionCard({ title, icon, count, onAdd, children, defaultOpen = false, id }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div id={id} className="mb-5 group/section">
      <div className={cn(
        "rounded-2xl border transition-all duration-300",
        open
          ? "border-brand-500/20 bg-surface-1"
          : "border-white/8 bg-surface-1 hover:border-white/15"
      )} style={{
        boxShadow: open ? 'var(--shadow-card)' : 'var(--shadow-sm)',
      }}>
        {/* Header */}
        <div
          className="flex items-center justify-between cursor-pointer p-5 select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
              open
                ? "bg-brand-500/20 text-brand-400 shadow-glow-sm"
                : "bg-white/5 text-white/40 group-hover/section:text-brand-400 group-hover/section:bg-brand-500/10"
            )}>
              {icon}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">{title}</h3>
              {count !== undefined && (
                <p className="text-white/30 text-xs mt-0.5">
                  {count === 0 ? "Nenhum item" : `${count} ${count === 1 ? "item" : "itens"}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onAdd && (
              <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
                  "text-brand-400 hover:bg-brand-500/20 hover:shadow-glow-sm",
                  "border border-transparent hover:border-brand-500/30"
                )}
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            )}
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
              "text-white/25 hover:text-white/50"
            )}>
              <ChevronDown
                size={16}
                className={cn("transition-transform duration-300 ease-out", open && "rotate-180")}
              />
            </div>
          </div>
        </div>

        {/* Content com transição suave */}
        <div
          ref={contentRef}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            open ? "opacity-100" : "opacity-0 max-h-0"
          )}
          style={open ? { maxHeight: contentRef.current ? contentRef.current.scrollHeight + 100 + "px" : "2000px" } : {}}
        >
          <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
