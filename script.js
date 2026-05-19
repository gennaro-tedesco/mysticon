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

function openDrawer() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("visible");
}
function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("visible");
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
      files: ["Malazan.dict", "Malazan.idx", "Malazan.ifo", "Malazan.syn"].map(
        (n) => ({ path: `malazan/dict/${n}`, name: n }),
      ),
      zipName: "malazan.zip",
    },
    {
      title: "Memory, Sorrow and Thorn",
      author: "Tad Williams",
      lang: "EN",
      format: "StarDict",
      files: [
        "Memory_Sorrow_Thorn.dict",
        "Memory_Sorrow_Thorn.idx",
        "Memory_Sorrow_Thorn.ifo",
        "Memory_Sorrow_Thorn.syn",
      ].map((n) => ({ path: `memory_sorrow_thorn/dict/${n}`, name: n })),
      zipName: "memory_sorrow_thorn.zip",
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

  async function startDownload(book, btnEl, progressEl, barEl) {
    btnEl.classList.add("hidden");
    progressEl.classList.add("visible");
    barEl.style.width = "0%";

    const urls = book.files.map((f) => `${RAW}/${f.path}`);
    const names = book.files.map((f) => f.name);
    const totalFiles = urls.length;
    const fileBuffers = new Array(totalFiles);

    // Fetch all files, spreading progress evenly across files
    for (let i = 0; i < totalFiles; i++) {
      const baseProgress = (i / totalFiles) * 100;
      fileBuffers[i] = await fetchWithProgress(urls[i], (loaded, total) => {
        const fileProgress = (loaded / total) * (100 / totalFiles);
        barEl.style.width = baseProgress + fileProgress + "%";
      });
    }

    barEl.style.width = "100%";

    // Single file: download directly; multiple files: zip with fflate
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

    // Brief pause so the full bar is visible, then close
    setTimeout(() => {
      closeModal();
      btnEl.classList.remove("hidden");
      progressEl.classList.remove("visible");
      barEl.style.width = "0%";
    }, 400);
  }

  // Hover panel
  const panel = document.createElement("div");
  panel.className = "hover-panel";
  panel.innerHTML = `
    <div class="hover-panel-title"></div>
    <div class="hover-panel-author"></div>
    <div class="hover-panel-tags"></div>
  `;
  document.body.appendChild(panel);

  const panelTitle = panel.querySelector(".hover-panel-title");
  const panelAuthor = panel.querySelector(".hover-panel-author");
  const panelTags = panel.querySelector(".hover-panel-tags");

  // Modal
  const backdrop = document.getElementById("modal-backdrop");
  const modalTitle = backdrop.querySelector(".modal-title");
  const modalAuthor = backdrop.querySelector(".modal-author");
  const modalTags = backdrop.querySelector(".modal-tags");
  const modalDlBtn = document.getElementById("modal-download");
  const progressEl = document.getElementById("modal-progress");
  const barEl = document.getElementById("modal-progress-bar");

  function openModal(book) {
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalTags.innerHTML = `
      <span class="card-tag">${book.lang}</span>
      <span class="card-tag">${book.format}</span>
    `;
    modalDlBtn.onclick = () =>
      startDownload(book, modalDlBtn, progressEl, barEl);
    backdrop.classList.add("visible");
  }

  function closeModal() {
    backdrop.classList.remove("visible");
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span class="card-title">${book.title}</span>`;

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
    card.addEventListener("click", () => openModal(book));

    grid.appendChild(card);
  });
}
