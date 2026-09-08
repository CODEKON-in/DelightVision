import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /* Gold border + glow, used for the highlighted combo */
  featured?: boolean;
  /* Drop the built-in padding and clip to the corner radius, so a photo
     can run edge to edge at the top of the card */
  flush?: boolean;
};

export function Card({
  children,
  featured = false,
  flush = false,
  className = "",
  ...rest
}: CardProps) {

  return (
    <div
      className={[
        "relative rounded-3xl transition-shadow duration-300",
        flush ? "overflow-hidden" : "p-6 sm:p-8",
        featured
          ? "bg-ivory-light royal-sheen royal-glow border-2 border-gold"
          : "bg-ivory-light border border-cream-dark shadow-soft hover:shadow-lift",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
