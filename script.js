// ==============================================
// ⚙️ CONFIGURAÇÕES GERAIS — ALTERE APENAS AQUI
// ==============================================
const CONFIG = {
  // Horário de funcionamento (formato 0-23)
  horaAbertura: 23,
  horaFechamento: 6,
  textoStatusAberto: "Aberto até às 06:00",
  textoStatusFechado: "Fechado",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "ALISON BURGER"
};

// ==============================================
// 🛒 VARIÁVEIS ELEMENTOS DA PÁGINA
// ==============================================
const carrinho = [];

const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal'), document.getElementById('btn-fechar')];
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const valorTotalEl = document.getElementById('valor-total');
const qtdCarrinhoEl = document.getElementById('qtd-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const textoStatusEl = document.getElementById('texto-status');
const pontoStatusEl = document.getElementById('ponto-status');
const campoBusca = document.getElementById('campoBusca');
const carrinhoContainer = document.getElementById('carrinho-container');
const resumoCarrinhoEl = document.getElementById('resumo-carrinho');

// ==============================================
// 🕒 VERIFICAR SE A LOJA ESTÁ ABERTA
// ==============================================
function verificarStatusLoja(mostrarAviso = false) {
  const agora = new Date();
  const horaAtual = agora.getHours();

  // Lógica corrigida para horário que passa da meia-noite
  const lojaAberta = horaAtual >= CONFIG.horaAbertura || horaAtual < CONFIG.horaFechamento;

  if (lojaAberta) {
    pontoStatusEl.style.backgroundColor = CONFIG.corStatusAberto;
    textoStatusEl.textContent = CONFIG.textoStatusAberto;
    textoStatusEl.classList.remove("fechado");
    textoStatusEl.classList.add("aberto");
  } else {
    pontoStatusEl.style.backgroundColor = CONFIG.corStatusFechado;
    textoStatusEl.textContent = CONFIG.textoStatusFechado;
    textoStatusEl.classList.remove("aberto");
    textoStatusEl.classList.add("fechado");
  }

  // Mostra aviso se solicitado
  if (!lojaAberta && mostrarAviso) {
    alertaFechado.classList.remove("oculto");
  }

  return lojaAberta;
}

// Verifica status ao carregar e a cada 1 minuto
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);

// Botão para fechar aviso de loja fechada
btnEntendi.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// ==============================================
// ➕ / ➖ CONTROLE DE QUANTIDADE DOS PRODUTOS
// ==============================================
document.querySelectorAll('.qtd-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    const valorEl = botao.parentElement.querySelector('.qtd-valor');
    let valor = parseInt(valorEl.textContent);

    if (botao.classList.contains('aumentar')) valor++;
    if (botao.classList.contains('diminuir') && valor > 0) valor--;

    valorEl.textContent = valor;
  });
});

// ==============================================
// 🛍️ ADICIONAR PRODUTO AO CARRINHO
// ==============================================
document.querySelectorAll('.add-carrinho').forEach(botao => {
  botao.addEventListener('click', () => {
    // Não deixa adicionar se loja estiver fechada
    if (!verificarStatusLoja(true)) return;

    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);
    const qtd = parseInt(botao.closest('.produto').querySelector('.qtd-valor').textContent);

    if (qtd <= 0) {
      alert('Escolha uma quantidade antes de adicionar!');
      return;
    }

    // Verifica se o item já existe para somar quantidade
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade += qtd;
    } else {
      carrinho.push({ nome, preco, quantidade: qtd });
    }

    atualizarCarrinho();

    // Zera a quantidade depois de adicionar
    botao.closest('.produto').querySelector('.qtd-valor').textContent = '0';

    // Feedback visual no botão
    const original = botao.innerHTML;
    botao.innerHTML = '<i class="fa fa-check"></i> Ok';
    botao.style.background = '#22c55e';
    botao.style.color = 'white';

    setTimeout(() => {
      botao.innerHTML = original;
      botao.style.background = '#facc15';
      botao.style.color = '#111827';
    }, 1100);
  });
});

// ==============================================
// 🔄 ATUALIZAR TELA DO CARRINHO
// ==============================================
function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let total = 0;
  let qtdTotal = 0;

  if (carrinho.length === 0) {
    valorTotalEl.textContent = '0.00';
    carrinhoContainer.style.display = 'none';
    return;
  }

  carrinhoContainer.style.display = 'flex';

  carrinho.forEach((item, index) => {
    const totalItem = item.preco * item.quantidade;
    total += totalItem;
    qtdTotal += item.quantidade; // Linha corrigida!

    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div>
        <h4 style="font-size:14px; margin-bottom:3px;">${item.nome}</h4>
        <p style="font-size:11px; color:#666;">R$ ${item.preco.toFixed(2)} cada</p>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="qtd-btn diminuir-item" data-index="${index}">-</button>
        <span style="font-weight:600; font-size:14px;">${item.quantidade}</span>
        <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
        <span style="font-weight:700; min-width:75px; text-align:right; font-size:14px;">R$ ${totalItem.toFixed(2)}</span>
      </div>
    `;
    listaItensCarrinho.appendChild(itemEl);
  });

  valorTotalEl.textContent = total.toFixed(2);
  qtdCarrinhoEl.textContent = qtdTotal;
  resumoCarrinhoEl.innerHTML = `${qtdTotal} itens • R$ ${total.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;

  adicionarEventosCarrinho();
}

// ==============================================
// ➕ / ➖ ALTERAR QUANTIDADE DENTRO DO CARRINHO
// ==============================================
function adicionarEventosCarrinho() {
  document.querySelectorAll('.aumentar-item').forEach(botao => {
    botao.addEventListener('click', () => {
      const idx = parseInt(botao.dataset.index);
      carrinho[idx].quantidade++;
      atualizarCarrinho();
    });
  });

  document.querySelectorAll('.diminuir-item').forEach(botao => {
    botao.addEventListener('click', () => {
      const idx = parseInt(botao.dataset.index);
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade--;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    });
  });
}

// ==============================================
// 📂 ABRIR E FECHAR MODAL DO CARRINHO
// ==============================================
abrirCarrinhoBtn.addEventListener('click', () => {
  if (carrinho.length === 0) return;
  if (!verificarStatusLoja(true)) return;
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(botao => {
  botao.addEventListener('click', () => {
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });
});

// ==============================================
// 🗂️ FILTRAR PRODUTOS POR CATEGORIA
// ==============================================
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const categoria = botao.dataset.categoria;

    document.querySelectorAll('.produto').forEach(produto => {
      if (categoria === 'todos' || produto.dataset.categoria === categoria) {
        produto.style.display = 'grid';
      } else {
        produto.style.display = 'none';
      }
    });

    campoBusca.value = '';
  });
});

// ==============================================
// 🔍 BUSCAR PRODUTOS PELO NOME
// ==============================================
campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(produto => {
    const nome = produto.dataset.nome.toLowerCase();
    produto.style.display = nome.includes(termo) ? 'grid' : 'none';
  });
});

// ==============================================
// 📤 FINALIZAR PEDIDO NO WHATSAPP
// ==============================================
document.getElementById('btn-finalizar').addEventListener('click', () => {
  const nome = document.getElementById('nome-cliente').value.trim();
  const endereco = document.getElementById('endereco-cliente').value.trim();
  const pagamento = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacoes').value.trim();
  const avisoEndereco = document.getElementById('aviso-endereco');

  if (carrinho.length === 0) {
    alert('Adicione itens ao carrinho primeiro!');
    return;
  }

  if (endereco.length < 8) {
    avisoEndereco.classList.remove('oculto');
    return;
  }
  avisoEndereco.classList.add('oculto');

  // Monta mensagem formatada
  let mensagem = `📦 *NOVO PEDIDO - ${CONFIG.nomeLoja}*\n\n`;
  mensagem += `👤 *Nome:* ${nome || 'Não informado'}\n`;
  mensagem += `🏠 *Endereço:* ${endereco}\n`;
  mensagem += `💳 *Forma de pagamento:* ${pagamento}\n\n`;
  mensagem += `🛒 *Itens do pedido:*\n`;

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} | ${item.quantidade}x | R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
  });

  mensagem += `\n💬 *Observações:* ${obs || 'Nenhuma observação'}\n`;
  mensagem += `💰 *Total:* R$ ${valorTotalEl.textContent}`;

  // Abre WhatsApp
  const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});