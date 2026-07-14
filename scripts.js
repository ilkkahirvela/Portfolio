const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  let searchInput = document.getElementById("projectSearch");
  const tagFiltersEl = document.getElementById("tagFilters");
  let resultsCountEl = document.getElementById("resultsCount");

  // Search and result count add little value with only a handful of projects
  if (PROJECTS.length < 6) {
    searchInput?.remove();
    resultsCountEl?.remove();
    searchInput = null;
    resultsCountEl = null;
  }

  const allProjects = sortedProjects(PROJECTS);

  // stable WORLD numbering — follows the sorted order, unaffected by filtering
  allProjects.forEach((p, i) => { p._world = i; });

  // tags from data
  const tagSet = new Set();
  allProjects.forEach(p => (p.tags || []).forEach(t => tagSet.add(String(t))));
  const tags = ["All", ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];

  let activeTag = "All";
  let searchTerm = "";

  // declared before the initial render() below — render() reads crtEntrance
  let offTimer = 0;
  let crtEntrance = false;

  // custom strip scrollbar + hint — fade out together when there's nothing to
  // browse (declared before the initial render(), which calls updateStripChrome)
  const stripBar = document.getElementById("stripScrollbar");
  const stripThumb = document.getElementById("stripThumb");
  const stripHint = document.querySelector(".strip-hint");

  function updateStripChrome() {
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const scrollable = maxScroll > 4;
    stripBar?.classList.toggle("hidden", !scrollable);
    stripHint?.classList.toggle("hidden", !scrollable);
    if (!scrollable || !stripThumb) return;
    const thumbPct = Math.max((grid.clientWidth / grid.scrollWidth) * 100, 8);
    stripThumb.style.width = thumbPct + "%";
    stripThumb.style.marginLeft = ((grid.scrollLeft / maxScroll) * (100 - thumbPct)) + "%";
  }

  grid.addEventListener("scroll", updateStripChrome, { passive: true });
  window.addEventListener("resize", updateStripChrome);

  // the bar scrolls the strip: drag the thumb, or press anywhere on the track
  // (the thumb centers on the cursor) and keep dragging from there
  let barGrab = null; // cursor offset within the thumb while dragging
  function barScrollTo(e) {
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const track = stripBar.getBoundingClientRect();
    const thumbW = stripThumb.getBoundingClientRect().width;
    const range = track.width - thumbW;
    if (maxScroll <= 0 || range <= 0) return;
    const frac = (e.clientX - track.left - barGrab) / range;
    grid.scrollLeft = Math.max(0, Math.min(1, frac)) * maxScroll;
  }
  stripBar?.addEventListener("pointerdown", (e) => {
    if (grid.scrollWidth - grid.clientWidth <= 0) return;
    e.preventDefault();
    stripBar.setPointerCapture(e.pointerId);
    const thumb = stripThumb.getBoundingClientRect();
    barGrab = (e.clientX >= thumb.left && e.clientX <= thumb.right)
      ? e.clientX - thumb.left
      : thumb.width / 2;
    grid.style.scrollSnapType = "none"; // don't fight the pointer mid-drag
    barScrollTo(e);
  });
  stripBar?.addEventListener("pointermove", (e) => {
    if (barGrab !== null) barScrollTo(e);
  });
  const endBarDrag = () => {
    if (barGrab === null) return;
    barGrab = null;
    grid.style.scrollSnapType = "";
  };
  stripBar?.addEventListener("pointerup", endBarDrag);
  stripBar?.addEventListener("pointercancel", endBarDrag);

  renderFilterChips();
  render();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = (e.target.value || "").trim().toLowerCase();
      rerender();
    });
  }

  // LEVEL SCOUT — inspect three different levels (hover or keyboard focus)
  const scouted = new Set();
  function scout(e) {
    const card = e.target.closest?.(".level-card");
    if (!card) return;
    scouted.add(card.href);
    if (scouted.size >= 3) window.HUD?.achieve?.("scout", "LEVEL SCOUT — browsed the worlds", 150);
  }
  grid.addEventListener("mouseover", scout);
  grid.addEventListener("focusin", scout);

  // Arrow keys browse the level strip once focus is inside it; Home/End jump to
  // the ends; Enter opens (native anchor behavior). Focus must already be on a
  // card — Tab into the strip (a single tab stop, see roving tabindex below).
  const STRIP_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"];
  grid.addEventListener("keydown", (e) => {
    if (!STRIP_KEYS.includes(e.key)) return;
    const cards = Array.from(grid.querySelectorAll(".level-card"));
    if (!cards.length) return;
    const cur = cards.indexOf(document.activeElement);
    if (cur === -1) return;
    let next = cur;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = cards.length - 1;
    else next = Math.min(Math.max(cur + (e.key === "ArrowRight" ? 1 : -1), 0), cards.length - 1);
    if (next === cur) return;
    e.preventDefault();
    // Move the roving tabindex so the strip keeps exactly one tab stop.
    cards[cur].tabIndex = -1;
    cards[next].tabIndex = 0;
    cards[next].focus({ preventScroll: true });
    cards[next].scrollIntoView({
      behavior: REDUCED_MOTION ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  });

  // Mouse drag-to-scroll (touch scrolls natively); suppresses the click after a drag
  let dragStartX = null, dragStartLeft = 0, dragMoved = false;
  grid.addEventListener("mousedown", (e) => {
    dragStartX = e.pageX;
    dragStartLeft = grid.scrollLeft;
    dragMoved = false;
  });
  window.addEventListener("mousemove", (e) => {
    if (dragStartX === null) return;
    const dx = e.pageX - dragStartX;
    if (Math.abs(dx) > 4) {
      dragMoved = true;
      grid.scrollLeft = dragStartLeft - dx;
    }
  });
  window.addEventListener("mouseup", () => { dragStartX = null; });
  grid.addEventListener("click", (e) => {
    if (dragMoved) {
      e.preventDefault();
      dragMoved = false;
    }
  }, true);

  function renderFilterChips() {
    if (!tagFiltersEl) return;

    tagFiltersEl.innerHTML = "";
    tags.forEach(tag => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip" + (tag === activeTag ? " active" : "");
      chip.textContent = tag;

      chip.addEventListener("click", () => {
        if (tag === activeTag) return; // no-op re-click; don't replay the switch
        activeTag = tag;
        if (tag !== "All") window.HUD?.achieve?.("curator", "CURATOR — filtered the archive", 50);
        renderFilterChips();
        rerender();
      });

      tagFiltersEl.appendChild(chip);
    });
  }

  // CRT channel switch on filter/search changes: power the current cards off
  // to a scanline, then render the new set with a power-on entrance. The
  // crt-in class lives on the cards themselves and is never removed — removing
  // it (or any animation-name swap) would restart the entrance animation.
  function rerender() {
    if (REDUCED_MOTION) { render(); return; }
    grid.classList.add("strip-off");
    // If an off→on cycle is already scheduled, let it fire — render() reads the
    // live activeTag/searchTerm, so it renders the latest selection. Restarting
    // the timer on every click would keep the strip dark for as long as you keep
    // filtering, which is what made rapid switching feel clunky.
    if (offTimer) return;
    offTimer = setTimeout(() => {
      offTimer = 0;
      grid.classList.remove("strip-off");
      crtEntrance = true;
      render();
      crtEntrance = false;
    }, 170);
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
      filtered.forEach((p, i) => {
        const card = makeCard(p, i);
        if (crtEntrance) card.classList.add("crt-in");
        grid.appendChild(card);
      });
      observeCards();
    }

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    }

    updateStripChrome();
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
    card.className = "project-card level-card card-animate";
    card.style.setProperty("--card-index", index);
    // Roving tabindex: the strip is a single tab stop; arrows move within it.
    card.tabIndex = index === 0 ? 0 : -1;
    if (p.featured) card.classList.add("featured");

    const href = getProjectHref(p);
    card.href = href;

    if (href === "#") {
      card.addEventListener("click", (e) => e.preventDefault());
      card.setAttribute("aria-disabled", "true");
    }

    const img = p.image ? `background-image:url('${p.image}')` : "";
    const world = String((p._world ?? index) + 1).padStart(2, "0");
    const yearHtml = p.year != null ? ` · ${escapeHtml(String(p.year))}` : "";

    const stamps = [
      p.featured ? `<span class="stamp stamp-feat">Featured</span>` : "",
      p.wip
        ? `<span class="stamp stamp-dev">In Dev</span>`
        : `<span class="stamp stamp-clear">Clear!</span>`,
    ].filter(Boolean).join("");

    const tagsHtml = Array.isArray(p.tags)
      ? p.tags.map(t => escapeHtml(String(t))).join(" · ")
      : "";

    const metaParts = [
      buildTeamIndicator(p.team ?? null),
      buildDurationIndicator(p.duration ?? null),
    ].filter(Boolean);
    const indicatorsHtml = metaParts.join('<span class="meta-sep">·</span>');

    card.innerHTML = `
      <div class="level-art"><div class="level-art-img${p.image ? "" : " no-image"}" style="${img}"></div></div>
      <div class="level-meta">
        <div class="level-topline">
          <span class="level-num">World ${world}${yearHtml}</span>
          <span class="level-stamps">${stamps}</span>
        </div>
        <h3 class="level-title">${escapeHtml(p.title ?? "Untitled")}</h3>
        <p class="level-desc">${escapeHtml(p.description ?? "")}</p>
        <div class="level-foot">
          <span class="level-indicators">${indicatorsHtml}</span>
          <span class="level-tags">${tagsHtml}</span>
        </div>
        ${href !== "#" ? `<span class="level-enter">▸ Enter Level</span>` : ""}
      </div>
    `;

    // Motion preview — swap art to the gameplay loop on hover (lazy-loads once)
    if (p.preview) {
      const art = card.querySelector(".level-art-img");
      card.addEventListener("mouseenter", () => {
        art.style.backgroundImage = `url('${p.preview}')`;
      });
      card.addEventListener("mouseleave", () => {
        art.style.backgroundImage = p.image ? `url('${p.image}')` : "";
      });
    }

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

// Hero canvas — drifting starfield
(() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = document.getElementById('about');

  let W, H;
  let visible = true;

  function resize() {
    W = canvas.width = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    s: 0.5 + Math.random() * 1.3,
    v: 0.02 + Math.random() * 0.09,
    ph: Math.random() * Math.PI * 2,
  }));

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const st of stars) {
      const a = 0.25 + 0.55 * Math.abs(Math.sin(t * 0.0006 + st.ph));
      ctx.fillStyle = `rgba(255,200,140,${a.toFixed(2)})`;
      ctx.fillRect(st.x * W, st.y * H, st.s, st.s);
    }
  }

  function loop(t) {
    if (visible) {
      for (const st of stars) {
        st.y += st.v / 1000;
        if (st.y > 1) { st.y = 0; st.x = Math.random(); }
      }
      draw(t);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0 }).observe(section);

  resize();
  if (REDUCED_MOTION) draw(0);
  else requestAnimationFrame(loop);
})();

// Text scramble
function scrambleText(el) {
  if (REDUCED_MOTION) return;
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

function scrambleHero() {
  scrambleText(document.querySelector('#about h1'));
}

scrambleHero();
scrambleText(document.querySelector('#pTitle'));

// Card 3D tilt on hover
(() => {
  if (REDUCED_MOTION || window.matchMedia('(pointer: coarse)').matches) return;
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
    card.style.boxShadow = `${dx * 6}px ${dy * 6}px 18px rgba(255,180,84,0.10), 0 20px 48px rgba(0,0,0,0.5)`;
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
  if (REDUCED_MOTION) {
    window.scrollTo(0, targetY);
    return;
  }
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
  // bfcache restore can resurrect a mid-navigation loading wipe
  document.querySelectorAll(".load-wipe").forEach(el => el.remove());
  if (e.persisted) {
    // bfcache restore: CSS animations have already played — force-restart them
    const animated = document.querySelectorAll(
      "#about, #projects, #tech-exp, #contact," +
      "#project-details .back-link, #project-details .project-header," +
      "#project-details .project-section, #project-details .project-rail"
    );
    animated.forEach(el => {
      const anims = el.getAnimations();
      if (anims.length) {
        anims.forEach(a => { a.cancel(); a.play(); });
      } else {
        // Fallback for browsers where getAnimations() omits finished animations
        el.style.animation = "none";
        void el.offsetHeight;
        el.style.animation = "";
      }
    });

    // Re-run title scramble animations
    scrambleHero();
    scrambleText(document.querySelector("#pTitle"));
  }
});

document.addEventListener("click", e => {
  if (REDUCED_MOTION) return; // navigate natively, no exit transition
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

  // NOW LOADING wipe with a destination label; falls back to the old fade
  if (window.HUD?.loading) {
    let label = "";
    const card = link.closest(".level-card");
    if (card) {
      const world = card.querySelector(".level-num")?.textContent.split("·")[0].trim() || "";
      const title = card.querySelector(".level-title")?.textContent.trim() || "";
      label = [world, title].filter(Boolean).join(" · ");
    } else if (/index\.html|^\.?\/?$/.test(href.split("#")[0])) {
      label = "Level Select";
    }
    window.HUD.loading(label, () => { window.location.href = href; });
  } else {
    document.body.classList.add("page-exit");
    setTimeout(() => { window.location.href = href; }, 130);
  }
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

// Header scroll effect — on home the title screen owns the top, so the
// header stays hidden until the visitor scrolls past most of the hero
(() => {
  const header = document.querySelector("header");
  if (!header) return;
  const isHome = !!document.getElementById("about");

  function update() {
    header.classList.toggle("scrolled", window.scrollY > 10);
    if (isHome) {
      header.classList.toggle("header-hidden", window.scrollY < window.innerHeight * 0.45);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Back to top
(() => {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  // On the home page the projects strip is full-bleed, so hold the button back
  // until that section has scrolled off the top — otherwise it sits over the
  // cards. Project pages have no strip, so fall back to a simple scroll offset.
  const projects = document.getElementById("projects");

  function updateBtn() {
    const show = projects
      ? projects.getBoundingClientRect().bottom <= 0
      : window.scrollY > 400;
    btn.classList.toggle("is-visible", show);
  }

  window.addEventListener("scroll", updateBtn, { passive: true });
  window.addEventListener("resize", updateBtn, { passive: true });
  updateBtn();

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

  const galleryLinks = Array.from(document.querySelectorAll("#project-details .gallery-item"))
    .filter(a => a.getAttribute("href") && /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(a.getAttribute("href")));

  const sources = galleryLinks.map(a => a.getAttribute("href"));
  let index = -1;
  let hideTimer;

  function showControls() {
    lightbox.classList.add("controls-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => lightbox.classList.remove("controls-visible"), 2000);
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
      window.HUD?.achieve?.("intel", "INTEL GATHERED — opened the gallery", 50);
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
    lightbox.classList.remove("controls-visible");
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

  // Show controls on movement anywhere in the overlay, hide instantly on leave
  lightbox.addEventListener("mousemove", showControls, { passive: true });
  lightbox.addEventListener("mouseleave", () => {
    clearTimeout(hideTimer);
    lightbox.classList.remove("controls-visible");
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
      window.HUD?.achieve?.("contact", "CONTACT ACQUIRED", 200);
      clearTimeout(copyResetTimer);
      copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      copyResetTimer = setTimeout(() => { copyBtn.innerHTML = originalCopyHtml; }, 1200);
    });
  });
})();

// Space to start — title screen affordance (only while at the top)
(() => {
  const projects = document.getElementById("projects");
  if (!projects) return;
  window.addEventListener("keydown", e => {
    if (e.key !== " " || window.scrollY > 60) return;
    if (e.target.closest?.("input, textarea, select, button, a")) return;
    e.preventDefault();
    smoothScrollTo(projects);
  });
})();

// Stat sheet — cells fill when the card scrolls into view
(() => {
  const card = document.getElementById("statCard");
  if (!card) return;
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      card.classList.add("go");
      obs.disconnect();
    }
  }, { threshold: 0.25 }).observe(card);
})();

// Continue screen countdown — loops 9→0 while visible
(() => {
  const el = document.getElementById("continueCount");
  if (!el || REDUCED_MOTION) return;
  let n = 9;
  let visible = false;
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.3 }).observe(el);
  setInterval(() => {
    if (!visible) return;
    n = n > 0 ? n - 1 : 9;
    el.textContent = n;
    // retrigger the tick pop (countTick in CSS)
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }, 900);
})();

// Footer email — click copies address, href keeps mailto for right-click
(() => {
  const link = document.querySelector("a.footer-email");
  if (!link) return;

  const toast = link.querySelector(".footer-email__toast");

  // Visually hidden live region — announces the copy to screen readers,
  // since the toast itself is aria-hidden decoration
  const announcer = document.createElement("span");
  announcer.setAttribute("role", "status");
  announcer.style.cssText =
    "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;";
  link.after(announcer);

  link.addEventListener("click", e => {
    e.preventDefault();
    navigator.clipboard.writeText("hirvela.ilkka@gmail.com").then(() => {
      announcer.textContent = "";
      announcer.textContent = "Email address copied to clipboard";
      if (!toast) return;
      toast.classList.remove("rise");
      void toast.offsetWidth; // reflow so the animation restarts on rapid clicks
      toast.classList.add("rise");
    }).catch(() => {
      // Clipboard unavailable (insecure context, permissions) — fall back to mailto
      window.location.href = link.href;
    });
  });
})();
