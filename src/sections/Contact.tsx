import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { GoldMotes } from "../components/Royal";
import { SectionHeading } from "../components/SectionHeading";
import { ClockIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, mapEmbedSrc, mapLinkHref, telHref, whatsappHrefFor } from "../data/site";

export function Contact() {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-royal py-[clamp(3.5rem,9vw,6rem)]">
      <GoldMotes />
      <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            onDark
            eyebrow={ui.contactEyebrow}
            title={ui.contactTitle}
            subtitle={ui.contactSubtitle}
          />
        </Reveal>

        {/* The number itself is the biggest tappable thing here — a caller
            should never have to hunt for an icon. */}
        <Reveal className="mt-12 text-center">
          <p className="label-gold text-gold-soft">{ui.callUsOn}</p>
          <a
            href={telHref}
            className="nums-lining mt-2 inline-block px-4 py-2 font-serif text-4xl font-semibold break-words text-gold-soft underline decoration-gold decoration-2 underline-offset-8 sm:text-5xl"
          >
            {business.phoneDisplay}
          </a>
        </Reveal>

        <Reveal className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            href={telHref}
            variant="primary"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<PhoneIcon className="size-6" />}
          >
            {ui.callNow}
          </Button>
          <Button
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<WhatsAppIcon className="size-6" />}
          >
            {ui.whatsappUs}
          </Button>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-royal-line bg-royal-light p-6">
            <AnimatedIcon className="shrink-0">
              <LocationIcon className="size-7 text-gold-soft" />
            </AnimatedIcon>
            <div>
              <p className="text-base font-semibold text-ivory-light">{ui.visitUs}</p>
              <p className="mt-1 text-base text-muted-soft">{business.addressLine1}</p>
              <p className="text-base text-muted-soft">{business.addressLine2}</p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-royal-line bg-royal-light p-6">
            <AnimatedIcon className="shrink-0">
              <ClockIcon className="size-7 text-gold-soft" />
            </AnimatedIcon>
            <div>
              <p className="text-base font-semibold text-ivory-light">{ui.timings}</p>
              <p className="mt-1 text-base text-muted-soft">{business.hours}</p>
            </div>
          </div>
        </Reveal>

        {/* Google Maps embed — keyless search embed, no API key needed */}
        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-gold/25 shadow-soft">
            <iframe
              title={`${ui.mapTitle}: ${business.name}, ${business.addressLine1}, ${business.addressLine2}`}
              src={mapEmbedSrc}
              className="h-72 w-full border-0 sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={mapLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-12 items-center gap-2 px-4 text-base font-semibold text-gold-soft underline decoration-gold decoration-2 underline-offset-4"
          >
            <LocationIcon className="size-5" />
            {ui.openInMaps}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
