/* app.js
   Requires:
   algoliasearch-lite.umd.js
   instantsearch.production.min.js
*/

(function () {
  const APP_ID = "BRKP65QR5X";
  const SEARCH_API_KEY = "d9365ac710c3956243c6817e5ed7766b";
  const INDEX_NAME = "records";

  // Replicas for sorting
  const SORT_INDICES = [
    { label: "Relevance", value: "records" },
    { label: "Price: Low → High", value: "records_price_asc" },
    { label: "Price: High → Low", value: "records_price_desc" },
    { label: "Rating: High → Low", value: "records_rating_desc" },
    { label: "Popularity: High → Low", value: "records_popularity_desc" },
  ];

  const { widgets } = instantsearch;

  function $(selector) {
    return document.querySelector(selector);
  }
  function exists(selector) {
    return !!$(selector);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === "") return "—";
    const num = Number(price);
    if (Number.isNaN(num)) return escapeHtml(price);
    return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function ratingStars(rating) {
    const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return "★".repeat(r) + "☆".repeat(5 - r);
  }

  // Placeholder if image is missing/broken
  const placeholder =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
        <rect width="100%" height="100%" fill="#f2f2f2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          font-family="Arial" font-size="14" fill="#888">No image</text>
      </svg>`
    );

  const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY);

  const search = instantsearch({
    indexName: INDEX_NAME,
    searchClient,
  });

  const widgetList = [];

  // Search box
  if (exists("#searchbox")) {
    widgetList.push(
      widgets.searchBox({
        container: "#searchbox",
        placeholder: "Search products…",
        showReset: true,
        showSubmit: true,
        showLoadingIndicator: false,
      })
    );
  }

  // Stats
  if (exists("#stats")) {
    widgetList.push(
      widgets.stats({
        container: "#stats",
        templates: {
          text({ nbHits, processingTimeMS, query }) {
            if (!query) return `${nbHits.toLocaleString()} results`;
            return `${nbHits.toLocaleString()} results for “${escapeHtml(
              query
            )}” (${processingTimeMS}ms)`;
          },
        },
      })
    );
  }

  // Sort
  if (exists("#sort-by")) {
    widgetList.push(
      widgets.sortBy({
        container: "#sort-by",
        items: SORT_INDICES,
      })
    );
  }

  // Clear filters
  if (exists("#clear-refinements")) {
    widgetList.push(
      widgets.clearRefinements({
        container: "#clear-refinements",
        templates: { resetLabel: "Clear filters" },
      })
    );
  }

  // Current refinements (chips only)
  if (exists("#current-refinements")) {
    widgetList.push(
      widgets.currentRefinements({
        container: "#current-refinements",
        templates: {
          item(item, { html }) {
            return html`
              <div class="refinement-group">
                ${item.refinements.map((r) => {
                  const label = r.label || r.value;
                  return html`<span class="chip">${escapeHtml(label)}</span>`;
                })}
              </div>
            `;
          },
        },
      })
    );
  }

  // Categories (tree)
  if (exists("#categories")) {
    widgetList.push(
      widgets.hierarchicalMenu({
        container: "#categories",
        attributes: [
          "hierarchicalCategories.lvl0",
          "hierarchicalCategories.lvl1",
          "hierarchicalCategories.lvl2",
          "hierarchicalCategories.lvl3",
        ],
        showParentLevel: true,
      })
    );
  }

  // Brand facet
  if (exists("#brand")) {
    widgetList.push(
      widgets.refinementList({
        container: "#brand",
        attribute: "brand",
        searchable: false,
        sortBy: ["count:desc", "name:asc"],
        limit: 10,
        showMore: true,
        showMoreLimit: 50,
      })
    );
  }

  // Price slider
  if (exists("#price")) {
    widgetList.push(
      widgets.rangeSlider({
        container: "#price",
        attribute: "price",
        tooltips: {
          format(raw) {
            const n = Number(raw);
            if (Number.isNaN(n)) return raw;
            return `$${Math.round(n).toLocaleString()}`;
          },
        },
      })
    );
  }

  // Rating facet
  if (exists("#rating")) {
    widgetList.push(
      widgets.ratingMenu({
        container: "#rating",
        attribute: "rating",
        max: 5,
      })
    );
  }

  // Free shipping toggle
  if (exists("#free-shipping")) {
    widgetList.push(
      widgets.toggleRefinement({
        container: "#free-shipping",
        attribute: "free_shipping",
        label: "Free shipping only",
      })
    );
  }

  // Hits
  if (exists("#hits")) {
    widgetList.push(
      widgets.hits({
        container: "#hits",
        templates: {
          item(hit, { html, components }) {
            const name = components.Highlight({ attribute: "name", hit });
            const desc = hit.description
              ? components.Snippet({ attribute: "description", hit })
              : "";

            const img = hit.image || hit.thumbnailImage || placeholder;
            const stars = hit.rating ? ratingStars(hit.rating) : "";
            const brandValue = hit.brand;

            return html`
              <article class="hit">
                <div class="hit-img">
                  <img
                    src="${escapeHtml(img)}"
                    alt="${escapeHtml(hit.name || "Product image")}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${placeholder}';"
                  />
                </div>

                <div class="hit-body">
                  <div class="hit-title">${name}</div>

                  <!-- BRAND goes right under the title -->
                  ${brandValue
                    ? html`<div class="hit-brand">${escapeHtml(
                        brandValue
                      )}</div>`
                    : ""}

                  ${stars
                    ? html`<div
                        class="hit-rating"
                        aria-label="Rating ${escapeHtml(hit.rating)} out of 5"
                      >
                        ${stars}
                        <span class="hit-rating-num"
                          >(${escapeHtml(hit.rating)})</span
                        >
                      </div>`
                    : ""}

                  ${desc ? html`<div class="hit-desc">${desc}</div>` : ""}

                  <!-- only keep Free shipping here now -->
                  <div class="hit-meta">
                    ${hit.free_shipping
                      ? html`<span class="pill pill-ok">Free shipping</span>`
                      : ""}
                  </div>

                  <div class="hit-row">
                    <div class="hit-price">${escapeHtml(
                      formatPrice(hit.price)
                    )}</div>
                    <a
                      class="hit-link"
                      href="${escapeHtml(hit.url || "#")}"
                      target="_blank"
                      rel="noopener"
                    >
                      View
                    </a>
                  </div>
                </div>
              </article>
            `;
          },
        },
      })
    );
  }

  // Pagination
  if (exists("#pagination")) {
    widgetList.push(
      widgets.pagination({
        container: "#pagination",
        padding: 2,
        showFirst: false,
        showLast: false,
      })
    );
  }

  // Configure
  widgetList.push(
    widgets.configure({
      hitsPerPage: 20,
    })
  );

  search.addWidgets(widgetList);
  search.start();
})();
