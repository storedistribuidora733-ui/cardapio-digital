const { jsPDF } = window.jspdf;

const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");

// ABRIR / FECHAR MODAL
cartBtn.onclick = () => cartModal.classList.remove("hidden");
closeModalBtn.onclick = () => cartModal.classList.add("hidden");

// ADICIONAR AO CARRINHO
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.onclick = () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const item = cart.find(i => i.name === name);

    item ? item.qtd++ : cart.push({ name, price, qtd: 1 });
    updateCart();
  };
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qtd;
    count += item.qtd;

    cartItems.innerHTML += `
      <div class="flex justify-between items-center border-b py-2">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>R$ ${item.price.toFixed(2)} x ${item.qtd}</p>
        </div>
        <button onclick="removeItem(${index})" class="text-red-500 font-bold">X</button>
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = count;
}

window.removeItem = index => {
  cart.splice(index, 1);
  updateCart();
};

// FINALIZAR PEDIDO
checkoutBtn.onclick = () => {
  const name = document.getElementById("customer-name").value || "Cliente";
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment-method").value;
  const obs = document.getElementById("observations").value;

  if (!address) {
    document.getElementById("address-warn").classList.remove("hidden");
    return;
  }

  gerarPDF(name, address, payment);
  enviarWhatsApp(name, address, payment, obs);
};

// PDF DO CUPOM FISCAL
function gerarPDF(name, address, payment) {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(14);
  doc.text("NOME DA LOJA", 105, y, { align: "center" });
  y += 6;
  doc.setFontSize(10);
  doc.text("NOME DA RUA", 105, y, { align: "center" });

  y += 10;
  doc.text(`Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 10, y);
  y += 6;
  doc.text(`Cliente: ${name}`, 10, y);
  y += 6;
  doc.text(`Endereço: ${address}`, 10, y);

  y += 8;
  doc.text("----------------------------------------", 10, y);
  y += 6;

  cart.forEach(item => {
    doc.text(`${item.qtd}x ${item.name} - R$ ${(item.price * item.qtd).toFixed(2)}`, 10, y);
    y += 6;
  });

  y += 4;
  doc.text("----------------------------------------", 10, y);
  y += 6;
  doc.text(`TOTAL: R$ ${cartTotal.innerText}`, 10, y);
  y += 6;
  doc.text(`Pagamento: ${payment}`, 10, y);

  y += 10;
  doc.text("Obrigado pela preferência!", 105, y, { align: "center" });

  doc.save("cupom-fiscal.pdf");
}

// WHATSAPP
function enviarWhatsApp(name, address, payment, obs) {
  let msg = `🧾 *NOVO PEDIDO*\n\n`;
  msg += `👤 ${name}\n📍 ${address}\n💳 ${payment}\n\n`;

  cart.forEach(item => {
    msg += `${item.qtd}x ${item.name} - R$ ${(item.price * item.qtd).toFixed(2)}\n`;
  });

  msg += `\n💰 Total: R$ ${cartTotal.innerText}`;
  if (obs) msg += `\n📝 Obs: ${obs}`;

  const phone = "5599999999999"; // SEU WHATSAPP
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}
