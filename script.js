// ===============================
// SEGURANÇA: esperar DOM carregar
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // -------- CARRINHO --------
  const cart = [];
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartModal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const footer = document.querySelector("footer");

  // -------- STATUS LOJA (SEMPRE ABERTA) --------
  const dateSpan = document.getElementById("date-span");
  if (dateSpan) {
    dateSpan.className = "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
    dateSpan.textContent = "Aberto agora";
  }

  // -------- ABRIR / FECHAR MODAL --------
  cartBtn?.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    footer.classList.add("hidden");
  });

  closeBtn?.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    footer.classList.remove("hidden");
  });

  // -------- ADICIONAR PRODUTOS --------
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      const item = cart.find(p => p.name === name);
      if (item) item.qtd++;
      else cart.push({ name, price, qtd: 1 });

      renderCart();
    });
  });

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.qtd;
      cartItems.innerHTML += `
        <div class="flex justify-between">
          <span>${item.name} x${item.qtd}</span>
          <strong>R$ ${(item.price * item.qtd).toFixed(2)}</strong>
        </div>
      `;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((s, i) => s + i.qtd, 0);
  }

});