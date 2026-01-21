
function loadSection(section) {
  fetch(`sections/${section}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar seção");
      }
      return response.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;
    })
    .catch(error => {
      document.getElementById("content").innerHTML =
        "<p style='color:red'>Erro ao carregar a seção.</p>";
      console.error(error);
    });
}

// Carrega HOME automaticamente ao abrir o site
document.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});
