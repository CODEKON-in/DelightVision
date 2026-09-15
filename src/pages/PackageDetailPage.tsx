import { useState } from "react";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { ServiceCard } from "../components/ServiceCard";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { combos, serviceById, type Service } from "../data/services";
import { HOME_PATH, navigate, packageDecorationsPathFor, packagePathFor } from "../lib/router";
import { ComboDetail } from "../sections/ComboDetail";
import { ServiceDetail } from "../sections/ServiceDetail";

/* Back to where the visitor came from. Written out in words rather than
   left to the browser's back button, and repeated at the foot of the page
   so it is there whichever end they finish at — the same pattern the
   Decorations page uses for "Back to Services". */
function BackToPackages({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`${HOME_PATH}#packages`)}
      className={`inline-flex min-h-12 items-center gap-2 type-nav text-base text-charcoal transition-colors hover:text-graphite ${className}`}
    >
      <span aria-hidden="true">&larr;</span>
      {ui.backToPackages}
    </button>
  );
}

type Props = {
  /* null when the URL doesn't name a real combo, or names one the content
     no longer has — shows a plain "not found" message instead of an empty
     page. */
  comboId: string | null;
  /* Which Bronze/Silver/Gold tier was selected on the Combo Packages
     section when "View Package Details" was clicked — null when the page
     was opened without one (a bookmarked or shared link, say), in which
     case the combo's first tier is shown instead. */
  tierName: string | null;
};

/* A single combo package's own page — opened from "View Package Details"
   on its Combo Packages card. Keeps things short: the package's name and
   blurb, then straight to the practical notes and the call/WhatsApp
   actions. The full breakdown (about, highlights, tiers) is still one
   click away via "Full package overview". */
export function PackageDetailPage({ comboId, tierName }: Props) {
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [openService, setOpenService] = useState<Service | null>(null);
  const combo = comboId ? combos.find((c) => c.id === comboId) : undefined;

  /* Whichever tier the visitor was looking at when they clicked "View
     Package Details" — falls back to the combo's first tier when the URL
     doesn't name one, or names one this combo doesn't have. */
  const tier =
    (tierName && combo?.priceTiers.find((t) => t.name === tierName)) ||
    combo?.priceTiers[0];

  /* The selected tier's services, shown as a listing above the footer.
     Falls back to the combo's own top-level service list for a combo with
     no tiers at all. */
  const tierServices = tier?.includes ?? combo?.includes ?? [];
  const tierExtras = tier?.extras ?? [];

  /* The decoration designs this package offers — the selected tier's, or
     the combo's own when it has no tiers. Resolved from the shared
     decoration designs in src/data/services.ts. */
  const packageDecorations = tier ? tier.decorations : (combo?.decorations ?? []);

  /* The Decoration card opens this package's own Decorations page — the
     same page as the catalogue, showing only the designs this tier offers.
     With no designs to show it falls back to the service's own details,
     like every other card. */
  const openCard = (service: Service) => {
    if (combo && service.designs.length > 0 && packageDecorations.length > 0) {
      navigate(packageDecorationsPathFor(combo.id, tier?.name));
      return;
    }
    setOpenService(service);
  };

  if (!combo) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-lg text-muted">{ui.packageNotFound}</p>
        <BackToPackages className="mt-6" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-ivory py-[clamp(2.5rem,7vw,4rem)]">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal immediate>
            <BackToPackages />
          </Reveal>

          <Reveal immediate>
            <h1 className="type-heading text-[clamp(2rem,7vw,3rem)] leading-tight text-charcoal">
              {combo.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">{combo.blurb}</p>
          </Reveal>

          {/* The levels as rows rather than three boxes: name, what that
              level covers, and its price against it, so the prices line up
              in a column the eye can run down — the same shape the
              decoration pricing uses. Each row is still the selector;
              tapping one switches the whole page to that level, and the
              chosen row is filled and ringed so it is obvious which is
              active. */}
          {combo.priceTiers.length > 0 && (
            <Reveal immediate className="mt-8 sm:mt-10">
              <h2 className="label-gold text-gold-deep">{ui.pricingOptionsHeading}</h2>

              <ul className="mt-4 flex max-w-2xl flex-col">
                {combo.priceTiers.map((t) => {
                  const active = t.name === tier?.name;
                  return (
                    <li key={t.name} className="border-b border-cream-dark last:border-0">
                      <button
                        type="button"
                        onClick={() => navigate(packagePathFor(combo.id, t.name))}
                        aria-pressed={active}
                        className={[
                          "flex w-full items-baseline justify-between gap-4 rounded-xl px-3 py-3.5 text-left transition-colors",
                          active
                            ? "bg-cream/70 ring-1 ring-gold"
                            : "hover:bg-cream/40",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-base font-semibold text-ink sm:text-lg">
                            {t.name}
                            {active && (
                              <CheckIcon className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                            )}
                          </p>
                          {t.blurb && (
                            <p className="mt-0.5 text-sm text-muted sm:text-base">{t.blurb}</p>
                          )}
                        </div>
                        {/* shrink-0 so a long blurb never pushes the price
                            onto a second line — the number is the point. */}
                        <p className="type-price shrink-0 text-xl leading-none text-charcoal sm:text-2xl">
                          {t.price}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}

          {/* The chosen level, described — and it comes after the prices,
              not before them: a visitor picks a level by what it costs,
              then reads what that level actually means. Every tier carries
              this paragraph in the content and the page had never shown it,
              so the only way to read it was to open the overview dialog.
              Keyed on the tier name so switching Bronze/Silver/Gold plays
              the reveal again instead of silently swapping the text. */}
          {tier?.about && (
            <Reveal key={`${tier.name}-about`} immediate className="mt-8 sm:mt-10">
              <h2 className="label-gold text-gold-deep">{ui.aboutThisPackageOption}</h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink">{tier.about}</p>
            </Reveal>
          )}

          {/* What this package includes, as the same cards the Services
              section shows — photo, name, description, price and "View
              Service Details" — so a service looks the same wherever a
              visitor meets it. Same columns and gaps as that grid too,
              which the orphan-centring rules in index.css are measured
              against. Cards cascade in one at a time. */}
          {tierServices.length > 0 && (
            <Reveal immediate className="mt-8 sm:mt-10">
              <h2 className="label-gold text-gold-deep">{ui.servicesInPackage}</h2>
              {/* Keyed on the tier's name so switching Bronze/Silver/Gold
                  remounts this list — otherwise React just swaps the row
                  content in place and the reveal, which only plays once on
                  mount, would never be seen again after the first tier.
                  Suffixed ("-services") because the extras list right below
                  is also keyed on the tier's name — two siblings sharing one
                  key confuses React's reconciliation between renders where
                  extras appear or disappear, which was duplicating this
                  list rather than replacing it. */}
              <Reveal
                key={`${tier?.name}-services`}
                as="ul"
                immediate
                stagger={0.06}
                className="dv-orphan-grid mt-4 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-6"
              >
                {tierServices.map((id, i) => (
                  <li key={id} className="h-full">
                    <ServiceCard service={serviceById[id]} index={i} onOpen={openCard} />
                  </li>
                ))}
              </Reveal>

              {tierExtras.length > 0 && (
                <Reveal
                  key={`${tier?.name}-extras`}
                  as="ul"
                  immediate
                  delay={0.2}
                  className="mt-3 flex max-w-2xl flex-wrap gap-1.5"
                >
                  {tierExtras.map((label) => (
                    <li
                      key={label}
                      className="rounded-full bg-gold/15 px-3 py-1 text-base font-semibold text-gold-deep"
                    >
                      {label}
                    </li>
                  ))}
                </Reveal>
              )}
            </Reveal>
          )}

          {/* One closing block: the package's own practical notes, the
              site's usual pair of actions, and the ways onward as plain
              links rather than more buttons — same shape as the
              Decorations page's footer. */}
          <div className="mt-16 border-t border-cream-dark pt-10">
            <Reveal>
              <h2 className="type-heading text-[clamp(1.5rem,5vw,2rem)] leading-tight text-charcoal">
                {ui.packagesFootnoteTitle}
              </h2>

              <p className="mt-3 max-w-2xl text-lg text-muted">{combo.detail.notice}</p>
              <p className="mt-1 max-w-2xl text-lg text-muted">{combo.detail.conditions}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={telHref}
                  variant="primary"
                  size="md"
                  icon={<PhoneIcon className="size-5" />}
                >
                  {ui.callToBook}
                </Button>
                <Button
                  href={whatsappHrefFor(business.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="md"
                  icon={<WhatsAppIcon className="size-5" />}
                >
                  {ui.whatsapp}
                </Button>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-8">
                <BackToPackages />
                <button
                  type="button"
                  onClick={() => setOverviewOpen(true)}
                  className="inline-flex min-h-12 items-center type-nav text-base text-charcoal underline underline-offset-4 transition-colors hover:text-graphite"
                >
                  {ui.fullPackageOverview}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The package's own about/highlights/full-inclusions overview, in
          the same dialog the Combo Packages cards used to open directly —
          still available here as a secondary link. */}
      <ComboDetail combo={overviewOpen ? combo : null} onClose={() => setOverviewOpen(false)} />
      <ServiceDetail service={openService} onClose={() => setOpenService(null)} />
    </>
  );
}
