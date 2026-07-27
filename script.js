// ==============================================
// ⚙️ CONFIGURAÇÕES — AJUSTE AQUI SE PRECISAR
// ==============================================
const CONFIG = {
  horaAbertura: 6,
  horaFechamento: 23,
  textoStatusAberto: "Aberto até às 23:00",
  textoStatusFechado: "Fechado • Abre às 07:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

// ==============================================
// 🛒 VARIÁVEIS GERAIS
// ==============================================
let carrinho = [];
let qtdAtual = 1;
let produtoAtual = null;
let adicionaisSelecionados = [];

// ==============================================
// 🕒 VERIFICAR HORÁRIO DE FUNCIONAMENTO
// ==============================================
function verificarHorario() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const totalMinutos = hora * 60 + minuto;
  const abertura = CONFIG.horaAbertura * 60;
  const fechamento = CONFIG.horaFechamento * 60;

  let aberto = false;
  if (abertura < fechamento) {
    aberto = totalMinutos >= abertura && totalMinutos < fechamento;
  } else {
    aberto = totalMinutos >= abertura || totalMinutos < fechamento;
  }

  const faixa = document.getElementById('faixa-status-modal');
  if (faixa) {
    faixa.textContent = aberto ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
    faixa.classList.toggle('aberto', aberto);
  }
  return aberto;
}

// ==============================================
// 🖱️ ABRIR PRODUTO NA PÁGINA DE DETALHES
// ==============================================
document.querySelectorAll('.produto').forEach(prod => {
  prod.addEventListener('click', () => {
    if (!verificarHorario()) {
      document.getElementById('alerta-fechado').classList.remove('oculto');
      return;
    }

    produtoAtual = {
      nome: prod.dataset.nome,
      preco: parseFloat(prod.dataset.preco),
      precoOriginal: parseFloat(prod.dataset.precoOriginal || prod.dataset.preco),
      descricao: prod.dataset.descricao,
      imagem: prod.dataset.imagem
    };
    qtdAtual = 1;
    adicionaisSelecionados = [];

    document.getElementById('img-detalhe').src = produtoAtual.imagem;
    document.getElementById('nome-detalhe').textContent = produtoAtual.nome;
    document.getElementById('descricao-detalhe').textContent = produtoAtual.descricao;
    document.getElementById('preco-original').textContent = `R$ ${produtoAtual.precoOriginal.toFixed(2).replace('.', ',')}`;
    document.getElementById('preco-promocional').textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('qtd-atual').textContent = qtdAtual;
    document.getElementById('btn-adicionar-detalhe').textContent = `Adicionar R$ ${(produtoAtual.preco * qtdAtual).toFixed(2).replace('.', ',')}`;

    document.getElementById('modal-produto').classList.remove('oculto');
    verificarHorario();
  });
});

// ==============================================
// ➕➖ CONTROLE DE QUANTIDADE
// ==============================================
document.getElementById('aumentar-qtd').addEventListener('click', () => {
  qtdAtual++;
  document.getElementById('qtd-atual').textContent = qtdAtual;
  atualizarBotaoAdicionar();
});

document.getElementById('diminuir-qtd').addEventListener('click', () => {
  if (qtdAtual > 1) {
    qtdAtual--;
    document.getElementById('qtd-atual').textContent = qtdAtual;
    atualizarBotaoAdicionar();
  }
});

function atualizarBotaoAdicionar() {
  let total = produtoAtual.preco * qtdAtual;
  adicionaisSelecionados.forEach(ad => total += parseFloat(ad.valor) * qtdAtual);
  document.getElementById('btn-adicionar-detalhe').textContent = `Adicionar R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ==============================================
// ✅ ADICIONAR AO CARRINHO
// ==============================================
document.getElementById('btn-adicionar-detalhe').addEventListener('click', () => {
  const item = {
    nome: produtoAtual.nome,
    precoUnitario: produtoAtual.preco,
    quantidade: qtdAtual,
    adicionais: [...adicionaisSelecionados]
  };
  carrinho.push(item);
  atualizarCarrinho();
  document.getElementById('modal-produto').classList.add('oculto');
});

// ==============================================
// ❌ VOLTAR DO PRODUTO
// ==============================================
document.getElementById('btn-voltar').addEventListener('click', () => {
  document.getElementById('modal-produto').classList.add('oculto');
});

// ==============================================
// 🛠️ ATUALIZAR VISUAL DO CARRINHO
// ==============================================
function atualizarCarrinho() {
  const container = document.getElementById('carrinho-container');
  const qtdTotal = carrinho.reduce((soma, i) => soma + i.quantidade, 0);
  const valorTotal = carrinho.reduce((soma, i) => {
    let totalItem = i.precoUnitario * i.quantidade;
    i.adicionais.forEach(ad => totalItem += parseFloat(ad.valor) * i.quantidade);
    return soma + totalItem;
  }, 0);

  document.getElementById('qtd-carrinho').textContent = qtdTotal;
  document.getElementById('resumo-carrinho').innerHTML = `${qtdTotal} itens • R$ ${valorTotal.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;
  
  container.style.display = carrinho.length > 0 ? 'block' : 'none';
}

// ==============================================
// 🚀 INICIAR TUDO
// ==============================================
verificarHorario();
setInterval(verificarHorario, 60000);

document.getElementById('btn-entendi').addEventListener('click', () => {
  document.getElementById('alerta-fechado').classList.add('oculto');
});
