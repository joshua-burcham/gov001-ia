# GOV001 IA Explainer

A single-page, lightly interactive HTML explainer of the proposed WordPress content
types and taxonomies for The Trust for Governors Island website redesign. Built by
Radish Lab to present during wireframes round 1. See `CLAUDE.md` for the full brief
(purpose, framing rules, page structure, and vocabulary rules).

## Files

- `index.html` page shell and copy
- `taxonomies.json` all content model data; the page renders everything from this file
- `css/style.css` styles (deliberately schematic, one accent color)
- `js/app.js` rendering and interactions (vanilla JS, no dependencies)

## Running locally

The page fetches `taxonomies.json`, so it needs to be served over HTTP rather than
opened straight from disk:

```
python3 -m http.server
```

Then open http://localhost:8000. Deploys as a static page to Netlify, consistent
with the GOV001 map prototype workflow.

## Updating the data

Edit `taxonomies.json` only; nothing is hardcoded in the markup. Schema is documented
in `CLAUDE.md` under "Data".
