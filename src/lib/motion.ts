/* Some environments never fire requestAnimationFrame — a backgrounded or
   occluded window, certain low-power modes. GSAP's ticker then never
   advances, which would leave artwork permanently half-drawn or invisible.

   Every animation in this project therefore has a safety net. The net must
   only catch a genuinely dead ticker though: a scroll-triggered animation
   that simply has not been scrolled to yet is perfectly healthy, and
   forcing it to finish would mean the visitor never sees it play.

   So we probe once at startup and only force an end state if the browser
   really is not painting. */

let tickerAlive = false;

requestAnimationFrame(() => {
  tickerAlive = true;
});

/* Runs `forceEnd` after `delay` ms, but only if the browser never painted
   a frame. Returns the timeout id so callers can clear it on cleanup. */
export function settleIfStalled(forceEnd: () => void, delay = 1500): number {
  return window.setTimeout(() => {
    if (!tickerAlive) forceEnd();
  }, delay);
}
