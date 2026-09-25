# Motion recipes

Starting points for the cases that come up most. Each has a **spec line** (what goes in the handoff) and implementations for **web**, **React Native** (Reanimated), and **Flutter**. For SwiftUI, Compose, Framer, Webflow, and Figma, apply the same spec with the translation table in `SKILL.md`.

Always swap in the design system's motion tokens where they exist.

## Shared tokens

```css
/* Web */
:root {
  --motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --motion-ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

```ts
// React Native (Reanimated)
import { Easing } from 'react-native-reanimated';

export const motion = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  press: 140, quick: 150, base: 200, modal: 250, sheet: 400,
};
```

```dart
// Flutter
abstract final class Motion {
  static const easeOut = Curves.easeOutQuint;      // Cubic(0.23, 1, 0.32, 1)
  static const easeInOut = Curves.easeInOutQuart;  // Cubic(0.77, 0, 0.175, 1)
  static const drawer = Cubic(0.32, 0.72, 0, 1);
  static const press = Duration(milliseconds: 140);
  static const quick = Duration(milliseconds: 150);
  static const base = Duration(milliseconds: 200);
  static const modal = Duration(milliseconds: 250);
  static const sheet = Duration(milliseconds: 400);
}
```

---

## Button press

**Spec:** press → scale 0.97, 140ms, ease-out; release returns the same way · Purpose: feedback · Reduced motion: keep (it's tiny and informative), or swap for an opacity dip.

```css
.button { transition: transform 140ms var(--motion-ease-out); }
.button:active { transform: scale(0.97); }
```

```tsx
const scale = useSharedValue(1);
const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
const to = (v: number) => (scale.value = withTiming(v, { duration: motion.press, easing: motion.easeOut }));

<Pressable onPressIn={() => to(0.97)} onPressOut={() => to(1)}>
  <Animated.View style={style}>{children}</Animated.View>
</Pressable>
```

```dart
GestureDetector(
  onTapDown: (_) => setState(() => pressed = true),
  onTapUp: (_) => setState(() => pressed = false),
  onTapCancel: () => setState(() => pressed = false),
  child: AnimatedScale(scale: pressed ? 0.97 : 1, duration: Motion.press, curve: Motion.easeOut, child: child),
)
```

The label and icon scale with the button, which is what makes it read as a physical press. On the web, `:active` works on touch; gate any separate `:hover` motion.

---

## Dropdown, popover, menu, select

**Spec:** open → opacity 0→1, scale 0.95→1 from the trigger edge, 200ms ease-out; close reverses · Purpose: continuity.

```css
.popover {
  transform-origin: var(--transform-origin, top left); /* the side nearest the trigger */
  transition: opacity 200ms var(--motion-ease-out), transform 200ms var(--motion-ease-out);
}
.popover[data-state="closed"] { opacity: 0; transform: scale(0.95); }
```

```tsx
// progress: 0 closed → 1 open
const style = useAnimatedStyle(() => ({
  opacity: progress.value,
  transform: [{ scale: 0.95 + 0.05 * progress.value }],
  transformOrigin: 'top left', // RN 0.73+; otherwise offset with translate
}));
progress.value = withTiming(open ? 1 : 0, { duration: motion.base, easing: motion.easeOut });
```

```dart
final curved = CurvedAnimation(parent: controller, curve: Motion.easeOut); // controller.duration = Motion.base
FadeTransition(
  opacity: curved,
  child: ScaleTransition(
    alignment: Alignment.topLeft, // the side nearest the trigger
    scale: Tween(begin: 0.95, end: 1.0).animate(curved),
    child: menu,
  ),
)
```

Growing from the trigger is the whole effect; a menu that scales from its own center looks detached from what opened it.

---

## Tooltip

**Spec:** like a popover but quicker — 150ms, scale 0.97→1 · After the first tooltip in a group opens, neighbours open with no delay and no animation.

```css
.tooltip { transform-origin: var(--transform-origin); transition: opacity 150ms var(--motion-ease-out), transform 150ms var(--motion-ease-out); }
.tooltip[data-state="closed"] { opacity: 0; transform: scale(0.97); }
.tooltip[data-instant] { transition-duration: 0ms; }
```

React Native and Flutter: use the platform tooltip (Flutter's `Tooltip` has `waitDuration` and `exitDuration`); match the durations above.

Why: the first tooltip waits so a passing cursor doesn't trigger it; once the user is clearly reading tooltips, making the rest appear immediately keeps a row of icons quick to scan.

---

## Modal / dialog

**Spec:** opacity 0→1, scale 0.96→1 from center, 250ms ease-out; backdrop fades in step · Purpose: continuity.

```css
.modal { transition: opacity 250ms var(--motion-ease-out), transform 250ms var(--motion-ease-out); }
.modal[data-state="closed"] { opacity: 0; transform: scale(0.96); }
.backdrop { transition: opacity 250ms var(--motion-ease-out); }
```

```tsx
// Reanimated layout animations on the dialog content
<Animated.View
  entering={FadeIn.duration(motion.modal).easing(motion.easeOut)}
  exiting={FadeOut.duration(motion.modal).easing(motion.easeOut)}
>{/* pair with a scale via a custom entering animation if needed */}</Animated.View>
```

```dart
showGeneralDialog(
  context: context,
  barrierDismissible: true,
  barrierLabel: 'Dismiss',
  transitionDuration: Motion.modal,
  pageBuilder: (_, __, ___) => dialog,
  transitionBuilder: (_, animation, __, child) {
    final curved = CurvedAnimation(parent: animation, curve: Motion.easeOut);
    return FadeTransition(
      opacity: curved,
      child: ScaleTransition(scale: Tween(begin: 0.96, end: 1.0).animate(curved), child: child),
    );
  },
);
```

Modals aren't anchored to a trigger, so they're the one overlay that grows from center.

---

## Drawer / bottom sheet

**Spec:** slide from off-screen (100% of its own height), 400ms drawer curve; exits the same way · Add drag → see **Drag to dismiss**.

```css
.sheet { transform: translateY(0); transition: transform 400ms var(--motion-ease-drawer); }
.sheet[data-state="closed"] { transform: translateY(100%); }
```

React Native: use a sheet component (e.g. `@gorhom/bottom-sheet`) and pass the curve and duration through its animation config rather than hand-building gestures.

For the exact drawer curve in Flutter, drive a custom route or `AnimationController` with `Motion.drawer`; the built-in sheet only takes a duration.

```dart
showModalBottomSheet(
  context: context,
  sheetAnimationStyle: AnimationStyle(duration: Motion.sheet), // Flutter 3.22+: sets duration; the sheet keeps its own curve
  builder: (_) => sheet,
);
```

---

## Toast

**Spec:** enter from below (100% of its height) with opacity, 400ms `ease`; exit the way it came; stacked toasts retarget rather than restart.

```css
.toast {
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

```tsx
<Animated.View
  entering={SlideInDown.duration(motion.sheet).easing(Easing.ease)}
  exiting={SlideOutDown.duration(motion.sheet).easing(Easing.ease)}
  layout={LinearTransition.duration(motion.base)}
/>
```

```dart
AnimatedSlide(
  offset: visible ? Offset.zero : const Offset(0, 1),
  duration: Motion.sheet,
  curve: Curves.ease,
  child: AnimatedOpacity(opacity: visible ? 1 : 0, duration: Motion.sheet, child: toast),
)
```

Toasts are fired rapidly, so use transitions or implicit animations (they retarget from the current value), never keyframes. A softer `ease` and a slightly longer duration suit a toast's calmer personality; tune the opacity-versus-reflow balance by eye when toasts stack.

---

## Accordion / collapse

**Spec:** height and opacity, 200ms ease-out · Keep it short; this is one of the few animations that costs layout every frame.

```css
.content { overflow: hidden; transition: height 200ms var(--motion-ease-out), opacity 200ms var(--motion-ease-out); }
/* Measure the content height in JS, or use a primitive that supplies it — don't animate to `auto`
   unless the browser supports `interpolate-size: allow-keywords`. */
```

```tsx
<Animated.View layout={LinearTransition.duration(motion.base).easing(motion.easeOut)}>
  {open && <Animated.View entering={FadeIn.duration(motion.base)} exiting={FadeOut.duration(motion.base)}>{content}</Animated.View>}
</Animated.View>
```

```dart
AnimatedSize(duration: Motion.base, curve: Motion.easeOut, child: open ? content : const SizedBox.shrink())
```

---

## Staggered entrance

**Spec:** items fade and rise 8px, 300ms ease-out, 50ms apart · Only for groups seen occasionally, and it must never block interaction.

```css
.item { opacity: 0; transform: translateY(8px); animation: rise 300ms var(--motion-ease-out) forwards; animation-delay: calc(var(--i) * 50ms); }
@keyframes rise { to { opacity: 1; transform: translateY(0); } }
/* set style="--i: 0|1|2…" on each item */
```

```tsx
{items.map((item, i) => (
  <Animated.View key={item.id} entering={FadeInDown.delay(i * 50).duration(300).easing(motion.easeOut)}>{…}</Animated.View>
))}
```

```dart
// one controller for the group; each item gets a slice, spread to fit any count
final step = count > 1 ? 0.4 / (count - 1) : 0.0;
final curve = CurvedAnimation(parent: controller, curve: Interval(i * step, 0.6 + i * step, curve: Motion.easeOut));
FadeTransition(opacity: curve, child: SlideTransition(position: Tween(begin: const Offset(0, 0.1), end: Offset.zero).animate(curve), child: item))
```

---

## Hold to confirm

**Spec:** press and hold → fill progresses linearly over 2s; release early → fill snaps back in 200ms ease-out · For destructive actions a click fires too easily.

```css
.fill { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--motion-ease-out); }
.button:active .fill { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; }
```

```tsx
onPressIn:  progress.value = withTiming(1, { duration: 2000, easing: Easing.linear }, (done) => done && runOnJS(confirm)());
onPressOut: progress.value = withTiming(0, { duration: 200, easing: motion.easeOut });
```

```dart
// controller.addStatusListener((s) { if (s == AnimationStatus.completed) confirm(); });
onTapDown:   (_) => controller.animateTo(1, duration: const Duration(seconds: 2), curve: Curves.linear),
onTapUp:     (_) => controller.animateBack(0, duration: Motion.base, curve: Motion.easeOut),
onTapCancel: ()  => controller.animateBack(0, duration: Motion.base, curve: Motion.easeOut),
```

Why linear: the fill is a countdown the user is watching, so it should advance at a steady rate; easing would make the remaining time hard to judge.

---

## Tab indicator

**Spec:** the indicator slides to the new tab, 250ms ease-in-out (it's moving on screen, not entering).

Animate the indicator's `transform` (translate plus a horizontal scale for width) rather than its `left`/`width`. When the active tab also changes text and background color, an in-sync alternative on the web is to render a styled copy of the tab row and animate a `clip-path` window over it, so the color change and the movement are one element.

Flutter's `TabBar` animates its indicator already — set the curve via a custom indicator or `TabController` animation; React Native tab libraries expose the same through their indicator config.

---

## Drag to dismiss

**Spec:** the element follows the finger; release past a distance **or** a quick flick dismisses; otherwise it springs back · Springs, not durations, because the user can reverse.

Details that make it feel right on every platform:
- **Velocity counts**, not just distance: a short fast flick should dismiss.
- **Stay attached to the gesture** for its whole length, including when the finger or cursor leaves the element's bounds (use pointer capture on the web; native gesture handlers already do this).
- **Only one finger drives it** — additional touches during a drag are ignored so the position can't snap.
- **Add resistance beyond limits** — past its natural resting point the element should follow at a reducing rate, not stop dead.
- **Set the transform on the dragged element directly.**

```js
// Web: decide on release
const velocity = Math.abs(dragDistance) / (Date.now() - dragStart);
if (Math.abs(dragDistance) > THRESHOLD || velocity > 0.11) dismiss(); else springBack();
```

```tsx
// React Native (Gesture Handler + Reanimated)
const pan = Gesture.Pan()
  .onChange((e) => { y.value = Math.max(0, e.translationY); })
  .onEnd((e) => {
    if (y.value > THRESHOLD || e.velocityY > 800) y.value = withTiming(height, { duration: motion.sheet, easing: motion.drawer }, () => runOnJS(dismiss)());
    else y.value = withSpring(0, { mass: 1, stiffness: 158, damping: 20 });
  });
```

```dart
onVerticalDragUpdate: (d) => setState(() => offset = (offset + d.delta.dy).clamp(0, double.infinity)),
onVerticalDragEnd: (d) {
  final v = d.velocity.pixelsPerSecond.dy;
  if (offset > threshold || v > 800) { dismiss(); return; }
  // controller = AnimationController.unbounded(vsync: this), listening to update `offset`; velocity in px/s, same direction as `offset`
  controller.animateWith(SpringSimulation(const SpringDescription(mass: 1, stiffness: 158, damping: 20), offset, 0, v));
},
```

---

## Data and stat updates

**Spec:** new numbers and chart values change without drawing attention away from reading them · Purpose: state · Pathlon-specific (built for dashboards like Courtside IQ).

- **First load:** a chart may draw in once, ≤400ms ease-out. Never on every visit to a screen people check daily.
- **Value changes:** transition the value 200ms ease-in-out; don't count numbers up from zero on screens people revisit.
- **Highlight the change, not the number:** a brief color or background fade (≤600ms, `ease`) on what changed tells the user what's new without moving it.
- **Don't reorder with motion** people must track — if a ranked list changes order, animate the move quickly (≤250ms) or not at all.
- **Reduced motion:** swap every movement for an instant change plus the color highlight.

```dart
// Flutter: a stat that eases to its new value
TweenAnimationBuilder<double>(
  tween: Tween(end: value),
  duration: Motion.base,
  curve: Motion.easeInOut,
  builder: (_, v, __) => Text(v.toStringAsFixed(1)),
)
```

---

## Crossfade that won't settle

If two states still look like separate layers passing through each other after tuning curve and duration, add a light blur for the length of the swap (web: `filter: blur(2px)` plus a slight opacity dip, 200ms). Softening both layers makes the change read as a single transformation. Keep blur small — it's expensive, especially in Safari. Flutter: `ImageFiltered` with `ImageFilter.blur`; use sparingly.

---

## Without a library (web)

For script-controlled motion without adding a dependency, use the browser's Web Animations API; it's interruptible and performs like CSS animation:

```js
el.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 600, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'forwards' }
);
```
