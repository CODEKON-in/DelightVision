import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "whatsapp";
type Size = "md" | "lg";

/* Tap targets are deliberately large (56px / 64px tall) — this site is
   built for guests who may be 50+ and browsing one-handed on a phone. */
const sizes: Record<Size, string> = {
  md: "min-h-14 px-3 text-base sm:px-6",
  lg: "min-h-16 px-5 text-lg sm:px-8",
};

const variants: Record<Variant, string> = {
  /* Charcoal rather than gold. The brand's black is what carries a call to
     action here; gold only ever trims one. */
  primary:
    "bg-charcoal text-ivory-light shadow-soft hover:bg-graphite active:bg-obsidian",
  /* Light chip for use on ivory sections */
  secondary:
    "bg-ivory-light text-charcoal border-2 border-charcoal/25 shadow-soft hover:border-charcoal/50 hover:bg-cream/60 active:bg-cream",
  /* The primary inverted, for the hero and the phone menu. A charcoal fill
     on a near-black ground is barely a button at all, so on the dark
     sections the same action becomes light-on-dark with a gold edge. */
  onDark:
    "bg-ivory-light text-charcoal border border-gold/45 shadow-soft hover:bg-cream hover:border-gold/70 active:bg-cream-dark",
  whatsapp:
    "bg-whatsapp text-white shadow-soft hover:bg-whatsapp-dark active:bg-whatsapp-dark",
};

const base = [
  "inline-flex items-center justify-center gap-3 rounded-full font-semibold tracking-wide",
  "transition-transform transition-colors duration-200 ease-out motion-safe:hover:-translate-y-0.5",
].join(" ");

type Common = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};

type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ActionProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: LinkProps | ActionProps) {
  const {
    variant = "primary",
    size = "lg",
    fullWidth = false,
    icon,
    children,
    className = "",
    ...rest
  } = props;

  const cls = [base, sizes[size], variants[variant], fullWidth ? "w-full" : "", className].join(" ");
  const inner = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (typeof props.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
