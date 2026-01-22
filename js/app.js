// ✅ Segurança/Debug: não deixa o site morrer em silêncio
console.log("✅ app.js carregou");
window.addEventListener("error", (e) => console.log("❌ ERRO JS:", e.message));

const APP = document.getElementById("app");
const MODAL_HOST = document.getElementById("modalHost");
const NAV = document.getElementById("nav");
const MENU_BTN = document.getElementById("menuBtn");

// ✅ WhatsApp padrão do projeto (Brasil: 55 + DDD + número)
const WHATSAPP_NUMBER = "5513997690898";

function setActiveNav(route) {
  document.querySelectorAll(".nav__link").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.go === route);
  });
}

function openWhatsApp(message) {
  const text = encodeURIComponent(message || "");
  const url = `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${text}` : ""}`;
  window.open(url, "_blank");
}

async function loadHTML(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar ${path} (${res.status})`);
  return await res.text();
}
async function loadSection(route) {
  const map = {
    home: "./sections/home.html",
    "sistema-k": "./sections/sistema-k.html",
    "k-tp": "./sections/k-tp.html",
    "k-afortunado": "./sections/k-afortunado.html",
    "k-alma": "./sections/k-alma.html",
    "k-store": "./sections/k-store.html",
    checkout: "./sections/checkout.html",
  };

  const file = map[route] || map.home;

  // ✅ Se APP não existir, não quebra
  if (APP) {
    APP.innerHTML = `<div class="hero"><h1 class="hero__title">Carregando…</h1><p class="hero__sub">Só um instante.</p></div>`;
  }

  try {
    const html = await loadHTML(file);

    if (APP) APP.innerHTML = html;
    setActiveNav(route);

    // ✅ fechar menu no mobile após navegar (sem quebrar)
    NAV?.classList.remove("is-open");
    MENU_BTN?.setAttribute("aria-expanded", "false");
  } catch (e) {
    if (APP) {
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
    console.log("❌ loadSection erro:", e);
  }
}
async function ensureModal() {
  // ✅ se modalHost não existir, não quebra
  if (!MODAL_HOST) return;
  if (MODAL_HOST.dataset.loaded === "1") return;

  const modalHTML = await loadHTML("./components/modal-login.html");
  MODAL_HOST.innerHTML = modalHTML;
  MODAL_HOST.dataset.loaded = "1";

  const overlay = document.getElementById("loginModalOverlay");
  const closeBtn = document.getElementById("loginModalClose");

  function close() {
    overlay?.classList.remove("is-open");
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

  if (title) title.textContent = `Entrar em ${sectorName}`;
  if (subtitle) subtitle.textContent = `Login do setor: ${sectorName}. (Você pode integrar autenticação depois.)`;

  overlay?.classList.add("is-open");
}

function wireEvents() {
  // ✅ menu mobile (sem quebrar se NAV não existir)
  MENU_BTN?.addEventListener("click", () => {
    const open = NAV?.classList.toggle("is-open");
    MENU_BTN?.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // navegação por data-go
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go]");
    if (!el) return;
    ev.preventDefault();
    loadSection(el.dataset.go);
  });

  // botões "Entrar" nos cards (delegação)
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-login]");
    if (!btn) return;
    ev.preventDefault();
    openLoginModal(btn.dataset.login);
  });

  // CTA WhatsApp
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-cta]");
    if (!btn) return;
    ev.preventDefault();

    if (btn.dataset.cta === "ktp-whatsapp") {
      openWhatsApp("Quero entrar no K-TP Projeto Transformação");
    }
  });

  // contato (rodapé)
  const contactBtn = document.getElementById("contactBtn");
  contactBtn?.addEventListener("click", (ev) => {
    ev.preventDefault();
    openWhatsApp("Olá! Quero falar com o Sistema K / KORVIL.");
  });
}

function boot() {
  wireEvents();

  // ✅ garante carregar Home quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => loadSection("home"));
  } else {
    loadSection("home");
  }
}

boot();
