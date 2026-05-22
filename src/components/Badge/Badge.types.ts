import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type Variant = "primary" | "default";

export type BadgeProps = {
  label: string;
  variant?: Variant;
  Icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
};
