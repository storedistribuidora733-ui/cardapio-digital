const precoBase = 98.9;
let sabores = [];
let extras = [];
let total = precoBase;

function abrirProduto() {
  resetar();
  document.getElementById("produto").classList.remove("hidden");
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.remove("hidden");
}

function fechar() {
  document.getElementById("produto").classList.add("hidden");
  document.getElementById("carrinho").classList.add("hidden");
}

function addSabor(sabor) {
  if (sabores.length >= 2) {
    alert("Máximo 2 sabores");
    return;
  }
  sabores.push(sabor);
}

function addExtra(nome, valor) {
  extras.push({ nome, valor });
  total += valor;
  document.getElementById("preco").innerText = total.toFixed(2);
}

function adicionarCarrinho() {
  if (sabores.length < 2) {
    alert("Escolha 2 sabores");
    return;
  }

  document.getElementById("total").innerText = "R$ " + total.toFixed(2);

  document.getElementById("resumo").innerHTML = `
    <p>🍕 Sabores: ${sabores.join(", ")}</p>
    <p>➕ Extras: ${extras.map(e => e.nome).join(", ") || "Nenhum"}</p>
    <p class="mt-2 font-bold">Total: R$ ${total.toFixed(2)}</p>
  `;

  fechar();
}

function enviarWhats() {
  const texto = `
Novo pedido:
Sabores: ${sabores.join(", ")}
Extras: ${extras.map(e => e.nome).join(", ") || "Nenhum"}
Total: R$ ${total.toFixed(2)}
  `;
  const url = "https://wa.me/5519989021323?text=" + encodeURIComponent(texto);
  window.open(url, "_blank");
}

function resetar() {
  sabores = [];
  extras = [];
  total = precoBase;
  document.getElementById("preco").innerText = precoBase.toFixed(2);
}

