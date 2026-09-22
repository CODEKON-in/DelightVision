# Delight Vision — Wedding Services Website

A premium, mobile-first site for **Delight Vision**, a wedding services
business in Pandaravadai, Thanjavur. Built with React + Vite + TypeScript,
Tailwind CSS v4 and GSAP. No backend and no contact form — every call to
action dials the phone or opens WhatsApp. Content is edited in the
[CMA](#where-the-content-lives) and lives in `content/*.json`.

Two pages: the main page at `/`, and Decorations at `/decorations`.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
```

The production site is written to `dist/`.

---

## Where the content lives

Two files hold everything you would want to change.

### `src/data/copy.ts` — interface wording

Buttons, headings and labels, so wording can be changed without hunting
through components.

### `src/data/site.ts` — business details

| What | Field | Notes |
|---|---|---|
| Business name | `business.name` | Header, hero, footer |
| Phone (on screen) | `business.phoneDisplay` | Currently `+91 95973 16147` |
| Phone (dial) | `business.phoneDial` | Powers every `tel:` link — `+919597316147` |
| WhatsApp | `business.whatsappNumber` | Powers every `wa.me` link. Digits only, no `+` |
| Address | `business.addressLine1/2` | Pandaravadai, Thanjavur |
| Map location | `business.mapQuery` | Feeds the Google Maps embed. Replace with an exact address or `lat,lng` once the shop is pinned |

### `src/data/services.ts` — services, combos, decorations

The four services — Decoration, Food & Catering, Photography &
Videography, Tour Planning & Organizing — their categories, and the full content for each "View Service
Details" modal (badge, subtitle, about text, sub-services, highlights, tags,
inclusions, availability notes). Also the three combo packages, and the
flattened view of the **decoration designs** described below.

This file only reshapes what is in `content/*.json` into plain English
strings with formatted prices. The content itself is edited in the CMA.

> **All prices are dummy placeholders.** Replace the `price` strings in
> `services[]` and `combos[]` — e.g. `"Starting ₹25,000"` — with real
> pricing. Every price in the UI reads from these two arrays.

### Services and individual services

There are **four top-level services**: Decoration, Food & Catering,
Photography & Videography, and Tour Planning & Organizing. Those four are
what the Services section shows.

A service can be made up of **individual services**, listed in its
`subServices`. Photography & Videography is: Candid Photography, Album
Design and so on are not services of their own in the Services section, they
belong to it. Each carries an `id`, which is how a package points at one:

```jsonc
// content/services.json → the photography-videography service
"subServices": [
  {
    "id": "candid-photography",                    // what a package refers to
    "name": { "en": "Candid Photography" },
    "description": { "en": "Natural moments captured through the day…" },
    "image": "/images/services/candid-photography.jpg",   // optional
    "pricing": [{ "label": { "en": "Full Day" }, "price": 25000 }]  // optional
  }
]
```

- **An individual service is an ordinary service** as far as the site is
  concerned: the same card renders it and the same details dialog opens it.
  It inherits its parent's category, and its description doubles as its
  "About this service" text.
- **A service made up of individual services gets a page of its own**, at
  `/services/<id>` — Photography & Videography is at
  `/services/photography-videography`. Its card in the Services section goes
  there instead of opening a dialog, exactly as the Decoration card goes to
  the Decorations page. That is a data check (does it have `subServices`?),
  not a hardcoded id.
- **The page and the dialog show the same thing.** Both render
  `ServiceBody` (`src/components/ServiceBody.tsx`) — photo, title, price,
  about, the individual services as cards under **Services Included**, and
  the usual call/WhatsApp buttons — so the two cannot drift apart. The page
  passes `asPage`, which rounds the photo into the page and lets the buttons
  end the content instead of sticking to the foot of a scrolling panel.
- **A card on that page opens that individual service in the usual
  dialog.** Inside a dialog (a package's Photography & Videography card, for
  instance) the cards instead swap the dialog to that service, with a "Back
  to …" link above the title, so a second dialog never opens on top of the
  first.
- **Pricing is the same generic label/price list the decoration designs
  use**, so any label works and no code knows about "album" or "editing"
  prices. The first line is the price on the card. **Pricing is optional**:
  a service without it (Photo Editing in the samples) simply shows no price,
  and the dialog leaves the pricing box out.
- **Images are optional**: a service without one gets the drawn fallback
  tile, like every other missing photo.
- **`id` is optional in the content**: an entry saved without one (the CMA
  does not ask for an id) is given a slug of its name, so it still works and
  can still be referenced.
- **Icons**: `src/components/serviceIcons.ts` maps the sample ids to the
  camera/film/album marks. An id it does not know falls back to the neutral
  mark — content, not layout, so nothing breaks.

**Packages reference services by id, whichever kind they are.** A tier's
`services` stays a plain list of ids, so a package can mix top-level and
individual services:

```jsonc
// content/packages.json → Video & Photography Combo, Silver
"services": ["candid-photography", "traditional-photography", "album-design"]

// content/packages.json → Complete Wedding Combo, Silver
"services": ["decoration", "food", "photography-videography"],
"decorationIds": ["design-001", "design-003", "design-009"]
```

The package page resolves each id against the shared services data and
renders the usual card, so nothing about a service is ever copied into a
package. Decoration still works exactly as before: the card is found by the
service id and the designs come from `decorationIds` (see *Package
decorations*).

**The sample individual services** are Candid Photography, Traditional
Photography, Cinematic Videography, Traditional Videography, Pre-Wedding
Photography, Album Design, Photo Editing and Video Editing, with sample
prices. They are development samples, like every other price and photo on
the site — replace them with the client's real list.

**Tour Planning & Organizing is a promotional card only.** It is an ordinary
entry in `content/services.json` (id `tour-planning-organizing`, category
`tours-travel`) and opens the normal service details dialog. It has no
price (`"type": "custom"` shows "Custom quote"), no highlights, tags or
inclusions — the dialog leaves those sections out when they are empty — and
it is not part of any package. There is no tour booking, itinerary or
package system behind it.

### Complimentary items

A package can throw in things that are not services and are not priced — a
pen drive, a suitcase. They live in their own optional list on the package,
never in `services`:

```jsonc
// content/packages.json → a combo (or one of its priceTiers)
"complimentaryItems": [
  { "label": { "en": "Premium Pen Drive" }, "description": { "en": "Your photographs and films…" } },
  { "label": { "en": "Travel Suitcase" } }          // description is optional
]
```

- **The package page lists them** under **Complimentary Items**, between the
  services and the closing notes, in the same check-list style the service
  dialogs use for what's included. A package with none shows no section.
- **A tier may name its own list**, which replaces the combo's for that
  tier; otherwise every tier shows the combo's.
- **Nothing else knows about them**: they are not services, have no ids, no
  prices and no pages, and an item without a label is skipped.
- **The CMA keeps them.** Its package editor has no field for them (it does
  not need one), and saving a package carries the list through untouched —
  as it does `priceTiers` and `decorationIds`. Editing the items themselves
  is a hand edit of `packages.json` until the CMA gains a field for them.

Current samples: Complete Wedding Combo — a pen drive; Video & Photography
Combo — a pen drive and a suitcase; Decor & Catering — none.

### Decoration designs

The client sells **decoration designs**, not decoration products: they show
a customer a design, adjust it lightly, then set it up at the event. Each
design is an entry in a `designs` list on the decoration service in
`content/services.json`:

```jsonc
"designs": [
  {
    "id": "design-001",
    "image": "/images/decorations/….jpg",   // required — the design IS its photo
    "title": { "en": "Wedding Stage Decoration" },  // optional
    "badge": { "en": "Popular" },           // optional
    "pricing": [                             // one or more lines, in order
      { "label": { "en": "Decoration Setup" },   "price": 15000 },
      { "label": { "en": "Artificial Flowers" }, "price": 3000 },
      { "label": { "en": "Natural Flowers" },    "price": 7000 }
    ],
    "description": { "en": "…" },           // optional
    "customization": { "en": "…" },         // optional
    "details": [                             // optional label/value lines
      { "label": { "en": "Suitable for" }, "value": { "en": "Weddings, receptions" } }
    ]
  }
]
```

How it renders:

- **The Decorations page** (`/decorations`) is a grid of the photographs. A
  tile opens the design's detail dialog.
- **Titles are optional.** A design without one is titled "Decoration
  Design" in its dialog, and its WhatsApp enquiry names it by `id`, so the
  client still knows exactly which design is meant.
- **Pricing is a generic list.** The site never reads a label — "Decoration
  Setup", "Natural Flowers", "Lighting" are all just text — so the CMA can
  offer a plain *+ Add price → Label / Price* editor and any label works
  without a code change. The **first line is the headline price**, shown
  under the title as a fixed amount (no "Starting"). A design with **two or
  more lines** also gets a Pricing box listing every line; a design with one
  line shows only the headline price.
- **There is no size-based (Small / Medium / Large) pricing.** A design has a
  constant price; flower type is expressed as extra pricing lines. Colour
  changes and minor adjustments do not change the price — say so in
  `customization`, which appears as the last line of the Details box.
- Empty optional fields simply do not render.

**The nine designs in the content are samples** — placeholder photographs,
titles and prices for development. Replace them with the client's real
designs.

### Package decorations

A combo package that includes decoration offers **its own set of designs**,
not the whole catalogue, and each Bronze/Silver/Gold tier has a different
set. A tier lists its designs by `id` — the designs themselves stay in
`designs` on the decoration service, so their photos, pricing and details
are never copied into a package:

```jsonc
// content/packages.json → a combo's priceTiers
{
  "name": { "en": "Silver" },
  "decorationIds": ["design-001", "design-003", "design-009"],  // shown in this order
  "services": ["decoration", "food", "photography-videography"] // unchanged: plain ids
}
```

- **On a package page** the Decoration card opens that tier's own
  Decorations page at `/packages/<combo>/<tier>/decorations` (or
  `/packages/<combo>/decorations` for a combo without tiers). It is the same
  `DecorationsPage` as the catalogue — same grid, cards and dialog — showing
  only the tier's designs, labelled "Included in the Silver Complete Wedding
  Combo", with "Back to Package". The dialogs carry the same label and their
  WhatsApp enquiry names the package.
- **From the Services section** the Decoration card still opens the full
  catalogue at `/decorations`.
- **A tier without `decorationIds` uses the combo's own** `decorationIds`,
  if it has any — which is also where a combo with no tiers puts them.
- **A new package or tier needs no code**: add it and give it
  `decorationIds`.
- **A wrong reference does not break the page.** An id that matches no
  design is left out of the grid; if none are left, the Decoration card
  falls back to the service's normal details dialog. The dev server logs a
  `[packages]` warning naming the package, tier and id — also for a tier
  that includes decoration but lists no designs, and for `decorationIds` on
  a tier that does not include decoration.

Current sample sets (all different within a combo):

| Combo | Bronze | Silver | Gold |
|---|---|---|---|
| Complete Wedding | 007, 005, 008 | 001, 003, 009 | 002, 006, 004 |
| Decor & Catering | 003, 005, 007 | 001, 004, 008 | 002, 006, 009 |

Photo & Video has no decoration. Designs may be shared between packages.

**The client picks the designs in the CMA.** The package editor has a
**Decoration Designs** section with a tick-list of the designs from
`services.json` for each Bronze/Silver/Gold option that includes decoration
(or one list for a package without options). It stores only
`decorationIds`, in the order they were ticked; **Clear** removes the key.
The section is hidden when the package does not include decoration, and a
saved id that matches no design stays ticked as "Unavailable design" with a
warning rather than being silently dropped. Unticking Decoration drops any
references left behind on save. Everything else in the package — including
the `services` id lists — is saved exactly as loaded.

**The CMA has no editor for `designs` yet.** It lives in
`content/services.json`, one of the five files the CMA reads, writes and
publishes, and the CMA's service editor preserves fields it does not know
through an edit and save. Adding a designs editor to the CMA is the
follow-up that makes this list client-editable.

### Images

Every `image` in `content/*.json` is a path under `public/images/` — the
folder the CMA uploads into.

**Every photograph currently committed there is a sample**, not the
business's own work. They are stock photographs, hand-matched to whatever
each one sits next to — a mandap for Decoration, a camera for Photography & Videography, a
sweets tray for the sweets counter — so the site can be looked at as it will
actually appear. All are 1100x825 JPEGs, about 4MB for the set.

Replacing one is a file copy: drop a real photograph over the same filename,
or upload it through the CMA. No content or code changes, because the paths
already point at these names. **Swap them all before the site goes live.**

Each tile also paints a gradient and floral motif *underneath* the photo
(`PlaceholderPhoto`), so a missing, slow or failed image never leaves a
blank box — which is what the site looked like before these were added, and
what it falls back to for any path with no file behind it.

`PlaceholderPhoto` only builds a `srcset` for Unsplash URLs, so these local
files are served at their full 1100px width whatever size they are painted
at — a service card on a phone is about 160px wide. That is the one piece of
the performance notes below that the committed samples do not honour, and it
matters more once the real photographs arrive, which will not be smaller.
Generating a couple of widths per file and teaching `buildSrcSet` about
local paths is the fix; it needs a naming convention the CMA's uploader
knows about too, which is why it has not been done yet.

---

## Structure

```
src/
  data/site.ts          business details
  data/services.ts      services, modal content, combos, decorations
  data/copy.ts          buttons, headings and labels
  lib/motion.ts         the animation safety net (read before editing)
  lib/router.ts         the two-page router (40 lines, no dependency)
  components/           Button, Card, SectionHeading, Modal, MobileMenu,
                        Reveal, Header, Footer, icons, AnimatedIcon,
                        HeroOrnament, Flourish, Royal, LevelDots,
                        PlaceholderPhoto, FullImageView,
                        DecorationCard, DecorationDetail
  sections/             Hero, Services, ServiceDetail, Combos,
                        ComboDetail, Contact
  pages/                DecorationsPage (catalogue + per-package), ServicePage, PackageDetailPage
  index.css             design system (colours, fonts, shadows)
```

### Routing

`src/lib/router.ts` is the whole thing: a path read from
`window.location.pathname`, a `useSyncExternalStore` subscription, and a
`navigate()` that pushes state. No routing library, because two pages do not
need one.

Paths are **real paths, not hashes**, because the header, footer and phone
menu already use `#services`-style hashes to jump around the main page and
folding both meanings into one `#` would make each harder to follow.
`netlify.toml` already serves index.html for any unknown path and Vite's dev
server does the same, so `/decorations` can be loaded, bookmarked and shared
directly.

Two details worth keeping:

- **The scroll after a navigation happens in a layout effect in `App`, not
  in `navigate`.** The element being scrolled to does not exist until React
  has rendered the new page. A `requestAnimationFrame` callback would also
  run late enough, but rAF stops firing in a window that is not painting —
  the same hazard `lib/motion.ts` exists for — and the visitor would land
  part-way down the page they just left.
- **`App` listens on `document` for clicks on `#` links, but only when the
  visitor is away from the main page.** Those ids only exist there, so off
  it the same link has to go home first and then jump. Listening on the
  document rather than on a wrapper is deliberate: the phone menu is
  portalled to `<body>` and would otherwise be missed. On the main page the
  listener is not installed at all, so every one of those links keeps
  exactly the behaviour it has always had, and `Header`, `Footer` and
  `MobileMenu` needed no changes.

### Design system

Tailwind v4 defines theme tokens in CSS rather than in `tailwind.config.js`,
so the palette lives in the `@theme` block at the top of `src/index.css`.
Each token is a normal utility — `bg-obsidian`, `text-gold-deep`,
`font-display`.

**Colour.** Black is the brand's presence, gold its signature, light the
canvas: a black-to-graphite hero, warm-ivory content sections, a charcoal
footer, champagne gold in small doses. Gold comes in pairs — `gold-deep` for
text on light, `gold-soft` for text on dark — and every pairing was measured
against WCAG AA; the ratios are noted beside the tokens.

- **Dark** obsidian `#080808`, charcoal `#171717`, graphite `#2a2a2a`
- **Light** ivory `#f7f5f0`, white `#ffffff`, cream `#f0eee9`
- **Gold** champagne `#b8944f` decorative, `#d8c59d` / `#7e6329` for text

### Typography

Three families, each with one job, all set as tokens in `index.css`:

| Token | Family | Used for |
|---|---|---|
| `font-display` | Cormorant Garamond | Card and package names, dialog subtitles |
| `font-body` | Inter | Everything functional: body, navigation, buttons, labels, **prices**, phone numbers |
| `font-over-there` | Over There (logo face) | The brand name — the hero's "Delight Vision" (`type-brand-name`) |
| `font-warpen` | Warpen (slogan face) | The slogan (`type-slogan`) and section/page/dialog titles (`type-heading`) |

The logo itself is an image (`public/images/DV LOGO p.png`) and is never
recreated in type.

**The brand font files live in `fonts/` at the project root** —
`fonts/Over There.ttf` and `fonts/Warpen.ttf`. The `@font-face` rules at the
bottom of `src/index.css` reference them by relative path, so Vite bundles
them into `dist/assets/` with a content hash; replace a file under the same
name and every visitor gets the new one. Both are single-weight (Regular)
faces, and both brand roles set `font-synthesis: none`, so the browser never
fakes a bold or italic they do not have. Cormorant Garamond stays in each
stack as the fallback while a font loads.

> **Licence:** the files in `fonts/` are the free downloads, which are
> personal-use only. The commercial licences are being arranged; when they
> arrive, drop the licensed files in under the same names.

**Over There needs its own sizes in the hero.** It is about two and a half
times as wide as Cormorant, and its T is unusual: the crossbar rises about
0.4em above the other capitals and reaches about 1.4em past the letter's
own width. Two consequences, both handled in `Hero.tsx`:

- The gold shimmer (`background-clip: text`) only paints inside the
  heading's box, so anything outside it is invisible. The heading carries
  padding on all sides, cancelled by matching negative margins, so the
  painted box takes in the whole T without the text moving. Without it the
  name read "DELIGHI".
- The crossbar reaches into the next word, so the name has extra
  `word-spacing` to stop it reading as "DELIGHTVISION".

Anywhere else Over There is used with a gradient fill will need the same
padding.

Beyond the families, text is set through **roles** — `type-heading`, `type-title`, `type-subheading`, `type-body`,
`type-body-small`, `type-label`, `type-nav`, `type-button`, `type-caption`,
`type-price`, `type-brand-name`, `type-slogan`. A role sets family, weight, tracking and case,
**never size or line height**: sizes stay on the element, where the fluid
`clamp()` values and breakpoint steps already live. Use a role rather than
reaching for `font-*` and `tracking-*` classes by hand.

Rules worth keeping:

- **Prices and phone numbers are always Inter** (`type-price`). A figure
  someone is about to dial or pay must be unmistakable.
- **Only the weights `index.html` loads**: Cormorant 400/500/600, Inter
  400/500/600. There is no 700 anywhere — a missing weight gets
  synthesised by the browser, and faux-bold is the heavy look this avoids.
  Load a weight before using it.
- **Cormorant 600 is only for small titles** (`type-title`, cards at
  18–24px), where its low x-height needs the extra weight beside Inter.
  Larger headings use 500.
- **Brand faces are for brand moments.** Over There and Warpen never set
  body copy, navigation, buttons or prices.
- **Italic is reserved for the slogan**, so it still means something.
  Subtitles are upright Cormorant.
- **Uppercase is for labels, captions and badges**, with modest tracking
  (0.08–0.12em). Headings stay in natural case.

---

## Notes for whoever picks this up next

**There is no sticky bottom call bar.** It was removed at the client's
request. Calling stays one tap away because the sticky header carries a
Call button at every screen size, alongside a menu button on phones.

**Section order is Hero → Services → Packages → Contact.** Charcoal and
ivory alternate. There is no testimonials section and no gallery section —
both were removed at the client's request. The photographs the gallery used
to carry now sit inside the decoration they show, on the Decorations page,
so a picture always says which service produced it.

**One service card goes somewhere else.** `ServiceCard` looks the same
everywhere and only calls `onOpen`; the page decides what that means. In the
Services section a service with a `designs` list navigates to
`/decorations` rather than opening `ServiceDetail`; on a package page it
opens that tier's own Decorations page (see *Package decorations*). Both are data
checks, not hardcoded ids.

**There are no filter pills above the grid.** They were removed at the
client's request — four cards do not need filtering.

**Two headings are gradient-filled**: the hero (`.shimmer-text`, a slow
looping sweep) and every section title (`.title-sheen`, one pass as it
scrolls into view). Both set `-webkit-text-fill-color: transparent`, so
`getComputedStyle(...).color` reads transparent and automated contrast
checks have to skip them — measure the gradient stops instead.

**Keep those `background-position` values between 0% and 100%.** A
percentage there resolves to `(container - image) x pct`, so with a
260%-wide image every 1% moves the gradient 1.6% of the element. Anything
outside 0–100% slides it clear off the element, and with transparent text
and no background left to clip to, the heading renders as nothing at all.
An earlier version animated 180% → -80% and every section title was
invisible. If you retune these, check the gradient still covers the element
at both ends of the range, not just that it looks right mid-sweep.

**The hero artwork drifts on scroll.** `HeroOrnament` scrubs a small
`yPercent` against the hero's own scroll range. Transform only, and scrubbed
rather than looping, so it costs nothing while the page is still.

**Layout on phones is two columns** for the services grid, which is
`grid-cols-2` from the smallest screen up. The button reads "View Details"
on phones and "View Service Details" from `xs` up. The Decorations page grid
is two photographs across on phones, three from `sm` and four from `lg`.

**Service cards line up without fixed heights.** Each leads with its photo,
then a `line-clamp-2` heading with a small min-height (so descriptions start
on the same line across a row), then the description, with the price and
button pushed down by `mt-auto`. That last part is what aligns the buttons
across a row — the cards do not need matching content, only a matching
bottom.

The description is `line-clamp-3` with **no** min-height. Three lines is
what it takes down to a 320px phone; a fixed two-line box silently cut text
off there. Dropping the min-height also means
a card is only as tall as it needs to be. Keep card copy short — if you
lengthen a `description` in `services.ts` past three lines it will be cut
off with an ellipsis, not push the card taller. Put detail in the modal
`about` text instead.

**The cards stay deliberately sparse.** The hero is a name, a tagline and
two buttons; the package cards are a photo, a name, a one-line blurb, the
included services as plain text chips, a price and two buttons. Everything
else lives in the detail modals. Earlier versions carried an intro
paragraph, a "7 services / One team / Open daily" strip, a scroll cue, a
full six-row service list on each package card and a third call-to-action —
all of it repeated something the visitor could already see, and it pushed
the real content off the screen.

Two consequences worth keeping in mind: package chips are **text only**
(an icon inside each chip made them wider than half the card, so only one
fitted per row), and the footer does **not** relist the services — the
Services section already does.

**All three detail views share one `Modal`**: `ServiceDetail`,
`ComboDetail` and `DecorationDetail`. Each package card has its own "View Pack
Details" view listing the bundled services with their one-line summaries,
so someone can see exactly what a combo contains before calling.

**Every vector on the page animates.** `AnimatedIcon` wraps any icon and
brings it in as it scrolls into view — outlined icons draw themselves
stroke by stroke, solid icons scale up — without touching a single icon
definition. On top of that: the hero arches and the gold section rules draw
themselves (`HeroOrnament`, `Flourish`), the rosette's petals unfold and
then turn slowly, gold corner brackets draw onto the highlighted combo
(`CornerOrnaments`), and gold motes drift through the dark sections
(`GoldMotes`). The highlighted combo also carries a slow gold sheen and a
breathing gold edge (`.royal-sheen`, `.royal-glow` in `index.css`).

**Scroll-triggered animations use `toggleActions`, never `once: true`.**
This one cost real time, so it is worth reading before touching
`Reveal`, `AnimatedIcon`, `Flourish`, `SectionHeading` or `CornerOrnaments`.

`once: true` kills the ScrollTrigger the moment it fires. Reload the page
part way down — on Packages or Contact, say — and every trigger above the
viewport is already past its start, so they all fire during ScrollTrigger's
first refresh and delete themselves from its internal `_triggers` list. That
refresh is midway through iterating that very list (`i` starts at
`_triggers.indexOf(self)` and counts down), so it walks off the end of the
now-shorter array, reads `.end` of `undefined` and throws. The throw comes
out of a `useLayoutEffect`, so React unmounts the entire tree: the document
collapses to viewport height and the page goes blank. It reads as a freeze.

It only happens when the page loads already scrolled, because at the top
almost nothing is past its trigger point and nothing self-kills. It affects
the production build, not just dev.

`toggleActions: "play none none none"` plays on the way in and does nothing
on the way out or back — what `once` looked like — but leaves the trigger in
the list, so the array never changes length underneath the loop. Verified by
reloading at every section, on desktop and phone, in both `npm run dev` and
the production build.

**There is deliberately no `scroll-behavior: smooth` on `html`.** It looks
like a free win and it is not: ScrollTrigger measures by setting `scrollTop`
and putting it straight back, and `main.tsx` refreshes it once the web fonts
land. A CSS-smooth scroller turns each of those restores into an animation,
so ScrollTrigger never finds the page where it just put it and measures
again — with the scrubbed hero trigger reacting every time. Restoring to `0`
is a no-op, which is why it only bit when the page loaded already scrolled:
reloading on `#packages` or `#contact` locked the tab up, while reloading at
the top was fine. GSAP documents the incompatibility.

The smooth glide is still there. `App` catches clicks on `#`-links at the
document level and calls `scrollToHash` from `lib/router.ts`, which is one
animation on a click rather than a rule that hijacks every programmatic
scroll. `scroll-padding-top` still applies, so links land at the same offset
they always did, and the handler falls back to an instant jump under
`prefers-reduced-motion`. Do not put that CSS property back.

**Animations must never gate content — and the safety net must not eat
them either.** Every animation has a fallback that forces its end state if
the browser never paints (a backgrounded or occluded window stops firing
`requestAnimationFrame`; GSAP then never advances, which would leave
artwork half-drawn or trap the modal open so Close does nothing).

That net lives in `src/lib/motion.ts` and is deliberately conditional. An
earlier version fired on a plain timer, which meant a scroll-triggered
animation that simply had not been scrolled to yet got force-completed
after a second or two — so on a real phone most of the page snapped to its
finished state and the visitor never saw anything animate. `settleIfStalled`
now probes `requestAnimationFrame` once at startup and only forces an end
state if the browser genuinely is not painting. Keep that distinction if
you touch this code.

**The mobile menu is portalled to `<body>` on purpose.** The header uses
`backdrop-blur`, and a `backdrop-filter` makes an element the containing
block for any `position: fixed` descendant — which collapsed the menu to a
41px sliver when it was rendered inside the header. The service modal is
portalled for the same reason.

---

## Responsive behaviour

Phones range from a 320px budget Android to a 430px Pro Max, but Tailwind's
first breakpoint is 640px — so without help the whole range shares one set
of styles and then jumps at once. Two things smooth that out:

- **An `xs` breakpoint at 400px** (declared in `index.css`) gives the larger
  phones a step of their own: roomier card padding, a bigger heading and
  price, and the fuller "View Service Details" button label.
- **Fluid type via `clamp()`** on the hero headline, tagline, phone number,
  section headings, the wordmark and section padding. These scale
  continuously with the viewport instead of snapping at a breakpoint.

Column counts: services go 2 → 3 at `sm` (640); decoration designs go
2 → 3 at `sm` → 4 at `lg`; packages go 1 → 2 at `sm` → 3 at `lg`. The inline header nav waits
until `lg` — at 768px the four links plus the brand and call button
squeezed the business name into an ellipsis, and a tablet is perfectly
happy with the menu button.


Verified with no clipped text, no horizontal scroll and no tap target under
44px at 320, 360, 375, 390, 400, 412, 430, 740×360 (landscape), 768, 1024
and 1440.

---

## Performance on phones

This site is aimed at people on mid-range Android handsets, so a few things
are deliberate:

- **Images are served at the size they are displayed.** A two-up card on a
  phone is about 160px wide; downloading an 800px image for it wastes
  bandwidth and decode time on exactly the devices least able to spare
  either. `PlaceholderPhoto` builds a `srcset` across six widths and a
  `sizes` hint, so a phone fetches roughly a 480px image instead of 800px.
  This only applies to Unsplash URLs — a real photo dropped into `public/`
  is used exactly as given, so add your own `srcset` there if the files are
  large.
- **`backdrop-filter` is desktop-only.** It forces a repaint of everything
  behind the element on every scroll frame, and on a sticky header that is
  the whole page. Phones get a solid background instead; the blur returns
  from `sm` up.
- **The highlighted package animates only transform and opacity.** The
  sheen used to animate `background-position` and the glow animated
  `box-shadow` — both repaint every frame. They now slide and fade on the
  compositor instead.
- **Half as many drifting gold motes on phones.** Each one is its own
  endless tween.
- Every animation is skipped entirely under `prefers-reduced-motion`.

---

## Accessibility

Built for guests who may be 50+ and unfamiliar with the web. Verified in the
browser rather than by eye:

- **Body text is 16px minimum.** The only smaller text is the caption tag on
  the placeholder images, which goes away with real photographs.
- **Every tap target is at least 44px** (most are 48–64px). The one
  exception is the visually-hidden "Skip to services" link, which becomes a
  full-size button when focused.
- **All 113 text elements pass WCAG AA contrast**, lowest ratio 5.43:1
  against a 4.5:1 requirement — checked on both the royal and champagne
  sections and inside the modals and menu. The hero headline and the
  section titles are gradient-filled, so automated checks skip them; every
  colour their sweeps pass through was measured separately and lands
  between 5.96:1 and 17.55:1.
- No horizontal scrolling at 375px, 768px, 1280px or 1440px. The filter
  tabs scroll inside their own container.
- The hero artwork is kept clear of the centre column and sits under a soft
  scrim, so the headline never competes with decoration.
- The modal traps focus, closes on Escape / backdrop / X, restores focus to
  the card that opened it, and locks the page behind it.
- Prices and phone numbers are set in Inter, and every serif heading is
  forced to lining figures, so no number renders in hard-to-read old-style
  numerals.
- Every animation is skipped under `prefers-reduced-motion`, and content is
  present in the DOM before GSAP runs, so nothing disappears if JavaScript
  fails.

## Deploying to Netlify

`netlify.toml` is already configured (build `npm run build`, publish `dist`,
SPA redirect, asset caching).

- **Git**: push the repo and pick it in Netlify — no further setup needed.
- **Drag and drop**: run `npm run build` and drop the `dist/` folder onto
  <https://app.netlify.com/drop>.
- **CLI**: `npx netlify-cli deploy --prod`
