// ============================
// Projects grid
// ============================
(() => {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    console.warn("PROJECTS array missing. Did you load projects.js before scripts.js?");
    return;
  }

  const searchInput = document.getElementById("projectSearch");
  const tagFiltersEl = document.getElementById("tagFilters");
  const resultsCountEl = document.getElementById("resultsCount");

  // featured first, then newest
  const allProjects = [...PROJECTS].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return (Number(b.year) || 0) - (Number(a.year) || 0);
  });

  // tags from data
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

      const haystack =
        `${p.title ?? ""} ${p.description ?? ""} ${(p.tags || []).join(" ")}`.toLowerCase();

      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      return matchesTag && matchesSearch;
    });

    grid.innerHTML = "";
    filtered.forEach(p => grid.appendChild(makeCard(p)));

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    }
  }

  function getProjectHref(p) {
    const href = (p.detailsUrl || p.link || "").trim();
    return href || "#";
  }

  function makeCard(p) {
    const card = document.createElement("a");
    card.className = "project-card";
    if (p.featured) card.classList.add("featured");

    const href = getProjectHref(p);
    card.href = href;

    if (href === "#") {
      card.addEventListener("click", (e) => e.preventDefault());
      card.setAttribute("aria-disabled", "true");
    }

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

// Lightbox
(() => {
  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const btnClose = lightbox?.querySelector(".lightbox__close");
  const btnPrev = lightbox?.querySelector(".lightbox__nav--prev");
  const btnNext = lightbox?.querySelector(".lightbox__nav--next");

  if (!lightbox || !imgEl || !btnClose || !btnPrev || !btnNext) return;

  const galleryLinks = Array.from(document.querySelectorAll("#project-details .gallery-item"))
    .filter(a => a.getAttribute("href") && /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(a.getAttribute("href")));

  const sources = galleryLinks.map(a => a.getAttribute("href"));
  let index = -1;

  function setNavVisibility() {
    const hasMany = sources.length > 1;
    btnPrev.classList.toggle("is-hidden", !hasMany);
    btnNext.classList.toggle("is-hidden", !hasMany);
  }

  function openAt(i) {
    if (!sources.length) return;
    index = (i + sources.length) % sources.length;

    imgEl.src = sources[index];
    imgEl.alt = galleryLinks[index]?.querySelector("img")?.alt || "Gallery image";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-lock");

    setNavVisibility();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-lock");

    imgEl.src = "";
    imgEl.alt = "";
    index = -1;
  }

  function next() {
    if (index === -1) return;
    openAt(index + 1);
  }

  function prev() {
    if (index === -1) return;
    openAt(index - 1);
  }

  // open gallery
  galleryLinks.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openAt(i);
    });
  });

  // backdrop close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  // buttons
  btnClose.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  btnNext.addEventListener("click", (e) => { e.stopPropagation(); next(); });
  btnPrev.addEventListener("click", (e) => { e.stopPropagation(); prev(); });

  // keyboard
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
