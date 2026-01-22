// ===== K-AI JS =====
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

    // Função de responder
    function kaiRespond(message) {
        message = message.toLowerCase();
        let response = kaiResponses[message] || kaiResponses["default"];

        // Mostrar no painel
        const kaiBody = document.getElementById('kaiBody');
        const userMsg = document.createElement('div');
        userMsg.textContent = "Você: " + message;
        userMsg.style.marginTop = '6px';
        userMsg.style.fontWeight = 'bold';
        kaiBody.appendChild(userMsg);

        const kaiMsg = document.createElement('div');
        kaiMsg.textContent = "K-AI: " + response;
        kaiMsg.style.marginBottom = '6px';
        kaiBody.appendChild(kaiMsg);

        kaiBody.scrollTop = kaiBody.scrollHeight;

        // Voz masculina
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.voice = speechSynthesis.getVoices().find(v => v.lang === 'pt-BR') || null;
        utterance.pitch = 1;
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
    }

    // Enviar mensagem
    const kaiInput = document.getElementById('kaiInput');
    document.getElementById('kaiSendBtn').addEventListener('click', () => {
        if(kaiInput.value.trim() !== "") {
            kaiRespond(kaiInput.value.trim());
            kaiInput.value = "";
        }
    });

    // Enviar ao pressionar Enter
    kaiInput.addEventListener('keydown', (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            if(kaiInput.value.trim() !== "") {
                kaiRespond(kaiInput.value.trim());
                kaiInput.value = "";
            }
        }
    });
});
