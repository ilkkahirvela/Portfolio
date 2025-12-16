(function () {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  // If projects.js isn't loaded, fail quietly
  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    console.warn("PROJECTS array missing. Did you load projects.js before scripts.js?");
    return;
  }

  // Sort: featured first, then newest year first
  const projects = [...PROJECTS].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    const ay = Number(a.year) || 0;
    const by = Number(b.year) || 0;
    return by - ay;
  });

  projects.forEach((p) => {
    const card = document.createElement("a");
    card.className = "project-card";
    if (p.featured) card.classList.add("featured");
    card.href = p.link || "#";

    const safeTitle = escapeHtml(p.title ?? "Untitled");
    const safeYear = escapeHtml(String(p.year ?? ""));
    const safeDesc = escapeHtml(p.description ?? "");
    const img = p.image ? `background-image:url('${p.image}')` : "";

    const tagsHtml = Array.isArray(p.tags)
      ? p.tags.map(t => `<span class="tag">${escapeHtml(String(t))}</span>`).join("")
      : "";

    card.innerHTML = `
      <div class="thumb" style="${img}"></div>
      <div class="card-body">
        <div class="title-row">
          <h3>${safeTitle}</h3>
          <span class="year">${safeYear}</span>
        </div>
        <p class="desc">${safeDesc}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
