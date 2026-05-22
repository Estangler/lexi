import type { BadgeProps, Variant } from "./Badge.types";

const baseStyles =
  "flex gap-1 text-xs font-medium border border-accent-dim items-center justify-center bg-accent-dim/30 py-2 px-3 rounded-md text-secondary";

const badgeVariant: Record<Variant, string> = {
  primary: "text-accent font-semibold",
  default: "",
};

export default function Badge({
  label,
  variant = "default",
  Icon,
  children,
  className = "",
}: BadgeProps) {
  return (
    <div className={`${baseStyles} ${className}`}>
      {Icon && <Icon className="text-accent animate-pulse" size={16} />}
      <p className={`${badgeVariant[variant]}`}>{label}</p>
      {children}
    </div>
  );
}
