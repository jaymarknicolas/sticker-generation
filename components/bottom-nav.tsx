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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40">
      {/* Safe area padding for devices with home indicators */}
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                item.active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${item.active ? "stroke-[2.5]" : ""}`}
              />
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                item.active ? "text-primary" : ""
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
