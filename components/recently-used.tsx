"use client";

import { Star } from "lucide-react";

interface RecentStyle {
  id: string;
  name: string;
  featured: boolean;
}

interface RecentlyUsedProps {
  styles: RecentStyle[];
  onStyleClick: (style: { id: string; name: string; type: string }) => void;
}

const colorGradients = [
  "linear-gradient(135deg, #d4a574 0%, #8b7355 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
  "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
];

export default function RecentlyUsed({
  styles,
  onStyleClick,
}: RecentlyUsedProps) {
  return (
    <section>
      <label className="text-xs font-bold text-muted-foreground tracking-wide block mb-3 sm:mb-4">
        RECENTLY USED
      </label>
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4">
        {styles.map((style, index) => (
          <button
            key={style.id}
            onClick={() =>
              onStyleClick({
                id: style.id,
                name: style.name,
                type: style.name.toUpperCase(),
              })
            }
            className="flex-shrink-0 group relative"
          >
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-border transition-transform group-hover:scale-110 group-hover:border-primary"
              style={{
                background: colorGradients[index % colorGradients.length],
              }}
            />

            {style.featured && (
              <div className="absolute top-0  right-0  bg-yellow-500 rounded-full p-0.5 sm:p-1 border-2 border-background">
                <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-white text-white" />
              </div>
            )}

            <p className="text-xs text-center mt-1.5 sm:mt-2 text-muted-foreground group-hover:text-foreground transition">
              {style.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
