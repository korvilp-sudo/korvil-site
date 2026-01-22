
// ===== K-AI Widget e Lógica =====
const kaiButton = document.createElement("div");
kaiButton.id = "kai-button";
kaiButton.textContent = "🤖";
document.body.appendChild(kaiButton);

const kaiPanel = document.createElement("div");
kaiPanel.id = "kai-panel";
kaiPanel.innerHTML = `
  <div id="kai-header">
    <span>K-AI Assistente</span>
    <button id="kai-close">×</button>
  </div>
  <div id="kai-messages"></div>
  <div id="kai-input-container">
    <input type="text" id="kai-input" placeholder="Pergunte qualquer coisa..." />
    <button id="kai-send">Enviar</button>
  </div>
`;
document.body.appendChild(kaiPanel);

const kaiClose = document.getElementById("kai-close");
const kaiSend = document.getElementById("kai-send");
const kaiInput = document.getElementById("kai-input");
const kaiMessages = document.getElementById("kai-messages");

// Abrir/fechar
kaiButton.addEventListener("click", ()=>{
    kaiPanel.style.display = kaiPanel.style.display==="flex"?"none":"flex";
    kaiPanel.style.flexDirection="column";
});
kaiClose.addEventListener("click", ()=>kaiPanel.style.display="none");

// Adicionar mensagem
function addMessage(text,sender){
    const div=document.createElement("div");
    div.classList.add("kai-message",sender);
    div.textContent=text;
    kaiMessages.appendChild(div);
    kaiMessages.scrollTop=kaiMessages.scrollHeight;
}

// Fala K-AI
function speak(text){
    const utter=new SpeechSynthesisUtterance(text);
    utter.lang='pt-BR';
    utter.voice=speechSynthesis.getVoices().find(v=>v.name.includes("Male")||v.name.includes("Masculino"))||speechSynthesis.getVoices()[0];
    utter.pitch=1;
    utter.rate=1;
    speechSynthesis.speak(utter);
}

// Função de resposta
function kaiResponse(userText){
    userText=userText.toLowerCase();
    let response="Desculpe, não entendi. Pergunte sobre a loja, produtos, carrinho, frete ou diga 'crie algo'.";
    
    kaiResponses.forEach(obj=>{
        obj.trigger.forEach(trigger=>{
            if(userText.includes(trigger)){
                response=obj.response;
            }
        });
    });
    
    addMessage(response,"kai");
    speak(response);
}

// Enviar mensagem
kaiSend.addEventListener("click", ()=>{
    const text=kaiInput.value.trim();
    if(!text) return;
    addMessage(text,"user");
    kaiResponse(text);
    kaiInput.value="";
});

// Enviar com Enter
kaiInput.addEventListener("keypress",(e)=>{
    if(e.key==="Enter") kaiSend.click();
});
