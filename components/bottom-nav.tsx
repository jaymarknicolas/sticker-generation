"use client";

import { Upload, Palette, Zap, Send } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl sm:rounded-t-2xl">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 sm:px-4 py-3 sm:py-4">
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition px-1">
          <Upload className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">
            UPLOAD
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition px-1">
          <Palette className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">STYLE</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition px-1">
          <Zap className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">
            CREATE
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition px-1">
          <Send className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">SHIP</span>
        </button>
      </div>
    </div>
  );
}
