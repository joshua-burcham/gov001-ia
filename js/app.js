/* GOV001 content model explainer.
   Everything renders from taxonomies.json; no taxonomy data lives in markup. */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    (children || []).forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  fetch("taxonomies.json")
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(init)
    .catch(() => {
      $("#ct-grid").appendChild(el("p", { class: "tax-note", text:
        "Could not load taxonomies.json. If you opened this file directly from disk, serve the folder over HTTP instead (for example: python3 -m http.server), or view the Netlify deploy." }));
    });

  function init(data) {
    const contentTypes = data.contentTypes;
    const taxonomies = data.taxonomies;
    const typeById = Object.fromEntries(contentTypes.map(ct => [ct.id, ct]));

    /* ---------- helpers ---------- */

    function isPageScoped(tax) {
      return tax.visibility && tax.visibility !== "visitor-facing";
    }

    function badgesFor(tax) {
      const out = [];
      if (tax.mapFilter) out.push(el("span", { class: "badge badge-map", text: "map filter" }));
      if (isPageScoped(tax)) out.push(el("span", { class: "badge", text: "page-scoped" }));
      return out;
    }

    /* The body content shown for a taxonomy in either view. */
    function taxBody(tax, currentTypeId) {
      const frag = document.createDocumentFragment();

      frag.appendChild(el("p", { class: "tax-desc", text: tax.description }));

      if (tax.mapFilter === true) {
        frag.appendChild(el("p", { class: "map-note", text: "Appears as a filter on the interactive island map." }));
      } else if (typeof tax.mapFilter === "string") {
        frag.appendChild(el("p", { class: "map-note", text: "Appears as a filter on the interactive island map (" + tax.mapFilter.toLowerCase() + ")." }));
      } else if (tax.mapFilter === null) {
        frag.appendChild(el("p", { class: "applies-line", text: "Whether this becomes a map filter is not yet decided." }));
      }

      if (isPageScoped(tax)) {
        frag.appendChild(el("p", { class: "tax-note", text: tax.visibility + "." }));
      }
      if (tax.notes) {
        frag.appendChild(el("p", { class: "tax-note", text: tax.notes }));
      }

      const chips = el("div", { class: "term-chips" });
      tax.terms.forEach(t => chips.appendChild(el("span", { class: "term", text: t })));
      frag.appendChild(chips);

      const others = tax.appliedTo.filter(id => id !== currentTypeId);
      const line = el("p", { class: "applies-line" });
      if (currentTypeId && others.length === 0) {
        line.appendChild(document.createTextNode("Applies only to " + typeById[currentTypeId].name + "."));
      } else {
        line.appendChild(document.createTextNode(currentTypeId ? "Also applies to: " : "Applies to: "));
        (currentTypeId ? others : tax.appliedTo).forEach(id => {
          const chip = el("button", { class: "ct-chip", type: "button", text: typeById[id].name });
          chip.addEventListener("click", () => {
            selectType(id);
            showView("by-type");
            $("#ct-picker").scrollIntoView({ block: "center" });
          });
          line.appendChild(chip);
        });
      }
      frag.appendChild(line);

      return frag;
    }

    /* ---------- content type cards ---------- */

    const grid = $("#ct-grid");
    contentTypes.forEach(ct => {
      const card = el("div", { class: "ct-card" });
      card.appendChild(el("h3", { text: ct.name }));
      card.appendChild(el("p", { text: ct.description }));
      const ul = el("ul", { class: "ct-examples" });
      ct.examples.forEach(ex => ul.appendChild(el("li", { text: ex })));
      card.appendChild(ul);
      grid.appendChild(card);
    });

    /* ---------- view toggle ---------- */

    const btnByType = $("#toggle-by-type");
    const btnByTax = $("#toggle-by-tax");

    function showView(which) {
      const byType = which === "by-type";
      btnByType.setAttribute("aria-pressed", String(byType));
      btnByTax.setAttribute("aria-pressed", String(!byType));
      $("#view-by-type").hidden = !byType;
      $("#view-by-tax").hidden = byType;
    }

    btnByType.addEventListener("click", () => showView("by-type"));
    btnByTax.addEventListener("click", () => showView("by-tax"));

    /* ---------- view A: by content type ---------- */

    const picker = $("#ct-picker");
    const rowsBox = $("#tax-rows");
    let selectedTypeId = contentTypes[0].id;

    function selectType(id) {
      selectedTypeId = id;
      $$(".pill", picker).forEach(p => p.setAttribute("aria-pressed", String(p.dataset.id === id)));
      renderRows();
    }

    contentTypes.forEach(ct => {
      const pill = el("button", { class: "pill", type: "button", text: ct.name, "data-id": ct.id, "aria-pressed": String(ct.id === selectedTypeId) });
      pill.addEventListener("click", () => selectType(ct.id));
      picker.appendChild(pill);
    });

    function renderRows() {
      rowsBox.innerHTML = "";
      const applicable = taxonomies.filter(t => t.appliedTo.includes(selectedTypeId));
      rowsBox.appendChild(el("p", { class: "applies-line", text:
        typeById[selectedTypeId].name + " content can carry " + applicable.length +
        (applicable.length === 1 ? " taxonomy:" : " taxonomies:") }));

      applicable.forEach((tax, i) => {
        const row = el("div", { class: "tax-row" });
        const bodyId = "taxbody-" + tax.id;
        const head = el("button", { class: "tax-row-head", type: "button", "aria-expanded": "false", "aria-controls": bodyId });
        head.appendChild(el("span", { class: "tax-row-caret", text: "▸", "aria-hidden": "true" }));
        head.appendChild(el("span", { text: tax.name }));
        badgesFor(tax).forEach(b => head.appendChild(b));
        head.appendChild(el("span", { class: "tax-row-count", text: tax.terms.length + " terms" }));
        row.appendChild(head);

        const body = el("div", { class: "tax-row-body", id: bodyId, hidden: "" });
        body.appendChild(taxBody(tax, selectedTypeId));
        row.appendChild(body);

        head.addEventListener("click", () => {
          const open = row.hasAttribute("data-open");
          if (open) {
            row.removeAttribute("data-open");
            body.hidden = true;
            head.setAttribute("aria-expanded", "false");
          } else {
            row.setAttribute("data-open", "");
            body.hidden = false;
            head.setAttribute("aria-expanded", "true");
          }
        });

        rowsBox.appendChild(row);
        if (i === 0) head.click();
      });
    }

    renderRows();

    /* ---------- view B: by taxonomy ---------- */

    const strip = $("#ct-strip");
    const list = $("#tax-list");
    const detail = $("#tax-detail");
    const stripChips = {};

    contentTypes.forEach(ct => {
      const chip = el("span", { class: "ct-chip", text: ct.name });
      stripChips[ct.id] = chip;
      strip.appendChild(chip);
    });

    function lightUp(tax) {
      contentTypes.forEach(ct => {
        stripChips[ct.id].classList.toggle("lit", !!tax && tax.appliedTo.includes(ct.id));
      });
    }

    function selectTax(tax) {
      $$(".tax-list-btn", list).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.id === tax.id)));
      lightUp(tax);
      detail.innerHTML = "";
      const h = el("h3");
      h.appendChild(el("span", { text: tax.name }));
      badgesFor(tax).forEach(b => h.appendChild(b));
      detail.appendChild(h);
      detail.appendChild(taxBody(tax, null));
    }

    taxonomies.forEach(tax => {
      const btn = el("button", { class: "tax-list-btn", type: "button", text: tax.name, "data-id": tax.id, "aria-pressed": "false" });
      btn.addEventListener("click", () => selectTax(tax));
      btn.addEventListener("mouseenter", () => lightUp(tax));
      btn.addEventListener("focus", () => lightUp(tax));
      list.appendChild(btn);
    });

    list.addEventListener("mouseleave", () => {
      const current = $('.tax-list-btn[aria-pressed="true"]', list);
      lightUp(current ? taxonomies.find(t => t.id === current.dataset.id) : null);
    });

    selectTax(taxonomies[0]);
  }
})();
