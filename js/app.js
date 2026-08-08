/* GOV001 IA explainer — rendering & interaction (vanilla JS, no deps) */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const postTypeByKey = Object.fromEntries(IA.postTypes.map(pt => [pt.key, pt]));
  const taxByKey = Object.fromEntries(IA.taxonomies.map(t => [t.key, t]));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else node.setAttribute(k, v);
      }
    }
    (children || []).forEach(c => node.appendChild(c));
    return node;
  }

  /* ---------- tabs ---------- */

  const TABS = ["overview", "sitemap", "content-types", "taxonomies", "examples"];

  function showTab(name) {
    if (!TABS.includes(name)) name = "overview";
    $$(".panel").forEach(p => { p.hidden = p.dataset.panel !== name; });
    $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", () => showTab(location.hash.slice(1)));

  /* ---------- sitemap ---------- */

  function renderSitemap() {
    const tree = $("#sitemap-tree");
    const detail = $("#sitemap-detail");

    function showDetail(page, parentTitle) {
      detail.innerHTML = "";
      const badges = el("p");
      if (page.pillar) badges.appendChild(el("span", { class: "badge badge-pillar", text: "Pillar page" }));
      if (page.dynamic) {
        const pt = postTypeByKey[page.dynamic];
        badges.appendChild(el("span", { class: "badge badge-dynamic", text: "Auto-populated · " + (pt ? pt.title : page.dynamic) }));
      }
      detail.appendChild(el("h3", { text: page.title }));
      if (parentTitle) detail.appendChild(el("p", { class: "tax-meta", html: "Under <strong>" + parentTitle + "</strong>" }));
      if (badges.children.length) detail.appendChild(badges);
      detail.appendChild(el("p", { class: "detail-note", text: page.note || "No notes yet." }));
      if (page.dynamic && postTypeByKey[page.dynamic]) {
        detail.appendChild(el("p", { class: "detail-note", html:
          "This page lists <a href='#content-types'>" + postTypeByKey[page.dynamic].title +
          "</a> entries automatically — no hand-maintained content." }));
      }
    }

    IA.sitemap.forEach(section => {
      const hasKids = section.children && section.children.length > 0;
      const wrapper = el("div", { class: "sm-section" });

      const parentBtn = el("button", { class: "sm-parent", type: "button" });
      const caret = el("span", { class: "sm-caret" + (hasKids ? "" : " leaf"), html: "&#9656;", "aria-hidden": "true" });
      parentBtn.appendChild(caret);
      parentBtn.appendChild(el("span", { text: section.title }));
      if (section.pillar) parentBtn.appendChild(el("span", { class: "badge badge-pillar", text: "pillar" }));
      if (section.dynamic) parentBtn.appendChild(el("span", { class: "badge badge-dynamic", text: "auto-populated" }));
      wrapper.appendChild(parentBtn);

      const kidBox = el("div", { class: "sm-children" });
      (section.children || []).forEach(child => {
        const btn = el("button", { class: "sm-child", type: "button" });
        btn.appendChild(el("span", { text: child.title }));
        if (child.dynamic) btn.appendChild(el("span", { class: "badge badge-dynamic", text: "auto-populated" }));
        btn.addEventListener("click", () => {
          $$(".selected", tree).forEach(n => n.classList.remove("selected"));
          btn.classList.add("selected");
          showDetail(child, section.title);
        });
        kidBox.appendChild(btn);
      });
      if (hasKids) wrapper.appendChild(kidBox);

      parentBtn.addEventListener("click", () => {
        if (hasKids) wrapper.classList.toggle("open");
        $$(".selected", tree).forEach(n => n.classList.remove("selected"));
        parentBtn.classList.add("selected");
        showDetail(section, null);
      });

      tree.appendChild(wrapper);
    });

    // open the first couple of sections so the tree reads as a tree
    $$(".sm-section", tree).slice(0, 3).forEach(s => s.classList.add("open"));
  }

  /* ---------- content types ---------- */

  function renderPostTypes() {
    const grid = $("#post-type-grid");
    IA.postTypes.forEach(pt => {
      const card = el("div", { class: "pt-card" });
      const head = el("div", { class: "pt-head" });
      head.appendChild(el("span", { class: "pt-icon", text: pt.icon }));
      head.appendChild(el("h3", { text: pt.title }));
      card.appendChild(head);
      card.appendChild(el("p", { text: pt.summary }));

      const props = el("div", { class: "pt-props" });
      const propDefs = [
        ["Map pin", pt.mapCoordinate],
        ["Map filter", pt.mapFilter],
        ["Page template", pt.pageTemplate]
      ];
      propDefs.forEach(([label, val]) => {
        props.appendChild(el("span", {
          class: "pt-prop" + (val === "Yes" || val === "Optional" ? " yes" : ""),
          text: label + ": " + val
        }));
      });
      card.appendChild(props);
      grid.appendChild(card);
    });

    const fieldBox = $("#listing-fields");
    IA.listingFields.forEach(f => {
      const row = el("div", { class: "field-row" });
      const name = el("div", { class: "field-name" });
      name.appendChild(document.createTextNode(f.name));
      if (f.required) name.appendChild(el("span", { class: "req", text: " *" }));
      if (f.conditional) name.appendChild(el("span", { class: "field-cond", text: "if " + f.conditional }));
      if (f.type === "checkbox") name.appendChild(el("span", { class: "field-cond", text: "checkbox" }));
      row.appendChild(name);
      row.appendChild(el("div", { class: "field-note", text: f.note || "—" }));
      fieldBox.appendChild(row);
    });
  }

  /* ---------- taxonomies ---------- */

  function renderTaxonomies() {
    const filterRow = $("#tax-filter");
    const grid = $("#tax-grid");

    const options = [{ key: "all", title: "All content types" }]
      .concat(IA.postTypes.map(pt => ({ key: pt.key, title: pt.title })));

    options.forEach((opt, i) => {
      const btn = el("button", { class: "pill" + (i === 0 ? " active" : ""), type: "button", text: opt.title });
      btn.addEventListener("click", () => {
        $$(".pill", filterRow).forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        $$(".tax-card", grid).forEach(card => {
          const applies = card.dataset.appliesTo.split(",");
          card.classList.toggle("dimmed", opt.key !== "all" && !applies.includes(opt.key));
        });
      });
      filterRow.appendChild(btn);
    });

    IA.taxonomies.forEach(tax => {
      const card = el("div", { class: "tax-card", "data-applies-to": tax.appliesTo.join(",") });

      const h = el("h3");
      h.appendChild(el("span", { text: tax.title }));
      if (tax.mapFilter && tax.mapFilter !== "No") h.appendChild(el("span", { class: "badge badge-map", text: "map filter" }));
      if (tax.visibility) h.appendChild(el("span", { class: "badge badge-limited", text: "limited visibility" }));
      if (tax.openQuestion) h.appendChild(el("span", { class: "badge badge-question", text: "open question" }));
      card.appendChild(h);

      card.appendChild(el("p", { class: "tax-desc", text: tax.description }));

      const meta = el("p", { class: "tax-meta" });
      meta.innerHTML = "<strong>Applies to:</strong> " +
        tax.appliesTo.map(k => postTypeByKey[k] ? postTypeByKey[k].title : k).join(", ") +
        (tax.visibility ? "<br><strong>Visibility:</strong> " + tax.visibility : "");
      card.appendChild(meta);

      const chips = el("div", { class: "term-chips" });
      tax.terms.forEach(term => {
        const note = tax.termNotes && tax.termNotes[term];
        chips.appendChild(el("span", { class: "term", text: term, title: note || "" }));
      });
      card.appendChild(chips);

      grid.appendChild(card);
    });
  }

  /* ---------- examples ---------- */

  function surfacesFor(ex) {
    const types = (ex.taxonomies["listing-type"] || []);
    const forVisitors = !!ex.fields["For Visitors"];
    const onMap = !!ex.fields["Show on Map"];
    const surfaces = [];

    surfaces.push({
      icon: "🗺", on: onMap,
      text: onMap
        ? "Pin on the <strong>interactive map</strong>" + (ex.fields["Map Coordinates"] === "(multiple)" ? " — multiple pins from one listing" : "")
        : "Not shown on the interactive map ('Show on Map' unchecked)"
    });
    surfaces.push({
      icon: "🎯", on: forVisitors,
      text: forVisitors
        ? "Card on <strong>Things to Do</strong>"
        : "Hidden from <strong>Things to Do</strong> ('For Visitors' unchecked)"
    });
    if (types.includes("Food & Drink")) {
      surfaces.push({ icon: "🍽", on: true, text: "Card on <strong>Food &amp; Drink</strong>, filterable by Dietary Preferences" });
    }
    if (types.includes("Public Art")) {
      surfaces.push({ icon: "🎨", on: true, text: "Card on the <strong>Public Art</strong> page (Arts &amp; Culture pillar)" });
    }
    if (types.includes("Business/Tenant")) {
      const disc = (ex.taxonomies["tenant-disciplines"] || []).join(", ");
      surfaces.push({ icon: "🏢", on: true, text: "Row on the <strong>Tenants</strong> page" + (disc ? ", filterable under <strong>" + disc + "</strong>" : "") });
    }
    if (types.includes("Artist Residency")) {
      surfaces.push({ icon: "🖌", on: true, text: "Listed under <strong>Artist Residencies</strong>" });
    }
    if (types.includes("Climate Pilot")) {
      const ch = (ex.taxonomies["climate-challenges"] || []).join(", ");
      surfaces.push({ icon: "🌱", on: true, text: "Card on <strong>Current Pilots</strong> (Climate pillar)" + (ch ? ", filterable under <strong>" + ch + "</strong>" : "") });
    }
    if (types.includes("Amenity")) {
      surfaces.push({ icon: "🧭", on: true, text: "Surfaced through <strong>map amenity filters</strong> and visitor info pages" });
    }
    return surfaces;
  }

  function renderExample(ex) {
    const stage = $("#example-stage");
    stage.innerHTML = "";

    /* left: mock listing page */
    const preview = el("div", { class: "listing-preview" });
    preview.appendChild(el("div", { class: "lp-hero", text: ex.emoji }));
    const body = el("div", { class: "lp-body" });
    body.appendChild(el("h2", { text: ex.title }));
    body.appendChild(el("p", { class: "lp-tagline", text: ex.tagline }));
    if (ex.fields["Quick description"]) {
      body.appendChild(el("p", { class: "lp-desc", text: ex.fields["Quick description"] }));
    }

    const dl = el("dl", { class: "lp-fields" });
    const skip = new Set(["Quick description"]);
    Object.entries(ex.fields).forEach(([name, value]) => {
      if (skip.has(name)) return;
      const row = el("div", { class: "lp-field" });
      row.appendChild(el("dt", { text: name }));
      const dd = el("dd");
      if (typeof value === "boolean") {
        dd.appendChild(el("span", {
          class: value ? "check-yes" : "check-no",
          text: value ? "✓ checked" : "✗ unchecked"
        }));
      } else {
        dd.textContent = value;
      }
      row.appendChild(dd);
      dl.appendChild(row);
    });
    body.appendChild(dl);

    const taxBlock = el("div", { class: "lp-taxes" });
    taxBlock.appendChild(el("h4", { text: "How it's tagged" }));
    Object.entries(ex.taxonomies).forEach(([key, terms]) => {
      const row = el("div", { class: "lp-tax-row" });
      row.appendChild(el("span", { class: "lp-tax-name", text: (taxByKey[key] ? taxByKey[key].title : key) }));
      const chips = el("span", { class: "term-chips" });
      terms.forEach(t => chips.appendChild(el("span", { class: "term", text: t })));
      row.appendChild(chips);
      taxBlock.appendChild(row);
    });
    body.appendChild(taxBlock);
    preview.appendChild(body);
    stage.appendChild(preview);

    /* right: where it appears + lesson */
    const side = el("div", { class: "example-side" });

    const surfCard = el("div", { class: "side-card" });
    surfCard.appendChild(el("h3", { text: "Where it appears" }));
    const list = el("ul", { class: "surface-list" });
    surfacesFor(ex).forEach(s => {
      const li = el("li", { class: s.on ? "" : "off" });
      li.appendChild(el("span", { class: "surface-icon", text: s.on ? s.icon : "🚫" }));
      li.appendChild(el("span", { html: s.text }));
      list.appendChild(li);
    });
    surfCard.appendChild(list);
    side.appendChild(surfCard);

    const lesson = el("div", { class: "side-card lesson-card" });
    lesson.appendChild(el("h3", { text: "What this example shows" }));
    lesson.appendChild(el("p", { text: ex.lesson }));
    side.appendChild(lesson);

    stage.appendChild(side);
  }

  function renderExamples() {
    const picker = $("#example-picker");
    IA.examples.forEach((ex, i) => {
      const btn = el("button", { class: "pill" + (i === 0 ? " active" : ""), type: "button", text: ex.emoji + " " + ex.title });
      btn.addEventListener("click", () => {
        $$(".pill", picker).forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        renderExample(ex);
      });
      picker.appendChild(btn);
    });
    renderExample(IA.examples[0]);
  }

  /* ---------- init ---------- */

  renderSitemap();
  renderPostTypes();
  renderTaxonomies();
  renderExamples();
  showTab(location.hash.slice(1) || "overview");
})();
