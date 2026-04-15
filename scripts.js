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

  // featured first, then non-WIP before WIP, then newest, then manual order
  const allProjects = [...PROJECTS].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    const aw = a.wip ? 1 : 0;
    const bw = b.wip ? 1 : 0;
    if (aw !== bw) return aw - bw;
    const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0);
    if (yearDiff !== 0) return yearDiff;
    return (a.order ?? 0) - (b.order ?? 0);
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

    const metaParts = [
      buildTeamIndicator(p.team ?? null),
      buildDurationIndicator(p.duration ?? null),
      p.year != null ? `<span class="year">${escapeHtml(String(p.year))}</span>` : "",
    ].filter(Boolean);
    const titleRightHtml = metaParts.join('<span class="meta-sep">·</span>');

    card.innerHTML = `
      <div class="thumb-wrap"><div class="thumb" style="${img}"></div></div>
      ${p.featured ? `<span class="card-badge">Featured</span>` : ""}
      ${p.wip ? `<span class="card-badge card-badge--wip">WIP</span>` : ""}
      <div class="card-body">
        <div class="title-row">
          <h3>${escapeHtml(p.title ?? "Untitled")}</h3>
          <div class="title-row-right">${titleRightHtml}</div>
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

// Hero canvas — wireframe terrain
(() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = document.getElementById('about');

  const isMobile = window.innerWidth < 640;
  const COLS = isMobile ? 16 : 26;
  const ROWS = isMobile ? 8 : 13;
  const AMP  = 28;  // wave height in px
  const COS  = Math.cos(Math.PI / 6);
  const SIN  = Math.sin(Math.PI / 6);

  let w, h, maxWy, xScale, t = 0;
  let visible = true;
  let bumps = new Float32Array(COLS * ROWS);
  let mouse = { x: null, y: null };

  function resize() {
    w     = canvas.width  = section.offsetWidth;
    h     = canvas.height = section.offsetHeight;
    maxWy  = h * 0.65;
    xScale = (maxWy * COS / w + 1) * 1.12;
  }

  function getZ(c, r) {
    const nx = c / (COLS - 1);
    const ny = r / (ROWS - 1);
    return (
      Math.sin(nx * Math.PI * 2.8 + t) * 0.5 +
      Math.sin(ny * Math.PI * 2.2 + t * 0.7) * 0.35 +
      Math.sin((nx + ny) * Math.PI * 2 + t * 1.1) * 0.15
    ) * AMP + bumps[r * COLS + c];
  }

  function project(c, r) {
    const z  = getZ(c, r);
    const wy = (r / (ROWS - 1)) * maxWy;
    const wx = (c / (COLS - 1) - 0.5) * w * xScale;
    return [
      wx + wy * COS - (maxWy * COS) / 2 + w * 0.5,
      -z * 0.45 + wy * SIN + h * 0.55,
    ];
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Decay bumps
    for (let i = 0; i < bumps.length; i++) bumps[i] *= 0.92;

    // Add mouse bump
    if (mouse.x !== null) {
      const mc = (mouse.x / w) * (COLS - 1);
      const mr = (mouse.y / h) * (ROWS - 1);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const d = Math.sqrt((c - mc) ** 2 + (r - mr) ** 2);
          if (d < 4) bumps[r * COLS + c] += (1 - d / 4) * 2;
        }
      }
    }

    // Precompute projected points
    const pts = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => project(c, r))
    );

    // Base pass — all edges, low opacity (1 draw call)
    ctx.beginPath();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (c < COLS - 1) {
          ctx.moveTo(...pts[r][c]);
          ctx.lineTo(...pts[r][c + 1]);
        }
        if (r < ROWS - 1) {
          ctx.moveTo(...pts[r][c]);
          ctx.lineTo(...pts[r + 1][c]);
        }
      }
    }
    ctx.strokeStyle = 'rgba(95,157,231,0.10)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Highlight pass — elevated edges only (1 draw call)
    ctx.beginPath();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const z = getZ(c, r);
        if (z < AMP * 0.35) continue;
        if (c < COLS - 1 && getZ(c + 1, r) > AMP * 0.35) {
          ctx.moveTo(...pts[r][c]);
          ctx.lineTo(...pts[r][c + 1]);
        }
        if (r < ROWS - 1 && getZ(c, r + 1) > AMP * 0.35) {
          ctx.moveTo(...pts[r][c]);
          ctx.lineTo(...pts[r + 1][c]);
        }
      }
    }
    ctx.strokeStyle = 'rgba(95,157,231,0.22)';
    ctx.stroke();

    t += 0.009;
    if (visible) requestAnimationFrame(animate);
  }

  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  section.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
  window.addEventListener('resize', () => { resize(); bumps.fill(0); });

  new IntersectionObserver(entries => {
    const wasVisible = visible;
    visible = entries[0].isIntersecting;
    if (visible && !wasVisible) animate();
  }, { threshold: 0 }).observe(section);

  resize();
  animate();
})();

// Text scramble
function scrambleText(el) {
  if (!el || !el.textContent.trim()) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';

  // Cancel any in-progress scramble (e.g. bfcache resume with stale interval)
  if (el._scrambleId) {
    clearInterval(el._scrambleId);
    el._scrambleId = null;
  }
  // Preserve the true original on first run; reuse it on subsequent calls
  // so a mid-scramble textContent is never mistaken for the real text.
  if (!el._scrambleOriginal) {
    el._scrambleOriginal = el.textContent;
  }
  const original = el._scrambleOriginal;
  el.textContent = original; // reset before restarting

  const duration = 900;
  const frameMs = 33;
  const totalFrames = Math.round(duration / frameMs);
  let frame = 0;

  const id = setInterval(() => {
    let out = '';
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ') { out += ' '; continue; }
      const lockAt = Math.floor((i / original.length) * totalFrames * 0.75);
      out += frame >= lockAt
        ? original[i]
        : chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = out;
    if (++frame > totalFrames) {
      el.textContent = original;
      clearInterval(id);
      el._scrambleId = null;
    }
  }, frameMs);

  el._scrambleId = id;
}

scrambleText(document.querySelector('#about h1'));
scrambleText(document.querySelector('#pTitle'));

// Card 3D tilt on hover
(() => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const MAX_TILT = 1.5;
  const PERSPECTIVE = 1000;

  grid.addEventListener('mousemove', e => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    if (!card.dataset.tiltReady) {
      card.style.opacity = '1';
      card.style.animation = 'none';
      card.dataset.tiltReady = '1';
    }

    const rect = card.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    card.style.transition = 'transform 0.08s ease';
    card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateY(-4px)`;
    card.style.boxShadow = `${dx * 6}px ${dy * 6}px 18px rgba(247,140,140,0.12), 0 20px 48px rgba(0,0,0,0.5)`;
  });

  grid.addEventListener('mouseout', e => {
    const card = e.target.closest('.project-card');
    if (!card || card.contains(e.relatedTarget)) return;

    card.style.transition = 'transform 0.45s ease, box-shadow 0.45s ease';
    card.style.transform = '';
    card.style.boxShadow = '';

    card.addEventListener('transitionend', () => {
      card.style.transition = '';
      card.style.transform = '';
    }, { once: true });
  });
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
window.addEventListener("pageshow", e => {
  document.body.classList.remove("page-exit");
  if (e.persisted) {
    // bfcache restore: CSS animations have already played — force-restart them
    const animated = document.querySelectorAll(
      "#about, #projects, #tech-exp, #contact," +
      "#project-details .back-link, #project-details .project-header," +
      "#project-details .project-section, #project-details .project-rail"
    );
    animated.forEach(el => {
      el.style.animation = "none";
      el.offsetHeight; // force reflow so the reset takes effect
      el.style.animation = "";
    });

    // Re-run title scramble animations
    scrambleText(document.querySelector("#about h1"));
    scrambleText(document.querySelector("#pTitle"));
  }
});

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

// Dot grid parallax
(() => {
  const SPEED = 0.05; // background moves at 5% of scroll speed
  window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty(
      '--parallax-y',
      (window.scrollY * SPEED).toFixed(1) + 'px'
    );
  }, { passive: true });
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

// Email popover
(() => {
  const wrap = document.querySelector(".email-wrap");
  if (!wrap) return;

  const trigger = wrap.querySelector(".email-trigger");
  const copyBtn = document.getElementById("emailCopyBtn");
  const EMAIL = "hirvela.ilkka@gmail.com";

  // On touch devices (no hover), tap trigger to open, tap outside to close
  if (window.matchMedia("(pointer: coarse)").matches) {
    trigger?.addEventListener("click", e => {
      e.stopPropagation();
      const opening = !wrap.classList.contains("is-open");
      wrap.classList.toggle("is-open", opening);
      trigger.setAttribute("aria-expanded", String(opening));
    });
    document.addEventListener("click", () => {
      wrap.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
    });
  }

  // Copy to clipboard
  const originalCopyHtml = copyBtn?.innerHTML;
  let copyResetTimer;
  copyBtn?.addEventListener("click", e => {
    e.stopPropagation();
    navigator.clipboard.writeText(EMAIL).then(() => {
      clearTimeout(copyResetTimer);
      copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      copyResetTimer = setTimeout(() => { copyBtn.innerHTML = originalCopyHtml; }, 2000);
    });
  });
})();
