# Phosphor Duotone · 2.1.1

Four original SVG files from the official `@phosphor-icons/core` npm package, licensed under MIT (see `LICENSE`). Source, package integrity, and individual SVG hashes are recorded in `provenance.json`.

- `truck`: Carrier A and Carrier D
- `factory`: Shipper B
- `storefront`: Shipper C
- `buildings`: Shipper E

`icons.js` embeds the exact SVG strings synchronously so the composition works offline and seeks without waiting for artwork. Only the rendered SVG viewport attributes are added by `opening-scenes.js`; original paths, viewBox, and duotone opacity remain intact. CSS supplies `currentColor: #26374b`.

After changing a vendored asset, regenerate `icons.js` from the SVG strings and update the provenance hashes. `npm run check:icon-review` checks that the embedded and original artwork match.
