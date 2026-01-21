const content = document.getElementById('content');

// Carregar seções dinamicamente
function loadSection(sector) {
  fetch(`sections/${sector}.html`)
    .then(res => res.text())
    .then(html => content.innerHTML = html)
    .catch(err => content.innerHTML = "<p>Erro ao carregar a seção</p>");
}

// Modal Login
function abrirModal(setor) {
  document.getElementById('tituloModal').innerText = setor;
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function loginSetor() {
  alert("Login mock do setor: " + document.getElementById('tituloModal').innerText);
  fecharModal();
}

// Carrinho (simples)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(produto.nome + " adicionado ao carrinho!");
}

// Inicializa Home
loadSection('home');
