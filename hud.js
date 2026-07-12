// ============================
// Game chrome layer
// Boot sequence, HUD bar, scanlines, achievement toasts.
// Exposes window.HUD = { toast, addScore, achieve } for later patches.
// ============================
(() => {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isHome = !!document.getElementById("about");

  // ---- inject chrome DOM ----
  document.body.classList.add("has-chrome");

  const scanlines = document.createElement("div");
  scanlines.className = "crt-scanlines";
  scanlines.setAttribute("aria-hidden", "true");

  const bar = document.createElement("div");
  bar.className = "hud-bar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = `
    <span class="hud-section"></span>
    <div class="hud-xp"><i></i></div>
    <span class="hud-pct">0%</span>
    <span class="hud-score">SCORE <b>000000</b></span>`;

  const toasts = document.createElement("div");
  toasts.className = "hud-toasts";
  toasts.setAttribute("aria-hidden", "true");

  document.body.append(scanlines, bar, toasts);

  // ---- score + toasts (persisted across visits) ----
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("ih-hud")) || null; }
    catch { return null; }
  })();
  let score = Number(stored?.score) || 0;
  const unlocked = new Set(Array.isArray(stored?.unlocked) ? stored.unlocked : []);

  function save() {
    try { localStorage.setItem("ih-hud", JSON.stringify({ score, unlocked: [...unlocked] })); }
    catch { /* storage unavailable — session-only score */ }
  }

  const scoreEl = bar.querySelector(".hud-score b");
  scoreEl.textContent = String(score).padStart(6, "0");

  function addScore(n) {
    const from = score;
    score += n;
    save();
    if (REDUCED) {
      scoreEl.textContent = String(score).padStart(6, "0");
      return;
    }
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 400, 1);
      scoreEl.textContent = String(Math.round(from + (score - from) * p)).padStart(6, "0");
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function toast(name, pts = 0) {
    const el = document.createElement("div");
    el.className = "hud-toast";
    const label = document.createElement("b");
    label.textContent = "★ achievement unlocked";
    const text = document.createElement("span");
    text.textContent = pts ? `${name} · +${pts}` : name;
    el.append(label, text);
    toasts.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
    setTimeout(() => el.classList.remove("show"), 2900);
    setTimeout(() => el.remove(), 3400);
    if (pts) addScore(pts);
  }

  function achieve(key, name, pts = 0) {
    if (unlocked.has(key)) return;
    unlocked.add(key);
    save();
    toast(name, pts);
  }

  // NOW LOADING wipe for internal navigation (caller navigates in the callback)
  function loading(label, done) {
    if (REDUCED) { done(); return; }
    const wipe = document.createElement("div");
    wipe.className = "load-wipe";
    wipe.setAttribute("aria-hidden", "true");
    const inner = document.createElement("div");
    inner.className = "load-inner";
    const lbl = document.createElement("div");
    lbl.className = "load-label";
    lbl.textContent = "Now Loading";
    const target = document.createElement("div");
    target.className = "load-target";
    target.textContent = label || "";
    const barWrap = document.createElement("div");
    barWrap.className = "load-bar";
    barWrap.appendChild(document.createElement("i"));
    inner.append(lbl, target, barWrap);
    wipe.appendChild(inner);
    document.body.appendChild(wipe);
    requestAnimationFrame(() => requestAnimationFrame(() => wipe.classList.add("in")));
    setTimeout(done, 380);
  }

  window.HUD = { toast, addScore, achieve, loading };

  // ---- scroll progress + scroll achievements ----
  const xpFill = bar.querySelector(".hud-xp i");
  const pctEl = bar.querySelector(".hud-pct");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    xpFill.style.width = (p * 100) + "%";
    pctEl.textContent = Math.round(p * 100) + "%";
    if (isHome) {
      if (window.scrollY > window.innerHeight * 0.5) achieve("left-title", "LEFT THE TITLE SCREEN", 50);
      if (p > 0.985) achieve("credits", "CREDITS ROLL", 100);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- section tracking: label + one-shot banners ----
  // The active section is picked deterministically from scroll position: the
  // last section whose top has crossed a reference line near the top of the
  // viewport. This replaces IntersectionObserver, whose "last intersecting entry
  // wins" behaviour was screen-height dependent — on a tall monitor, landing on
  // #projects (a short section) left the taller #tech-exp past its threshold too,
  // so STAT SHEET overwrote LEVEL SELECT. A single scroll-driven choice is
  // consistent on every screen size.
  const LABELS = {
    "about": "TITLE SCREEN",
    "projects": "LEVEL SELECT",
    "tech-exp": "STAT SHEET",
    "contact": "CONTINUE?",
    "project-details": "LEVEL BRIEFING",
  };
  const sectionEl = bar.querySelector(".hud-section");
  const sections = Array.from(document.querySelectorAll("section[id]")).filter(s => LABELS[s.id]);

  if (sections.length) {
    // Banner sweep (home only) — reused by the tracker below.
    let showBanner = () => {};
    if (isHome && !REDUCED) {
      const bannerEl = document.createElement("div");
      bannerEl.className = "hud-banner";
      bannerEl.setAttribute("aria-hidden", "true");
      document.body.appendChild(bannerEl);

      let bannerTimer;
      showBanner = (text) => {
        clearTimeout(bannerTimer);
        bannerEl.textContent = text;
        bannerEl.classList.remove("show");
        void bannerEl.offsetWidth; // restart the sweep
        bannerEl.classList.add("show");
        bannerTimer = setTimeout(() => bannerEl.classList.remove("show"), 1200);
      };
    }

    let activeId = null;
    const bannered = new Set();

    function updateSection() {
      // Reference line in the upper portion of the viewport. Capped well below
      // the shortest real section height so that after an #anchor jump (which
      // pins a section's top near the viewport top) the line still lands inside
      // that section — keeping the choice consistent on tall screens. Sitting
      // lower than the header also lets trailing sections reach it with less
      // scroll, so each one still activates on tall monitors.
      const line = Math.min(window.innerHeight * 0.4, 440);
      let active = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) active = s;
      }
      // The last section can be too short to ever reach the line on tall
      // screens (you run out of scroll first) — pin it once at the page bottom.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom) active = sections[sections.length - 1];
      if (!active || active.id === activeId) return;
      activeId = active.id;
      sectionEl.textContent = LABELS[active.id];
      // Banner the section once per visit; the title screen never banners.
      if (active.id !== "about" && !bannered.has(active.id)) {
        bannered.add(active.id);
        showBanner(LABELS[active.id]);
      }
    }

    window.addEventListener("scroll", updateSection, { passive: true });
    window.addEventListener("resize", updateSection, { passive: true });
    window.addEventListener("hashchange", updateSection);
    window.addEventListener("pageshow", updateSection);
    // Run now and again after the browser applies any #hash scroll on load.
    updateSection();
    requestAnimationFrame(updateSection);
    window.addEventListener("load", () => requestAnimationFrame(updateSection));
  }

  // ---- konami code ----
  {
    const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
                 "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    window.addEventListener("keydown", (e) => {
      pos = (e.key === SEQ[pos]) ? pos + 1 : (e.key === SEQ[0] ? 1 : 0);
      if (pos !== SEQ.length) return;
      pos = 0;
      achieve("konami", "OLD SCHOOL — code accepted", 500);
      if (!REDUCED) {
        document.body.classList.add("crt-flash");
        setTimeout(() => document.body.classList.remove("crt-flash"), 700);
      }
    });
  }

  // ---- boot sequence (once per session, skipped under reduced motion) ----
  if (REDUCED || sessionStorage.getItem("ih-booted")) return;
  sessionStorage.setItem("ih-booted", "1");

  const projCount = (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS)) ? PROJECTS.length : "?";
  const boot = document.createElement("div");
  boot.id = "chromeBoot";
  boot.setAttribute("aria-hidden", "true");
  boot.innerHTML = `
    <div class="boot-inner">
      <pre class="boot-log"></pre>
      <div class="boot-bar"><i class="boot-fill"></i></div>
      <div class="boot-skip">click or press any key to skip</div>
    </div>`;
  document.body.appendChild(boot);

  const log = boot.querySelector(".boot-log");
  const fill = boot.querySelector(".boot-fill");
  const lines = [
    "> IH-OS v1.0 — portfolio kernel",
    `> mounting /projects .......... ${projCount} found`,
    "> loading pixel shaders ....... OK",
    "> waking recruiter interface .. OK",
    "> INSERT PLAYER",
  ];

  let bootDone = false;
  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    boot.classList.add("done");
    setTimeout(() => boot.remove(), 600);
    window.removeEventListener("keydown", finishBoot);
  }

  lines.forEach((line, i) => setTimeout(() => {
    if (bootDone) return;
    log.textContent += line + "\n";
    fill.style.width = ((i + 1) / lines.length * 100) + "%";
    if (i === lines.length - 1) setTimeout(finishBoot, 500);
  }, 200 + i * 240));

  window.addEventListener("keydown", finishBoot);
  boot.addEventListener("click", finishBoot);
})();
