// scripts.js
(function () {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    console.warn("PROJECTS array missing. Did you load projects.js before scripts.js?");
    return;
  }

  const searchInput = document.getElementById("projectSearch");
  const tagFiltersEl = document.getElementById("tagFilters");
  const resultsCountEl = document.getElementById("resultsCount");

  // Sort: featured first, then newest
  const allProjects = [...PROJECTS].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return (Number(b.year) || 0) - (Number(a.year) || 0);
  });

  // Build filter tags from data
  const tagSet = new Set();
  allProjects.forEach(p => (p.tags || []).forEach(t => tagSet.add(String(t))));
  const tags = ["All", ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];

  let activeTag = "All";
  let searchTerm = "";

  renderFilterChips();
  render();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = (e.target.value || "").trim().toLowerCase();
      render();
    });
  }

  function renderFilterChips() {
    if (!tagFiltersEl) return;

    tagFiltersEl.innerHTML = "";
    tags.forEach(tag => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip" + (tag === activeTag ? " active" : "");
      chip.textContent = tag;

      chip.addEventListener("click", () => {
        activeTag = tag;
        renderFilterChips();
        render();
      });

      tagFiltersEl.appendChild(chip);
    });
  }

  function render() {
    const filtered = allProjects.filter(p => {
      const matchesTag =
        activeTag === "All" ||
        (Array.isArray(p.tags) && p.tags.map(String).includes(activeTag));

      const haystack = `${p.title ?? ""} ${p.description ?? ""} ${(p.tags || []).join(" ")}`.toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);

      return matchesTag && matchesSearch;
    });

    grid.innerHTML = "";
    filtered.forEach(p => grid.appendChild(makeCard(p)));

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    }
  }

  function makeCard(p) {
    const card = document.createElement("a");
    card.className = "project-card";
    if (p.featured) card.classList.add("featured");
    card.href = p.link || "#";

    const img = p.image ? `background-image:url('${p.image}')` : "";
    const tagsHtml = Array.isArray(p.tags)
      ? p.tags.map(t => `<span class="tag">${escapeHtml(String(t))}</span>`).join("")
      : "";

    card.innerHTML = `
      <div class="thumb" style="${img}"></div>
      <div class="card-body">
        <div class="title-row">
          <h3>${escapeHtml(p.title ?? "Untitled")}</h3>
          <span class="year">${escapeHtml(String(p.year ?? ""))}</span>
        </div>
        <p class="desc">${escapeHtml(p.description ?? "")}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    `;

    return card;
  }

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
