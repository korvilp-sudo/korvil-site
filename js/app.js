const app = document.getElementById("app");
const navLinks = document.querySelectorAll("[data-go]");

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
    };
  });
}

// MENU MOBILE
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.onclick = () => {
  nav.classList.toggle("is-open");
};

// Carregamento inicial
document.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});
