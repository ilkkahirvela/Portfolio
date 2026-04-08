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

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-state">No projects match your search.</div>`;
    } else {
      filtered.forEach((p, i) => grid.appendChild(makeCard(p, i)));
      observeCards();
    }

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    }
  }

  function observeCards() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    grid.querySelectorAll(".card-animate").forEach(card => obs.observe(card));
  }

  function getProjectHref(p) {
    const href = (p.detailsUrl || p.link || "").trim();
    return href || "#";
  }

  function makeCard(p, index = 0) {
    const card = document.createElement("a");
    card.className = "project-card";
    card.classList.add("card-animate");
    card.style.setProperty("--card-index", index);
    if (p.featured) card.classList.add("featured");
    if (!p.image) card.classList.add("no-image");

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

    const showCta = href !== "#";

    card.innerHTML = `
      <div class="thumb" style="${img}"></div>
      ${p.featured ? `<span class="card-badge">Featured</span>` : ""}
      <div class="card-body">
        <div class="title-row">
          <h3>${escapeHtml(p.title ?? "Untitled")}</h3>
          <span class="year">${escapeHtml(String(p.year ?? ""))}</span>
        </div>
        <p class="desc">${escapeHtml(p.description ?? "")}</p>
        <div class="card-footer">
          <div class="tags">${tagsHtml}</div>
          ${showCta ? `<span class="card-cta">View Details →</span>` : ""}
        </div>
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

// Shared scroll animation
function animateScrollTo(targetY, duration = 480) {
  const start = window.scrollY;
  const distance = targetY - start;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function smoothScrollTo(target, duration = 480) {
  const targetY = target.getBoundingClientRect().top + window.scrollY - 80;
  animateScrollTo(targetY, duration);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });
});

// Page exit transition for internal navigation
document.addEventListener("click", e => {
  const link = e.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("http") ||
    href.startsWith("mailto") ||
    link.getAttribute("target") === "_blank" ||
    link.getAttribute("aria-disabled") === "true"
  ) return;
  e.preventDefault();
  document.body.classList.add("page-exit");
  setTimeout(() => { window.location.href = href; }, 130);
});

// Active nav section highlighting
(() => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("header nav a");
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`header nav a[href="#${entry.target.id}"]`);
      if (!link) return;
      link.classList.toggle("active", entry.isIntersecting);
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

// Header scroll effect
(() => {
  const header = document.querySelector("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
})();

// Back to top
(() => {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const footer = document.querySelector("footer");

  function updateBtn() {
    btn.classList.toggle("is-visible", window.scrollY > 400);

    if (footer) {
      const footerVisible = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
      btn.style.bottom = footerVisible > 0 ? `${footerVisible + 16}px` : "";
    }
  }

  window.addEventListener("scroll", updateBtn, { passive: true });

  btn.addEventListener("click", () => {
    animateScrollTo(0);
  });
})();

// Lightbox
(() => {
  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const counterEl = document.getElementById("lightboxCounter");
  const btnClose = lightbox?.querySelector(".lightbox__close");
  const btnPrev = lightbox?.querySelector(".lightbox__nav--prev");
  const btnNext = lightbox?.querySelector(".lightbox__nav--next");

  if (!lightbox || !imgEl || !btnClose || !btnPrev || !btnNext) return;

  const frame = lightbox.querySelector(".lightbox__frame");
  const galleryLinks = Array.from(document.querySelectorAll("#project-details .gallery-item"))
    .filter(a => a.getAttribute("href") && /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(a.getAttribute("href")));

  const sources = galleryLinks.map(a => a.getAttribute("href"));
  let index = -1;
  let hideTimer;

  function showControls() {
    frame.classList.add("controls-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => frame.classList.remove("controls-visible"), 2000);
  }

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = sources.length > 1 ? `${index + 1} / ${sources.length}` : "";
  }

  function setNavVisibility() {
    const hasMany = sources.length > 1;
    btnPrev.classList.toggle("is-hidden", !hasMany);
    btnNext.classList.toggle("is-hidden", !hasMany);
  }

  function setImage(i) {
    imgEl.src = sources[i];
    imgEl.alt = galleryLinks[i]?.querySelector("img")?.alt || "Gallery image";
  }

  function openAt(i) {
    if (!sources.length) return;
    const newIndex = (i + sources.length) % sources.length;

    if (lightbox.classList.contains("is-open") && newIndex !== index) {
      // Instant swap, fade new image in
      index = newIndex;
      imgEl.style.transition = "none";
      imgEl.style.opacity = "0";
      setImage(index);
      imgEl.offsetHeight; // force reflow to restart transition
      imgEl.style.transition = "";
      imgEl.style.opacity = "1";
      updateCounter();
      setNavVisibility();
    } else {
      index = newIndex;
      setImage(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lb-lock");
      updateCounter();
      setNavVisibility();
      showControls();
    }
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-lock");
    clearTimeout(hideTimer);
    frame.classList.remove("controls-visible");
    index = -1;
    // Clear src after fade-out completes
    setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        imgEl.src = "";
        imgEl.alt = "";
      }
    }, 250);
  }

  function next() { if (index !== -1) openAt(index + 1); }
  function prev() { if (index !== -1) openAt(index - 1); }

  // Open from gallery
  galleryLinks.forEach((a, i) => {
    a.addEventListener("click", e => { e.preventDefault(); openAt(i); });
  });

  // Show controls on movement inside frame, hide instantly on leave
  frame.addEventListener("mousemove", showControls, { passive: true });
  frame.addEventListener("mouseleave", () => {
    clearTimeout(hideTimer);
    frame.classList.remove("controls-visible");
  });

  // Backdrop close
  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });

  // Buttons
  btnClose.addEventListener("click", e => { e.stopPropagation(); close(); });
  btnNext.addEventListener("click", e => { e.stopPropagation(); next(); });
  btnPrev.addEventListener("click", e => { e.stopPropagation(); prev(); });

  // Keyboard
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Swipe support
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }, { passive: true });
})();
