---
name: motion
phase: all
description: >
  Decide whether something should move, then design and build the motion so it feels right —
  purpose, properties, curve, duration or spring, interruption, exit, and reduced motion — on any
  platform (web, React Native, Flutter, SwiftUI, Jetpack Compose, Framer, Webflow, Figma prototypes).
  Use when asked to animate something, add motion or a transition, spec motion for handoff, or
  make a component feel responsive. Produces a motion spec in design phases and an implementation
  in build. Recipes cover buttons, dropdowns, popovers, tooltips, modals, drawers, toasts,
  accordions, staggered lists, tabs, drag to dismiss, and data updates.
claude_surface: chat-or-code
ai_leverage: high
---

# Motion

Motion is a decision before it's an animation. Most bad motion comes from skipping the first two questions — should this move at all, and why — and then reaching for whatever curve looks familiar. This skill makes the calls in the order that decides whether motion feels right, then writes either a **motion spec** (Prototype, handoff) or the **implementation** (Build).

Adapted from Emil Kowalski's animation skills (MIT); see `ATTRIBUTION.md`. Pathlon's version adds design-system tokens, a spec output for designers, and translations for every platform.

## When to Use

- A component, screen, or state change needs motion — or someone is asking for it
- Prototype: deciding where motion belongs and writing the spec for handoff
- Build: implementing motion from a spec or a design
- QA: checking motion against the spec (the checklist at the end feeds `design-qa`)

## Rules

1. **Decide in order.** Steps 1 and 2 can end the work. Never pick a curve before deciding the thing should move.
2. **No invented values.** Curves, durations, and springs come from the system's tokens or the tables here.
3. **The design system wins.** If the product's system has motion tokens, use them. If it doesn't, use Pathlon's defaults below and propose them to the system's owner (`design-system` skill, Step 6) — don't create a parallel set.
4. **Accessibility ships with the motion.** Reduced-motion handling (and hover gating on the web) is part of the first version, not a follow-up.
5. **Lightest tool that does the job.** Reach for a library only when the platform's built-in animation can't express the motion.
6. **Decide, don't offer choices.** Pick one approach, justify it in a sentence, and continue.

---

## Step 0 — Read the system's motion tokens

Check the design system summary in Pathlon (or run the `design-system` skill). Look for easing curves, a duration scale, and spring settings. Map what exists to the roles below. Where a role is missing, use the Pathlon default and note it as a gap.

**Pathlon default motion tokens**

| Token | Value | Use |
|---|---|---|
| `motion.ease.out` | cubic-bezier(0.23, 1, 0.32, 1) | Entering and exiting UI (strong ease-out; "ease-out quint") |
| `motion.ease.inOut` | cubic-bezier(0.77, 0, 0.175, 1) | Moving or morphing something already on screen ("ease-in-out quart") |
| `motion.ease.drawer` | cubic-bezier(0.32, 0.72, 0, 1) | Sheets and drawers (iOS-style) |
| `motion.ease.standard` | ease | Hover and color changes |
| `motion.duration.press` | 140ms | Press feedback |
| `motion.duration.quick` | 150ms | Tooltips, small popovers |
| `motion.duration.base` | 200ms | Dropdowns, menus, selects, accordions |
| `motion.duration.modal` | 250ms | Dialogs |
| `motion.duration.sheet` | 400ms | Drawers, sheets, toasts |
| `motion.spring.default` | duration 0.5s, bounce 0.2 (≈ mass 1, stiffness 158, damping 20; damping ratio 0.8) | Gestures and anything the user can interrupt |

The two built-in CSS keywords `ease-out` and `ease-in-out` are too weak for UI; use the curves above.

## Step 1 — Should it move at all?

Decide by how often the user sees it:

| How often | Decision |
|---|---|
| Constantly (keyboard shortcuts, command palette, 100+ times a day) | No motion. Stop here. |
| Often (hover, list navigation, tens of times a day) | Barely perceptible, or none |
| Occasionally (modals, drawers, toasts, menus) | Standard motion |
| Rarely (onboarding, first success, celebrations) | Room for expression |

Anything triggered from the keyboard belongs in the first row. When a request lands there, recommend against the motion, explain the frequency reason, and propose what to do instead (an instant change, or a visual cue that doesn't move). Deciding on no motion is a complete answer.

## Step 2 — Name the purpose

Pick one before going further:

- **Feedback** — the interface heard the user
- **Continuity** — where something came from or went
- **State** — making a change legible
- **Bridging** — avoiding a jarring jump in content
- **Explanation** — showing how something works (marketing and onboarding only)
- **Expression** — only at the "rarely" tier

No purpose, no motion. Also check function: content people read or act on — numbers, charts, forms — shouldn't move for style.

## Step 3 — Choose the tool

Walk down the list for the platform and stop at the first that fits. The full per-platform mapping is in **Platform translations** below.

- **Web:** CSS transition → CSS `@starting-style` (entry on mount) → CSS animation (predetermined motion that must stay smooth while the page is busy) → Web Animations API (programmatic, no library) → Motion (`motion.dev`) for springs, layout, exit, and gestures
- **React Native:** Reanimated (runs on the UI thread); avoid JS-thread `Animated` without the native driver
- **Flutter:** implicit animations (`AnimatedScale`, `AnimatedOpacity`, `AnimatedSlide`) → explicit (`AnimationController` + transitions) → physics (`SpringSimulation`)
- **SwiftUI:** `.animation(_:value:)` and `.transition` → `withAnimation` → `.spring`
- **Jetpack Compose:** `animate*AsState` → `AnimatedVisibility` / `updateTransition` → `spring`
- **Framer, Webflow, Figma:** the tool's own transition settings, using the same curves and durations

If what's needed is a *component* (menu, dialog, sheet, toast), use the system's or platform's component and style its motion — don't hand-build the component to get the animation.

## Step 4 — Choose the properties

- **Transform and opacity only.** They avoid layout and paint. Animating width, height, margins, padding, or position is expensive on every platform. Exceptions: height for accordions (no transform equivalent), and clip/reveal masks.
- **Never scale from zero.** Start at 0.95–0.97 with opacity 0. Nothing appears from nothing.
- **Grow from the trigger.** Popovers, dropdowns, menus, and tooltips scale from the edge nearest what opened them. Modals are the exception — centered.
- **Move by the element's own size** (percentages on the web, fractional offsets in Flutter) rather than hard-coded distances.
- **Set the transform on the moving element itself**, not through a shared variable on a parent that forces every child to recompute.

## Step 5 — Curve and duration, or a spring

| Situation | Curve |
|---|---|
| Entering or exiting | `motion.ease.out` |
| Moving or morphing on screen | `motion.ease.inOut` |
| Hover or color | `motion.ease.standard` |
| Constant motion (progress, marquee, hold-to-confirm fill) | linear |

**Avoid ease-in for interface motion.** Its slow start spends the first frames — the ones people notice most — barely moving, so it reads as lag. Ease-out front-loads the change and feels quicker at the same length.

**Durations:** use the token scale. Interface motion stays under 300ms unless it's a sheet, a toast, or marketing.

**Use a spring instead** when the user can drag, flick, interrupt, or reverse the motion, or when something should feel alive. Keep bounce between 0.1 and 0.3, and leave it out of most UI — it belongs to drag-to-dismiss and playful moments.

## Step 6 — Interruption and exit

- **Rapidly triggered things (toasts, toggles) retarget, they don't restart.** Use transitions or implicit animations that animate from the current value, not keyframes that restart from the beginning.
- **Gestures settle with springs** so the release carries the user's velocity.
- **Leave the way you came.** Something that slides in from below exits downward.
- **Slow where the user decides, fast where the system responds.** For example, a deliberate 2s hold-to-confirm, then a 200ms release.

## Step 7 — Reduced motion (and hover on the web)

Reduced motion means fewer and gentler, not none: keep opacity and color changes that aid understanding, remove movement, scaling, and position changes. On the web, only apply hover motion on devices that really hover (`@media (hover: hover) and (pointer: fine)`) — touch screens fire hover on tap.

---

## Platform translations

| | Curve | Duration | Spring | Reduced motion |
|---|---|---|---|---|
| **CSS** | `cubic-bezier(0.23, 1, 0.32, 1)` | `200ms` | — (use Motion or WAAPI) | `@media (prefers-reduced-motion: reduce)` |
| **Motion (web, React)** | `ease: [0.23, 1, 0.32, 1]` | `duration: 0.2` | `{ type: "spring", duration: 0.5, bounce: 0.2 }` | `useReducedMotion()` |
| **React Native (Reanimated)** | `Easing.bezier(0.23, 1, 0.32, 1)` | `withTiming(v, { duration: 200, easing })` | `withSpring(v, { mass: 1, stiffness: 158, damping: 20 })` | `useReducedMotion()` |
| **Flutter** | `Curves.easeOutQuint` (= `Cubic(0.23, 1, 0.32, 1)`); `Curves.easeInOutQuart` for in-out | `Duration(milliseconds: 200)` | `SpringDescription(mass: 1, stiffness: 158, damping: 20)` with `SpringSimulation` | `MediaQuery.of(context).disableAnimations` |
| **SwiftUI** | `.timingCurve(0.23, 1, 0.32, 1, duration: 0.2)` | in the curve | `.spring(duration: 0.5, bounce: 0.2)` | `@Environment(\.accessibilityReduceMotion)` |
| **Jetpack Compose** | `CubicBezierEasing(0.23f, 1f, 0.32f, 1f)` | `tween(durationMillis = 200, easing = …)` | `spring(dampingRatio = 0.8f, stiffness = 158f)` | Follows the system animator duration scale automatically; add gentler variants where motion carries meaning |
| **Framer** | Transition → Ease → custom bezier `0.23, 1, 0.32, 1` | Duration field | Transition → Spring (time-based: duration + bounce) | Test the published site with the OS reduced-motion setting on; avoid scroll-driven movement on key UI |
| **Webflow** | Interaction easing → Custom → cubic-bezier | Duration field | — (use a strong ease-out) | Add a reduced-motion variant or skip movement actions |
| **Figma prototype** | Smart Animate → Custom bezier | Duration field | Spring presets or custom (mass, stiffness, damping) | Note the reduced-motion variant in the spec |

**Transform-only, per platform:** React Native — `transform`/`opacity` in Reanimated styles. Flutter — `ScaleTransition`, `FadeTransition`, `SlideTransition`, `AnimatedScale`/`AnimatedOpacity`/`AnimatedSlide` rather than animating a container's size. SwiftUI — `scaleEffect`, `offset`, `opacity` rather than `frame`. Compose — `Modifier.graphicsLayer { scaleX; alpha; translationY }` rather than size or padding. Framer and Webflow — move, scale, and opacity actions rather than size.

---

## Recipes

For the common cases — button press, dropdown/popover/menu, tooltip, modal, drawer/sheet, toast, accordion, staggered entrance, hold to confirm, tab indicator, drag to dismiss, data and stat updates, and crossfades — start from **RECIPES.md** instead of a blank file. Each recipe has the spec line plus web, React Native, and Flutter implementations; use the translation table for the other platforms.

## Output

**Spec mode (Prototype, handoff):** one row per motion, saved with the handoff and recorded in Pathlon (`write_memory`, `memory_type: "decision"`):

| Element | Trigger | Should it move? (tier) | Purpose | Properties | Curve token | Duration / spring | Origin | Exit | Reduced motion |
|---|---|---|---|---|---|---|---|---|---|

**Build mode:** write the code, then at most three lines:
- **Gate** — the frequency tier and purpose (or what was rejected and why)
- **Ingredients** — tool, properties, curve, duration or spring
- **Feel-check** — what code alone can't confirm (a crossfade, how much a spring overshoots): slow it down in the platform's animation tools, scrub through it, test gestures on hardware, and revisit it after a break

Keep the notes to those three lines; the code or spec carries the rest.

## Motion vocabulary

Words that make motion requests precise:

- **Ease-out / ease-in-out / linear** — fast-then-settle for entrances and exits; slow-fast-slow for on-screen movement; constant for progress
- **Duration vs. delay** — how long it moves vs. how long before it starts
- **Stagger** — items entering one after another (30–80ms apart)
- **Origin** — the point something grows from or shrinks toward
- **Spring: bounce, stiffness, damping, mass** — overshoot; how hard it pulls; how quickly it settles; how heavy it feels
- **Retarget / interrupt** — changing direction mid-motion without restarting
- **Enter/exit symmetry** — leaving the way it came
- **Perceived speed** — how fast it *feels*; ease-out feels faster than ease-in at the same duration
- **Reduced motion** — the gentler variant for people who turn motion down

## Never ship (QA checklist)

`design-qa` uses this list when reviewing motion:

- [ ] Nothing animates on keyboard shortcuts or constant actions
- [ ] Every motion has a named purpose
- [ ] No "all properties" transitions — each property is named
- [ ] No scale-from-zero entrances
- [ ] No ease-in on UI
- [ ] Curves and durations come from tokens, not guesses
- [ ] Interface motion under 300ms unless it's a sheet, toast, or marketing
- [ ] Popovers grow from their trigger; modals from center
- [ ] Rapidly triggered elements retarget instead of restarting
- [ ] Only transform and opacity animate (accordion height and reveal masks excepted)
- [ ] Hover motion gated to real hover devices (web)
- [ ] A reduced-motion variant exists
- [ ] Groups stagger instead of all arriving at once

## Phase Handoff Note

Include the motion spec table in the Prototype → Build & Deliver handoff, note any motion tokens the design system lacks (with the gap proposal), and flag anything that needs a feel-check on a real device.
