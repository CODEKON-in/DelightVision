import { useState } from "react";

/* A photo tile. The gradient + floral motif is painted underneath, so if an
   image is missing, slow or fails to load, the tile still looks designed
   rather than blank. Pass `src` to show a photograph on top. */

const palettes = [
  { from: "#efe6f5", to: "#cdb8de", ink: "#4a2a63" },
  { from: "#f7efdc", to: "#e0cb9a", ink: "#6b5210" },
  { from: "#f3e4ea", to: "#d9b3c3", ink: "#6d2a45" },
  { from: "#e8e6f5", to: "#bdb8dc", ink: "#3c3670" },
  { from: "#e7f0ec", to: "#bcd4c6", ink: "#2f5544" },
  { from: "#f5e8e2", to: "#dcbcab", ink: "#6f4433" },
];

/* Unsplash resizes on the fly, so hand the browser a set of widths and let
   it pick one. Any other URL - a real photo dropped into `public/` - is
   used exactly as given. */
const UNSPLASH = "images.unsplash.com";
const WIDTHS = [200, 320, 480, 640, 800, 1200];

function buildSrcSet(src: string): string | undefined {
  if (!src.includes(UNSPLASH)) return undefined;
  return WIDTHS.map((w) => {
    const url = src
      .replace(/([?&])w=\d+/, `$1w=${w}`)
      .replace(/([?&])h=\d+/, `$1h=${Math.round(w * 1.25)}`);
    return `${url} ${w}w`;
  }).join(", ");
}

type Props = {
  index: number;
  /* DUMMY photo URL  see src/data/services.ts */
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  /* Width this image occupies at each breakpoint, so the browser can
     choose a source. Defaults to the two-up card layout. */
  sizes?: string;
};

export function PlaceholderPhoto({
  index,
  src,
  alt,
  label,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 48vw",
}: Props) {
  const p = palettes[index % palettes.length];
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${p.from} 0%, ${p.to} 100%)` }}
      {...(!imageSrc ? { role: "img", "aria-label": label ?? `Wedding photo ${index + 1}` } : {})}
    >
      {/* Decorative rings + floral mark, rotated per tile so a grid of
          fallbacks does not look like copies of one image. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke={p.ink} strokeOpacity="0.28" strokeWidth="1.5">
          <circle cx={40 + (index % 3) * 20} cy="42" r="30" />
          <circle cx="168" cy={150 - (index % 4) * 12} r="44" />
        </g>
        <g
          transform={`translate(100 104) rotate(${(index % 4) * 12 - 18}) scale(1.7)`}
          fill="none"
          stroke={p.ink}
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M0 -14C7 -9 7 -1 0 4C-7 -1 -7 -9 0 -14Z" />
          <path d="M0 4C0 12 0 16 0 20" />
          <path d="M0 10C-5 8 -8 4 -9 0" />
          <path d="M0 13C5 11 8 7 9 3" />
        </g>
      </svg>

      {imageSrc && (
        <img
          src={imageSrc}
          srcSet={buildSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt ?? label ?? ""}
          loading="lazy"
          decoding="async"
          onError={() => setImageSrc(undefined)}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {label && (
        <span
          className="absolute right-3 bottom-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/90 px-3 py-1 text-sm font-semibold tracking-wide break-words"
          style={{ color: p.ink }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
