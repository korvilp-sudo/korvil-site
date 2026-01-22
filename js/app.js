// =========================
// Navegação entre páginas
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const links = document.querySelectorAll(".nav__link");

  async function loadSection(section) {
    try {
      const res = await fetch(`sections/${section}.html`);
      if (!res.ok) throw new Error("Erro ao carregar a seção");
      const html = await res.text();
      app.innerHTML = html;
      // Pode inicializar scripts específicos da seção aqui
    } catch (err) {
      app.innerHTML = `<h2>Erro ao carregar a seção: ${section}</h2>`;
    }
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove("is-active"));
      link.classList.add("is-active");
      const section = link.getAttribute("data-go");
      loadSection(section);
    });
  });

  // Carregar home por padrão
  loadSection("home");
});function renderStoreIfOnPage() {
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
