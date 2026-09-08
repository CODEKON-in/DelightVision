import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ui } from "./data/copy";
import { Combos } from "./sections/Combos";
import { Contact } from "./sections/Contact";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";

export default function App() {
  return (
    <div className="min-h-screen bg-ivory">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:font-semibold focus:text-ivory-light"
      >
        {ui.skipToServices}
      </a>

      <Header />

      <main>
        <Hero />
        <Services />
        <Combos />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
