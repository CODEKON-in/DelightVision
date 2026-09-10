import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { CornerOrnaments } from "../components/Royal";
import { SectionHeading } from "../components/SectionHeading";
import { PhoneIcon } from "../components/icons";
import { ui } from "../data/copy";
import { telHref } from "../data/site";
import { combos, serviceById, type Combo } from "../data/services";
import { ComboDetail } from "./ComboDetail";

export function Combos() {
  const [openCombo, setOpenCombo] = useState<Combo | null>(null);

  return (
    <section
      id="packages"
      className="relative scroll-mt-20 overflow-hidden bg-cream py-[clamp(3.5rem,9vw,6rem)]"
    >

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={ui.combosEyebrow}
            title={ui.combosTitle}
            subtitle={ui.combosSubtitle}
          />
        </Reveal>

        <Reveal as="ul" stagger={0.1} className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, comboIndex) => (
            <li key={combo.id} className="h-full">
              <Card featured={combo.popular} flush className="flex h-full flex-col">
                {combo.popular && <CornerOrnaments />}

                <div className="relative">
                  {/* DUMMY photo of this package - see src/data/services.ts */}
                  <PlaceholderPhoto
                    index={comboIndex}
                    src={combo.image}
                    alt={combo.name}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="aspect-2/1 w-full"
                  />
                  {combo.popular && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian/60 to-transparent"
                        aria-hidden="true"
                      />
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1.5 text-base font-bold tracking-wide whitespace-nowrap text-obsidian uppercase shadow-soft">
                        {ui.mostPopular}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex grow flex-col p-5 sm:p-6">
                  <h3 className="text-xl leading-tight font-semibold break-words text-charcoal sm:text-2xl">
                    {combo.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-base break-words text-muted">
                    {combo.blurb}
                  </p>

                  {/* The bundled services as plain chips. A vertical list of
                      six rows made this card twice as tall as it needed to
                      be, and an icon inside each chip pushed them past half
                      the card width so only one fitted per row. Text alone
                      packs two to a row; the detail view still shows each
                      service with its icon and a line of explanation. */}
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {combo.includes.map((id) => (
                      <li
                        key={id}
                        className="rounded-full bg-cream/70 px-3 py-1 text-base text-ink"
                      >
                        {serviceById[id].name}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-cream-dark pt-4">
                    {/* DUMMY PRICE - see src/data/services.ts */}
                    <p className="nums-lining font-serif text-3xl font-semibold text-charcoal">
                      {combo.price}
                    </p>

                    <div className="mt-4 flex flex-col gap-2.5">
                      <Button
                        href={telHref}
                        variant="primary"
                        size="md"
                        fullWidth
                        icon={<PhoneIcon className="size-5" />}
                      >
                        {ui.callToBook}
                      </Button>

                      <Button
                        variant="secondary"
                        size="md"
                        fullWidth
                        
                        onClick={() => setOpenCombo(combo)}
                      >
                        <span className="sm:hidden">{ui.viewPackShort}</span>
                        <span className="hidden sm:inline">{ui.viewPackLong}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-10 text-center text-base text-muted">{ui.combosFootnote}</p>
        </Reveal>
      </div>

      <ComboDetail combo={openCombo} onClose={() => setOpenCombo(null)} />
    </section>
  );
}
