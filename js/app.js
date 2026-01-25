const app = document.getElementById("app");
const navLinks = document.querySelectorAll("[data-go]");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

let menuTimer = null;

// Função para carregar seção
function loadSection(section) {
  // Evita duplicar conteúdo
  if(app.dataset.current === section) return;
  app.dataset.current = section;

  fetch(`./sections/${section}.html`)
    .then(res => res.text())
    .then(html => {
      app.innerHTML = html;
      bindInternalLinks(); // Rebind links dentro da nova seção
    })
    .catch(() => {
      app.innerHTML = "<p>Seção não encontrada.</p>";
    });
}

// Atualiza os links internos para navegar corretamente
function bindInternalLinks() {
  document.querySelectorAll("[data-go]").forEach(link => {
    link.onclick = e => {
      e.preventDefault(); // previne scroll/topo
      const target = link.getAttribute("data-go");

      // Atualiza classe is-active
      navLinks.forEach(l => l.classList.remove("is-active"));
      link.classList.add("is-active");

      loadSection(target);

      // Fecha menu mobile ao clicar e reinicia timer de abertura
      if(nav.classList.contains("is-open")){
        nav.classList.remove("is-open");
        resetMenuTimer();
      }
    };
  });
}

// MENU MOBILE: abre/fecha com botão
menuBtn.onclick = () => {
  nav.classList.toggle("is-open");
  resetMenuTimer();
};

// Função para voltar menu automaticamente após 7s
function resetMenuTimer() {
  if(menuTimer) clearTimeout(menuTimer);
  menuTimer = setTimeout(() => {
    nav.classList.remove("is-open");
  }, 7000);
}

// Carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
  loadSection("home");

  // Para mobile: se abrir o menu, fecha automaticamente após 7s
  nav.addEventListener("transitionend", () => {
    if(nav.classList.contains("is-open")) resetMenuTimer();
  });
});
