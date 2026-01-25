// ===============================
// KORVIL - JS GLOBAL OFICIAL
// Menu + K-AI + Navegação
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTOS DO MENU
  // ===============================
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("menu");
  let menuTimer = null;

  if (menuBtn && nav) {

    // ABRIR MENU
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      nav.classList.add("open");

      // Limpa timer antigo
      if (menuTimer) clearTimeout(menuTimer);

      // Fecha automaticamente após 8 segundos
      menuTimer = setTimeout(() => {
        nav.classList.remove("open");
      }, 8000);
    });

    // FECHAR AO CLICAR EM UM ITEM
    document.querySelectorAll(".nav__link").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        if (menuTimer) clearTimeout(menuTimer);
      });
    });

    // FECHAR AO CLICAR FORA
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove("open");
        if (menuTimer) clearTimeout(menuTimer);
      }
    });
  }

  // ===============================
  // K-AI (CUBO GLOBAL)
  // ===============================
  if (!document.getElementById("k-ai")) {
    const kai = document.createElement("div");
    kai.id = "k-ai";
    kai.innerHTML = "⬛";

    kai.style.position = "fixed";
    kai.style.bottom = "20px";
    kai.style.right = "20px";
    kai.style.width = "60px";
    kai.style.height = "60px";
    kai.style.borderRadius = "12px";
    kai.style.background = "#00f2ff";
    kai.style.color = "#000";
    kai.style.display = "flex";
    kai.style.alignItems = "center";
    kai.style.justifyContent = "center";
    kai.style.fontSize = "22px";
    kai.style.fontWeight = "bold";
    kai.style.cursor = "pointer";
    kai.style.zIndex = "9999";
    kai.style.boxShadow = "0 0 15px rgba(0,242,255,0.6)";

    kai.title = "K-AI — Assistente do Sistema K";

    kai.addEventListener("click", () => {
      alert("K-AI ativo 🚀\nEm breve: chat, voz e comandos.");
    });

    document.body.appendChild(kai);
  }

});
