# Delight Vision — Wedding Services Website

A premium, mobile-first single-page site for **Delight Vision**, a wedding
services business in Pandaravadai, Thanjavur. Built with React + Vite +
TypeScript, Tailwind CSS v4 and GSAP. No backend, no CMS, no contact form —
every call to action dials the phone or opens WhatsApp.

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

### `src/data/services.ts` — services, combos, gallery

All seven services, their filter categories, and the full content for each
"View Service Details" modal (badge, subtitle, about text, highlights, tags,
inclusions, availability notes). Also the three combo packages and the
gallery tiles.

> **All prices are dummy placeholders.** Replace the `price` strings in
> `services[]` and `combos[]` — e.g. `"Starting ₹25,000"` — with real
> pricing. Every price in the UI reads from these two arrays.

### Images

Every service and gallery photo is a **dummy Unsplash image**, chosen by
hand to match what it sits next to — a mandap for Decoration, an editing
timeline for Video Editing, a sweets tray for the sweets counter.

All of them are one-liners in `src/data/services.ts`:

```ts
image: dummyPhoto("1587271636175-90d58cdad458"),
```

To use real photographs, drop files into `public/` and replace the call
with the path — `image: "/decoration.jpg"`. Nothing else changes.

Each tile paints a gradient and floral motif *underneath* the photo
(`PlaceholderPhoto`), so a slow or failed image never leaves a blank box.

---

## Structure

```
src/
  data/site.ts          business details
  data/services.ts      services, modal content, combos, gallery
  data/copy.ts          buttons, headings and labels
  lib/motion.ts         the animation safety net (read before editing)
  components/           Button, Card, SectionHeading, FilterTabs, Modal,
                        MobileMenu, Reveal, Header, Footer, icons,
                        AnimatedIcon, HeroOrnament, Flourish, Royal
  sections/             Hero, Services, ServiceDetail, Combos,
                        Gallery, Contact
  index.css             design system (colours, fonts, shadows)
```

### Design system

Tailwind v4 defines theme tokens in CSS rather than in `tailwind.config.js`,
so the palette lives in the `@theme` block at the top of `src/index.css`.
Each token is a normal utility — `bg-royal`, `text-gold-soft`,
`font-serif`.

The theme is **royal purple, antique gold and champagne**. The page
alternates deep royal and champagne sections. Accent colours come in pairs:
`gold-deep` for text on champagne, `gold-soft` for text on royal. Both were
measured, not guessed.

- **Dark base** royal `#1e1033`, deep `#150b24`, elevated `#2c1b4a`
- **Light base** champagne ivory `#fbf7f0`, cream `#f3eada`
- **Accent** amethyst `#5b2a86`
- **Highlight** gold `#d4af37` decorative, `#f2dc9b` / `#7a5a0f` for text
- **Type** Cormorant Garamond headings, Inter body

Token names follow the palette: `bg-royal`, `text-plum`, `text-gold-soft`.

---

## Notes for whoever picks this up next

**There is no sticky bottom call bar.** It was removed at the client's
request. Calling stays one tap away because the sticky header carries a
Call button at every screen size, alongside a menu button on phones.

**Section order is Hero → Services → Packages → Gallery → Contact.**
Charcoal and ivory alternate. There is no testimonials section — it was
removed at the client's request.

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

**Filter pills wrap and centre; they do not scroll sideways.** On phones
each category shows a shorter label (`categories[].short`) so the pills
settle into tidy rows, and the full names return from `sm` up.

**Gallery photos open their own detail modal** (`GalleryDetail`), built on
the same `Modal` as the service one, and each links back to the service that
produced it.

**Layout on phones is two columns.** Both the services grid and the gallery
are `grid-cols-2` from the smallest screen up. The button reads "View
Details" on phones and "View Service Details" from `sm` up.

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

**All three detail modals share one `Modal`**: `ServiceDetail`,
`ComboDetail` and `GalleryDetail`. Each package card has its own "View Pack
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

Column counts: services and gallery go 2 → 3 at `sm` (640) → gallery 4 at
`lg`; packages go 1 → 2 at `sm` → 3 at `lg`. The inline header nav waits
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
- Serif digits are forced to lining figures, so prices and phone numbers
  don't render in hard-to-read old-style numerals.
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
