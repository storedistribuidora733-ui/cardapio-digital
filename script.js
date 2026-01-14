let totalExtra = 0;
const basePrice = 98.9;

function openProduct(){
  document.getElementById("product").classList.remove("hidden");
  document.getElementById("product").classList.add("flex");
}

function openCart(){
  document.getElementById("cart").classList.remove("hidden");
  document.getElementById("cart").classList.add("flex");
}

function closeAll(){
  document.querySelectorAll("#product, #cart").forEach(m => {
    m.classList.add("hidden");
    m.classList.remove("flex");
  });
}

function add(valor){
  totalExtra += valor;
  document.getElementById("pPrice").innerText =
    (basePrice + totalExtra).toFixed(2);
}

function addToCart(){
  const finalPrice = basePrice + totalExtra;
  document.getElementById("total").innerText = "R$ " + finalPrice.toFixed(2);
  document.getElementById("cartTotal").innerText = "R$ " + finalPrice.toFixed(2);
  closeAll();
}
