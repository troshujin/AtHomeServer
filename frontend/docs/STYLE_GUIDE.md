# AtHomeServer Frontend Style Guide

This document is the reference for how the app should look, feel, and behave.
It exists so that new screens (not just the Gym pages) stay visually and
behaviorally consistent without every contributor having to reverse-engineer
decisions from CSS. When in doubt, match what's here; when something isn't
covered, extend it in the spirit of the principles below and update this file.

## 1. What we're building

AtHomeServer's frontend is a **PWA** — a personal home-server dashboard that
should feel like a native app on a phone, not a website that happens to be
responsive. That framing drives most of the decisions below:

- **Installable and app-like.** Sticky (not fixed) chrome, safe-area-aware
  padding for notches/home indicators, generous touch targets, no
  hover-dependent functionality.
- **Intuitive over comprehensive.** A user should never have to search for
  how to do something. If a screen needs an explanation, the design failed.
  Prefer fewer, obvious actions over many discoverable ones.
- **Smooth.** Every state change (navigating, loading, opening a menu,
  swiping a carousel) should read as fluid motion, not a jump-cut. This is a
  performance requirement as much as a visual one — see [§6](#6-motion--interaction).
- **A healthy amount of engagement bait.** Logging a workout (or whatever the
  next feature is) should feel a little rewarding — a bold stat, a color, an
  icon, a sense of progress — the same instinct that makes fitness apps and
  social feeds satisfying to open. This is explicitly scoped, see [§7](#7-engagement-bait-the-healthy-kind).

## 2. Design principles

1. **Clarity first.** Every interactive element looks interactive (pill
   buttons, visible affordances, obvious active states). Every action has
   visible feedback (hover/press states, loading skeletons, toasts).
2. **Native-feel over reinvented.** Reach for the platform before writing
   JavaScript for it: CSS `scroll-snap` for carousels instead of a gesture
   library, `position: sticky` instead of scroll-listener repositioning,
   native `<RouterLink>`/`<a>`/`<button>` semantics instead of `div` soup.
   It's faster, smoother, and needs less code to maintain.
3. **Approachable premium.** Soft gradients, blurred glass surfaces, pill
   shapes, and generous whitespace — not a flat corporate-internal-tool
   look, and not a gaudy neon one either. See [§3](#3-design-tokens).
4. **Mobile-first, desktop-enhanced.** Design the small screen first (it's
   the PWA install target), then use extra desktop width for density (lists
   instead of carousels, multi-column grids) — never the other way round.
5. **Accessible by default.** Respect `prefers-reduced-motion` and
   `prefers-color-scheme`, keep color contrast at WCAG AA in every theme
   ([§9](#9-theming)), use semantic elements, keep focus/aria state
   correct on anything that toggles (menus, expandable sections).

## 3. Design tokens

Tokens live in two places, split by whether they can change at runtime:

- **`src/styles/_variables.scss`** — compile-time-only SCSS constants. As of
  the theming work in [§9](#9-theming), this is just `$font-stack`. Nothing
  color-related belongs here anymore — see why below.
- **`src/styles/_themes.scss`** — every color/surface/shadow token, as CSS
  custom properties scoped under `:root, [data-theme='light']` and
  `[data-theme='dark']`. This is the single source of truth for color. Both
  `.scss` partials (via plain `var(--token)`, no `@use` needed for these) and
  `<style scoped>` blocks in `.vue` files read from the same place.

The reason there's no SCSS-variable-feeds-CSS-variable indirection anymore
(there used to be): SCSS variables are resolved at build time, so they can't
respond to the user flipping the theme at runtime. Every color token has to
be a real CSS custom property so [§9](#9-theming)'s `[data-theme]` switch
can actually change it. **Never reintroduce a `$color-*` SCSS variable** —
if you need a new color, it goes in `_themes.scss`.

### Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-primary` | `#3498db` | `#60a5fa` | Primary actions, links, active states |
| `--color-primary-rgb` | `52, 152, 219` | `96, 165, 250` | Same color as an R,G,B triplet, for `rgba(var(--color-primary-rgb), X)` glows/shadows |
| `--color-primary-dark` | `#2f7fb8` | `#3b82f6` | Gradient partner for primary buttons/brand mark |
| `--color-accent` | `#6c5ce7` | `#a78bfa` | Secondary gradient accent (violet) — avatars, brand mark |
| `--color-accent-rgb` | `108, 92, 231` | `167, 139, 250` | RGB triplet form of `--color-accent` |
| `--color-secondary` | `#2c3e50` | `#f1f5f9` | Headings, highest-emphasis text |
| `--color-text` | `#333333` | `#cbd5e1` | Body text |
| `--color-background` | `#f8f9fa` | `#0f172a` | Page background |
| `--color-surface` | `#ffffff` | `#1e293b` | Cards, the base color the full-screen mobile menu's glass is mixed from |
| `--color-surface-alt` | `rgba(15,23,42,.045)` | `rgba(255,255,255,.05)` | Subtle fill, e.g. the pill nav-links track |
| `--overlay-rgb` | `15, 23, 42` | `255, 255, 255` | Neutral tint for hover/press/skeleton washes — see [§9](#9-theming) |
| `--glass-bg` / `--glass-bg-scrolled` / `--glass-bg-solid` | white-based | slate-900-based | The navbar's blurred glass chrome, at increasing opacity |
| `--surface-border` | `rgba(15,23,42,.07)` | `rgba(255,255,255,.08)` | Hairline borders |
| `--surface-shadow` | `0 1px 3px rgba(15,23,42,.08)` | `0 1px 3px rgba(0,0,0,.4)` | Resting elevation (cards) |
| `--surface-shadow-lg` | `0 24px 48px -16px rgba(15,23,42,.18)` | `0 24px 48px -16px rgba(0,0,0,.6)` | Popover/floating elevation (dropdowns, carousel cards) |

Beyond the core palette, content cards (see [§7](#7-engagement-bait-the-healthy-kind))
use a curated set of 6 saturated gradient pairs, picked deterministically per
item so the same item always renders the same color. Don't add more than
needed — the point is variety at a glance, not a rainbow. Current set lives
in `WorkoutCard.vue`'s `CARD_THEMES`, and — unlike everything else on this
page — it's **the same in both themes on purpose**. See [§9](#9-theming).

### Shape & elevation

| Token | Value | Use |
|---|---|---|
| `--radius-pill` | `999px` | Buttons, chips, nav links — anything that reads as "tappable" |
| `--radius-md` | `0.9rem` | List rows, small controls |
| `--radius-lg` | `1.25rem` | Cards, section containers, dropdowns |

Rule of thumb: **pill for actions, rounded-rect for containers.** A pill
shape signals "tap me"; a soft rounded rectangle signals "this is a
surface/container." Don't mix them up (e.g. don't make a card pill-shaped).

### Typography

- Font stack: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` (`$font-stack`)
  — system-first for fast load and native feel, no webfont dependency.
- Headings (`h1`–`h6`) default to `--color-secondary`, no top margin (layout
  controls spacing, not the heading itself).
- Weight is the primary hierarchy tool, not size: `700`/`800` for names,
  stats, and headings; `600` for interactive labels (links, buttons); `400`
  for body copy. Keep font sizes in a narrow `0.75rem`–`1.3rem` band for UI
  chrome — big type is reserved for the one hero number on a card
  ([§7](#7-engagement-bait-the-healthy-kind)), not for general emphasis.

### Spacing

No formal spacing scale is enforced yet — components use `rem` values that
are multiples of `0.25rem`/`0.15rem` gaps and `0.5–1.5rem` paddings. Stay in
that rhythm rather than introducing arbitrary pixel values.

## 4. Layout & responsive strategy

Breakpoints (defined once, reused everywhere — don't invent new ones per
component unless there's a genuine reason):

| Breakpoint | Value | Meaning |
|---|---|---|
| `respond-to('small')` (`_mixins.scss`) | `max-width: 600px` | Phones |
| carousel breakpoint | `max-width: 640px` | Where list → carousel and row-card → square-card switches happen (see [§5](#workoutfeedvue--workoutcardvue)) |
| `respond-to('medium')` (`_mixins.scss`) | `max-width: 900px` | Tablets / where the navbar collapses, grids go single-column |

**The responsive pattern used throughout is "same data, different shape,"
driven entirely by CSS media queries** — never a JS-computed "is mobile"
branch that renders different markup. `WorkoutFeed`/`WorkoutCard` render one
DOM tree; CSS decides whether it's a vertical list of rows or a horizontal
carousel of square cards at the same breakpoint. This keeps behavior
(routing, data fetching, a11y tree) identical across screen sizes and avoids
the two-implementations-drift-apart problem.

**PWA-specific layout rules:**
- The header is `position: sticky`, not `fixed` — it participates in layout
  instead of needing compensating body padding, and it's how
  `NavBar.vue`'s scroll-elevation effect (`.is-scrolled`) works.
- `padding-top: env(safe-area-inset-top)` on the sticky header so it clears
  a notch/Dynamic Island once installed as a standalone PWA.
- Touch targets are ≥ `2.5rem` (40px) square, matching `.menu-toggle` and
  the avatar chips — comfortably above the ~44px recommended minimum once
  you include the surrounding tap padding.
- No `:hover`-only affordances for anything essential (see `WorkoutCard`'s
  mobile mode, which drops hover-dependent states entirely).

## 5. Component patterns

**Componentize eagerly.** If a piece of UI has any realistic chance of being
used twice — a back link, a page header, a badge, a stat row — make it a
component in `common/` (or the feature's folder) the *first* time you build
it, not after the third copy-paste has already drifted. Duplicated scoped
CSS blocks across views are the smell to watch for: identical `__back`,
`__header`, or badge styles in two files means a component should exist.
The same goes for logic: shared formatting/sorting belongs in `lib/` or a
composable, not re-derived per view. When you extract one, add it to this
section so the next contributor finds it before reinventing it.

### `common/AppButton.vue`

The one and only button component. Renders as `<RouterLink>`, `<a>`, or
`<button>` depending on which of `to`/`href` is passed — callers never
choose the tag themselves.

- `variant`: `primary` (gradient, for the one main action in a context) or
  `ghost` (neutral, for secondary actions). Don't add more variants without
  updating this guide — the two-variant limit is intentional, it keeps
  "what's the main action here" unambiguous.
- `size`: `sm` / `md` / `lg`. `lg` is for a single hero CTA per screen (e.g.
  "+ Add workout" under a section) — it also switches to a rounded-rect
  radius instead of a pill, visually marking it as *the* call to action.
- Always `block` on mobile for primary CTAs that should span the available
  width — thumb-friendly, unambiguous.
- `type`: `'button'` (default) or `'submit'` — only meaningful when it
  renders as a native `<button>` (no `to`/`href`). Added for the workout
  form's save action; before that, every button on the app was a navigation
  or an `@click` handler, so nothing needed `type="submit"`. If you add a
  `<form>`, its primary action should be `type="submit"` on an `AppButton`
  rather than a manual `@click` that calls the same handler a submit would
  — native `<form @submit>` also gets you Enter-to-submit from any field
  for free.
- `disabled`: dims to 55% opacity and blocks pointer/hover state changes.
  Use it for "request in flight," not for "this action doesn't apply yet"
  (prefer just not rendering the button, or an `EmptyState`, for that).

### `common/Icon.vue`

The one way to render a UI glyph: `<Icon icon="md.download" />`. Icons are
inline SVG path data from the registry in `lib/icons.ts` — no icon font, no
CDN (same no-external-dependency reasoning as the font stack in
[§3](#3-design-tokens)). The registry is namespaced sets (`md.*` Material
Design, `fa.*` Font Awesome Free solid, `custom.*` hand-drawn), and the
`icon` prop is typed as the full `'set.name'` union, so every valid name
autocompletes and a typo fails type-check. Adding an icon is a one-line
paste into the right set in `lib/icons.ts`.

The glyph is `1em` of `currentColor` — it sizes and colors like a text
character, so style the *surrounding* element (or set `font-size` on
`.icon`) rather than passing size/color props. It's `aria-hidden` always:
an icon never carries meaning alone, the host control provides the
accessible name (`aria-label` on icon-only buttons). Don't add new emoji
or entity-character glyphs (`&#8595;`-style) to UI chrome — put a real
path in the registry instead. (The theme registry's emoji icons and
`WorkoutCard`'s type emoji predate this and are content, not chrome —
they stay as they are.)

### `common/SectionCard.vue`

The rounded `--color-surface` container every "section" on a page lives in
(see `GymHome.vue`). Header (`title` + optional `actions` slot) + body slot.
Reach for this instead of hand-rolling `<section>` styling — consistent
padding/radius/shadow across the app is what makes a page feel coherent
rather than assembled from mismatched parts.

### `common/Modal.vue`, `common/ConfirmDialog.vue`

`Modal` is the one generic dialog shell — `<Teleport to="body">`'d, backed by
`useModalStack` (a shared, module-level stack so `isTop()` means something
across multiple modal instances) for correct Escape-key targeting when more
than one is ever open. It's driven entirely by the caller's own `v-if`
around `<Modal>` — mounting *is* opening, unmounting *is* closing, there's
no separate `open`/`visible` prop to keep in sync. `size`: `sm` (default,
confirm-dialog width) / `md` / `lg` (near full-screen). `enableClosing`
disables the × button and both Escape/outside-click, for a step that
shouldn't be dismissible (e.g. `ConfirmDialog` disables it while `loading`
is true, so a pending irreversible request can't be walked away from
mid-flight). Same backdrop/panel chrome and motion as `ThemeMenu` (bottom
sheet on mobile, centered card from `641px` up) — one consistent "how a
modal presents itself" across the app, deliberately reused rather than
each modal inventing its own entrance.

`ConfirmDialog` wraps `Modal` for exactly one job: the single confirm step
required before an irreversible action (see [§8](#8-clarity--navigation)).
`title` + `message` (or the default slot, for anything richer than plain
text), `confirmLabel`/`cancelLabel`, and `loading` (disables both buttons
and the dialog's own close paths while the caller's request is in flight —
the caller owns the actual async call and passes its own loading state
in, `ConfirmDialog` never calls an API itself). `danger` defaults to `true`
since that's the common case this component exists for. The confirm button
is intentionally *not* `AppButton` — `AppButton` caps at two variants on
purpose (see below), so a destructive confirm is a resting-state
danger-tinted pill (`--color-danger` text on a `--color-danger-rgb`
background tint, not solid fill + white text) instead of a third variant.
The tint (rather than solid fill) is why it clears contrast in both themes
without a separate dark-theme override — see [§3](#3-design-tokens)'s
contrast rules for why `--color-danger` isn't used as a button's solid
background.

### `common/InstallHelpModal.vue`

The manual "Add to Home Screen" walkthrough shown when the install button
is tapped in a browser with no programmatic install prompt — iOS (every
browser there), Firefox, or Chromium on a plain-HTTP origin. Steps are
per-platform (`platform` prop from `usePwaInstall`), and the whole flow is
owned by `NavBar.vue`'s install button: native prompt when available,
this modal otherwise. `usePwaInstall`'s `canInstall` already hides the
button on desktop browsers that can't install at all, so this is never a
dead end.

### `common/EmptyState.vue`

Every list-like view needs a designed empty state, not a blank div. Message
+ optional action slot. Use it any time a fetch can legitimately return zero
items — an empty screen with no explanation reads as broken, not empty.

### `common/SkeletonBlock.vue`

A single shimmering placeholder rectangle (`height`/`width`/`borderRadius`
props). Compose several of them to sketch a loading page's rough shape
(see `GymWorkoutDetail.vue`'s and `GymWorkoutForm.vue`'s loading states) —
cheaper and more consistent than each screen hand-rolling its own shimmer
CSS. `WorkoutFeed.vue`'s carousel skeleton predates this and still has its
own inline version; a new loading state should use this component instead.

### `common/PageShell.vue`, `common/PageHeader.vue`, `common/BackLink.vue`

The page scaffolding trio — every routed view (except the status pages'
centered layout) composes these instead of re-declaring the same scoped
CSS:

- `PageShell` — the centered, capped-width column with the app's page
  padding and vertical rhythm. `max-width` prop is the only per-page knob
  (`720px` default for forms/lists, `1000px` detail, `1200px` dashboard
  grids).
- `PageHeader` — `title` + optional `subtitle`, the standard list-page
  heading.
- `BackLink` — the "← Back to X" link at the top of every sub-page
  (`to` prop, label via slot).

### `common/BadgePill.vue`

The small uppercase status pill ("You", "In progress"). `variant="primary"`
for identity/ownership, `variant="accent"` for live state — two tints so
two badges can sit side by side and still read as different kinds of
information (see the workout detail byline).

### `common/UserBadge.vue`

Avatar-initials-circle + username, linking to `/gym/users/:id`. Used
anywhere a piece of content needs to show (and link to) who made it —
currently the workout detail page's byline. `size`: `sm` / `md`.

### `common/ComboBox.vue`

A free-text input with filtered autocomplete suggestions underneath —
typing something not in the list is just as valid as picking a suggestion,
this is a suggestion box, not a restricted picker. Built for the workout
form's exercise-name field (see [§10](#10-forms)), but generic: `options:
string[]`, plain `v-model`. Filters case-insensitively, `startsWith`
matches sort first, capped at 8 results. Keyboard: arrow keys to
highlight, `Enter` to accept the highlighted option (or just close if
nothing's highlighted — the typed text is already the value), `Escape` to
close, click-outside to close.

### `common/ThemeToggle.vue`, `common/ThemeSwitcher.vue`, `common/ThemeMenu.vue`

The three pieces of the theme system's UI — see [§9](#9-theming) for the
full mechanism. In short: `ThemeToggle` is a single icon button (click =
quick light/dark swap, 8 rapid clicks = open the picker) showing the active
theme's own registry icon, not always sun/moon. `ThemeSwitcher` pairs it
with a chevron that opens the picker directly — desktop-only, since mobile
gets its own entry point in `NavBar`'s full-screen menu instead of a second
control crammed into the compact header. `ThemeMenu` is the picker itself: a
single global modal mounted once in `App.vue`, opened from anywhere via
`themeStore.openPicker()`.

### `gym/WorkoutFeed.vue` + `gym/WorkoutCard.vue`

The reference implementation of the "same data, different shape" pattern
from §4, and of the engagement-bait styling from §7. Read these two files
together before building another data feed/list — the loading skeleton,
empty state, and carousel mechanics are meant to be copied, not
reinvented per feature.

- Desktop (`> 640px`): vertical list, compact rows, avatar left / text
  right, minimal color.
- Mobile (`≤ 640px`): horizontal `scroll-snap` carousel, one card fully
  visible plus the next one peeking at the edge (`flex: 0 0 76%`) as a
  built-in "there's more, swipe" affordance. `scroll-snap-stop: always` is
  load-bearing — without it, a fast trackpad/wheel flick skips past cards.
- **Finite, never looping.** The carousel only ever contains
  `items.length` cards. A trailing `FeedMoreCard` (dashed outline, distinct
  from content cards on purpose) is the *only* thing after the last real
  card — that's the "end of list" signal, not a loop back to card one.

### `gym/FeedMoreCard.vue`

The carousel/list terminator. Deliberately styled differently from
`WorkoutCard` (dashed border, muted fill) so it reads as "action, not
content" at a glance — never make a "view all" card look like a real data
card, or users will swipe past it assuming it's more content.

### `gym/detail/*` (`GymWorkoutDetail.vue`'s pieces)

`WorkoutStatsBar` (the hero-volume-plus-stat-grid header), `WorkoutExerciseSection`
(one exercise: name, time range, its sets), `RepChart` (the per-set bar
chart inside a section — see [§7](#7-engagement-bait-the-healthy-kind) for
why it's bars instead of a line of text), and `WorkoutExerciseNav` (the
quick-lookup jump list, sidebar on desktop / horizontal chips on mobile —
another "same DOM, different shape" instance, [§4](#4-layout--responsive-strategy)).
Read these together before building another detail-style page; the
pattern (hero stat card, then a nav + content two-column layout that
collapses to one column) is meant to be reused, not reinvented.

### `gym/form/*` (`GymWorkoutForm.vue`'s pieces)

`ExerciseFormRow` (name + previous-sets hint + its sets) and `SetInputRow`
(one set: a list of weight+reps "drop" pairs, defaulting to one). See
[§10](#10-forms) for the form-specific patterns these establish — the
"helpful, not invasive" previous-sets hint
in particular.

### `gym/form/WorkoutMode.vue`

The full-screen, one-thumb workout logger — entered from the mobile-only
mode switcher at the bottom of `GymWorkoutForm.vue` (hidden above 640px;
this is a phone-at-the-gym surface). Patterns it establishes:

- **Same state, second interface.** It edits the *same* reactive
  `WorkoutFormState` object as the normal form (passed by reference, shape
  defined in `formState.ts`) — never a copy that syncs back on exit. That's
  what makes "switch to the normal view to fix a mistake" free and lossless,
  and it's the required shape for any future alternate editing surface.
- **A stage machine, not routes.** Three stages (`naming` → `overview` →
  `set`) as a local `ref`, since the whole thing is one modal experience the
  router shouldn't know about. Enter submits the naming stage (a real
  `<form @submit>`, `enterkeyhint="go"` for mobile keyboards).
- **No moving parts.** Every region on the set stage has a fixed size (the
  rep-chart row keeps its height whether empty or full; the undo button is
  always rendered, merely disabled) so the hero button never shifts under a
  mid-set thumb. The only motion is the chart's own horizontal scrolling.
- Teleported to `<body>` like every full-screen fixed overlay (see NavBar),
  solid `--color-background` (not glass — it's a workspace, not a sheet),
  safe-area-inset padding, body scroll locked while open.
- **One hero control per stage** (§7/§8): the giant circular "+1 rep"
  button is the single oversized element on the set stage, with the rep
  count as the hero number above it. Weight steppers snap to the 0.5 kg
  grid (weights are floats — half-kg plates are real).
- Name suggestions are opt-in chips that only fill the field
  (`exerciseHistory.ts`, own history only) — same "helpful, not invasive"
  rule as the previous-sets hint.

### `layout/NavBar.vue`

Sticky, glassy (`backdrop-filter: blur`), gains a shadow once
`window.scrollY > 8` (`.is-scrolled`) for depth-on-scroll. Collapses to a
hamburger below `respond-to('medium')` (900px), with a real animated
hamburger-to-X icon, closes on: outside click, `Escape`, route change, and
viewport growing back past the breakpoint. Every color in it comes from the
theme tokens in [§3](#3-design-tokens) — it's the component with the most
surface area (glass chrome, pills, full-screen menu), so it's the best
reference for theming a new component correctly.

Below 900px, the hamburger opens a **full-screen** menu, not a small
floating card — deliberately, so it reads as "you're now in the app's
navigation," not a dismissible tooltip, and so it has room for a page list
that will grow. It's structured as a flex column filling the viewport:

- A scrollable top area (`.mobile-menu__scroll`) for nav links — sized to
  keep growing as more top-level pages get added, without needing a layout
  change.
- A `flex-shrink: 0` footer (`.mobile-menu__footer`) that's *effectively*
  sticky — not via `position: sticky`, but because the scroll area above is
  its own independent scroll container and the footer sits outside it in
  the same flex column, so it never scrolls out of view. Contains the
  user info (login/user chip) and `.mobile-theme-button` — the mobile entry
  point to `ThemeMenu` (see [§9](#9-theming)) — deliberately grouped
  together as "who you are and how the app looks," the two things you'd
  expect at the bottom of a mobile nav sheet.

**Load-bearing implementation detail:** this panel is `<Teleport
to="body">`'d, not rendered inline where the template puts it. `.app-header`
has its own `backdrop-filter`, and per spec, an element with
`backdrop-filter` (like `transform` or `filter`) becomes the *containing
block* for any `position: fixed` descendant — so without the `Teleport`, the
menu's `inset: 0` resolves against the header's own small box instead of the
viewport, and it silently stops being full-screen. If you ever need another
`position: fixed` overlay nested under a blurred/transformed ancestor,
teleport it to `body` too rather than debugging why "fixed" isn't behaving
like fixed. (Corollary: because it's teleported, its outside-click check
can't rely on `headerRef.contains(...)` alone — it has its own ref, checked
alongside the header's. See `handleOutsideClick` in `NavBar.vue`.)

The panel's background is `color-mix(in srgb, var(--color-surface) 94%,
transparent)` under a 32px blur — noticeably heavier on both axes than the
header's own glass (which is `--glass-bg` at a lower blur radius). The
header only ever sits over normal page background; this menu can end up
over a screen full of vivid `WorkoutCard` gradients mid-scroll, so it needs
enough opacity and blur that those colors read as a muted wash behind the
nav text, not a distraction competing with it. If you add another
full-viewport overlay over content that can be this visually busy, match
this treatment rather than reusing the header's lighter glass.

## 6. Motion & interaction

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Hover/press feedback (buttons, chips, list rows) | `0.15s` | `ease` | Fast enough to feel instant |
| Larger surface transitions (header blur/shadow, `lg` buttons) | `0.2s`–`0.25s` | `ease` | Slightly slower for bigger visual changes |
| Dropdown/menu/sheet open-close | `0.16s`–`0.2s` | `ease` | Paired with a small translate + opacity, never a bare fade |
| Loading skeleton shimmer | `1.4s` | `ease infinite` | Communicates "fetching," never left in a static/blank state |

Rules:

- **Every custom animation must have a `@media (prefers-reduced-motion:
  reduce)` fallback** that disables it (see `NavBar.vue` and
  `WorkoutFeed.vue` for the pattern: `transition: none !important` on the
  affected selectors). This isn't optional polish — treat it as a
  correctness requirement, the same way you'd treat a missing `alt` text.
- Prefer CSS transitions/animations over JS-driven ones. If something can
  be a `transition:` on a class toggle, it should be — it's cheaper, and it
  composes with `prefers-reduced-motion` for free.
- Motion should always mean something (state opened, position changed,
  loading in progress) — never add motion purely for decoration on a static
  element.

## 7. Engagement bait (the healthy kind)

The brief for this app explicitly wants a "healthy amount of engagement
bait" — logging a workout should feel a little bit like a small win, the way
closing an activity ring or seeing a streak number does elsewhere. Concretely,
that means:

- **A bold hero stat per card.** `WorkoutCard`'s mobile layout makes the kg-
  lifted figure the single biggest, boldest thing on the card — the "reward"
  a user sees immediately. Any new content card should identify its one
  headline number and give it the same treatment, not bury it in a meta line.
- **Deterministic color + icon variety.** Cards get a stable
  gradient (hashed from their id) and a small icon matched to their type
  (`💪` push, `🏋️` pull, `🦵` leg, `🔥` full body, `⚡` upper body, `🏆`
  fallback). The goal is a shelf of colorful, distinct "trophies" — scrolling
  the carousel should feel like flipping through a card collection, not a
  spreadsheet. Keep the icon set small and legible at a glance; don't caption
  every card with an explanation of what the icon means, the emoji should be
  self-evident.
- **Frosted-glass, gradient, and glow details** (the avatar's blurred
  translucent circle, the soft radial highlight in the card's corner) add
  perceived polish without adding real visual noise — they're subtle enough
  to not compete with the hero stat.

**Explicit boundaries — what this is *not* license to do:**

- No fake urgency ("only 2 spots left," countdown timers on nothing).
- No guilt/streak-shaming copy ("Don't break your streak!" nags).
- No dark-pattern friction on opt-out actions (logging out, dismissing a
  prompt) — those should be exactly as easy as the primary action, not
  buried or padded with extra steps to discourage them. Irreversible
  actions (deleting a workout) are the one deliberate exception: they get
  exactly one `ConfirmDialog` step — see [§8](#8-clarity--navigation) for
  why that's a safety net rather than the friction this rule is about.
- No notification bait that isn't the user's own data changing.

If a proposed "engagement" idea doesn't survive "would this still feel good
if the user thought about it for 5 seconds," don't ship it.

## 8. Clarity & navigation

- **One obvious primary action per screen or section.** `AppButton`'s
  `primary` variant should appear at most once or twice on a screen — if
  everything is a gradient pill, nothing is the main action.
  header buttons (`View all`, `Manage friends`) stay `ghost`.
- **Labels are actions, not nouns.** "+ Add workout," "View all," "Log your
  first workout" — a verb plus what happens, not a generic "Submit" or
  "OK." A user should be able to guess correctly what will happen before
  they tap.
- **Never leave a dead end.** Every list has an empty state with a next
  step ([§5](#commonemptystatevue)), every carousel ends in a "view all"
  card ([§5](#gymworkoutfeedvue--gymworkoutcardvue)), every destructive or
  loading state gets visible feedback rather than silence.
- **Consistent iconography for consistent meaning.** A hamburger always
  opens navigation, a dashed outline always means "this is an action tile,
  not content," an avatar circle always means "this belongs to a person."
  Don't reuse a visual motif for a different meaning elsewhere in the app.
- **Irreversible actions get exactly one confirm step — never zero, never
  more than one.** Anything with no undo (deleting a workout, and anything
  else destructive added later with no soft-delete/undo path) opens
  `common/ConfirmDialog.vue` before it happens: a single, clearly-labeled
  choice ("Delete" / "Cancel"), not a second nag, a typed confirmation
  phrase, or a countdown. This is a safety net for something the user can't
  take back, not the "opt-out friction" [§7](#7-engagement-bait-the-healthy-kind)
  warns against — that rule is about padding an action with steps to
  discourage it; one confirm step for an irreversible action is the
  opposite of that, it's what makes the action safe to offer as
  unhesitatingly as everything else. Reversible destructive-looking actions
  (removing a still-unsaved set row mid-edit) don't need it — only reach
  for `ConfirmDialog` once there's genuinely no way back.

## 9. Theming

The app ships **11 hardcoded themes** — `Light`, `Dark`, and 9 named ones
(`Aurora`, `Sunset Blvd`, `Evergreen`, `Abyss`, `Cotton Candy`, `Neon Grid`,
`Rose Gold`, `Magma`, `Nordic Frost`) — selectable at runtime and persisted
across visits. The whole mechanism:

- **`src/styles/_themes.scss`** — the token contract. One `[data-theme='id']`
  block per theme, each defining the exact same set of custom properties
  (see the table in [§3](#3-design-tokens)). Two Sass mixins, `light-chrome`
  and `dark-chrome`, hold the half of the contract that's genuinely shared
  across every light-background or dark-background theme (neutral overlay
  tint, borders, shadows, radii, `color-scheme`) — a new theme only has to
  state the part that makes it *distinct*: brand colors, text, and the three
  surface tones. See "Adding a new theme" below.
- **`src/stores/theme.ts`** — owns two things:
  - The **`THEMES` registry**: `{ id, name, icon }[]`, the single source of
    truth for "which themes exist, what are they called, what emoji
    represents them" on the JS/UI side (as opposed to `_themes.scss`, which
    is the source of truth for their actual colors — a theme isn't finished
    until it's in both places).
  - A Pinia store that sets `data-theme` on `<html>`, persists the choice to
    `localStorage`, and otherwise follows `prefers-color-scheme` live (for
    `light`/`dark` only — the 9 named themes are never auto-selected by the
    OS preference). It's imported eagerly in `main.ts` *before*
    `app.mount()`, so the correct theme is already on `<html>` for the very
    first paint — there is no flash-of-wrong-theme, and that must stay true
    for any future theme too. It also owns `isPickerOpen`, shared global
    state for the picker described below.
- **`src/components/common/ThemeToggle.vue`** — the compact icon button.
  A single click is a **quick light/dark swap** (`theme === 'dark' ? 'light'
  : 'dark'` — it ignores which of the 9 extra themes is active and always
  resolves to one of the two base ones). Clicking it **8 times within 1.5s**
  opens the full picker instead — a hidden-but-discoverable shortcut. Its
  icon is the *active* theme's icon from the
  registry: ☀️/🌙 for light/dark, or that theme's own icon for any of the 9
  — never a generic "custom theme" placeholder, each one gets its own mark.
- **`src/components/common/ThemeSwitcher.vue`** — `ThemeToggle` plus a small
  chevron button next to it, the discoverable desktop-only way to open the
  picker without knowing about the spam-click. Lives in `NavBar.vue`'s
  `.auth-inline`-style desktop-only slot (hidden below the 900px breakpoint
  — **as a wrapping `<div>`, not a class on the component root**; see the
  NavBar entry in [§5](#5-component-patterns) for why that distinction
  matters).
- **`src/components/common/ThemeMenu.vue`** — the picker itself: a
  `<Teleport to="body">`'d modal (bottom sheet on narrow screens, centered
  card on wide ones) listing all themes from the registry as icon+name
  tiles, with a checkmark on the active one. Mounted once, at the app root
  in `App.vue`, and opened/closed purely through `themeStore.isPickerOpen`
  — any future entry point just calls `themeStore.openPicker()`, it doesn't
  need to know how to render the menu itself.

On mobile, the picker's third entry point lives inside the full-screen nav
menu's sticky footer (`.mobile-theme-button`, in `NavBar.vue`) rather than in
the compact header — see that component's entry in [§5](#5-component-patterns)
for the reasoning.

Adding a new hardcoded theme is meant to be a **two-file, additive change**
(one color block in `_themes.scss`, one registry entry in `theme.ts`) — see
the steps below. You should **not** need to touch any other component's
`<style>` block to add a theme — if you find yourself doing that, it means
some component still has a hardcoded color that should have been a token in
the first place. Fix that in the component, not by special-casing the new
theme.

### The token contract

Every `[data-theme='...']` block must define all of:

`--color-primary`, `--color-primary-rgb`, `--color-primary-dark`,
`--color-accent`, `--color-accent-rgb`, `--color-secondary`, `--color-text`,
`--color-background`, `--color-surface`, `--color-surface-alt`,
`--overlay-rgb`, `--glass-bg`, `--glass-bg-scrolled`, `--glass-bg-solid`,
`--surface-border`, `--surface-shadow`, `--surface-shadow-lg`,
`--radius-pill`, `--radius-md`, `--radius-lg`, and set `color-scheme`
(`light` or `dark` — this is what makes native form controls, scrollbars,
etc. pick a matching style for free). In practice you get the last 9 of
those (everything from `--overlay-rgb` down) for free by including
`light-chrome` or `dark-chrome` — see below.

Three of these are **RGB triplets, not colors** (`--color-primary-rgb`,
`--color-accent-rgb`, and the neutral `--overlay-rgb`) — they exist so a
component can write `rgba(var(--color-primary-rgb), 0.35)` and get a
themed color at an arbitrary opacity, which you can't do by adding alpha to
a `#hex` custom property. **If you introduce a new base color that will ever
need a translucent variant, add its `-rgb` sibling in the same PR.**
`--overlay-rgb` is the special one: it's the neutral tint used for
hover/press/skeleton "wash" effects, and it deliberately flips direction
between themes (dark ink over a light surface; light wash over a dark one)
— that's *why* it's a token instead of every component hardcoding
`rgba(15, 23, 42, X)`, which only ever looks right on a light background.

### Adding a new theme, step by step

1. In `_themes.scss`, add a new `[data-theme='your-id']` block. Start with
   `@include light-chrome;` or `@include dark-chrome;` depending on whether
   your background is light or dark — that's the neutral border/shadow/
   overlay/radius half of the contract handled in one line.
2. Fill in the theme-specific half: `--color-primary` (+ its `-rgb`
   sibling), `--color-primary-dark`, `--color-accent` (+ `-rgb`),
   `--color-secondary`, `--color-text`, `--color-background`,
   `--color-surface`, `--color-surface-alt`, and the three `--glass-bg*`
   tokens (tint them toward your `--color-background`/`--color-surface`,
   the way every existing theme does, rather than reusing a neutral gray).
   See "Contrast rules" below for the bar each has to clear.
3. Register it in `stores/theme.ts`'s `THEMES` array: `{ id: 'your-id',
   name: 'Cool Display Name', icon: '🎨' }`. Pick an emoji nobody else in
   the list is using. The `id` here must exactly match the `[data-theme=]`
   value from step 1 — nothing enforces that at compile time, so double
   check it.
4. That's it for wiring — `ThemeToggle`'s icon, `ThemeMenu`'s grid, and
   persistence all read the registry, so a new entry there just appears
   everywhere automatically. Nothing to touch in `ThemeToggle.vue`,
   `ThemeMenu.vue`, or `NavBar.vue`.
5. Manually check every component in [§5](#5-component-patterns) with the
   new theme active (see "Testing a theme" below) — there is no linter for
   "this component forgot to use a token."

### Contrast rules

Target **WCAG 2.1 AA**, checked against whichever background the text/icon
actually sits on (usually `--color-background` or `--color-surface`):

| Content | Minimum contrast ratio |
|---|---|
| Body text (`--color-text`), and any text under ~18px regular / ~14px bold | **4.5 : 1** |
| Headings (`--color-secondary`) | **4.5 : 1** (aim higher — headings carry the most weight on a page) |
| Large text (≥18px regular / ≥14px bold) and UI graphics (icons, focus rings, control borders) | **3 : 1** |
| `--color-primary`/`--color-accent` used *as text or an icon color* on `--color-surface`/`--color-background` | **3 : 1** minimum, **4.5 : 1** where it's doubling as body text (e.g. a link) |
| Button label color (usually `#fff`) against the *darkest* stop of its gradient background | **4.5 : 1** |

How to check: browser devtools color picker shows a contrast ratio (and an
AA/AAA pass indicator) when you inspect any element's `color`; use it
against the computed background. There's no automated check in CI for this
yet — treat it as a required manual step before merging a new theme, the
same way you'd manually check a layout on a real phone.

Two tokens are exempt from the 4.5:1 text bar because they're never used for
body text, only for very large/bold numerals or icons sitting on a vivid,
non-neutral background (the workout-card hero stat on its gradient) — for
those, hold the line at 3:1 and lean on `text-shadow`/a translucent scrim if
a particular gradient runs light (see `WorkoutCard.vue`'s `text-shadow` on
`.workout-card__name`).

### What stays the same in every theme

`WorkoutCard`'s carousel-mode gradients (`CARD_THEMES`) and their white text
are **intentionally theme-invariant** — they're a deliberate "spot color"
moment (see [§7](#7-engagement-bait-the-healthy-kind)), not part of the
neutral chrome, and a vivid saturated gradient with white text reads fine on
both a light and a dark page. Don't route these through theme tokens; don't
add a "card theme" mode either. If you're building another engagement-bait
surface like this, the same exemption applies — but say so explicitly in
that component, the way `WorkoutCard.vue`'s comment does, so it's clearly a
choice and not a token someone forgot to wire up.

### Testing a theme

Before shipping a new or changed theme:

- [ ] Select it via `ThemeMenu` (open it from `ThemeSwitcher`'s chevron, or
      the mobile nav's sticky footer button) and confirm every component in
      [§5](#5-component-patterns) — especially `NavBar` (including the
      full-screen mobile menu, open) and `WorkoutCard` in both its row and
      carousel layouts — still has correct contrast and no leftover
      hardcoded color poking through.
- [ ] Reload the page with the theme active — it must persist (via
      `localStorage`) and must not flash the other theme first.
- [ ] If it's `light` or `dark`: toggle `prefers-color-scheme` at the OS
      level with no explicit choice made yet (clear `localStorage`) — the
      app should follow it live. The 9 named themes are never
      auto-selected by the OS preference, only by explicit choice.
- [ ] Confirm `ThemeToggle` shows the new theme's own registry icon (not a
      generic placeholder, and not the sun/moon) when it's active.
- [ ] Check it with `prefers-reduced-motion` on too — the theme switch
      itself has no required animation, but nothing else should break.

## 10. Forms

`GymWorkoutForm.vue` (create/edit a workout) is the app's first real form —
before it, every input was a link, a button, or a theme toggle. The
patterns it establishes:

### Base input styling is global, not per-component

`input[type=text|number|datetime-local]` get their border/radius/focus-ring
styling once, in `base.scss`, the same way `a`/`h1`–`h6` do — not scoped
CSS repeated in every form component. `.form-field` (label+input stack),
`.form-label`, and `.form-hint` (a small muted helper line under an input,
e.g. "leave empty while you're still lifting") are global for the same
reason: several different components (`GymWorkoutForm.vue`'s own fields,
`SetInputRow.vue`'s weight/reps) need to agree on the same shape, and
scoped styles can't cross a component boundary. **If you add a new native input type to a
form, add its base styling to this same global block** rather than
styling it locally — that's what keeps every form looking like the same
app instead of a patchwork.

### Persist-first + autosave, not local drafts

Creating a workout POSTs a blank in-progress record immediately
(`useStartWorkout.ts`) and lands on its edit page; from there a deep watcher
on the form state debounces (~2.5s after the last input) into a lenient PUT
(`buildDraftPayload` — persists whatever is valid so far, never blocks on
validation). The explicit Save button remains the strict, validated path.
A small `role="status"` line next to the title reports
pending/saving/saved/error. If a future form holds data a user would hate
to lose (anything entered on a phone, mid-activity), copy this shape: no
unsaved local draft should ever be more than a few seconds from the server.

### One shared component for create and edit

`GymWorkoutForm.vue` handles both `/gym/workouts/new` and
`/gym/workouts/:id/edit` — there is no separate edit-only component to
drift out of sync with the create one. If a future form needs the same
split (create vs. edit an existing thing), do the same: one component,
an `isEditing = computed(() => !!props.id)`, not two components that
happen to look alike today.

### "Helpful, not invasive" is a concrete UI shape, not just a vibe

`ExerciseFormRow`'s previous-sets hint is the reference implementation:
information is surfaced (last time's sets, visibly, right under the field
that triggered it), but nothing is auto-applied — applying it is always an
explicit, clearly-labeled button (`Use these sets`), never a silent
overwrite of what the user already typed. If you build another
"we noticed something, want to use it?" feature, match this shape:
show → label the action → let the user trigger it. Don't auto-fill on
blur/selection, and don't require confirming *away* from the suggestion
either (no "are you sure?" dialog for accepting it) — the friction should
be zero in both directions.

That hint also only ever draws on the current user's **own** history
(`exerciseHistory.ts` reads only their workouts) — suggesting a friend's
numbers as a template for your own is the invasive direction, not the
helpful one, even though the app has friends' data on hand elsewhere.

### Validation is inline text, not a toast or a popup

`GymWorkoutForm.vue` shows a single inline error message (`role="alert"`,
styled with `--color-danger`) above the submit button rather than a toast
per-field or a blocking dialog. Keep it that way for new forms: one place
to look, no interruption, and it uses the same `--color-danger` token as
`SetInputRow`'s remove-button hover — a token added specifically because
this was the first place the app needed a semantic "destructive/invalid"
color. It's defined once per `light-chrome`/`dark-chrome` mixin ([§9](#9-theming))
since it's universal, not brand-specific, the same reasoning as
`--overlay-rgb`.

### Match the data model's shape, default to its simplest case

The real `Workout` shape allows a set to have multiple weight/rep pairs
(a "drop set") — `formState.ts`'s `SetFormState.reps` mirrors that
directly rather than flattening it away, so nothing is lost editing a
workout that has them, and "Use these sets" can offer back the exact
drop-set structure it found. The "make it easy" part isn't in the data
shape, it's in the **default**: `createSetFormState()` starts a new set
with exactly one rep row, so the common case (a plain set) is just one kg
field and one reps field, same as before — `SetInputRow.vue`'s "+ Add
drop" is what a set with more than one weight step looks like, an opt-in
escalation rather than the default shape everyone has to see. If a future
field has this same tension (the data model supports something most users
don't need), prefer this pattern — model it fully, default to the minimal
case — over silently flattening data the model can actually express.

### One field is the source of truth, the others are views onto it

`ExerciseFormRow`'s Start/Minutes/Ends trio looks like three independent
fields but stores at most two values — `ExerciseFormState.durationMinutes`
plus an optional pinned `startTime`. Ends is never stored: it's always
`startedAt + durationMinutes`, rendered as an editable `<input type="time">`
whose `@change` handler works backwards — it recomputes the duration from
the typed end time (clamped to a minimum of 1 minute). This avoids the
values ever disagreeing, which a naive "store start, end, and duration,
keep them in sync" approach can't guarantee. If a future field has this
same "one number, multiple editable representations" shape, derive the
redundant ones instead of storing and syncing them.

Start is editable too, but with **hint-until-pinned** semantics:
`startTime: null` means the chained value (the workout's own start for the
first exercise, the previous exercise's end for the rest — resolved in
`GymWorkoutForm.vue`'s `exerciseTimings`) is only a live default that keeps
*following* its anchor when the workout start or an earlier duration
changes. Typing a start pins that exercise to a wall-clock time and stops
the following; clearing the field hands it back to the chain. Loading an
existing workout re-derives this per exercise: a stored start that sits
exactly where the chain would put it loads as still-following, only a
deviating one loads as pinned. Prefer this pattern over a one-shot default
(stale the moment its input changes) or a hard binding (which would forbid
gaps and overlaps the user meant to record).

## 11. Adding something new — checklist

Before adding a new component or screen, confirm:

- [ ] Colors, radii, and shadows come from the tokens in [§3](#3-design-tokens),
      not new hard-coded values.
- [ ] It's designed mobile-first; desktop is the enhancement, not the base.
- [ ] Any custom animation has a `prefers-reduced-motion` fallback.
- [ ] Any list/feed has a loading skeleton and an `EmptyState`, not a blank
      gap.
- [ ] Buttons use `AppButton`; containers use `SectionCard`, unless there's
      a documented reason not to (and if so, consider updating this guide).
- [ ] UI glyphs use `Icon` (`icon="set.name"`, backed by `lib/icons.ts` —
      add missing icons there), never entity characters or emoji in chrome,
      and never meaning carried by the glyph alone ([§5](#commoniconvue)):
      icon-only controls get an `aria-label`.
- [ ] Nothing was copy-pasted that should be a component ([§5](#5-component-patterns)'s
      "componentize eagerly" rule): pages compose `PageShell`/`PageHeader`/
      `BackLink`, badges are `BadgePill`, and shared formatting/sorting
      comes from `lib/`/composables instead of being re-derived per view.
- [ ] Internal navigation uses `to` (RouterLink), never `href` — `href` on
      an `AppButton` is for genuinely external URLs only (a full page
      reload throws away the SPA state, e.g. an in-flight autosave).
- [ ] Touch targets are comfortably tappable (~40px+), and nothing essential
      requires `:hover` to discover or use.
- [ ] If it's a card/feed meant to be engaging, it has a clear single hero
      stat and fits the boundaries in [§7](#7-engagement-bait-the-healthy-kind)
      — nothing manipulative.
- [ ] It was actually looked at in `light`, `dark`, *and* at least one of
      the 9 named themes (open `ThemeMenu` and spot-check a vivid one like
      `Magma` or `Neon Grid`) — not just written against whichever theme
      happened to be active, per [§9](#9-theming).
- [ ] No new `rgba(15, 23, 42, …)`/`rgba(255, 255, 255, …)`/hex color was
      hardcoded where a `--color-*`, `--overlay-rgb`, or `--surface-*` token
      should have been used instead (grep for raw `rgba(` and `#` colors in
      your diff as a gut check).
- [ ] If it's a form: inputs use the global base styling ([§10](#10-forms)),
      not new scoped input CSS; any "we noticed something" suggestion is
      opt-in via a labeled button, never auto-applied; and if it can mutate
      data another screen also reads (a cache key another composable also
      fetches), that other screen was actually checked for staleness after
      the mutation — don't assume a separate `useCachedApi` call will
      notice a change it has no way to know about.
- [ ] If it's irreversible (a delete, or anything else with no undo), it
      goes through `common/ConfirmDialog.vue` ([§8](#8-clarity--navigation))
      — exactly one confirm step, not zero and not a second nag on top of it.
