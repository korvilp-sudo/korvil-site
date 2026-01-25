// ===== K-AI (exemplo simples) =====
function talkAI(setor, message){
  let response = "K-AI está processando...";
  if(setor === 'K-TP') response = "Vamos focar na sua transformação!";
  if(setor === 'K-AFORTUNADO') response = "Hora de multiplicar sua fortuna!";
  if(setor === 'K-ALMA') response = "Equilíbrio é a chave para sua paz!";
  return response;
}

// ===== NAVEGADOR CENTRAL =====
const app = document.getElementById("app");

function loadSection(section) {
  fetch(`./sections/${section}.html`)
    .then(res => res.text())
    .then(html => {
      app.innerHTML = html;
      bindInternalLinks();
    })
    .catch(() => {
      app.innerHTML = "<p>Seção não encontrada.</p>";
    });
}

function bindInternalLinks() {
  document.querySelectorAll("[data-go]").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      const target = link.getAttribute("data-go");
      loadSection(target);
    };
  });
}

// ===== MENU MOBILE =====
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if(menuBtn && nav){
    menuBtn.onclick = () => {
      nav.classList.toggle("is-open");
    };
  }

  // CARREGAMENTO INICIAL
  loadSection("home");
});
