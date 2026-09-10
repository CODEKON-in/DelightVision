import { useEffect, useState } from "react";
import { MobileMenu, type NavLink } from "./MobileMenu";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { ui } from "../data/copy";
import { business, telHref } from "../data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: NavLink[] = [
    { href: "#services", label: ui.navServices },
    { href: "#packages", label: ui.navPackages },
    { href: "#contact", label: ui.navContact },
  ];

  /* A rotated phone would leave the panel open over a desktop layout */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-dark-line bg-obsidian sm:bg-obsidian/95 sm:backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1.5 px-4 xs:gap-2 xs:px-5 sm:h-20 sm:gap-3 lg:px-8">
        <a href="#top" className="flex min-h-11 min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 bg-gold" />
          {/* Fluid: a 320px phone has roughly a third less room in the
              header than a 430px one. */}
          <span className="truncate font-serif text-[clamp(1.05rem,4.4vw,1.5rem)] font-semibold text-ivory-light">
            {business.name}
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label={ui.mainNavigation}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-base font-medium text-muted-soft transition-colors hover:text-gold-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Calling stays one tap from anywhere, on every screen size */}
          <a
            href={telHref}
            aria-label={ui.callBusiness}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-gold/50 bg-graphite px-3 font-semibold text-ivory-light transition-colors hover:border-gold hover:bg-charcoal sm:px-5 md:px-6"
          >
            <PhoneIcon className="size-5 shrink-0" />
            <span className="hidden xs:inline">{ui.callNow}</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-dark-line text-ivory-light transition-colors active:bg-graphite lg:hidden"
          >
            {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </header>
  );
}
