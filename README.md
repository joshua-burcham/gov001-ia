# GOV001 — Interactive IA Explainer

An interactive explanation of the information architecture for the Governors Island
website redesign (GOV001). Built to help the client team understand how the new site
is organized: a small set of hand-crafted pages, plus structured content types and
taxonomies that automatically feed the map, calendar, and landing pages.

**Plain HTML/CSS/JS — no build step, no dependencies.** Open `index.html` in a
browser, or host the folder anywhere static files can live (GitHub Pages, Netlify, etc.).

## Sections

| Section | What it shows |
|---|---|
| **Overview** | The core concept: enter content once, it appears everywhere it should. |
| **Sitemap** | Collapsible page tree with per-page notes and auto-populated badges. ⚠️ Currently a *draft reconstruction* from the migration sheet's UX notes — reconcile with the confirmed Figma sitemap (Sitemap Delivery R2) before sharing externally. |
| **Content Types** | The 7 post types (Listing, Event, Blog, Press, Permit, Property, People) and the full Listing field list. |
| **Taxonomies** | All 12 taxonomies with terms, rules, and a content-type filter. |
| **See It in Action** | 7 real test listings from the IA sheet (Cabin, Pizzeria Fantastica, Adaptora…) rendered as mock listing pages, showing where each one surfaces and why. |

## Editing the content

All IA data lives in **`js/data.js`** — post types, listing fields, taxonomies,
example listings, and the sitemap tree. It mirrors the working
[Gov IA Google Sheet](https://docs.google.com/spreadsheets/d/1UuL-HGzPrNgtZYGYFjbSDu-Co277OTYYc8CKLZ1Ol_0/edit)
(Taxonomy List, Listing Testing, and Migration Plan tabs). When the sheet changes,
update `data.js` to match.

Layout and interactions are in `index.html`, `css/style.css`, and `js/app.js`.
