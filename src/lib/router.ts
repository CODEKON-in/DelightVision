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

export type RouteName = "home" | "decorations";

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

export function routeName(path: string): RouteName {
  return path === DECORATIONS_PATH ? "decorations" : "home";
}

export function useRoute(): RouteName {
  return routeName(useSyncExternalStore(subscribe, snapshot, snapshot));
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
