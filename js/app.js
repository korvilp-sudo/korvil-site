const APP = document.getElementById("app");
const MODAL_HOST = document.getElementById("modalHost");
const NAV = document.getElementById("nav");
const MENU_BTN = document.getElementById("menuBtn");

function setActiveNav(route) {
  document.querySelectorAll(".nav__link").forEach(a => {
    a.classList.toggle("is-active", a.dataset.go === route);
  });
}

async function loadHTML(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar ${path} (${res.status})`);
  return await res.text();
}

async function loadSection(route) {
  const map = {
    "home": "./sections/home.html",
    "sistema-k": "./sections/sistema-k.html",
    "k-tp": "./sections/k-tp.html",
    "k-afortunado": "./sections/k-afortunado.html",
    "k-alma": "./sections/k-alma.html",
    "k-store": "./sections/k-store.html",
    "checkout": "./sections/checkout.html",
  };

  const file = map[route] || map.home;

  // IMPORTANTE: substitui (não duplica)
  APP.innerHTML = `<div class="hero"><h1 class="hero__title">Carregando…</h1><p class="hero__sub">Só um instante.</p></div>`;

  try {
    const html = await loadHTML(file);
    APP.innerHTML = html;
    setActiveNav(route);

    // fechar menu no mobile após navegar
    NAV.classList.remove("is-open");
    MENU_BTN?.setAttribute("aria-expanded", "false");
  } catch (e) {
    APP.innerHTML = `
      <section class="hero">
        <h1 class="hero__title">Erro ao carregar</h1>
        <p class="hero__sub">${String(e.message || e)}</p>
        <div class="hero__ctaRow">
          <button class="btn btn--accent" data-go="home">Voltar para Home</button>
        </div>
      </section>
    `;
  }
}

async function ensureModal() {
  if (MODAL_HOST.dataset.loaded === "1") return;

  const modalHTML = await loadHTML("./components/modal-login.html");
  MODAL_HOST.innerHTML = modalHTML;
  MODAL_HOST.dataset.loaded = "1";

  const overlay = document.getElementById("loginModalOverlay");
  const closeBtn = document.getElementById("loginModalClose");

  function close() {
    overlay.classList.remove("is-open");
  }

  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", (ev) => {
    if (ev.target === overlay) close();
  });
}

async function openLoginModal(sectorName) {
  await ensureModal();
  const overlay = document.getElementById("loginModalOverlay");
  const title = document.getElementById("loginModalTitle");
  const subtitle = document.getElementById("loginModalSubtitle");

  title.textContent = `Entrar em ${sectorName}`;
  subtitle.textContent = `Login do setor: ${sectorName}. (Você pode integrar autenticação depois.)`;

  overlay.classList.add("is-open");
}

function wireEvents() {
  // menu mobile
  MENU_BTN?.addEventListener("click", () => {
    const open = NAV.classList.toggle("is-open");
    MENU_BTN.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // navegação por data-go
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go]");
    if (!el) return;
    ev.preventDefault();
    const route = el.dataset.go;
    loadSection(route);
  });

  // botões "Entrar" nos cards (delegação)
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-login]");
    if (!btn) return;
    ev.preventDefault();
    openLoginModal(btn.dataset.login);
  });

  // contato
  const contactBtn = document.getElementById("contactBtn");
  contactBtn?.addEventListener("click", (ev) => {
    ev.preventDefault();
    // troque para seu WhatsApp depois
    window.open("https://wa.me/5500000000000", "_blank");
  });
}

function boot() {
  wireEvents();
  loadSection("home");
}

boot();
