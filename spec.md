# Pristine Learning Mobile

## Current State
The app has a warm cream / sage green color scheme using OKLCH tokens. Light mode uses a warm cream background with sage green as the primary color and amber accents. Dark mode uses deep warm neutrals.

## Requested Changes (Diff)

### Add
- A full pastel palette: soft lavender primary, pastel mint secondary, blush pink accent, butter yellow charts

### Modify
- `index.css` light mode tokens: shift to pastel hues -- lavender primary, soft mint secondary, blush accent, very pale backgrounds
- `index.css` dark mode tokens: soften to muted pastel-tinted dark backgrounds that complement the light palette
- Gradient utility classes updated to match new pastel directions
- Chart color tokens updated to a pastel rainbow (lavender, mint, blush, peach, sky)

### Remove
- Sage green and warm amber as primary/accent colors

## Implementation Plan
1. Update `index.css` OKLCH tokens for light and dark mode to a pastel palette
2. Update gradient utility classes to use pastel colors

## UX Notes
- Pastels should be soft but maintain AA contrast for text on backgrounds
- Dark mode should use muted, desaturated versions of the pastel hues so it doesn't look washed out
