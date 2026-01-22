// =========================
// K-AI JS
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // Criar cubo flutuante
  const kaiCube = document.createElement('div');
  kaiCube.id = 'kaiCube';
  kaiCube.textContent = 'K-AI';
  document.body.appendChild(kaiCube);

  // Criar painel
  const kaiPanel = document.createElement('div');
  kaiPanel.id = 'kaiPanel';
  kaiPanel.innerHTML = `
    <header>
      <span>K-AI</span>
      <button id="kaiCloseBtn">&times;</button>
    </header>
    <div class="kaiBody" id="kaiBody"></div>
    <div class="kaiInputRow">
      <input type="text" id="kaiInput" class="kaiInput" placeholder="Digite sua pergunta..." />
      <button id="kaiSendBtn" class="kaiSendBtn">Enviar</button>
    </div>
  `;
  document.body.appendChild(kaiPanel);

  // Abrir/fechar painel
  kaiCube.addEventListener('click', () => {
    kaiPanel.style.display = kaiPanel.style.display === 'flex' ? 'none' : 'flex';
    kaiPanel.style.flexDirection = 'column';
  });
  document.getElementById('kaiCloseBtn').addEventListener('click', () => {
    kaiPanel.style.display = 'none';
  });

  // Elementos
  const kaiBody = document.getElementById('kaiBody');
  const kaiInput = document.getElementById('kaiInput');

  // Função de resposta
  function kaiRespond(msg) {
    const message = msg.toLowerCase();
    const response = kaiResponses[message] || kaiResponses["default"];

    // Mensagem do usuário
    const userDiv = document.createElement('div');
    userDiv.textContent = "Você: " + msg;
    userDiv.style.fontWeight = 'bold';
    kaiBody.appendChild(userDiv);

    // Mensagem K-AI
    const kaiDiv = document.createElement('div');
    kaiDiv.textContent = "K-AI: " + response;
    kaiBody.appendChild(kaiDiv);

    // Scroll para baixo
    kaiBody.scrollTop = kaiBody.scrollHeight;

    // Voz
    const utterance = new SpeechSynthesisUtterance(response);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang === 'pt-BR') || null;
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }

  // Botão enviar
  document.getElementById('kaiSendBtn').addEventListener('click', () => {
    if(kaiInput.value.trim()) {
      kaiRespond(kaiInput.value.trim());
      kaiInput.value = "";
    }
  });

  // Enter envia
  kaiInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      if(kaiInput.value.trim()) {
        kaiRespond(kaiInput.value.trim());
        kaiInput.value = "";
      }
    }
  });
});
