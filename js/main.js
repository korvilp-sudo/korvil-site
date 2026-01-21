document.addEventListener("DOMContentLoaded", () => {
  loadSection("home.html");
});

// Carregar seções dinamicamente
function loadSection(file){
  fetch(`sections/${file}`)
    .then(res => {
      if (!res.ok) throw new Error("Arquivo não encontrado!");
      return res.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;
    })
    .catch(err => {
      console.error("Erro ao carregar seção:", err);
      document.getElementById("content").innerHTML = "<h2>Seção inacessível</h2>";
    });
}

// Modal login
function abrir(setor){
  document.getElementById('tituloModal').innerText = setor;
  document.getElementById('modal').style.display = 'flex';
}

function fechar(){
  document.getElementById('modal').style.display = 'none';
}
