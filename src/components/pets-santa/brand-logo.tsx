import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  size?: BrandLogoSize;
  showText?: boolean;
  showSubtitle?: boolean;
}

const sizeClasses: Record<
  BrandLogoSize,
  { icon: string; title: string; subtitle: string }
> = {
  sm: {
    icon: "h-7 w-7",
    title: "text-xl",
    subtitle: "text-[8px]",
  },
  md: {
    icon: "h-8 w-8",
    title: "text-xl",
    subtitle: "text-[8px]",
  },
  lg: {
    icon: "h-12 w-12",
    title: "text-3xl",
    subtitle: "text-[9px]",
  },
};

export default function BrandLogo({
  className,
  iconClassName,
  textClassName,
  size = "sm",
  showText = true,
  showSubtitle = false,
}: BrandLogoProps) {
  const classes = sizeClasses[size];

  return (
    <span className={cn("flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pets-santa-logo.svg"
        alt={showText ? "" : "Pets Santa"}
        aria-hidden={showText}
        className={cn(
          "shrink-0 select-none drop-shadow-sm transition-transform group-hover:rotate-12",
          classes.icon,
          iconClassName,
        )}
      />
      {showText && (
        <span className={cn("leading-none", textClassName)}>
          <span
            className={cn(
              "block bg-gradient-to-r from-red-600 to-red-500 bg-clip-text font-serif font-extrabold italic tracking-tight text-transparent",
              classes.title,
            )}
          >
            Pets Santa
          </span>
          {showSubtitle && (
            <span
              className={cn(
                "mt-1 block font-mono font-bold uppercase tracking-widest text-slate-400",
                classes.subtitle,
              )}
            >
              AI Portrait Studio
            </span>
          )}
        </span>
      )}
    </span>
  );
}
