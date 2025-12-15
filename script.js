// ===============================
// CONFIGURAÇÕES
// ===============================
const WHATSAPP_NUMERO = "5519989021323";
const NOME_LOJA = "Nome da Loja";

// CUPONS
const CUPONS = {
  "PRIMEIRA10": { tipo: "porcentagem", valor: 10 },
  "DESC5": { tipo: "fixo", valor: 5 }
};

// ===============================
// CARRINHO
// ===============================
let carrinho = [];
let cupomAplicado = null;

function adicionarProduto(nome, preco) {
  const item = carrinho.find(p => p.nome === nome);
  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }
  atualizarCarrinho();
}

function removerProduto(nome) {
  carrinho = carrinho.filter(p => p.nome !== nome);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalEl = document.getElementById("total");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach(p => {
    total += p.preco * p.qtd;
    lista.innerHTML += `
      <div class="item-carrinho">
        <span>${p.nome} (${p.qtd}x)</span>
        <span>R$ ${(p.preco * p.qtd).toFixed(2)}</span>
        <button onclick="removerProduto('${p.nome}')">❌</button>
      </div>
    `;
  });

  let desconto = 0;
  if (cupomAplicado) {
    const c = CUPONS[cupomAplicado];
    desconto = c.tipo === "fixo"
      ? c.valor
      : total * (c.valor / 100);
  }

  totalEl.innerText = `Total: R$ ${(total - desconto).toFixed(2)}`;
}

function aplicarCupom() {
  const codigo = document.getElementById("cupom").value.toUpperCase();
  if (CUPONS[codigo]) {
    cupomAplicado = codigo;
    alert("Cupom aplicado com sucesso!");
    atualizarCarrinho();
  } else {
    alert("Cupom inválido");
  }
}

// ===============================
// FINALIZAR PEDIDO
// ===============================
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const pagamento = prompt("Forma de pagamento: Pix, Dinheiro ou Cartão");
  if (!pagamento) return;

  let mensagem = `🛒 *NOVO PEDIDO* - ${NOME_LOJA}\n\n`;
  let total = 0;

  carrinho.forEach(p => {
    mensagem += `• ${p.nome} (${p.qtd}x) - R$ ${(p.preco * p.qtd).toFixed(2)}\n`;
    total += p.preco * p.qtd;
  });

  let desconto = 0;
  if (cupomAplicado) {
    const c = CUPONS[cupomAplicado];
    desconto = c.tipo === "fixo"
      ? c.valor
      : total * (c.valor / 100);

    mensagem += `\n🎟️ Cupom: ${cupomAplicado}`;
  }

  const totalFinal = total - desconto;

  mensagem += `\n\n💰 Total: R$ ${totalFinal.toFixed(2)}`;
  mensagem += `\n💳 Pagamento: ${pagamento}`;

  // WHATSAPP
  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );

  // IMPRESSÃO
  imprimirPedido(pagamento, total, desconto, totalFinal);
}

// ===============================
// IMPRESSÃO
// ===============================
function imprimirPedido(pagamento, subtotal, desconto, total) {
  const win = window.open("", "", "width=300");
  win.document.write(`
    <html>
    <head>
      <style>
        body { font-family: monospace; }
        h3 { text-align:center; }
        hr { border:1px dashed #000; }
      </style>
    </head>
    <body>
      <h3>${NOME_LOJA}</h3>
      <hr>
      ${carrinho.map(p =>
        `${p.nome} (${p.qtd}x) - R$ ${(p.preco * p.qtd).toFixed(2)}<br>`
      ).join("")}
      <hr>
      Subtotal: R$ ${subtotal.toFixed(2)}<br>
      Desconto: R$ ${desconto.toFixed(2)}<br>
      <b>TOTAL: R$ ${total.toFixed(2)}</b><br>
      <hr>
      Pagamento: ${pagamento}<br>
      Pedido via WhatsApp
      <script>
        window.onload = () => window.print();
      </script>
    </body>
    </html>
  `);
}