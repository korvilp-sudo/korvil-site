/* =========================================================
   KORVIL — js/app.js (COMPLETO)
   Router + Modal + CTAs WhatsApp + K-Store (vitrine, carrinho, frete CEP, checkout)
   ========================================================= */

console.log("✅ app.js carregou");
window.addEventListener("error", (e) => console.log("❌ ERRO JS:", e.message));

const APP = document.getElementById("app");
const MODAL_HOST = document.getElementById("modalHost");
const NAV = document.getElementById("nav");
const MENU_BTN = document.getElementById("menuBtn");

const WHATSAPP_NUMBER = "5513997690898";

/* -----------------------------
   Helpers
------------------------------ */
function openWhatsApp(message) {
  const text = encodeURIComponent(message || "");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${text}` : ""}`, "_blank");
}

function setActiveNav(route) {
  document.querySelectorAll(".nav__link").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.go === route);
  });
}

async function loadHTML(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar ${path} (${res.status})`);
  return await res.text();
}

/* -----------------------------
   Router / Seções
------------------------------ */
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

  if (APP) {
    APP.innerHTML = `<div class="hero"><h1 class="hero__title">Carregando…</h1><p class="hero__sub">Só um instante.</p></div>`;
  }

  try {
    const html = await loadHTML(file);
    if (APP) APP.innerHTML = html;

    setActiveNav(route);

    // ✅ hooks pós-carregamento (K-Store/Checkout)
    kstoreOnSectionLoaded();

    NAV?.classList.remove("is-open");
    MENU_BTN?.setAttribute("aria-expanded", "false");
  } catch (e) {
    console.log("❌ loadSection erro:", e);
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
  }
}

/* -----------------------------
   Modal Login (opcional)
------------------------------ */
async function ensureModal() {
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
  if (subtitle) subtitle.textContent = `Login do setor: ${sectorName}. (Integração real depois.)`;

  overlay?.classList.add("is-open");
}

/* =========================================================
   K-STORE (MVP completo)
========================================================= */
const KSTORE = {
  cartKey: "korvil_kstore_cart_v1",
  shipKey: "korvil_kstore_shipping_v1",
  products: [
    { id: "whey-k", name: "Whey K-Performance 900g", price: 129.9, category: "Suplementos", img: "./assets/images/capa-korvil.jpg", desc: "Proteína para performance e recuperação.", stock: 23 },
    { id: "creatina-k", name: "Creatina K-Core 300g", price: 89.9, category: "Suplementos", img: "./assets/images/capa-korvil.jpg", desc: "Força e explosão.", stock: 41 },
    { id: "camiseta-k", name: "Camiseta KORVIL — Preta", price: 79.9, category: "Roupas", img: "./assets/images/capa-korvil.jpg", desc: "Estilo KORVIL.", stock: 18 },
    { id: "luva-k", name: "Luva Treino K-Grip", price: 59.9, category: "Acessórios", img: "./assets/images/capa-korvil.jpg", desc: "Pegada firme e proteção.", stock: 33 },
    { id: "garrafa-k", name: "Garrafa K-Hydra 1L", price: 49.9, category: "Acessórios", img: "./assets/images/capa-korvil.jpg", desc: "Hidratação no modo K.", stock: 52 },
    { id: "ebook-k", name: "E-book: Protocolo Off Season (K-TP)", price: 39.9, category: "Digitais", img: "./assets/images/capa-korvil.jpg", desc: "Guia base.", stock: 9999 },
  ],
};

function brl(v) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function safeParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function getCart() {
  return safeParse(localStorage.getItem(KSTORE.cartKey) || "[]", []);
}
function setCart(cart) {
  localStorage.setItem(KSTORE.cartKey, JSON.stringify(cart));
  updateCartCount();
}
function getShipping() {
  return safeParse(localStorage.getItem(KSTORE.shipKey) || "null", null);
}
function setShipping(ship) {
  localStorage.setItem(KSTORE.shipKey, JSON.stringify(ship));
}

function cartCount() {
  return getCart().reduce((s, it) => s + (it.qty || 0), 0);
}
function updateCartCount() {
  const el = document.getElementById("kstoreCartCount");
  if (el) el.textContent = String(cartCount());
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  setCart(cart);
}
function removeFromCart(id) {
  setCart(getCart().filter((i) => i.id !== id));
}
function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  setCart(cart);
}

function totals() {
  const cart = getCart();
  let subtotal = 0;
  for (const it of cart) {
    const p = KSTORE.products.find((x) => x.id === it.id);
    if (p) subtotal += p.price * it.qty;
  }
  const shipping = getShipping()?.value ?? 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

// Frete simulado por região de CEP
function calcShippingByCep(cepRaw) {
  const cep = String(cepRaw || "").replace(/\D/g, "");
  if (cep.length !== 8) return { ok: false, msg: "CEP inválido. Use 8 dígitos." };

  const prefix = parseInt(cep.slice(0, 2), 10);
  let value = 29.9,
    days = "5–10 dias";

  if (prefix >= 1 && prefix <= 19) {
    value = 14.9;
    days = "2–4 dias";
  } else if (prefix >= 20 && prefix <= 28) {
    value = 19.9;
    days = "3–6 dias";
  } else if (prefix >= 30 && prefix <= 39) {
    value = 18.9;
    days = "3–6 dias";
  } else if (prefix >= 40 && prefix <= 49) {
    value = 24.9;
    days = "4–8 dias";
  } else if (prefix >= 50 && prefix <= 59) {
    value = 26.9;
    days = "4–9 dias";
  } else if (prefix >= 60 && prefix <= 69) {
    value = 29.9;
    days = "5–10 dias";
  } else if (prefix >= 70 && prefix <= 79) {
    value = 27.9;
    days = "4–9 dias";
  } else if (prefix >= 80 && prefix <= 89) {
    value = 22.9;
    days = "3–7 dias";
  } else if (prefix >= 90 && prefix <= 99) {
    value = 23.9;
    days = "3–7 dias";
  }

  return { ok: true, cep, value, days };
}

function calcShippingFromUI() {
  const cepEl = document.getElementById("kstoreCep");
  const resEl = document.getElementById("kstoreShippingResult");
  if (!cepEl || !resEl) return;

  const out = calcShippingByCep(cepEl.value);
  if (!out.ok) {
    resEl.textContent = out.msg;
    return;
  }

  setShipping({ cep: out.cep, value: out.value, days: out.days });
  resEl.textContent = `Frete: ${brl(out.value)} • Prazo: ${out.days}`;
  renderCart();
}

/* -------- Render Loja -------- */
function renderStoreIfOnPage() {
  const grid = document.getElementById("kstoreProducts");
  if (!grid) return;

  const cat = document.getElementById("kstoreCategory");
  const search = document.getElementById("kstoreSearch");
  const sort = document.getElementById("kstoreSort");
  if (!cat || !search || !sort) return;

  const cats = ["all", ...Array.from(new Set(KSTORE.products.map((p) => p.category)))];
  cat.innerHTML = cats.map((c) => `<option value="${c}">${c === "all" ? "Todas" : c}</option>`).join("");

  function filtered() {
    const q = (search.value || "").trim().toLowerCase();
    const c = cat.value;

    let list = KSTORE.products.slice();
    if (c !== "all") list = list.filter((p) => p.category === c);
    if (q) list = list.filter((p) => (p.name + " " + p.desc).toLowerCase().includes(q));

    if (sort.value === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sort.value === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sort.value === "nameAsc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function draw() {
    const list = filtered();
    grid.innerHTML = list
      .map(
        (p) => `
        <article class="card" style="grid-column: span 6;">
          <div style="display:flex; gap:12px; align-items:center;">
            <img src="${p.img}" alt="${p.name}" class="k-cartThumb" style="width:72px;height:72px;border-radius:16px;" />
            <div style="flex:1; min-width:160px;">
              <h3 class="card__title" style="margin:0;">${p.name}</h3>
              <div class="muted">${p.category} • Estoque: ${p.stock}</div>
              <div class="k-price">${brl(p.price)}</div>
            </div>
          </div>
          <div class="card__row" style="margin-top:12px;">
            <span class="tag">K-Store</span>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn" data-kstore-view="${p.id}">Ver</button>
              <button class="btn btn--accent" data-kstore-add="${p.id}">Adicionar</button>
            </div>
          </div>
        </article>
      `
      )
      .join("");

    updateCartCount();
  }

  ["input", "change"].forEach((evt) => {
    search.addEventListener(evt, draw);
    cat.addEventListener(evt, draw);
    sort.addEventListener(evt, draw);
  });

  draw();
}

/* -------- Modal Produto -------- */
function openProductModal(id) {
  const p = KSTORE.products.find((x) => x.id === id);
  if (!p) return;

  const overlay = document.getElementById("kstoreProductOverlay");
  if (!overlay) return;

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");

  document.getElementById("kstoreProductTitle")?.replaceChildren(document.createTextNode(p.name));
  document.getElementById("kstoreProductDesc")?.replaceChildren(document.createTextNode(p.desc));

  const img = document.getElementById("kstoreProductImg");
  if (img) img.src = p.img;

  document.getElementById("kstoreProductPrice")?.replaceChildren(document.createTextNode(brl(p.price)));
  document.getElementById("kstoreProductMeta")?.replaceChildren(
    document.createTextNode(`${p.category} • Estoque: ${p.stock}`)
  );

  const addBtn = document.getElementById("kstoreAddToCartBtn");
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(p.id, 1);
      renderCart();
      openCart();
    };
  }
}

function closeProductModal() {
  const overlay = document.getElementById("kstoreProductOverlay");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

/* -------- Carrinho Drawer -------- */
function openCart() {
  const overlay = document.getElementById("kstoreCartOverlay");
  if (!overlay) return;
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  renderCart();
}

function closeCart() {
  const overlay = document.getElementById("kstoreCartOverlay");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

function renderCart() {
  const host = document.getElementById("kstoreCartItems");
  if (!host) return;

  const cart = getCart();

  if (cart.length === 0) {
    host.innerHTML = `<p class="muted">Seu carrinho está vazio.</p>`;
  } else {
    host.innerHTML = cart
      .map((it) => {
        const p = KSTORE.products.find((x) => x.id === it.id);
        if (!p) return "";
        return `
          <div class="k-cartItem">
            <img class="k-cartThumb" src="${p.img}" alt="${p.name}" />
            <div class="k-cartMain">
              <p class="k-cartTitle">${p.name}</p>
              <div class="k-cartMeta">${brl(p.price)} • ${p.category}</div>
            </div>
            <div class="k-cartActions">
              <div class="k-qty">
                <button data-kstore-dec="${p.id}">−</button>
                <strong>${it.qty}</strong>
                <button data-kstore-inc="${p.id}">+</button>
              </div>
              <button class="btn" data-kstore-remove="${p.id}">Remover</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const { subtotal, shipping, total } = totals();
  document.getElementById("kstoreSubtotal")?.replaceChildren(document.createTextNode(brl(subtotal)));
  document.getElementById("kstoreShipping")?.replaceChildren(document.createTextNode(brl(shipping)));

  const totalEl = document.getElementById("kstoreTotal");
  if (totalEl) totalEl.innerHTML = `<strong>${brl(total)}</strong>`;

  const ship = getShipping();
  const cepEl = document.getElementById("kstoreCep");
  const resEl = document.getElementById("kstoreShippingResult");
  if (cepEl && ship?.cep) cepEl.value = ship.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  if (resEl && ship?.days) resEl.textContent = `Frete: ${brl(ship.value)} • Prazo: ${ship.days}`;

  updateCartCount();
}

/* -------- Checkout -------- */
function renderCheckoutIfOnPage() {
  const ckItems = document.getElementById("ckItems");
  if (!ckItems) return;

  const cart = getCart();
  if (cart.length === 0) {
    ckItems.innerHTML = `<p class="muted">Seu carrinho está vazio. Volte para a loja.</p>`;
  } else {
    ckItems.innerHTML = cart
      .map((it) => {
        const p = KSTORE.products.find((x) => x.id === it.id);
        if (!p) return "";
        return `<div class="muted">• ${it.qty}x ${p.name} — ${brl(p.price * it.qty)}</div>`;
      })
      .join("");
  }

  const { subtotal, shipping, total } = totals();
  document.getElementById("ckSubtotal")?.replaceChildren(document.createTextNode(brl(subtotal)));
  document.getElementById("ckShipping")?.replaceChildren(document.createTextNode(brl(shipping)));

  const totalEl = document.getElementById("ckTotal");
  if (totalEl) totalEl.innerHTML = `<strong>${brl(total)}</strong>`;

  // Toggle pagamento (PIX / Cartão)
  const pixBox = document.getElementById("pixBox");
  const cardBox = document.getElementById("cardBox");

  document.querySelectorAll('input[name="pay"]').forEach((r) => {
    r.addEventListener("change", () => {
      const v = document.querySelector('input[name="pay"]:checked')?.value;
      if (pixBox) pixBox.style.display = v === "pix" ? "block" : "none";
      if (cardBox) cardBox.style.display = v === "card" ? "block" : "none";
    });
  });

  document.getElementById("copyPixBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("korvil@kstore");
      alert("Chave PIX copiada!");
    } catch {
      alert("Não consegui copiar. Copie manualmente: korvil@kstore");
    }
  });

  document.getElementById("finishBtn")?.addEventListener("click", () => {
    const name = document.getElementById("ckName")?.value?.trim() || "(sem nome)";
    const phone = document.getElementById("ckPhone")?.value?.trim() || "(sem whatsapp)";
    const cep = document.getElementById("ckCep")?.value?.trim() || "(sem cep)";
    const city = document.getElementById("ckCity")?.value?.trim() || "(sem cidade)";
    const addr = document.getElementById("ckAddr")?.value?.trim() || "(sem endereço)";
    const comp = document.getElementById("ckComp")?.value?.trim() || "";
    const pay = document.querySelector('input[name="pay"]:checked')?.value || "pix";

    const { subtotal, shipping, total } = totals();

    const lines = [];
    lines.push("🛒 *Pedido K-Store (KORVIL)*");
    lines.push(`Nome: ${name}`);
    lines.push(`WhatsApp: ${phone}`);
    lines.push(`Endereço: ${addr}${comp ? " - " + comp : ""}`);
    lines.push(`Cidade/UF: ${city}`);
    lines.push(`CEP: ${cep}`);
    lines.push("");
    lines.push("*Itens:*");
    for (const it of getCart()) {
      const p = KSTORE.products.find((x) => x.id === it.id);
      if (!p) continue;
      lines.push(`- ${it.qty}x ${p.name} (${brl(p.price * it.qty)})`);
    }
    lines.push("");
    lines.push(`Subtotal: ${brl(subtotal)}`);
    lines.push(`Frete: ${brl(shipping)} (${getShipping()?.days || "—"})`);
    lines.push(`*Total: ${brl(total)}*`);
    lines.push("");
    lines.push(`Pagamento: ${pay === "pix" ? "PIX" : "Cartão (simulado)"}`);
    lines.push("Confirmar pedido ✅");

    openWhatsApp(lines.join("\n"));
  });
}

/* -------- Hooks pós-carregamento -------- */
function kstoreOnSectionLoaded() {
  updateCartCount();
  renderStoreIfOnPage();
  renderCheckoutIfOnPage();
}

/* -------- Eventos globais da loja (delegação) -------- */
function kstoreWireGlobalEvents() {
  // Abrir carrinho
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-kstore-open-cart]");
    if (!btn) return;
    ev.preventDefault();
    openCart();
  });

  // Ver / Adicionar
  document.addEventListener("click", (ev) => {
    const view = ev.target.closest("[data-kstore-view]");
    const add = ev.target.closest("[data-kstore-add]");
    if (view) {
      ev.preventDefault();
      openProductModal(view.dataset.kstoreView);
      return;
    }
    if (add) {
      ev.preventDefault();
      addToCart(add.dataset.kstoreAdd, 1);
      renderCart();
      openCart();
    }
  });

  // + / - / remover
  document.addEventListener("click", (ev) => {
    const inc = ev.target.closest("[data-kstore-inc]");
    const dec = ev.target.closest("[data-kstore-dec]");
    const rem = ev.target.closest("[data-kstore-remove]");
    if (!inc && !dec && !rem) return;

    ev.preventDefault();
    const cart = getCart();

    if (inc) {
      const id = inc.dataset.kstoreInc;
      const it = cart.find((x) => x.id === id);
      if (it) setQty(id, it.qty + 1);
      renderCart();
      return;
    }

    if (dec) {
      const id = dec.dataset.kstoreDec;
      const it = cart.find((x) => x.id === id);
      if (it) setQty(id, it.qty - 1);
      renderCart();
      return;
    }

    if (rem) {
      removeFromCart(rem.dataset.kstoreRemove);
      renderCart();
    }
  });

  // Clicar fora fecha overlay
  document.addEventListener("click", (ev) => {
    if (ev.target?.id === "kstoreProductOverlay") closeProductModal();
    if (ev.target?.id === "kstoreCartOverlay") closeCart();
  });

  // Botões diretos
  document.addEventListener("click", (ev) => {
    const closeProd = ev.target.closest("#kstoreCloseProductBtn");
    if (closeProd) {
      ev.preventDefault();
      closeProductModal();
    }

    const closeCartBtn = ev.target.closest("#kstoreCloseCartBtn");
    if (closeCartBtn) {
      ev.preventDefault();
      closeCart();
    }

    const calcShipBtn = ev.target.closest("#kstoreCalcShippingBtn");
    if (calcShipBtn) {
      ev.preventDefault();
      calcShippingFromUI();
    }

    const clearBtn = ev.target.closest("#kstoreClearCartBtn");
    if (clearBtn) {
      ev.preventDefault();
      setCart([]);
      localStorage.removeItem(KSTORE.shipKey);
      renderCart();
    }
  });
}
