import { useSyncExternalStore } from "react";

/* The whole router.

   The site is two pages — the main page and Decorations — so it does not
   need a routing library. Paths are real paths rather than hashes, because
   the header, footer and menu already use `#services`-style hashes to jump
   around the main page, and folding both meanings into one `#` would make
   each harder to reason about. `netlify.toml` already serves index.html for
   any unknown path, and Vite's dev server does the same, so `/decorations`
   loads directly and can be bookmarked or shared. */

export const HOME_PATH = "/";
export const DECORATIONS_PATH = "/decorations";
/* One combo package's own detail page, e.g. "/packages/complete" — the
   Combo Packages section's "View Package Details" button sends visitors
   here instead of opening a popup, so each package gets a real,
   bookmarkable page listing its Bronze/Silver/Gold tiers. */
export const PACKAGES_PATH_PREFIX = "/packages/";

export type RouteName = "home" | "decorations" | "package";

const listeners = new Set<() => void>();

/* Trailing slashes are stripped so `/decorations/` and `/decorations` are
   the same page rather than one of them quietly falling back to home. */
function normalize(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return path === "" ? HOME_PATH : path;
}

let currentPath = normalize(window.location.pathname);

/* Where to scroll once the page being opened has actually rendered. Held
   here rather than acted on immediately because the element does not exist
   yet — `consumePendingScroll` is called from an effect after React has
   committed the new page. Left null by a Back or Forward press, so the
   browser's own scroll restoration is not fought with. */
const SCROLL_TO_TOP = "top";
let pendingScroll: string | null = null;

function publish() {
  const next = normalize(window.location.pathname);
  if (next === currentPath) return;
  currentPath = next;
  for (const listener of listeners) listener();
}

/* Back and forward buttons */
window.addEventListener("popstate", publish);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return currentPath;
}

/* Builds/reads the "/packages/<comboId>" path, optionally with a second
   segment naming which Bronze/Silver/Gold tier was selected on the Combo
   Packages section — e.g. "/packages/complete/Silver" — so "View Package
   Details" opens straight onto the tier a visitor was already looking at,
   instead of always starting from the first one. Kept as one small family
   of functions so the prefix and the two-segment shape are only ever
   spelled out once. */
export function packagePathFor(comboId: string, tierName?: string): string {
  const base = `${PACKAGES_PATH_PREFIX}${comboId}`;
  return tierName ? `${base}/${encodeURIComponent(tierName)}` : base;
}

function packagePathRest(path: string): string | null {
  return path.startsWith(PACKAGES_PATH_PREFIX) && path.length > PACKAGES_PATH_PREFIX.length
    ? path.slice(PACKAGES_PATH_PREFIX.length)
    : null;
}

export function comboIdFromPath(path: string): string | null {
  const rest = packagePathRest(path);
  if (rest === null) return null;
  const slash = rest.indexOf("/");
  return slash === -1 ? rest : rest.slice(0, slash);
}

/* null when the path doesn't name a tier — the page then falls back to the
   combo's first tier, exactly as it did before tiers were addressable. */
export function tierNameFromPath(path: string): string | null {
  const rest = packagePathRest(path);
  if (rest === null) return null;
  const slash = rest.indexOf("/");
  if (slash === -1) return null;
  const tier = rest.slice(slash + 1);
  return tier ? decodeURIComponent(tier) : null;
}

export function routeName(path: string): RouteName {
  if (path === DECORATIONS_PATH) return "decorations";
  if (comboIdFromPath(path)) return "package";
  return "home";
}

export function useRoute(): RouteName {
  return routeName(useSyncExternalStore(subscribe, snapshot, snapshot));
}

/* The raw current path, for a caller (just App.tsx today) that needs more
   than the route's name — e.g. which combo a "/packages/<id>" page is
   for. */
export function useRoutePath(): string {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/* Smooth unless the visitor has asked for less motion. Read per call rather
   than once, so a changed setting takes effect straight away. */
function behavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/* Glides to the element a hash names, and says whether it found one.

   This is the site's smooth scrolling. It used to be
   `scroll-behavior: smooth` on `html`, which also caught ScrollTrigger's own
   measuring scrolls and locked the page up on a reload part-way down the
   page — see the note in `index.css`. Doing it here keeps the glide on the
   links people click and nowhere else. */
export function scrollToHash(hash: string): boolean {
  const el = hash.length > 1 ? document.querySelector(hash) : null;
  if (!el) return false;
  el.scrollIntoView({ behavior: behavior(), block: "start" });
  return true;
}

function scrollToTarget(target: string) {
  if (target === SCROLL_TO_TOP) {
    /* Instant: the page underneath has just been replaced, so there is
       nothing to glide past. */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return;
  }
  scrollToHash(target);
}

/* Moves to a path, which may carry a hash naming what to scroll to on
   arrival. Staying on the same page scrolls straight away, because the
   target is already rendered. */
export function navigate(to: string): void {
  const url = new URL(to, window.location.origin);
  const samePage = normalize(url.pathname) === currentPath;

  if (samePage && !url.hash) return;

  window.history.pushState(null, "", url);

  if (samePage) {
    scrollToTarget(url.hash);
    return;
  }

  pendingScroll = url.hash || SCROLL_TO_TOP;
  publish();
}

/* Performs and clears whatever scroll the last `navigate` asked for. Safe to
   call on every route change: it does nothing after a Back or Forward. */
export function consumePendingScroll(): void {
  const target = pendingScroll;
  pendingScroll = null;
  if (target) scrollToTarget(target);
}
