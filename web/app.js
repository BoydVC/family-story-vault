(function () {
  const DATA = window.__STORIES__ || { stories: [], family: {}, prompts: [] };
  const STORE = "family-story-vault-notes-v1";
  let tagFilter = "all";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function fmtDate(d) {
    if (!d) return "—";
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function showView(name) {
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    $$(".tab").forEach((t) => {
      const on = t.dataset.view === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function go() {
    const h = (location.hash || "#stories").replace(/^#/, "");
    const view = ["stories", "timeline", "tree", "tell", "about"].includes(h) ? h : "stories";
    showView(view);
  }

  function allTags() {
    const set = new Set(["all", "EXAMPLE"]);
    (DATA.stories || []).forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return [...set];
  }

  function renderTags() {
    $("#tagRow").innerHTML = allTags().map((t) =>
      `<button type="button" class="chip${t === tagFilter ? " active" : ""}" data-tag="${esc(t)}">${esc(t)}</button>`
    ).join("");
  }

  function renderStories() {
    let list = DATA.stories || [];
    if (tagFilter !== "all") {
      list = list.filter((s) => (s.tags || []).includes(tagFilter) || s.label === tagFilter);
    }
    $("#storyCount").textContent = `${(DATA.stories || []).length} stories`;
    $("#storyGrid").innerHTML = list.map((s) => `
      <button type="button" class="story-card" data-id="${esc(s.id)}">
        <div class="story-meta">
          <span class="mini-tag ex">${esc(s.label || "EXAMPLE")}</span>
          <span>${esc(fmtDate(s.date))}</span>
        </div>
        <h3>${esc(s.title)}</h3>
        <p class="body">${esc(s.body)}</p>
        <div class="story-meta">Told by <strong>${esc(s.told_by)}</strong>
          ${s.told_to && s.told_to.length ? " · for " + esc(s.told_to.join(" & ")) : ""}</div>
        <div class="story-tags">${(s.tags || []).filter(t => t !== "EXAMPLE").map(t =>
          `<span class="mini-tag">${esc(t)}</span>`).join("")}</div>
        <div class="media-row">
          <span class="media-chip">📷 stub</span>
          <span class="media-chip">🎙 stub</span>
        </div>
      </button>
    `).join("") || '<p class="lede">No stories for this tag.</p>';
  }

  function openStory(id) {
    const s = (DATA.stories || []).find((x) => x.id === id);
    if (!s) return;
    $("#modalLabel").textContent = s.label || "EXAMPLE";
    $("#modalTitle").textContent = s.title;
    $("#modalMeta").textContent = `${fmtDate(s.date)} · told by ${s.told_by}` +
      (s.told_to ? ` · for ${s.told_to.join(" & ")}` : "");
    $("#modalBody").textContent = s.body;
    $("#storyModal").showModal();
  }

  function renderTimeline() {
    const events = [
      { date: "2006-06-19", title: "Boyd & Miranda married", detail: "June 19, 2006" },
      { date: "2013-02-12", title: "Charlotte (Char) born", detail: "February 12, 2013" },
      { date: "2015-06-23", title: "Victor (Vic) born", detail: "June 23, 2015" },
    ];
    (DATA.stories || []).forEach((s) => {
      events.push({
        date: s.date,
        title: s.title,
        detail: `${s.label} · told by ${s.told_by}`,
        storyId: s.id,
      });
    });
    events.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    $("#timeline").innerHTML = events.map((e) => `
      <li ${e.storyId ? `data-id="${esc(e.storyId)}" style="cursor:pointer"` : ""}>
        <div class="when">${esc(fmtDate(e.date))}</div>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.detail)}</p>
      </li>
    `).join("");
  }

  function renderTree() {
    const f = DATA.family || {};
    const gps = f.grandparents || [];
    const parents = f.parents || [];
    const kids = f.kids || [];
    $("#tree").innerHTML = `
      <div class="tree-label">Grandparents</div>
      <div class="tree-row">
        ${gps.map((g) => `
          <div class="tree-node gp">
            <strong>${esc(g.name)}</strong>
            <span>${esc(g.nick || "")}${g.side ? " · " + esc(g.side) : ""}</span>
          </div>`).join("")}
      </div>
      <div class="tree-connector"></div>
      <div class="tree-label">Parents · married ${esc((f.marriage && f.marriage.date) || "2006-06-19")}</div>
      <div class="tree-row">
        ${parents.map((p) => `
          <div class="tree-node">
            <strong>${esc(p.nick || p.name)}</strong>
            <span>${esc(p.name)}</span>
          </div>`).join("")}
      </div>
      <div class="tree-connector"></div>
      <div class="tree-label">Kids (only Char &amp; Vic)</div>
      <div class="tree-row">
        ${kids.map((k) => `
          <div class="tree-node kids">
            <strong>${esc(k.nick)}</strong>
            <span>${esc(k.name)} · born ${esc(fmtDate(k.born))}</span>
          </div>`).join("")}
      </div>
      <p class="hint" style="text-align:center;margin-top:.5rem">${esc(DATA.home || "Millersville MD")}</p>
    `;
  }

  function renderPrompts() {
    const prompts = DATA.prompts || [];
    $("#promptGrid").innerHTML = prompts.map((p) =>
      `<button type="button" class="prompt-btn" data-prompt="${esc(p)}">${esc(p)}</button>`
    ).join("");
  }

  function loadNote() {
    try {
      const raw = localStorage.getItem(STORE);
      $("#vaultNote").value = raw ? JSON.parse(raw).text || "" : "";
    } catch {
      $("#vaultNote").value = "";
    }
  }

  function saveNote() {
    const text = $("#vaultNote").value;
    localStorage.setItem(STORE, JSON.stringify({ text, savedAt: new Date().toISOString() }));
    $("#noteHint").textContent = "Saved on this device.";
    setTimeout(() => { $("#noteHint").textContent = ""; }, 2000);
  }

  // events
  $$(".tab").forEach((t) => t.addEventListener("click", () => { location.hash = t.dataset.view; }));
  $("#tagRow").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tag]");
    if (!b) return;
    tagFilter = b.dataset.tag;
    renderTags();
    renderStories();
  });
  $("#storyGrid").addEventListener("click", (e) => {
    const c = e.target.closest("[data-id]");
    if (c) openStory(c.dataset.id);
  });
  $("#timeline").addEventListener("click", (e) => {
    const li = e.target.closest("[data-id]");
    if (li) openStory(li.dataset.id);
  });
  $("#promptGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-prompt]");
    if (!b) return;
    const ta = $("#vaultNote");
    const prefix = b.dataset.prompt + "\n\n";
    if (!ta.value.startsWith(prefix)) ta.value = prefix + ta.value;
    ta.focus();
    location.hash = "tell";
  });
  $("#btnSaveNote").addEventListener("click", saveNote);
  $("#btnClearNote").addEventListener("click", () => {
    $("#vaultNote").value = "";
    localStorage.removeItem(STORE);
    $("#noteHint").textContent = "Cleared.";
  });

  window.addEventListener("hashchange", go);
  renderTags();
  renderStories();
  renderTimeline();
  renderTree();
  renderPrompts();
  loadNote();
  $("#footInfo").textContent = DATA.subtitle || "";
  go();
})();
