(() => {
  // Only run on the details template
  const detailsRoot = document.getElementById("project-details");
  if (!detailsRoot) return;

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    console.warn("PROJECTS array missing. Did you load projects.js before projectPage.js?");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const idRaw = (params.get("id") || "").trim();
  const id = idRaw.toLowerCase();

  const elTitle = document.getElementById("pTitle");
  const elYear = document.getElementById("pYear");
  const elLead = document.getElementById("pLead");
  const elTags = document.getElementById("pTags");
  const elTitleRight = document.getElementById("pTitleRight");
  const elLinks = document.getElementById("pLinks");
  const elBody = document.getElementById("pBody");
  const elGallery = document.getElementById("pGallery");
  const elRail = document.getElementById("pRail");

  if (!id) {
    document.title = "Ilkka Hirvelä | Project";
    if (elTitle) elTitle.textContent = "Project";
    if (elYear) elYear.textContent = "";
    if (elLead) elLead.textContent = "Choose a project from the Projects section.";
    if (elTags) elTags.innerHTML = "";
    if (elLinks) elLinks.innerHTML = "";
    if (elBody) {
      elBody.innerHTML =
        `<div class="project-section">
          <h2>Tip</h2>
          <p>Open a project using a URL like <code>project.html?id=viridianland</code>.</p>
        </div>`;
    }
    if (elGallery) elGallery.innerHTML = "";
    if (elRail) elRail.style.display = "none";
    return;
  }

  const project = PROJECTS.find(p => String(p.id || "").toLowerCase() === id);

  if (!project) {
    document.title = "Ilkka Hirvelä | Project Not Found";
    if (elTitle) elTitle.textContent = "Project not found";
    if (elYear) elYear.textContent = "";
    if (elLead) elLead.textContent = "This project doesn't exist (or the URL is wrong).";
    if (elTags) elTags.innerHTML = "";
    if (elLinks) elLinks.innerHTML = "";
    if (elBody) {
      elBody.innerHTML =
        `<div class="project-section">
          <h2>Tip</h2>
          <p>Use a URL like <code>project.html?id=viridianland</code>.</p>
        </div>`;
    }
    if (elGallery) elGallery.innerHTML = "";
    if (elRail) elRail.style.display = "none";
    return;
  }

  // Title
  document.title = `Ilkka Hirvelä | ${project.title || "Project"}`;
  if (elTitle) elTitle.textContent = project.title || "Project";
  if (elYear) elYear.textContent = project.year != null ? String(project.year) : "";

  // Lead text: prefer content.summary, fallback to description
  const lead = cleanText(project.content?.summary) || cleanText(project.description) || "";
  if (elLead) elLead.textContent = lead;

  // Tags
  if (elTags) {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    elTags.innerHTML = tags.map(t => `<span class="tag">${escapeHtml(String(t))}</span>`).join("");
  }

  // Team indicator
  if (elTitleRight && project.team != null) {
    elTitleRight.insertAdjacentHTML("afterbegin", buildTeamIndicator(project.team));
  }

  // Links
if (elLinks) {
  const linksObj = project.content?.links || project.links || {};
  const linksHtml = [];

  // Primary: itch, demo, trailer
  if (linksObj.itch)
    linksHtml.push(btnHtml(linksObj.itch, "Play on Itch.io →", "primary", true));

  if (linksObj.demo)
    linksHtml.push(btnHtml(linksObj.demo, "Live Demo →", "primary", true));

  if (linksObj.trailer)
    linksHtml.push(btnHtml(linksObj.trailer, "Watch Trailer →", "primary", true));

  // Secondary: github, docs
  if (linksObj.github)
    linksHtml.push(btnHtml(linksObj.github, "View on GitHub →", "secondary", true));

  if (linksObj.docs)
    linksHtml.push(btnHtml(linksObj.docs, "Documentation →", "secondary", true));

  elLinks.innerHTML = linksHtml.join(" ");
  elLinks.style.display = linksHtml.length ? "" : "none";
}


  // Body sections (skip empty/TODO) — hidden when project is WIP
  if (elBody) {
    if (project.wip) {
      elBody.innerHTML = `<div class="project-section wip-notice"><p>This project page is under construction. More details coming soon.</p></div>`;
    } else {
      elBody.innerHTML = renderSections(project.content?.sections);
      if (!elBody.innerHTML.trim()) elBody.innerHTML = "";
    }
  }

  // Gallery (right rail) — hidden when project is WIP
  const gallery = (!project.wip && Array.isArray(project.content?.gallery)) ? project.content.gallery : [];
  if (elGallery) {
    if (!gallery.length) {
      elGallery.innerHTML = "";
      if (elRail) elRail.style.display = "none";
    } else {
      if (elRail) elRail.style.display = "";
      elGallery.innerHTML = gallery.map((src, i) => {
        const alt = `${project.title || "Project"} Screenshot ${i + 1}`;
        return `
          <a class="gallery-item" href="${escapeAttr(src)}" target="_blank" rel="noopener">
            <img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" />
          </a>
        `;
      }).join("");
    }
  }

  // -----------------------
  // Helpers
  // -----------------------

  function renderSections(sections) {
    const s = Array.isArray(sections) ? sections : [];
    if (!s.length) return "";

    return s.map(sec => {
      const h2 = cleanText(sec?.h2);

      // p can be string OR array
      const paragraphs = Array.isArray(sec?.p)
        ? sec.p.map(cleanText).filter(p => p && p.toUpperCase() !== "TODO")
        : [cleanText(sec?.p)].filter(p => p && p.toUpperCase() !== "TODO");

      const ulRaw = Array.isArray(sec?.ul) ? sec.ul : [];
      const ulClean = ulRaw
        .map(cleanText)
        .filter(x => x && x.toUpperCase() !== "TODO");

      if (!h2 && !paragraphs.length && !ulClean.length) return "";

      const h2Html = h2 ? `<h2>${escapeHtml(h2)}</h2>` : "";
      const pHtml = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("");
      const ulHtml = ulClean.length
        ? `<ul>${ulClean.map(li => `<li>${escapeHtml(li)}</li>`).join("")}</ul>`
        : "";

      return `<div class="project-section">${h2Html}${pHtml}${ulHtml}</div>`;
    }).join("");
  }

  function btnHtml(href, text, variant, external) {
    const ext = external ? ` target="_blank" rel="noopener"` : "";
    const classes = variant === "primary" ? "btn btn-primary" : "btn";
    return `<a class="${classes}" href="${escapeAttr(href)}"${ext}>${escapeHtml(text)}</a>`;
  }

  function cleanText(v) {
    const s = (v == null) ? "" : String(v);
    return s.trim();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replaceAll("`", "&#096;");
  }
})();
