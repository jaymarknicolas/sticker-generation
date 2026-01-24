"use client";

import { Upload, Palette, Sparkles, Package } from "lucide-react";

interface NavItem {
  icon: typeof Upload;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Upload, label: "Upload", active: true },
  { icon: Palette, label: "Style" },
  { icon: Sparkles, label: "Create" },
  { icon: Package, label: "Orders" },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/50 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 ${
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Active indicator */}
              {item.active && (
                <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 relative z-10 ${
                  item.active ? "stroke-[2.5]" : ""
                }`}
              />
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide relative z-10 ${
                  item.active ? "text-primary" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
