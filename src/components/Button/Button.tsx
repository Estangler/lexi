import { LoaderCircle } from "lucide-react";
import type { Variant, ButtonProps } from "./Button.types";

const buttonVariant: Record<Variant, string> = {
  primary: "hover:-translate-y-1 bg-accent hover:bg-btn-hover text-background",
  ghost: "border border-accent-dim hover:bg-primary/5 hover:border-primary/20",
};

const baseStyle =
  "active:scale-95 transition-all cursor-pointer duration-150 ease font-medium py-2 px-4 text-sm border rounded-[6px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function Button({
  variant = "primary",
  children,
  loading,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      className={`${baseStyle} ${buttonVariant[variant]}  ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoaderCircle size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
