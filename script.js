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
  numeroWhatsApp: "5519989021323", // ✅ Seu número correto
  nomeLoja: "ALISON BURGER",
  subtituloLoja: "Sabor de verdade!" // ✅ Igual da foto
};

// ==============================================
// 🛒 ELEMENTOS DA PÁGINA
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

// Campos do endereço
const cepEl = document.getElementById('cep-cliente');
const ruaEl = document.getElementById('rua-cliente');
const bairroEl = document.getElementById('bairro-cliente');
const cidadeEl = document.getElementById('cidade-cliente');
const ufEl = document.getElementById('uf-cliente');
const avisoEndereco = document.getElementById('aviso-endereco');

// ==============================================
// 🚀 FUNÇÃO BUSCAR CEP AUTOMÁTICA + MÁSCARA
// ==============================================
function aplicarMascaraCEP(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  return valor;
}

cepEl.addEventListener('input', () => {
  cepEl.value = aplicarMascaraCEP(cepEl.value);
});

async function buscarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      avisoEndereco.textContent = '❌ CEP não encontrado!';
      avisoEndereco.classList.remove('oculto');
      return;
    }

    ruaEl.value = dados.logradouro || '';
    bairroEl.value = dados.bairro || '';
    cidadeEl.value = dados.localidade || '';
    ufEl.value = dados.uf || '';
    avisoEndereco.classList.add('oculto');

  } catch (erro) {
    avisoEndereco.textContent = '⚠️ Erro ao buscar CEP, preencha manualmente.';
    avisoEndereco.classList.remove('oculto');
  }
}

cepEl.addEventListener('blur', () => buscarCEP(cepEl.value));

// ==============================================
// 🕒 VERIFICAR STATUS DA LOJA
// ==============================================
function verificarStatusLoja(mostrarAviso = false) {
  const agora = new Date();
  const horaAtual = agora.getHours();
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

  if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove("oculto");
  return lojaAberta;
}

verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// ==============================================
// ➕ / ➖ CONTROLE DE QUANTIDADE
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
// 🛍️ ADICIONAR AO CARRINHO
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
// 🔄 ATUALIZAR CARRINHO
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
        <p style="font-size:11px; color:#666;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="qtd-btn diminuir-item" data-index="${index}">-</button>
        <span style="font-weight:600; font-size:14px;">${item.quantidade}</span>
        <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
        <span style="font-weight:700; min-width:75px; text-align:right; font-size:14px;">R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
      </div>
    `;
    listaItensCarrinho.appendChild(itemEl);
  });

  valorTotalEl.textContent = total.toFixed(2).replace('.', ',');
  qtdCarrinhoEl.textContent = qtdTotal;
  resumoCarrinhoEl.innerHTML = `${qtdTotal} itens • R$ ${total.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;

  adicionarEventosCarrinho();
}

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
// 🗂️ FILTRAR POR CATEGORIA
// ==============================================
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const categoria = botao.dataset.categoria;

    document.querySelectorAll('.produto').forEach(produto => {
      produto.style.display = (categoria === 'todos' || produto.dataset.categoria === categoria) ? 'grid' : 'none';
    });
    campoBusca.value = '';
  });
});

// ==============================================
// 🔍 BUSCAR PRODUTOS
// ==============================================
campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(produto => {
    const nome = produto.dataset.nome.toLowerCase();
    produto.style.display = nome.includes(termo) ? 'grid' : 'none';
  });
});

// ==============================================
// ✅ FINALIZAR PEDIDO — FORMATO IGUAL A COMANDA
// ==============================================
document.getElementById('btn-finalizar').addEventListener('click', () => {
  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR');

  const nome = document.getElementById('nome-cliente').value.trim();
  const cep = cepEl.value.trim();
  const numero = document.getElementById('numero-cliente').value.trim();
  const semNumero = document.getElementById('sn-cliente').checked;
  const complemento = document.getElementById('complemento-cliente').value.trim();
  const referencia = document.getElementById('referencia-cliente').value.trim();
  const rua = ruaEl.value.trim();
  const bairro = bairroEl.value.trim();
  const cidade = cidadeEl.value.trim();
  const uf = ufEl.value.trim().toUpperCase();
  const pagamento = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacoes').value.trim();

  if (carrinho.length === 0) {
    alert('Adicione pelo menos um produto antes de finalizar!');
    return;
  }

  if (!nome || !rua || !bairro || !cidade || !uf || (!numero && !semNumero)) {
    avisoEndereco.textContent = '⚠️ Preencha: Nome, Rua, Bairro, Cidade, UF e Número ou marque "Sem número"!';
    avisoEndereco.classList.remove('oculto');
    return;
  }
  avisoEndereco.classList.add('oculto');

  // Monta endereço completo
  let enderecoCompleto = `ENDEREÇO: ${rua}, ${semNumero ? 'S/N' : `Nº ${numero}`}`;
  if (complemento) enderecoCompleto += `\nCOMP.: ${complemento}`;
  enderecoCompleto += `\nBAIRRO: ${bairro}`;
  enderecoCompleto += `\nCIDADE: ${cidade} - ${uf}`;
  if (cep) enderecoCompleto += ` | CEP: ${cep}`;

  // Monta mensagem no formato da comanda
  let mensagem = `━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensagem += `*${CONFIG.nomeLoja}*\n`;
  mensagem += `${CONFIG.subtituloLoja}\n`;
  mensagem += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  mensagem += `*📅 DATA / HORA:*\n${dataHora}\n\n`;

  mensagem += `*👤 CLIENTE:*\n${nome}\n\n`;

  mensagem += `*📍 ENTREGA:*\n${enderecoCompleto}\n\n`;

  mensagem += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensagem += `*🛒 ITENS DO PEDIDO*\n`;
  mensagem += `QTD | PRODUTO | VALOR UNIT. | TOTAL\n`;
  mensagem += `━━━━━━━━━━━━━━━━━━━━━━━\n`;

  carrinho.forEach(item => {
    const valorUnit = item.preco.toFixed(2).replace('.', ',');
    const valorTotalItem = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
    mensagem += `${item.quantidade}x | ${item.nome} | R$ ${valorUnit} | R$ ${valorTotalItem}\n`;
  });

  mensagem += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  mensagem += `*💳 FORMA DE PAGAMENTO:*\n${pagamento}\n\n`;

  if (obs) {
    mensagem += `*💬 OBSERVAÇÕES:*\n${obs}\n\n`;
  }

  mensagem += `*💰 VALOR TOTAL DO PEDIDO:*\nR$ ${valorTotalEl.textContent}\n`;
  mensagem += `━━━━━━━━━━━━━━━━━━━━━━━`;

  const urlWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, '_blank');
});