/* =========================
   CONTROLE DE SEÇÕES
========================= */
const navLinks = document.querySelectorAll('.nav__link');
const app = document.getElementById('app');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

// Menu mobile toggle
menuBtn.addEventListener('click', () => nav.classList.toggle('is-open'));

// Navegação
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Atualiza ativo
    navLinks.forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');

    // Carrega a seção
    loadSection(link.dataset.go);
  });
});

// Carrega a seção padrão (home)
loadSection('home');

function loadSection(name) {
  fetch(`sections/${name}.html`)
    .then(r => r.text())
    .then(html => {
      app.innerHTML = html;
      // Hooks pós-carregamento de cada seção
      if (name === 'kstore') {
        kstoreOnSectionLoaded();
        kstoreWireGlobalEvents();
      } else if (name === 'checkout') {
        renderCheckoutIfOnPage();
      } else if (name === 'ktp') {
        ktpOnSectionLoaded();
      } // adicione outros hooks se necessário
    })
    .catch(err => app.innerHTML = `<p>Erro ao carregar a página ${name}</p>`);
}
