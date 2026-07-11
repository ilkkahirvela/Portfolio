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

  // ---- score + toasts ----
  let score = 0;
  const scoreEl = bar.querySelector(".hud-score b");

  function addScore(n) {
    const from = score;
    score += n;
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

  const unlocked = new Set();
  function achieve(key, name, pts = 0) {
    if (unlocked.has(key)) return;
    unlocked.add(key);
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

  // ---- section label ----
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
    sectionEl.textContent = LABELS[sections[0].id];
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) sectionEl.textContent = LABELS[e.target.id];
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach(s => io.observe(s));
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
