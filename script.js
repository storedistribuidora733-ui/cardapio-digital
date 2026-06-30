// ==============================================
// ⚙️ CONFIGURAÇÕES GERAIS — ALTERE APENAS AQUI
// ==============================================
const CONFIG = {
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

  if (!lojaAberta && mostrarAviso) {
    alertaFechado.classList.remove("oculto");
  }

  return lojaAberta;
}

verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);

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
    if (!verificarStatusLoja(true)) return;

    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);
    const qtd = parseInt(botao.closest('.produto').querySelector('.qtd-valor').textContent);

    if (qtd <= 0) {
      alert('Escolha uma quantidade antes de adicionar!');
      return;
    }

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade += qtd;
    } else {
      carrinho.push({ nome, preco, quantidade: qtd });
    }

    atualizarCarrinho();

    botao.closest('.produto').querySelector('.qtd-valor').textContent = '0';

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
    qtdTotal += item.quantidade;

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
// 📂 ABRIR / FECHAR MODAL
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
  const cep = document.getElementById('cep-cliente').value.trim();
  const numero = document.getElementById('numero-cliente').value.trim();
  const semNumero = document.getElementById('sn-cliente').checked;
  const complemento = document.getElementById('complemento-cliente').value.trim();
  const referencia = document.getElementById('referencia-cliente').value.trim();
  const rua = document.getElementById('rua-cliente').value.trim();
  const bairro = document.getElementById('bairro-cliente').value.trim();
  const cidade = document.getElementById('cidade-cliente').value.trim();
  const uf = document.getElementById('uf-cliente').value.trim().toUpperCase();
  const pagamento = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacoes').value.trim();
  const avisoEndereco = document.getElementById('aviso-endereco');

  if (carrinho.length === 0) {
    alert('Adicione itens ao carrinho primeiro!');
    return;
  }

  // Validação básica
  if (!nome || !rua || !bairro || !cidade || !uf || (!numero && !semNumero)) {
    avisoEndereco.classList.remove('oculto');
    return;
  }
  avisoEndereco.classList.add('oculto');

  // Monta o endereço completo
  let enderecoCompleto = `Rua: ${rua}`;
  enderecoCompleto += semNumero ? ' - S/N' : `, Nº ${numero}`;
  if (complemento) enderecoCompleto += ` | Complemento: ${complemento}`;
  if (referencia) enderecoCompleto += ` | Referência: ${referencia}`;
  enderecoCompleto += `\nBairro: ${bairro} | Cidade: ${cidade}/${uf}`;
  if (cep) enderecoCompleto += `\nCEP: ${cep}`;

  // Monta mensagem formatada
  let mensagem = `📦 *NOVO PEDIDO - ${CONFIG.nomeLoja}*\n\n`;
  mensagem += `👤 *Nome:* ${nome}\n`;
  mensagem += `🏠 *Endereço:*\n${enderecoCompleto}\n\n`;
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