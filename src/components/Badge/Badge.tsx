import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-1 text-[12px] font-medium border border-accent-dim items-center justify-center bg-accent-dim/30 py-2 px-3 rounded-md text-secondary">
      <Sparkles className="text-accent animate-pulse" size={16} />
      <p>{children}</p>
    </div>
  );
}
