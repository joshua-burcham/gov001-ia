# GOV001 IA Explainer

A single-page, lightly interactive HTML explainer of the proposed WordPress content types and taxonomies for The Trust for Governors Island website redesign. Built by Radish Lab to present during wireframes round 1.

## Purpose and audience

This page is shown to TGI client stakeholders (marketing, visitor services, leadership) who are not WordPress-literate. Its job is to make the proposed information architecture legible before Radish surveys external users about taxonomy terms. It must explain two things:

1. How content will be organized in the WordPress back end (content types)
2. How that organization surfaces for front-end visitors (taxonomies, filters, labels)

This is explicitly NOT a wireframe, prototype, or design deliverable. Nothing on this page implies visual design, layout, or page templates. The client should never mistake it for one.

## Critical framing to get right

- The proposed "Listing" content type is the counterintuitive centerpiece. It holds superficially unrelated things: food vendors, historic sites, public art, recreation, restrooms, climate pilots, tenants. What unifies them: every Listing is a physical place on the island, and every Listing appears on the interactive map. That is the reason for the shared content type, and the page must say so explicitly. Visitors never see the word "Listing" and never perceive these as one bucket; taxonomies (especially Listing Type) do the visible differentiation. Use a concrete example: a visitor browsing "Public Art" and a visitor finding a restroom on the map are both looking at Listings.
- Content type = what shape the data is (which fields it has, where it lives in the back end). Taxonomy = how items get labeled and filtered. Keep these definitions plain and repeat them.
- Some taxonomies span multiple content types (Focus applies to Listing, Blog, and Press; Region/Area applies to Listing, Event, Property, and Blog). This cross-cutting behavior is the second key insight and the reason for the dual-view toggle below.
- Some taxonomies are visitor-facing filters, some are contextual (Tenant Disciplines only appears on the tenant/business page; Climate Challenges only on the Climate Pilot page), and some may become custom fields instead (Season). Show this honestly; the client's feedback on these edges is the point of sharing early.

## Page structure

### 1. Intro
Short. States what this page is (an interactive explanation of the proposed content model) and what it is not (a wireframe or prototype). One or two sentences on why we're sharing IA earlier than usual: client feedback is needed before external user surveys about taxonomies.

### 2. Content Types
Define content type in one plain sentence. Then a card per content type, all six with identical treatment: Listing, Event, Blog, Press, Property, Permit. Each card gets a one-line description and example items. Within its card, the Listing description carries the extra weight: the diversity of what lives inside it, the fact that everything in it is a mappable place (which is why it exists as one content type), and that this grouping is invisible to public users. Do not visually promote or demote any card; unequal treatment would confuse the model being explained.

### 3. Taxonomies (the interactive section)
Define taxonomy in one plain sentence. Then a toggle between two views of the same data:

- **By content type**: pick a content type, see every taxonomy applied to it, expandable to show the terms in each. Answers "what labels can an Event carry?"
- **By taxonomy**: pick a taxonomy, see its description, its terms, and every content type it applies to. Answers "where does Focus show up?" and makes the cross-cutting taxonomies visible.

Per-taxonomy metadata to surface as small badges or notes: whether it's a map filter, visitor visibility (default visible, page-scoped, or admin-leaning), and open notes (e.g. Season may become a custom field; Region/Area shouldn't be leaned on heavily).

The map connection should be explicit, not just a badge. Taxonomies marked as map filters become filter chips on the interactive island map; a short recurring note ("appears as a filter on the map") on those taxonomies ties the IA to the map without simulating map UI. Do not embed a map or mock one up.

A small hover or click interaction connecting the two views is worth it if cheap: hovering a taxonomy highlights the content types it touches, or vice versa. Do not build filtering simulations, fake search, or anything that reads as product UI.

## Data

All content lives in `taxonomies.json` in this repo. Render everything from it; no taxonomy data hardcoded in markup. The JSON schema:

- `contentTypes[]`: id, name, description, examples[]
- `taxonomies[]`: id, name, description, appliedTo[] (content type ids), mapFilter (bool, string note, or null where unresolved), visibility (string), notes (string or null), terms[] (flat strings; there are no parent/child term relationships)

## Technical constraints

- One HTML file plus one JSON file plus one CSS file plus one JS file, or a single self-contained HTML file. No build step, no framework, no dependencies. Vanilla JS.
- Deployable as a static page to Netlify (consistent with the GOV001 map prototype workflow).
- Mobile-friendly but desktop-first; this will be presented on a screen share and browsed by client stakeholders at their desks.
- Accessible: real buttons for toggles, keyboard navigable, sufficient contrast.

## Visual direction

Deliberately schematic and diagrammatic, not designed. This reinforces the "not a wireframe" disclaimer. Neutral grays and whites, system or single simple typeface, generous whitespace. At most one accent color for interactive states. Do not use the Governors Island brand palette or anything resembling brand exploration; the brand and design system work is a separate workstream and this page must not preempt it.

## Vocabulary rules

- "Governors Island" takes no apostrophe.
- Visitor-facing entity word is "destination" (casual: "spot"); "tenant" is internal vocabulary and appears here only because this is an internal-facing explainer, but prefer "organization" or "business/tenant" as labeled in the data.
- No em dashes anywhere in copy.
