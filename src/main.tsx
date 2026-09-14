import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App.tsx";
/* Self-hosted web fonts. Served from our own origin so the type never
   waits on a third party, and so the site keeps working where Google
   Fonts is slow or blocked. Weights match the type system exactly. */
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/* Web fonts change text height, which shifts every scroll trigger.
   Recalculate once they have loaded. */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
