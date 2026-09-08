import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/* Web fonts change text height, which shifts every scroll trigger.
   Recalculate once they have loaded. */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
