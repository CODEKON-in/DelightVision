/* `toggleActions` rather than `once: true`, deliberately.

   `once` kills the ScrollTrigger the moment it fires. Reload the page part
   way down and every trigger above the viewport is already past its start,
   so they all fire during ScrollTrigger's first refresh and delete
   themselves from its internal list — while that same refresh is midway
   through iterating it. The iteration walks off the end of the shortened
   array, throws, and takes the whole React tree down with it: a blank page,
   which is what "it freezes on reload" turned out to be.

   These four actions mean play on the way in and do nothing on the way out
   or back, which is what `once` looked like, but the trigger stays in the
   list and the array never changes length underneath the loop. */

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
<<<<<<< HEAD

/* The hero's drifting motes, its slowly turning rosette and its floating
   blooms never end — they are ambient. Left running, GSAP keeps redrawing
   them for the whole visit, including the long stretch after the visitor
   has scrolled past the hero, which is battery a phone should not be
   spending. Pause them whenever their artwork is off screen.

   Returns a cleanup function. Where IntersectionObserver is missing, the
   animations simply keep running as before. */
export function pauseWhileOffscreen(
  element: Element,
  animations: Array<{ pause: () => void; resume: () => void }>
): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const observer = new IntersectionObserver(
    ([entry]) => {
      for (const animation of animations) {
        if (entry.isIntersecting) animation.resume();
        else animation.pause();
      }
    },
    { rootMargin: "100px" }
  );

  observer.observe(element);
  return () => observer.disconnect();
}
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
