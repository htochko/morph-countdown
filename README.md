# morph-countdown
A modular, lightweight TypeScript SVG matrix-morphing countdown component with zero heavy framework dependencies, tree-shaking support, and customizable vector themes.

## Deaclare by attribute 'data-date-start' or ''
```
<div id="marathon-timer" data-date-start="2026-12-31T23:59:59"></div>

<script type="module">
  import { MorphCountdown } from 'morph-countdown';
  new MorphCountdown('#marathon-timer');
</script>
```

## Declare with options
```
<div id="marathon-timer" data-date-start="2026-12-31T23:59:59"></div>

<script type="module">
  import { MorphCountdown } from 'morph-countdown';
  import { i18nPL } from 'morph-countdown/i18n/pl';

  // Declare with options
  new MorphCountdown('#marathon-timer', {
    i18n: i18nPL
  });
</script>
```