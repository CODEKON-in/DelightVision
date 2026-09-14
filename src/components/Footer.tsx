import { AnimatedIcon } from "./AnimatedIcon";
import { Flourish } from "./Flourish";
import { Reveal } from "./Reveal";
import { ClockIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import logo from "../assets/logo-white.png";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";

export function Footer() {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);

  const explore = [
    { href: "#services", label: ui.navServices },
    { href: "#packages", label: ui.footerComboPackages },
    { href: "#contact", label: ui.navContact },
  ];

  return (
    <footer className="relative overflow-hidden bg-charcoal">
      {/* Hairline that separates the footer from the section above */}
      <div
        className="gold-rule h-px w-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 lg:px-8">
        {/* Brand */}
        <Reveal className="flex flex-col items-center text-center">
          <img src={logo} alt={business.name} className="h-16 w-auto sm:h-20" />
          <p className="mt-4 type-slogan text-xl text-gold-soft">{business.tagline}</p>
          <Flourish className="mt-5" />
        </Reveal>

        {/* Two columns of links and details. They only hold a short menu
            and a few lines of contact detail, so left across the full
            6xl container they sat in the left half with a dead third to
            the right. Capping the pair at 3xl and centring it under the
            brand keeps the footer balanced on a wide screen. */}
        <Reveal
          as="div"
          stagger={0.08}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:gap-8 sm:text-left"
        >
          <div>
            <h2 className="label-gold text-gold-soft">{ui.footerExplore}</h2>
            <ul className="mt-4 flex flex-col">
              {explore.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-base text-muted-soft transition-colors hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label-gold text-gold-soft">{ui.footerReachUs}</h2>

            <a
              href={telHref}
              className="type-price mt-4 inline-flex min-h-12 items-center gap-2 text-2xl text-gold-soft underline decoration-gold decoration-2 underline-offset-4"
            >
              <AnimatedIcon>
                <PhoneIcon className="size-5" />
              </AnimatedIcon>
              {business.phoneDisplay}
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-12 items-center justify-center gap-2 text-base text-muted-soft transition-colors hover:text-gold-soft sm:justify-start"
            >
              <AnimatedIcon>
                <WhatsAppIcon className="size-5" />
              </AnimatedIcon>
              {ui.messageOnWhatsapp}
            </a>

            <p className="mt-4 flex items-start justify-center gap-2 text-base text-muted-soft sm:justify-start">
              <AnimatedIcon className="mt-0.5 shrink-0">
                <LocationIcon className="size-5 text-gold" />
              </AnimatedIcon>
              <span>
                {business.addressLine1}
                <br />
                {business.addressLine2}
              </span>
            </p>

            <p className="mt-3 flex items-start justify-center gap-2 text-base text-muted-soft sm:justify-start">
              <AnimatedIcon className="mt-0.5 shrink-0">
                <ClockIcon className="size-5 text-gold" />
              </AnimatedIcon>
              <span>{business.hours}</span>
            </p>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-dark-line pt-6">
          <p className="text-center text-base text-muted-soft">
            &copy; {new Date().getFullYear()} {business.name}. {ui.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
