const kaiResponses = {
  "oi": "Olá! Eu sou o K-AI, assistente do KORVIL.",
  "como vai": "Estou funcionando perfeitamente!",
  "default": "Desculpe, não entendi. Pode reformular?"
}
function speak(text){
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.pitch = 0.9;   // voz mais grave
  utter.rate = 1;
  utter.voice = speechSynthesis.getVoices().find(v=>v.lang==='pt-BR' && v.name.includes('Male')) || null;
  speechSynthesis.speak(utter);
}

function showMessage(text){
  messageBox.textContent = text;
  messageBox.classList.add("show");
  speak(text);
  setTimeout(()=> messageBox.classList.remove("show"), 2500);
};
