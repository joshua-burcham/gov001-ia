# gov001-ia

Interactive explanation of the GOV001 (Governors Island website redesign) information
architecture, for Radish Lab. Audience: the client team at the Trust for Governors
Island, plus internal UX/dev.

## Constraints

- **Plain HTML/CSS/JS only.** No build step, no frameworks, no external dependencies
  (fonts included). Must work from `file://` and any static host.
- Single-page app: `index.html` with hash-based tabs (`#overview`, `#sitemap`,
  `#content-types`, `#taxonomies`, `#examples`).

## Where things live

- `js/data.js` — **all IA content.** Post types, Listing fields, 12 taxonomies with
  terms, 7 real example listings, and the sitemap tree. This mirrors the working
  Gov IA Google Sheet (ID `1UuL-HGzPrNgtZYGYFjbSDu-Co277OTYYc8CKLZ1Ol_0`): Taxonomy
  List, Listing Testing, and Migration Plan tabs. Keep them in sync.
- `js/app.js` — rendering + interactions (vanilla JS, IIFE).
- `css/style.css` — all styles; CSS custom properties at the top.

## Known caveats

- The **sitemap section is a draft reconstruction** from the migration sheet's
  "UX notes during SM" column. The confirmed sitemap is in Figma
  ("GOV001 UX — Sitemap Delivery R2"). `IA.sitemapDraft` is `true` and a warning
  banner shows until it's reconciled — don't remove either until the tree matches Figma.
- The Season taxonomy may become a custom field instead (flagged as an open question
  in the sheet and in the UI).
- The Restrooms example carries an open question from the sheet (all-in-one listing
  vs. amenity tag vs. both).
