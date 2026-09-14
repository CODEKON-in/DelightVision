import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* Stroke icons share one set of defaults so every service card reads
   as part of the same family. */
function Stroke({ children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* -- Service icons -------------------------------------------------- */

export function DecorationIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      {/* Mandap arch with floral accents */}
      <path d="M4 21V10a8 8 0 0 1 16 0v11" />
      <path d="M2 21h20" />
      <circle cx="12" cy="4.5" r="1.6" />
      <circle cx="6.6" cy="7.6" r="1.2" />
      <circle cx="17.4" cy="7.6" r="1.2" />
      <path d="M8 21v-5a4 4 0 0 1 8 0v5" />
    </Stroke>
  );
}

export function FoodIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      {/* Served plate under a cloche */}
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M2.5 16h19" />
      <path d="M12 8V5.5" />
      <path d="M5 19.5h14" />
    </Stroke>
  );
}

export function PhotographyIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.3-2h6.8l1.3 2h1.8A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
      <circle cx="12" cy="12.5" r="3.6" />
    </Stroke>
  );
}

export function VideographyIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="6.5" width="12.5" height="11" rx="2.5" />
      <path d="M15 11l5.2-2.9a.6.6 0 0 1 .9.5v6.8a.6.6 0 0 1-.9.5L15 13z" />
    </Stroke>
  );
}

export function AlbumIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      {/* Bound album with a photo on the cover */}
      <path d="M5 3.5h13a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5z" />
      <path d="M7.5 3.5v17" />
      <path d="M10.5 14.5l2.2-2.6 1.6 1.8 1.2-1.3 1.5 2.1z" />
      <circle cx="11.6" cy="8.6" r="1" />
    </Stroke>
  );
}

export function EditingIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      {/* Film strip with an edit sparkle */}
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M7 5.5v13M17 5.5v13" />
      <path d="M2.5 12h4.5M17 12h4.5" />
      <path d="M12 9.2l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9z" />
    </Stroke>
  );
}

export function PhotoEditingIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      {/* Photograph with a retouch wand */}
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M2.5 15.5l4.6-4.6 3.4 3.4 3-3 3.4 3.4" />
      <circle cx="8.4" cy="9.1" r="1.3" />
      <path d="M17.6 4.2l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" />
    </Stroke>
  );
}

/* -- Contact / UI icons --------------------------------------------- */

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.6 3h-.3A3.3 3.3 0 0 0 3 6.3C3 14.4 9.6 21 17.7 21a3.3 3.3 0 0 0 3.3-3.3v-.3a1.5 1.5 0 0 0-1-1.4l-3.3-1.2a1.5 1.5 0 0 0-1.7.5l-.9 1.1a11.6 11.6 0 0 1-5.5-5.5l1.1-.9a1.5 1.5 0 0 0 .5-1.7L8.9 4.9a1.5 1.5 0 0 0-1.4-1z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.94 9.94 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2zm0 1.85c2.17 0 4.2.84 5.73 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.8.82-2.99-.2-.31a8.07 8.07 0 0 1-1.24-4.3c0-4.48 3.64-8.11 8.12-8.11zm-3.2 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.74-1.81-.2-.47-.4-.41-.55-.42h-.46z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2.5} {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Stroke>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </Stroke>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </Stroke>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Stroke>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
    </Stroke>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Stroke>
  );
}

