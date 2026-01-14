const basePrice = 98.9;
let total = 0;
let flavors = [];
let extras = [];

function openProduct() {
  document.getElementById("product").classList.remove("hidden");
  document.getElementById("product").classList.add("flex");
}

function openCart() {
  document.getElementById("cart").classList.remove("hidden");
  document.getElementById("cart").classList.add("flex");
}

function closeAll() {
  ["product", "cart"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
    document.getElementById(id).classList.remove("flex");
  });
}

function addFlavor(name) {
  if (flavors.length >= 2) return alert("Máximo 2 sabores");
  flavors.push(name);
}

function addExtra(name, price) {
  extras.push({ name, price });
  updatePrice();
}

function updatePrice() {
  total = basePrice + extras.reduce((s, e) => s + e.price, 0);
  document.getElementById("pPrice").innerText = total.toFixed(2);
}

function addToCart() {
  if (flavors.length < 2) return alert("Escolha 2 sabores");

  document.getElementById("total").innerText = "R$ " + total.toFixed(2);
  document.getElementById("cartTotal").innerText = "R$ " + total.toFixed(2);

  document.getElementById("cartItems").innerHTML = `
    <p>🍕 Sabores: ${flavors.join(", ")}</p>
    ${extras.map(e => `➕ ${e.name}`).join("<br>")}
  `;

  closeAll();
}

function sendWhatsApp() {
  const msg = `
🍕 *Novo Pedido*
Sabores: ${flavors.join(", ")}
Extras: ${extras.map(e => e.name).join(", ") || "Nenhum"}
Total: R$ ${total.toFixed(2)}
  `;

  const url = `https://wa.me/5519989021323?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
