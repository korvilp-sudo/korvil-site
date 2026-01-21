// ===== CARRINHO =====
const cartKey = 'korvil-cart';

function addToCart(item){
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existing = cart.find(i => i.id === item.id);
  if(existing){
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(`${item.name} adicionado ao carrinho!`);
}

function clearCart(){
  localStorage.removeItem(cartKey);
}
