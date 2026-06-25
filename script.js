let carrinho = [];

const botoes = document.querySelectorAll(".botao");
const carrinhoBtn = document.getElementById("finalizar");

// adicionar produtos
botoes.forEach((botao) => {
  botao.addEventListener("click", () => {

    const produto = botao.parentElement;
    const nome = produto.querySelector("h3").innerText;
    const preco = produto.querySelector(".preco").innerText;

    carrinho.push({ nome, preco });

    botao.innerText = "✔ adicionado";
    botao.style.background = "green";

    setTimeout(() => {
      botao.innerText = "🛒 adicionar";
      botao.style.background = "#111";
    }, 1000);

  });
});

// WHATSAPP
carrinhoBtn.addEventListener("click", () => {

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá, quero fazer um pedido:%0A%0A";

  let total = 0;

  carrinho.forEach((item) => {
    mensagem += `• ${item.nome} - R$ ${item.preco}%0A`;
    total += parseFloat(item.preco);
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  // 🔥 TROQUE SEU NÚMERO AQUI:
  const telefone = "5500000000000";

  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
});