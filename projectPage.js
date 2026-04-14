(() => {
  // Only run on the details template
  const detailsRoot = document.getElementById("project-details");
  if (!detailsRoot) return;

  if (typeof PROJECTS === "undefined" || !Array.isArray(PROJECTS)) {
    console.warn("PROJECTS array missing. Did you load projects.js before projectPage.js?");
    return;
  }

  const BTN_ICONS = {
    "btn-itch":    `<svg class="btn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="4.5" width="13" height="9" rx="3.5"/><line x1="5.5" y1="9" x2="7.5" y2="9"/><line x1="6.5" y1="8" x2="6.5" y2="10"/><circle cx="10.5" cy="8.5" r="0.7" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="0.7" fill="currentColor" stroke="none"/></svg>`,
    "btn-trailer": `<svg class="btn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><polygon points="6.5,5.5 11.5,8 6.5,10.5" fill="currentColor" stroke="none"/></svg>`,
    "btn-github":  `<svg class="btn-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
    "btn-docs":    `<svg class="btn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.5z"/><polyline points="9.5 2 9.5 5.5 13 5.5"/><line x1="5.5" y1="8.5" x2="10.5" y2="8.5"/><line x1="5.5" y1="11" x2="8.5" y2="11"/></svg>`,
  };

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

  // Lead text: prefer content.summary, fallback to description
  const lead = cleanText(project.content?.summary) || cleanText(project.description) || "";
  if (elLead) elLead.textContent = lead;

  // Tags
  if (elTags) {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    elTags.innerHTML = tags.map(t => `<span class="tag">${escapeHtml(String(t))}</span>`).join("");
  }

  // Meta row: team · duration · year
  if (elTitleRight) {
    const metaParts = [
      buildTeamIndicator(project.team ?? null),
      buildDurationIndicator(project.duration ?? null),
      project.year != null ? `<span class="year">${escapeHtml(String(project.year))}</span>` : "",
    ].filter(Boolean);
    elTitleRight.innerHTML = metaParts.join('<span class="meta-sep">·</span>');
  }

  // Links
if (elLinks) {
  const linksObj = project.content?.links || project.links || {};
  const linksHtml = [];

  if (linksObj.itch)
    linksHtml.push(btnHtml(linksObj.itch, "Play on Itch.io →", "btn-itch", true));

  if (linksObj.demo)
    linksHtml.push(btnHtml(linksObj.demo, "Live Demo →", "btn-itch", true));

  if (linksObj.trailer)
    linksHtml.push(btnHtml(linksObj.trailer, "Watch Trailer →", "btn-trailer", true));

  if (linksObj.github)
    linksHtml.push(btnHtml(linksObj.github, "View on GitHub →", "btn-github", true));

  if (linksObj.docs)
    linksHtml.push(btnHtml(linksObj.docs, "Documentation →", "btn-docs", true));

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

  function btnHtml(href, text, typeClass, external) {
    const ext = external ? ` target="_blank" rel="noopener"` : "";
    const icon = BTN_ICONS[typeClass] ?? "";
    return `<a class="btn ${typeClass}" href="${escapeAttr(href)}"${ext}>${icon}${escapeHtml(text)}</a>`;
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
