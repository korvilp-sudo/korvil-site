// Carrega seções dinamicamente
function loadSection(section){
  let content = document.getElementById('content');
  switch(section){
    case 'home':
      content.innerHTML = `
      <section class="topo">
        <h1>KORVIL</h1>
        <p>Você está no ecossistema KORVIL. Um sistema integrado de evolução física, mental, espiritual e financeira.</p>
      </section>
      <section class="setores">
        <h2>Escolha um setor</h2>
        <div class="grid">
          <div class="card"><h3>Sistema K</h3><p>Central de organização, serviços e automações do KORVIL.</p><button class="btn" onclick="abrirModal('Sistema K')">Entrar</button></div>
          <div class="card"><h3>K-TP</h3><p>Projeto Transformação e Treinamento Personalizado.</p><button class="btn" onclick="abrirModal('K-TP')">Entrar</button></div>
          <div class="card"><h3>K-AFORTUNADO</h3><p>Empreendedorismo e crescimento financeiro.</p><button class="btn" onclick="abrirModal('K-AFORTUNADO')">Entrar</button></div>
          <div class="card"><h3>K-ALMA</h3><p>Cuidados e Projeto Paz.</p><button class="btn" onclick="abrirModal('K-ALMA')">Entrar</button></div>
        </div>
      </section>`;
      break;

    case 'checkout':
      // carrinho
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let itemsHTML = cart.map(i => `<li>${i.name} - R$${i.price}</li>`).join('');
      content.innerHTML = `
      <section class="contato">
        <h2>Checkout</h2>
        <ul>${itemsHTML}</ul>
        <form data-netlify="true">
          <input type="hidden" name="cart" value='${JSON.stringify(cart)}'>
          <input type="text" name="nome" placeholder="Seu nome" required>
          <input type="email" name="email" placeholder="Seu e-mail" required>
          <button class="btn" type="submit">Finalizar Pedido</button>
        </form>
      </section>`;
      break;

    default:
      content.innerHTML = `<h2>Seção ${section} ainda não implementada</h2>`;
  }
}

// MODAL LOGIN
function abrirModal(setor){
  document.getElementById('tituloModal').innerText = setor;
  document.getElementById('modal').style.display = 'flex';
}
function fecharModal(){
  document.getElementById('modal').style.display = 'none';
}
function login(){
  alert('Login simulado. Aqui você conectaria ao K-AI.');
  fecharModal();
}

// Inicializa
loadSection('home');
