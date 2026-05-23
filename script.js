const RAW = "https://raw.githubusercontent.com/gennaro-tedesco/mysticon/master";

const ABOUT_TEXT = `
  <p class="drawer-body">Mysticon is a collection of ereader dictionaries for fantasy series. Characters, locations, trivia and much more at your fingertip, while reading your favourite series.</p>
  <ul class="drawer-list">
    <li>Download the relevant dictionary</li>
    <li>Copy it into the appropriate folder on your target device</li>
  </ul>
  <h2 class="drawer-section-title">Acknowledgments</h2>
  <p class="drawer-body">We would like to acknowledge <a class="drawer-link" href="https://www.fandom.com" target="_blank" rel="noopener">www.fandom.com</a>, especially for long series where condensed spoiler free summary have been greatly beneficial.</p>
  <p class="drawer-copyright">&copy; Gennaro Tedesco</p>
`;

// Theme toggle
if (typeof lucide !== "undefined") lucide.createIcons();

const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// Drawer (all pages)
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawer-overlay");

function makeFocusTrap(container) {
  function onKeyDown(e) {
    if (e.key !== "Tab") return;
    const focusable = Array.from(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  container.addEventListener("keydown", onKeyDown);
  return () => container.removeEventListener("keydown", onKeyDown);
}

let _drawerOpener = null;
let _releaseDrawerTrap = null;

function openDrawer() {
  _drawerOpener = document.activeElement;
  drawer.removeAttribute("aria-hidden");
  drawer.classList.add("open");
  drawerOverlay.classList.add("visible");
  document.getElementById("drawer-close").focus();
  _releaseDrawerTrap = makeFocusTrap(drawer);
}
function closeDrawer() {
  if (_releaseDrawerTrap) {
    _releaseDrawerTrap();
    _releaseDrawerTrap = null;
  }
  drawer.setAttribute("aria-hidden", "true");
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("visible");
  _drawerOpener?.focus();
}

document
  .querySelector(".drawer-content")
  ?.insertAdjacentHTML("beforeend", ABOUT_TEXT);
document.getElementById("about-btn")?.addEventListener("click", openDrawer);
document.getElementById("drawer-close")?.addEventListener("click", closeDrawer);
drawerOverlay?.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// Collections page
const grid = document.getElementById("card-grid");
if (grid) {
  const books = [
    {
      title: "The Warlord Chronicles",
      author: "Bernard Cornwell",
      lang: "EN",
      format: "Kindle",
      files: [
        {
          path: "the_warlord_chronicles/warlord_chronicles.mobi",
          name: "warlord_chronicles.mobi",
        },
      ],
      zipName: null,
    },
    {
      title: "Die Hexer Saga",
      author: "Andrzej Sapkowski",
      lang: "DE",
      format: "Kindle",
      files: [{ path: "hexer/hexer.mobi", name: "hexer.mobi" }],
      zipName: null,
    },
    {
      title: "Agatha Christie",
      author: "Agatha Christie",
      lang: "EN",
      format: "StarDict",
      files: ["Agatha.dict", "Agatha.idx", "Agatha.ifo", "Agatha.syn"].map(
        (n) => ({ path: `agatha/dict/${n}`, name: n }),
      ),
      zipName: "agatha.zip",
    },
    {
      title: "Malazan Book of the Fallen",
      author: "Steven Erikson",
      lang: "EN",
      format: "StarDict",
      files: ["malazan.dict", "malazan.idx", "malazan.ifo", "malazan.syn"].map(
        (n) => ({ path: `malazan/dict/${n}`, name: n }),
      ),
      zipName: "malazan.zip",
    },
    {
      title: "Memory, Sorrow and Thorn",
      author: "Tad Williams",
      lang: "EN",
      format: "StarDict",
      files: ["mst.dict", "mst.idx", "mst.ifo", "mst.syn"].map((n) => ({
        path: `memory_sorrow_thorn/dict/${n}`,
        name: n,
      })),
      zipName: "mst.zip",
    },
    {
      title: "Zamonien",
      author: "Walter Moers",
      lang: "DE",
      format: "StarDict",
      files: [
        "zamonien.dict",
        "zamonien.idx",
        "zamonien.ifo",
        "zamonien.syn",
      ].map((n) => ({ path: `zamonien/dict/${n}`, name: n })),
      zipName: "zamonien.zip",
    },
    {
      title: "The Silmarillion",
      author: "J.R.R. Tolkien",
      lang: "EN",
      format: "StarDict",
      files: [
        "Silmarillion.dict",
        "Silmarillion.idx",
        "Silmarillion.ifo",
        "Silmarillion.syn",
      ].map((n) => ({ path: `silmarillion/dict/${n}`, name: n })),
      zipName: "silmarillion.zip",
    },
  ];

  // Fetch a single URL, reporting byte progress via onProgress(loaded, total)
  async function fetchWithProgress(url, onProgress) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    if (!res.body) {
      const buf = await res.arrayBuffer();
      onProgress(buf.byteLength, buf.byteLength);
      return new Uint8Array(buf);
    }
    const total = parseInt(res.headers.get("Content-Length") || "0");
    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total) onProgress(loaded, total);
    }
    const out = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }

  // Trigger a blob download
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function startDownload(book, btnEl, progressEl, barEl, errorEl) {
    btnEl.classList.add("hidden");
    errorEl.classList.remove("visible");
    progressEl.classList.add("visible");
    barEl.style.width = "0%";

    let succeeded = false;
    try {
      const urls = book.files.map((f) => `${RAW}/${f.path}`);
      const names = book.files.map((f) => f.name);
      const totalFiles = urls.length;
      const fileBuffers = new Array(totalFiles);

      for (let i = 0; i < totalFiles; i++) {
        const baseProgress = (i / totalFiles) * 100;
        fileBuffers[i] = await fetchWithProgress(urls[i], (loaded, total) => {
          const fileProgress = (loaded / total) * (100 / totalFiles);
          barEl.style.width = baseProgress + fileProgress + "%";
        });
      }

      barEl.style.width = "100%";

      if (book.zipName === null) {
        triggerDownload(new Blob([fileBuffers[0]]), names[0]);
      } else {
        const zipInput = {};
        names.forEach((name, i) => {
          zipInput[name] = fileBuffers[i];
        });
        const zipped = fflate.zipSync(zipInput);
        triggerDownload(
          new Blob([zipped], { type: "application/zip" }),
          book.zipName,
        );
      }

      await new Promise((r) => setTimeout(r, 400));
      succeeded = true;
    } catch {
      errorEl.textContent = "Download failed. Please try again.";
      errorEl.classList.add("visible");
    } finally {
      btnEl.classList.remove("hidden");
      progressEl.classList.remove("visible");
      barEl.style.width = "0%";
      if (succeeded) closeModal();
    }
  }

  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let panel = null;
  let panelTitle = null;
  let panelAuthor = null;
  let panelTags = null;

  if (canHover) {
    panel = document.createElement("div");
    panel.className = "hover-panel";
    panel.innerHTML = `
      <div class="hover-panel-title"></div>
      <div class="hover-panel-author"></div>
      <div class="hover-panel-tags"></div>
    `;
    document.body.appendChild(panel);

    panelTitle = panel.querySelector(".hover-panel-title");
    panelAuthor = panel.querySelector(".hover-panel-author");
    panelTags = panel.querySelector(".hover-panel-tags");
  }

  // Modal
  const backdrop = document.getElementById("modal-backdrop");
  const modalTitle = backdrop.querySelector(".modal-title");
  const modalAuthor = backdrop.querySelector(".modal-author");
  const modalTags = backdrop.querySelector(".modal-tags");
  const modalDlBtn = document.getElementById("modal-download");
  const progressEl = document.getElementById("modal-progress");
  const barEl = document.getElementById("modal-progress-bar");
  const errorEl = document.getElementById("modal-error");

  let _modalOpener = null;
  let _releaseModalTrap = null;

  function openModal(book) {
    _modalOpener = document.activeElement;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalTags.innerHTML = `
      <span class="card-tag">${book.lang}</span>
      <span class="card-tag">${book.format}</span>
    `;
    errorEl.classList.remove("visible");
    modalDlBtn.onclick = () =>
      startDownload(book, modalDlBtn, progressEl, barEl, errorEl);
    backdrop.removeAttribute("aria-hidden");
    backdrop.classList.add("visible");
    document.getElementById("modal-close").focus();
    _releaseModalTrap = makeFocusTrap(document.getElementById("modal"));
  }

  function closeModal() {
    if (_releaseModalTrap) {
      _releaseModalTrap();
      _releaseModalTrap = null;
    }
    backdrop.classList.remove("visible");
    backdrop.setAttribute("aria-hidden", "true");
    _modalOpener?.focus();
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  books.forEach((book) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.innerHTML = `<span class="card-title">${book.title}</span>`;

    if (canHover) {
      card.addEventListener("mouseenter", () => {
        panel.classList.remove("visible");
        panel.classList.add("reset");

        panelTitle.textContent = book.title;
        panelAuthor.textContent = book.author;
        panelTags.innerHTML = `
          <span class="card-tag">${book.lang}</span>
          <span class="card-tag">${book.format}</span>
        `;

        panel.offsetHeight;

        const gridRect = grid.getBoundingClientRect();
        panel.style.top =
          gridRect.top + (gridRect.height - panel.offsetHeight) / 2 + "px";

        panel.classList.remove("reset");
        panel.classList.add("visible");
      });

      card.addEventListener("mouseleave", () =>
        panel.classList.remove("visible"),
      );
    }
    card.addEventListener("click", () => openModal(book));

    grid.appendChild(card);
  });
}
