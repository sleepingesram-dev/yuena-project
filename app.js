(() => {
  const cfg = window.SITE_CONFIG || {};
  const path = location.pathname.split("/").pop() || "index.html";
  const nav = [
    ["index.html", "Home"],
    ["ev.html", "E.V."],
    ["japan.html", "Japan"],
    ["motorcycle.html", "Motorcycle"],
    ["base.html", "E.V. Base"],
    ["updates.html", "Updates"],
    ["support.html", "Support"]
  ];

  const pageTitles = {
    "index.html": "E.V. / Projects & Roadmap",
    "ev.html": "E.V. / Personal AI",
    "japan.html": "Road to Japan",
    "motorcycle.html": "Motorcycle Project",
    "base.html": "E.V. Base Japan",
    "updates.html": "Project Updates",
    "support.html": "Support the Build"
  };

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <div class="nav-shell">
        <a class="brand page-brand" href="index.html" aria-label="E.V. home">
          <span class="page-brand-title">${pageTitles[path] || "E.V. / Projects"}</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">MENU</button>
        <nav class="nav-links" aria-label="Primary navigation">
          ${nav.map(([href,label]) => `<a href="${href}" ${path===href ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
      </div>`;
    const toggle = header.querySelector(".nav-toggle");
    const links = header.querySelector(".nav-links");
    toggle?.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <span class="eyebrow">E.V. / PROJECTS</span>
          <p>One connected roadmap: personal AI, Japan, motorcycles, and a future live/work base.</p>
        </div>
        <div class="footer-links">
          <a href="ev.html">E.V.</a>
          <a href="japan.html">Road to Japan</a>
          <a href="support.html">Support</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Esram</span>
        <span>Built in public. Progress documented.</span>
      </div>`;
  }

  document.querySelectorAll("[data-link]").forEach(el => {
    const key = el.dataset.link;
    const url = cfg.links?.[key];
    if (url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      el.removeAttribute("href");
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      el.title = "Not connected yet";
      if (!el.dataset.pendingLabelApplied) {
        el.textContent = el.textContent + " · coming soon";
        el.dataset.pendingLabelApplied = "true";
      }
    }
  });

  document.querySelectorAll("[data-fund]").forEach(el => {
    const key = el.dataset.fund;
    const fund = cfg.funding?.[key];
    if (!fund) return;
    const pct = fund.target ? Math.min(100, Math.round((fund.raised / fund.target) * 100)) : 0;
    el.querySelector("[data-fund-label]")?.replaceChildren(fund.label);
    el.querySelector("[data-fund-value]")?.replaceChildren(`$${fund.raised.toLocaleString()} / $${fund.target.toLocaleString()}`);
    const bar = el.querySelector("[data-fund-bar]");
    if (bar) bar.style.width = `${pct}%`;
    el.querySelector("[data-fund-pct]")?.replaceChildren(`${pct}%`);
  });

  const focus = document.querySelector("[data-current-focus]");
  if (focus) focus.textContent = cfg.status?.focus || "E.V. development";
  const updated = document.querySelector("[data-updated]");
  if (updated) updated.textContent = cfg.status?.updated || "";

  const updateFeed = document.querySelector("[data-update-feed]");
  if (updateFeed && Array.isArray(window.PROJECT_UPDATES)) {
    updateFeed.innerHTML = window.PROJECT_UPDATES.map(item =>
      '<article class="timeline-card ' + (item.status === "complete" ? "complete" : "") + ' reveal">' +
      '<h3>' + item.title + '</h3>' +
      '<p>' + item.summary + '</p>' +
      '<small>' + item.project + ' / ' + item.status + ' / ' + item.date + '</small>' +
      '</article>'
    ).join("");
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
})();