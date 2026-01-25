// ===== K-AI =====
// Exemplo simples: respostas básicas por setor
function talkAI(setor, message){
  let response = "K-AI está processando...";
  if(setor === 'K-TP') response = "Vamos focar na sua transformação!";
  if(setor === 'K-AFORTUNADO') response = "Hora de multiplicar sua fortuna!";
  if(setor === 'K-ALMA') response = "Equilíbrio é a chave para sua paz!";
  return response;
}
const app = document.getElementById("app");
const navLinks = document.querySelectorAll("[data-go]");

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

// MENU MOBILE
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.onclick = () => {
  nav.classList.toggle("open");
};

// CARREGAMENTO INICIAL
document.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});
