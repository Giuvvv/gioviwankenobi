# Ship design v1 — the plain dart

Kept so the original can be put back without guesswork. This is the shape the
ship had before the v2 redesign; nothing else about the component changed, so
restoring it is a matter of swapping the two pieces below back into
`src/components/site/Ship.astro`.

## Markup

Inside the `.ship` element, replacing whatever `<svg>` is there:

```html
<svg viewBox="0 0 24 28" width="26" height="30" focusable="false">
  <path class="ship__hull" d="M12 0 L23 24 L12 19 L1 24 Z" />
  <circle class="ship__thruster" cx="12" cy="21" r="2.1" />
</svg>
```

## Styles

Replacing the `.ship__*` fill rules in the same file's `<style>` block:

```css
.ship__hull { fill: currentColor; opacity: 0.9; }
.ship__thruster { fill: #fff; opacity: 0.85; }
```

## Notes

- The hull takes its colour from `.ship { color: var(--accent) }`, so the gold
  comes from the token and not from the path.
- v2 adds a `.ship__canopy` path. If you restore v1, that rule becomes dead and
  should be deleted rather than left behind.
- The thruster was pure `#fff`, which is not one of the site's tokens. v2 moved
  it to `var(--ink)`; worth keeping even if the rest goes back.
- Size and viewBox must stay 26×30 either way: the script centres the ship with
  hard-coded half-offsets of 13 and 15.
