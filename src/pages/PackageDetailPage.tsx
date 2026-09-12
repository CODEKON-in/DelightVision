import { useState } from "react";
import { Button } from "../components/Button";
import { ComboServiceRow } from "../components/ComboServiceRow";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { combos, serviceById, type Service } from "../data/services";
import { HOME_PATH, navigate, packagePathFor } from "../lib/router";
import { ComboDetail } from "../sections/ComboDetail";
import { ServiceDetail } from "../sections/ServiceDetail";

/* Bronze / Silver / Gold get their own accent colour on the tier badge —
   same colours the Combo Packages section and its cards use, duplicated
   here rather than shared because each usage styles a differently-shaped
   badge. */
const TIER_ACCENTS: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "#a9713f", text: "#fff7ec" },
  Silver: { bg: "#93938d", text: "#fff" },
  Gold: { bg: "#d4af37", text: "#2a1f08" },
};

function tierAccent(name: string) {
  return TIER_ACCENTS[name] ?? { bg: "#3a3632", text: "#fff" };
}

/* Back to where the visitor came from. Written out in words rather than
   left to the browser's back button, and repeated at the foot of the page
   so it is there whichever end they finish at — the same pattern the
   Decorations page uses for "Back to Services". */
function BackToPackages({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`${HOME_PATH}#packages`)}
      className={`inline-flex min-h-12 items-center gap-2 text-base font-semibold text-charcoal transition-colors hover:text-graphite ${className}`}
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
            <h1 className="font-heading text-[clamp(2rem,7vw,3rem)] leading-tight font-semibold text-charcoal">
              {combo.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">{combo.blurb}</p>
          </Reveal>

          {/* Every tier's price side by side, so a visitor sees how the
              three compare before reading one tier's own services below.
              Tapping a tier switches the whole page to it — the tier
              that's active is outlined in its own accent colour. */}
          {combo.priceTiers.length > 0 && (
            <Reveal immediate className="mt-8 sm:mt-10">
              <h2 className="label-gold text-gold-deep">{ui.pricingOptionsHeading}</h2>
              <Reveal
                as="div"
                immediate
                stagger={0.06}
                className="mt-3 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {combo.priceTiers.map((t) => {
                  const active = t.name === tier?.name;
                  const accent = tierAccent(t.name);
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => navigate(packagePathFor(combo.id, t.name))}
                      aria-pressed={active}
                      className={[
                        "flex flex-col items-start rounded-2xl border-2 p-4 text-left transition-colors",
                        active
                          ? "border-gold bg-cream/60 shadow-soft"
                          : "border-cream-dark bg-ivory-light hover:border-charcoal/30 hover:bg-cream/40",
                      ].join(" ")}
                    >
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase"
                        style={{ background: accent.bg, color: accent.text }}
                      >
                        {t.name}
                      </span>
                      <p className="nums-lining mt-3 text-2xl leading-none font-bold text-charcoal">
                        {t.price}
                      </p>
                      <p className="mt-1.5 text-sm text-muted">{t.blurb}</p>
                    </button>
                  );
                })}
              </Reveal>
            </Reveal>
          )}

          {/* What this package includes, one row per service — same
              product-listing pattern the Combo Packages cards use, so a
              visitor sees the same photo/description/price/actions
              whether they're comparing cards or looking at one package
              on its own page. Rows cascade in one at a time rather than
              fading in as one flat block. */}
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
                as="div"
                immediate
                stagger={0.06}
                className="mt-3 flex max-w-2xl flex-col divide-y divide-cream-dark"
              >
                {tierServices.map((id, i) => (
                  <ComboServiceRow
                    key={id}
                    service={serviceById[id]}
                    index={i}
                    onViewDetails={() => setOpenService(serviceById[id])}
                  />
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
              <h2 className="font-heading text-[clamp(1.5rem,5vw,2rem)] leading-tight font-semibold text-charcoal">
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
                  className="inline-flex min-h-12 items-center text-base font-semibold text-charcoal underline underline-offset-4 transition-colors hover:text-graphite"
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
