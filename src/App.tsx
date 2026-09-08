import { useEffect, useLayoutEffect } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ui } from "./data/copy";
import {
  HOME_PATH,
  consumePendingScroll,
  navigate,
  scrollToHash,
  useRoute,
} from "./lib/router";
import { DecorationsPage } from "./pages/DecorationsPage";
import { Combos } from "./sections/Combos";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Combos />
      <Contact />
    </>
  );
}

export default function App() {
  const route = useRoute();
  const onHome = route === "home";

  /* Every `#services`-style link on the site goes through here: the header,
     the footer, the phone menu and the skip link.

     On the main page it performs the smooth glide itself. That used to come
     from `scroll-behavior: smooth` on `html`, but that rule also caught
     ScrollTrigger's own measuring scrolls and froze the page on a reload
     part-way down it — see the note in `index.css`. Doing it on the click
     keeps the glide where it was wanted and nowhere else.

     Away from the main page those ids do not exist, so the same links go
     home first and then jump.

     Listening on the document rather than on this element is deliberate:
     the phone menu is portalled to <body> and would otherwise be missed. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      /* Leave alone: right/middle clicks, and the modified clicks people
         use to open something in a new tab. */
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href?.startsWith("#")) return;

      if (!onHome) {
        event.preventDefault();
        navigate(HOME_PATH + href);
        return;
      }

      /* Only take over once the target is known to exist; otherwise leave
         the browser to handle the link as it normally would. */
      if (!scrollToHash(href)) return;
      event.preventDefault();
      /* Keeps the address bar and the back button in step, exactly as the
         plain anchor did. */
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onHome]);

  /* Scrolling to the new page's starting point belongs here rather than in
     `navigate`, because the thing being scrolled to only exists once React
     has rendered the page. An effect runs after that commit; a rAF callback
     would too, but rAF stops firing in a window that is not painting, and
     the visitor would land halfway down the previous page's scroll. */
  useLayoutEffect(consumePendingScroll, [route]);

  /* So a bookmarked or shared Decorations link is named properly, and the
     browser's own back button shows something meaningful in its history. */
  useEffect(() => {
    document.title = onHome
      ? ui.pageTitle
      : `${ui.decorationsTitle} — ${ui.pageTitle}`;
  }, [onHome]);

  return (
    <div className="min-h-screen bg-ivory">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:font-semibold focus:text-ivory-light"
      >
        {ui.skipToServices}
      </a>

      <Header />

      <main>{onHome ? <Home /> : <DecorationsPage />}</main>

      <Footer />
    </div>
  );
}
