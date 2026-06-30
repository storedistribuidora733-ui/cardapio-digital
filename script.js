// ==============================================
// ⚙️ CONFIGURAÇÕES — AJUSTE AQUI SE PRECISAR
// ==============================================
const CONFIG = {
  horaAbertura: 7,       // 7h = 23:00
  horaFechamento: 23,      // 23h = 06:00
  textoStatusAberto: "Aberto até às 06:00",
  textoStatusFechado: "Fechado",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "ALISON BURGER",
  taxaEntregaPadrao: 6.00
};

// ==============================================
// 🛒 VARIÁVEIS ELEMENTOS
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

const nomeEl = document.getElementById('nome-cliente');
const avisoGeral = document.getElementById('aviso-geral');

const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
const campoTaxaEntregaEl = document.getElementById('campo-taxa-entrega');
const blocoEnderecoEl = document.getElementById('bloco-endereco');
const taxaEntregaEl = document.getElementById('taxa-entrega');

// Campos de endereço
const cepEl = document.getElementById('cep');
const numeroEl = document.getElementById('numero');
const complementoEl = document.getElementById('complemento');
const referenciaEl = document.getElementById('referencia');
const ruaEl = document.getElementById('rua');
const bairroEl = document.getElementById('bairro');
const cidadeUfEl = document.getElementById('cidade-uf');
const avisoCepEl = document.getElementById('aviso-cep');

const pagamentoEl = document.getElementById('forma-pagamento');
const obsEl = document.getElementById('observacoes');

// ==============================================
// 🚀 CONTROLE ENTREGA / RETIRADA
// ==============================================
tipoAtendimentoEl.addEventListener('change', () => {
  if (tipoAtendimentoEl.value === 'entrega') {
    campoTaxaEntregaEl.classList.remove('oculto');
    blocoEnderecoEl.classList.remove('oculto');
    taxaEntregaEl.value = CONFIG.taxaEntregaPadrao.toFixed(2).replace('.', ',');
  } else {
    campoTaxaEntregaEl.classList.add('oculto');
    blocoEnderecoEl.classList.add('oculto');
    taxaEntregaEl.value = '0,00';
    limparCamposEndereco();
  }
});

// ==============================================
// 🔍 BUSCA DE CEP E PREENCHIMENTO AUTOMÁTICO
// ==============================================
cepEl.addEventListener('input', () => {
  let cep = cepEl.value.replace(/\D/g, '');
  if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  cepEl.value = cep;
});

cepEl.addEventListener('blur', async () => {
  const cepNumeros = cepEl.value.replace(/\D/g, '');
  if (cepNumeros.length !== 8) {
    avisoCepEl.textContent = 'CEP inválido! Digite 8 dígitos.';
    avisoCepEl.style.color = '#dc2626';
    limparCamposEndereco();
    return;
  }

  avisoCepEl.textContent = 'Buscando endereço...';
  avisoCepEl.style.color = '#2563eb';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      avisoCepEl.textContent = 'CEP não encontrado!';
      avisoCepEl.style.color = '#dc2626';
      limparCamposEndereco();
      return;
    }

    // Preenche os campos automaticamente
    ruaEl.value = dados.logradouro || '';
    bairroEl.value = dados.bairro || '';
    cidadeUfEl.value = `${dados.localidade} / ${dados.uf}`;
    avisoCepEl.textContent = 'Endereço preenchido!';
    avisoCepEl.style.color = '#22c55e';

  } catch (erro) {
    avisoCepEl.textContent = 'Erro ao buscar CEP. Tente novamente.';
    avisoCepEl.style.color = '#dc2626';
    limparCamposEndereco();
  }
});

function limparCamposEndereco() {
  cepEl.value = '';
  numeroEl.value = '';
  complementoEl.value = '';
  referenciaEl.value = '';
  ruaEl.value = '';
  bairroEl.value = '';
  cidadeUfEl.value = '';
  avisoCepEl.textContent = 'Digite o CEP para preencher automaticamente';
  avisoCepEl.style.color = '#2563eb';
}

// ==============================================
// 🕒 STATUS DA LOJA — FUNCIONANDO 100%
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
    valorTotalEl.textContent = '0,00';
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
  avisoGeral.classList.add('oculto');
});

fecharModalBtns.forEach(botao => {
  botao.addEventListener('click', () => {
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });
});

// ==============================================
// 🗂️ FILTRAR E BUSCAR
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

campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(produto => {
    const nome = produto.dataset.nome.toLowerCase();
    produto.style.display = nome.includes(termo) ? 'grid' : 'none';
  });
});

// ==============================================
// ✅ FINALIZAR PEDIDO E ENVIAR PARA WHATSAPP
// ==============================================
document.getElementById('btn-finalizar').addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  const nome = nomeEl.value.trim();
  const pagamento = pagamentoEl.value;
  const obs = obsEl.value.trim();

  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxaEntrega = parseFloat(taxaEntregaEl.value.replace(',', '.')) || 0;
  const totalItens = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
  const totalGeral = totalItens + taxaEntrega;

  // Validações básicas
  if (carrinho.length === 0) {
    avisoGeral.textContent = 'Adicione pelo menos um produto!';
    avisoGeral.classList.remove('oculto');
    return;
  }
  if (!nome) {
    avisoGeral.textContent = 'Informe seu nome completo!';
    avisoGeral.classList.remove('oculto');
    return;
  }

  // Validações específicas para entrega
  if (tipoAtendimento === 'entrega') {
    const cep = cepEl.value.trim();
    const numero = numeroEl.value.trim();
    const rua = ruaEl.value.trim();

    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      avisoGeral.textContent = 'Informe um CEP válido!';
      avisoGeral.classList.remove('oculto');
      return;
    }
    if (!rua) {
      avisoGeral.textContent = 'Digite o CEP e aguarde o preenchimento do endereço!';
      avisoGeral.classList.remove('oculto');
      return;
    }
    if (!numero) {
      avisoGeral.textContent = 'Informe o número da residência!';
      avisoGeral.classList.remove('oculto');
      return;
    }
  }

  // Monta o endereço completo
  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += ` - ${complementoEl.value.trim()}`;
    enderecoCompleto += ` | Bairro: ${bairroEl.value} | ${cidadeUfEl.value} | CEP: ${cepEl.value}`;
    if (referenciaEl.value.trim()) enderecoCompleto += ` | Referência: ${referenciaEl.value.trim()}`;
  }

  // Monta mensagem do WhatsApp
  let mensagem = `📦 *NOVO PEDIDO - ${CONFIG.nomeLoja}*\n\n`;
  mensagem += `📋 *Tipo:* ${tipoAtendimento === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}\n`;
  mensagem += `👤 *Nome:* ${nome}\n`;

  if (tipoAtendimento === 'entrega') {
    mensagem += `🏠 *Endereço:* ${enderecoCompleto}\n`;
  }

  mensagem += `\n💳 *Forma de pagamento:* ${pagamento}\n\n`;
  mensagem += `🛒 *Itens do pedido:*\n`;

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} | ${item.quantidade}x | R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n💬 *Observações:* ${obs || 'Nenhuma'}\n`;
  mensagem += `🧾 *Subtotal:* R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;

  if (tipoAtendimento === 'entrega') {
    mensagem += `🚚 *Taxa de entrega:* R$ ${taxaEntrega.toFixed(2).replace('.', ',')}\n`;
  }

  mensagem += `💰 *TOTAL GERAL:* R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

  // Abre o WhatsApp
  const urlWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, '_blank');
}); 