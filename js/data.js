/* GOV001 IA data
   Source of truth: "Gov IA" Google Sheet (Taxonomy List, Listing Testing,
   Migration Plan tabs). Update here when the sheet changes. */

const IA = {

  postTypes: [
    {
      key: "listing",
      title: "Listing",
      icon: "📍",
      summary:
        "A place or presence on the Island — restaurants, public art, tenants, historic sites, climate pilots, amenities. The workhorse of the new site: one Listing entry powers the map, Things to Do, Food & Drink, and more.",
      mapCoordinate: "Yes",
      mapFilter: "Yes",
      pageTemplate: "Yes",
      hasFields: true
    },
    {
      key: "event",
      title: "Event",
      icon: "🗓",
      summary:
        "A dated happening — tours, festivals, workshops, performances. Feeds the calendar. Can optionally place a pin on the map, but events are not a map filter.",
      mapCoordinate: "Optional",
      mapFilter: "No",
      pageTemplate: "Yes"
    },
    {
      key: "blog",
      title: "Blog",
      icon: "✏️",
      summary:
        "News, announcements, stories, itineraries, and recaps. The old site's large blog archive migrates here, and several old standalone pages (Plant Watch, Natural Areas features) become blog posts.",
      mapCoordinate: "No",
      mapFilter: "No",
      pageTemplate: "Yes"
    },
    {
      key: "press",
      title: "Press",
      icon: "📰",
      summary:
        "Press coverage and media items. Listed, not templated — no dedicated page design of its own.",
      mapCoordinate: "No",
      mapFilter: "No",
      pageTemplate: "No"
    },
    {
      key: "permit",
      title: "Permit",
      icon: "📄",
      summary:
        "Permit and rental offerings — film & photography, GI gatherings, athletic fields, site rentals for private events.",
      mapCoordinate: "No",
      mapFilter: "No",
      pageTemplate: "Yes"
    },
    {
      key: "property",
      title: "Property",
      icon: "🏛",
      summary:
        "Real-estate properties — the historic buildings and development zones available for lease (Building 4 through the Eastern & Western Development Zones). Each gets a coordinate and a templated page.",
      mapCoordinate: "Yes",
      mapFilter: "No",
      pageTemplate: "Yes"
    },
    {
      key: "people",
      title: "People",
      icon: "👤",
      summary:
        "People profiles — staff, board, leadership — with a templated page.",
      mapCoordinate: "No",
      mapFilter: "No",
      pageTemplate: "Yes"
    }
  ],

  /* Custom fields on the Listing post type (from the Listing Testing tab).
     Order reflects the sheet, not a suggested backend order. */
  listingFields: [
    { name: "Listing Title", required: true, note: "" },
    { name: "Quick description", required: true, note: "Text under the title and in preview cards across the site." },
    { name: "Artist", required: false, note: "For public art." },
    { name: "About", required: false, note: "Longer text on the listing page." },
    { name: "Primary Image", required: true, note: "Optional carousel. Link to image in Drive folder during content collection." },
    { name: "For Visitors", required: false, note: "Checkbox. Shows the listing on Things to Do and Food & Drink. Uncheck for businesses with no visitor-facing aspect.", type: "checkbox" },
    { name: "Days & Hours", required: false, note: "Required if 'For Visitors' is checked.", conditional: "For Visitors" },
    { name: "Show on Map", required: false, note: "Check if this should show on the interactive Map.", type: "checkbox" },
    { name: "Map Coordinates", required: false, note: "One or more. Required if 'Show on Map' is checked; also applied to the Listing page.", conditional: "Show on Map" },
    { name: "External Link to Learn More", required: false, note: "" },
    { name: "Optional additional link or download", required: false, note: "e.g. a menu PDF." }
  ],

  taxonomies: [
    {
      key: "listing-type",
      title: "Listing Type",
      required: true,
      description: "Type of place.",
      appliesTo: ["listing"],
      mapFilter: "Yes",
      visibility: null,
      terms: ["Food & Drink", "Historic Site", "Organization in Residence", "Public Art",
        "Recreation", "Business/Tenant", "Tour", "Climate Pilot", "Artist Residency", "Amenity"],
      termNotes: {
        "Recreation": "e.g. bike rental, sport field",
        "Amenity": "e.g. bathrooms, water fountains, picnic tables"
      }
    },
    {
      key: "event-type",
      title: "Event Type",
      description: "Type of event.",
      appliesTo: ["event"],
      mapFilter: "No",
      visibility: null,
      terms: ["Tour", "Fundraiser", "Workshop/Class", "Talk", "Performance",
        "Recreation or Race", "Festival", "Community Gathering"]
    },
    {
      key: "blog-type",
      title: "Blog Type",
      description: "Content type/format for blog. Terms should not overlap with Focus.",
      appliesTo: ["blog"],
      mapFilter: "No",
      visibility: null,
      terms: ["Announcement", "Visitor Information", "Story", "Itinerary", "Event Recap"]
    },
    {
      key: "focus",
      title: "Focus",
      description: "Broad focus, aligning with the Island's pillars but adding History.",
      appliesTo: ["listing", "blog", "press"],
      mapFilter: "Yes — filtering Listings",
      visibility: null,
      terms: ["Art", "Climate", "Open Space", "History"]
    },
    {
      key: "amenities",
      title: "Amenities",
      description: "Practical amenities that don't warrant their own listing page, but that visitors want to know about a location.",
      appliesTo: ["listing", "event"],
      mapFilter: "Yes",
      visibility: null,
      terms: ["Accessible Entrance", "Restrooms", "Bike Parking", "Kid-Friendly", "Pet-Friendly",
        "Picnic Tables", "Rentals/Permits Available", "Water Fountain", "Wifi Available"]
    },
    {
      key: "dietary",
      title: "Dietary Preferences",
      description: "Only applied to Food & Drink listings.",
      appliesTo: ["listing"],
      mapFilter: "No",
      visibility: "Food & Drink listings only",
      terms: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Pescatarian"]
    },
    {
      key: "region",
      title: "Region/Area",
      description: "Useful for return visitors who know the Island's regions, and aligns with wayfinding signs on the Island. Shouldn't be leaned on too heavily — most visitors don't know these reference points.",
      appliesTo: ["listing", "event", "property", "blog"],
      mapFilter: "No",
      visibility: null,
      terms: ["LMCC, Building 110", "Battery Maritime Building", "Colonels Row", "Western Promenade",
        "King Avenue Food Court", "Soissons Landing", "Liggett Terrace", "Discovery Hill"]
    },
    {
      key: "status",
      title: "Status",
      description: "For things like public art — an optional status. Lets 'coming soon' pieces appear on the website before they open. Not the same as the automatic 'open now' tag driven by hours & season.",
      appliesTo: ["listing"],
      mapFilter: "No",
      visibility: "Public Art, Orgs in Residence, etc.",
      terms: ["On View", "Coming Soon", "Not Open to Public"]
    },
    {
      key: "cost",
      title: "Cost",
      description: "Not the same as the custom text field for price details.",
      appliesTo: ["event", "listing"],
      mapFilter: "No",
      visibility: null,
      terms: ["Free", "Paid", "Varies"]
    },
    {
      key: "season",
      title: "Season",
      description: "Might end up being a custom field instead of a taxonomy.",
      appliesTo: ["listing", "event", "blog", "permit"],
      mapFilter: "No",
      visibility: null,
      openQuestion: true,
      terms: ["Year Round", "May–Oct", "Jul–Aug"]
    },
    {
      key: "tenant-disciplines",
      title: "Tenant Disciplines",
      description: "For filtering tenants/businesses only.",
      appliesTo: ["listing"],
      mapFilter: "No",
      visibility: "Only visible on the Tenant/Business page as a filter",
      terms: ["Arts & Culture", "Education", "Environment & Climate", "Amenity", "Nonprofit", "Tech", "Food & Beverage"]
    },
    {
      key: "climate-challenges",
      title: "Climate Challenges",
      description: "For filtering climate pilot programs only.",
      appliesTo: ["listing"],
      mapFilter: "No",
      visibility: "Only visible on the Climate Pilot page as a filter",
      terms: ["Urban Agriculture", "Energy", "Adaptive Infrastructure", "Water",
        "Mobility & Logistics", "Waste", "Circular Economy", "Adaptation"]
    }
  ],

  /* Real test listings from the Listing Testing tab. */
  examples: [
    {
      key: "cabin",
      title: "Cabin",
      emoji: "🎨",
      tagline: "Public art that lives everywhere at once",
      fields: {
        "Quick description": "Lorem ipsum (content TBD)",
        "Artist": "Rachel Whiteread",
        "About": "Rachel Whiteread's installation Cabin continues the artist's interest in producing evocative sculptures of negative spaces and structures — a concrete cast of the interior of a simple cabin, sited on the hillside of Discovery Hill overlooking New York Harbor.",
        "For Visitors": true,
        "Days & Hours": "Every Day: 7:00 am – 10:00 pm",
        "Show on Map": true
      },
      taxonomies: {
        "listing-type": ["Public Art"],
        "focus": ["Art"],
        "amenities": ["Accessible Entrance", "Kid-Friendly"],
        "season": ["Year Round"],
        "cost": ["Free"],
        "region": ["Discovery Hill"],
        "status": ["On View"]
      },
      lesson: "One entry, many surfaces: because it's tagged Public Art + Art + On View and 'For Visitors' is checked, Cabin shows up on the interactive map, on Things to Do, on the Public Art page, and can be filtered by amenity — without anyone maintaining four pages."
    },
    {
      key: "the-oyster",
      title: "The Oyster",
      emoji: "🦪",
      tagline: "Why Status exists",
      fields: {
        "Quick description": "Lorem ipsum (content TBD)",
        "Artist": "Alan Michelson",
        "For Visitors": true,
        "Show on Map": true
      },
      taxonomies: {
        "listing-type": ["Public Art"],
        "focus": ["Art"],
        "amenities": ["Accessible Entrance", "Kid-Friendly", "Pet-Friendly"],
        "season": ["Year Round"],
        "cost": ["Free"],
        "region": ["Colonels Row"],
        "status": ["Coming Soon"]
      },
      lesson: "The Status taxonomy lets a piece that isn't installed yet live on the site as 'Coming Soon' — building anticipation without pretending it's on view. This is separate from the automatic open-now logic driven by hours and season."
    },
    {
      key: "billion-oyster",
      title: "Billion Oyster Project",
      emoji: "🌊",
      tagline: "One organization, two listing types",
      fields: {
        "Quick description": "Lorem ipsum (content TBD)",
        "About": "Based on Governors Island, Billion Oyster Project is restoring oyster populations to New York Harbor in collaboration with NYC communities and through public education initiatives.",
        "For Visitors": true,
        "Days & Hours": "Fridays, Saturdays: 10:00 am – 4:00 pm",
        "Show on Map": true,
        "External Link": "billionoysterproject.org"
      },
      taxonomies: {
        "listing-type": ["Business/Tenant", "Artist Residency"]
      },
      lesson: "Listing Type isn't exclusive — Billion Oyster Project is both a tenant and hosts residencies, so it carries both terms and appears in both contexts. One entry, no duplication."
    },
    {
      key: "pizzeria",
      title: "Pizzeria Fantastica",
      emoji: "🍕",
      tagline: "Food & Drink unlocks extra fields",
      fields: {
        "Quick description": "Pizzeria Fantastica (formerly Pizza Yard) brings gourmet Neapolitan and Roman-style wood-fired pizzas and a full drink menu.",
        "For Visitors": true,
        "Days & Hours": "Weekdays: 11 am – 4 pm · Weekends: 11 am – 5 pm",
        "Show on Map": true,
        "External Link": "pizzeriafantastica.com",
        "Additional link": "Menu PDF (open question: PDF or link?)"
      },
      taxonomies: {
        "listing-type": ["Food & Drink"],
        "amenities": ["Bike Parking", "Kid-Friendly", "Picnic Tables"],
        "dietary": ["Vegetarian", "Pescatarian"],
        "season": ["May–Oct"],
        "cost": ["Varies"],
        "region": ["King Avenue Food Court"]
      },
      lesson: "Dietary Preferences only applies to Food & Drink listings — a conditional taxonomy. Tagging it Food & Drink is what makes the vegetarian/pescatarian filters (and the Food & Drink page) pick it up."
    },
    {
      key: "cincher",
      title: "Cincher",
      emoji: "💼",
      tagline: "Not everything is for visitors",
      fields: {
        "Quick description": "Software company focused on being the easiest and fastest way to extract and manage data from Slack.",
        "For Visitors": false,
        "Show on Map": false,
        "External Link": "cincher.io"
      },
      taxonomies: {
        "listing-type": ["Business/Tenant"],
        "region": ["Colonels Row"],
        "tenant-disciplines": ["Tech"]
      },
      lesson: "'For Visitors' unchecked keeps Cincher off Things to Do and the map, but it still exists as a Listing — appearing on the Tenants page, filterable by its Tenant Discipline (Tech). Tenant Disciplines is invisible everywhere else on the site."
    },
    {
      key: "adaptora",
      title: "Adaptora",
      emoji: "🌡",
      tagline: "A climate pilot with its own filter set",
      fields: {
        "Quick description": "Near real-time monitoring of flood risk for coastal areas.",
        "For Visitors": false,
        "Show on Map": true,
        "External Link": "adaptora.ai"
      },
      taxonomies: {
        "listing-type": ["Climate Pilot"],
        "focus": ["Climate"],
        "climate-challenges": ["Adaptive Infrastructure"]
      },
      lesson: "Climate Challenges is a specialist taxonomy: it only surfaces as a filter on the Climate Pilots page. Adaptora isn't a visitor destination, but it can still get a map pin — 'Show on Map' and 'For Visitors' are independent switches."
    },
    {
      key: "restrooms",
      title: "Restrooms",
      emoji: "🚻",
      tagline: "One listing, many pins",
      fields: {
        "Quick description": "All public restroom locations shown in one place.",
        "For Visitors": true,
        "Days & Hours": "Every Day: 7:00 am – 10:00 pm",
        "Show on Map": true,
        "Map Coordinates": "(multiple)"
      },
      taxonomies: {
        "listing-type": ["Amenity"],
        "amenities": ["Restrooms", "Kid-Friendly"],
        "region": ["LMCC, Building 110", "Battery Maritime Building", "Colonels Row", "King Avenue Food Court", "Liggett Terrace", "Western Promenade", "Soissons Landing"]
      },
      lesson: "Map Coordinates accepts one or more points, so a single 'Restrooms' listing can drop a pin at every restroom on the Island — one page to maintain, seven pins on the map. (Open question in the sheet: all-in-one listing, amenity tag, or both?)",
      openQuestion: true
    }
  ],

  /* DRAFT sitemap — reconstructed from the migration sheet's UX notes.
     The confirmed sitemap lives in Figma (GOV001 UX, Sitemap Delivery R2);
     reconcile this tree against it before sharing externally. */
  sitemapDraft: true,
  sitemap: [
    {
      title: "Home", note: "New homepage.", children: []
    },
    {
      title: "Plan Your Visit",
      note: "Staying largely as-is.",
      children: [
        { title: "Ferry & Getting Here", note: "Same as current ferry page." },
        { title: "Food & Drink", note: "Powered by Listings tagged Food & Drink with 'For Visitors' checked." , dynamic: "listing" },
        { title: "Interactive Map", note: "Powered by Listings with 'Show on Map' checked; filters come from Listing Type, Focus, and Amenities.", dynamic: "listing" },
        { title: "Island Rules", note: "Same as current." }
      ]
    },
    {
      title: "Things to Do",
      note: "Replaces the old Activities Overview.",
      children: [
        { title: "Events Calendar", note: "Powered by the Event post type.", dynamic: "event" },
        { title: "Public Art", note: "Listings tagged Public Art; doubles as part of the Arts pillar.", dynamic: "listing" },
        { title: "Recreation", note: "Listings tagged Recreation (bike rental, sport fields…).", dynamic: "listing" }
      ]
    },
    {
      title: "Arts & Culture",
      pillar: true,
      note: "Pillar page (from old About > Arts Culture).",
      children: [
        { title: "Organizations in Residence", note: "From old Ongoing Programs; org profiles are Listings.", dynamic: "listing" },
        { title: "Artist Residencies", note: "Listings tagged Artist Residency.", dynamic: "listing" }
      ]
    },
    {
      title: "Climate",
      pillar: true,
      note: "Pillar page. Old Natural Areas / GI Nature content folds in here; several old pages become blog posts featured on this page.",
      children: [
        { title: "Current Pilots", note: "Listings tagged Climate Pilot, filtered by Climate Challenges.", dynamic: "listing" },
        { title: "Governors Island Nature", note: "Climate pillar sub-page." },
        { title: "Tree Map", note: "Under the pillar page." }
      ]
    },
    {
      title: "History",
      pillar: true,
      note: "History pillar, aligned with the History term in the Focus taxonomy.",
      children: [
        { title: "National Park Service", note: "NPS page." }
      ]
    },
    {
      title: "Build With Us",
      note: "New opportunities hub — gathers scattered old pages: business opportunities, climate piloting applications, opportunities for artists, orgs-in-residence open calls.",
      children: [
        { title: "Opportunities", note: "Business opportunities, concession opportunities, climate piloting how-to-apply, opportunities for artists — as sections." },
        { title: "Tenants", note: "Listings tagged Business/Tenant, filtered by Tenant Disciplines.", dynamic: "listing" }
      ]
    },
    {
      title: "Real Estate",
      note: "Landing page absorbs Vision for Future Growth; RFPs become a section here.",
      children: [
        { title: "Leasing & Development", note: "Same or similar." },
        { title: "Available Properties", note: "Powered by the Property post type — ~40 buildings and development zones.", dynamic: "property" },
        { title: "Current Tenants", note: "Same or similar." }
      ]
    },
    {
      title: "Permits & Rentals",
      note: "Permit post type with a page template.",
      children: [
        { title: "Site Rentals for Private Events", note: "New events-rentals page.", dynamic: "permit" },
        { title: "Film & Photography", note: "Staying as permit template.", dynamic: "permit" },
        { title: "GI Gatherings", note: "Staying as permit template.", dynamic: "permit" },
        { title: "Athletic Fields", note: "Staying as permit template.", dynamic: "permit" }
      ]
    },
    {
      title: "Support",
      note: "Ways to give. Old Get Involved already redirects here.",
      children: [
        { title: "Donate", note: "Absorbs give-a-gift and donate-node pages." },
        { title: "Membership / Season Pass", note: "From individual membership pages." },
        { title: "Volunteer", note: "Same or similar." },
        { title: "Corporate Opportunities", note: "Same or similar." },
        { title: "Supporters", note: "Same or similar." },
        { title: "Adopt a Piece of Governors Island", note: "Same or similar." }
      ]
    },
    {
      title: "About",
      note: "DEI statement content folds into the main About page.",
      children: [
        { title: "The Trust for Governors Island", note: "PARA documents live under here." },
        { title: "Foundation", note: "Same or similar." },
        { title: "Job Openings", note: "Under About." },
        { title: "Press", note: "Press post type — listed, no page template.", dynamic: "press" },
        { title: "Contact Us", note: "Exists today." }
      ]
    },
    {
      title: "Blog / News",
      note: "The full blog archive migrates; some old standalone pages become posts. Filterable by Blog Type and Focus.",
      dynamic: "blog",
      children: []
    }
  ]
};
