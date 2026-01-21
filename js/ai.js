// ===== K-AI =====
// Exemplo simples: respostas básicas por setor
function talkAI(setor, message){
  let response = "K-AI está processando...";
  if(setor === 'K-TP') response = "Vamos focar na sua transformação!";
  if(setor === 'K-AFORTUNADO') response = "Hora de multiplicar sua fortuna!";
  if(setor === 'K-ALMA') response = "Equilíbrio é a chave para sua paz!";
  return response;
}
