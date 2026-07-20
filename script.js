// ==============================================
// ⚙️ CONFIGURAÇÕES — AJUSTE AQUI SE PRECISAR
// ==============================================
const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 8,
  textoStatusAberto: "Aberto até às 07:00",
  textoStatusFechado: "Fechado • Abre às 08:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

// ==============================================
// 🛒 VARIÁVEIS GERAIS
// ==============================================
const carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;
let adicionaisSelecionados = [];

// Elementos originais
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal')];
const btnLimparCarrinho = document.getElementById('btn-limpar');
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
const cepEl = document.getElementById('cep');
const numeroEl = document.getElementById('numero');
const complementoEl = document.getElementById('complemento');
const referenciaEl = document.getElementById('referencia');
const ruaEl = document.getElementById('rua');
const bairroEl = document.getElementById('bairro');
const cidadeUfEl = document.getElementById('cidade-uf');
const avisoCepEl = document.getElementById('aviso-cep');
const pagamentoEl = document.getElementById('forma-pagamento');

// Elementos da tela de detalhes
const modalProduto = document.getElementById('modal-produto');
const btnVoltarLista = document.getElementById('btn-voltar');
const imgDetalhe = document.getElementById('img-detalhe');
const nomeDetalhe = document.getElementById('nome-detalhe');
const descricaoDetalhe = document.getElementById('descricao-detalhe');
const precoOriginalEl = document.getElementById('preco-original');
const precoPromocionalEl = document.getElementById('preco-promocional');
const listaAdicionaisEl = document.getElementById('lista-adicionais');
const qtdAtualEl = document.getElementById('qtd-atual');
const diminuirQtdBtn = document.getElementById('diminuir-qtd');
const aumentarQtdBtn = document.getElementById('aumentar-qtd');
const btnAdicionarDetalhe = document.getElementById('btn-adicionar-detalhe');
const pontoStatusModal = document.getElementById('ponto-status-modal');
const textoStatusModal = document.getElementById('texto-status-modal');

// ==============================================
// 🗑️ LIMPAR CARRINHO
// ==============================================
function limparTudoCarrinho() {
  carrinho.length = 0;
  listaItensCarrinho.innerHTML = '';
  valorTotalEl.textContent = '0,00';
  qtdCarrinhoEl.textContent = '0';
  resumoCarrinhoEl.innerHTML = '0 itens • R$ 0,00 &nbsp; | &nbsp; 🔒 Ambiente 100% seguro';
  carrinhoContainer.style.display = 'none';
  nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada';
  taxaEntregaEl.value = '8,00';
  pagamentoEl.value = 'Dinheiro';
  avisoGeral.classList.add('oculto');
  limparCamposEndereco();
  campoTaxaEntregaEl.classList.add('oculto');
  blocoEnderecoEl.classList.add('oculto');
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}
btnLimparCarrinho.addEventListener('click', limparTudoCarrinho);

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
// 🔍 BUSCA DE CEP
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
    if (dados.erro) throw new Error();
    ruaEl.value = dados.logradouro || '';
    bairroEl.value = dados.bairro || '';
    cidadeUfEl.value = `${dados.localidade} / ${dados.uf}`;
    avisoCepEl.textContent = 'Endereço preenchido!';
    avisoCepEl.style.color = '#22c55e';
  } catch {
    avisoCepEl.textContent = 'CEP não encontrado!';
    avisoCepEl.style.color = '#dc2626';
    limparCamposEndereco();
  }
});

function limparCamposEndereco() {
  cepEl.value = ''; numeroEl.value = ''; complementoEl.value = ''; referenciaEl.value = '';
  ruaEl.value = ''; bairroEl.value = ''; cidadeUfEl.value = '';
  avisoCepEl.textContent = 'Digite o CEP para preencher automaticamente';
  avisoCepEl.style.color = '#2563eb';
}

// ==============================================
// 🕒 STATUS DA LOJA (ATUALIZA AMBAS AS TELAS)
// ==============================================
function verificarStatusLoja(mostrarAviso = false) {
  const agora = new Date();
  const horaAtual = agora.getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura || horaAtual < CONFIG.horaFechamento;

  // Tela principal
  pontoStatusEl.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  textoStatusEl.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;

  // Tela de detalhes
  pontoStatusModal.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  textoStatusModal.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;

  if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove("oculto");
  return lojaAberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// ==============================================
// 📂 ABRIR TELA DE DETALHES AO CLICAR NO PRODUTO
// ==============================================
document.querySelectorAll('.produto').forEach(produto => {
  produto.addEventListener('click', () => {
    if (!verificarStatusLoja(true)) return;

    // Carrega dados do produto
    produtoAtual = {
      nome: produto.dataset.nome,
      preco: parseFloat(produto.dataset.preco),
      descricao: produto.dataset.descricao || 'Sem descrição.',
      imagem: produto.dataset.imagem || '',
      adicionais: [
        { nome: 'Bacon Suculento', preco: 2.90 },
        { nome: 'Queijo Extra', preco: 2.50 },
        { nome: 'Catupiry', preco: 2.00 },
        { nome: 'Ovo', preco: 1.50 }
      ]
    };

    // Reseta valores
    quantidadeAtual = 1;
    adicionaisSelecionados = [];
    qtdAtualEl.textContent = quantidadeAtual;

    // Preenche tela
    imgDetalhe.src = produtoAtual.imagem;
    nomeDetalhe.textContent = produtoAtual.nome;
    descricaoDetalhe.textContent = produtoAtual.descricao;
    precoOriginalEl.textContent = `R$ ${(produtoAtual.preco * 1.2).toFixed(2).replace('.', ',')}`;
    precoPromocionalEl.textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    atualizarTotalDetalhe();

    // Carrega adicionais
    listaAdicionaisEl.innerHTML = '';
    produtoAtual.adicionais.forEach((add, idx) => {
      const addEl = document.createElement('div');
      addEl.className = 'adicional-item';
      addEl.innerHTML = `
        <div>
          <div class="adicional-nome">${add.nome}</div>
          <div class="adicional-preco">+ R$ ${add.preco.toFixed(2).replace('.', ',')}</div>
        </div>
        <button class="btn-add-adicional" data-idx="${idx}">+</button>
      `;
      listaAdicionaisEl.appendChild(addEl);
    });

    // Abre tela
    modalProduto.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
  });
});

// Voltar para lista
btnVoltarLista.addEventListener('click', () => {
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// ==============================================
// ➕ / ➖ QUANTIDADE E ADICIONAIS NA TELA DETALHES
// ==============================================
diminuirQtdBtn.addEventListener('click', () => {
  if (quantidadeAtual > 1) {
    quantidadeAtual--;
    qtdAtualEl.textContent = quantidadeAtual;
    atualizarTotalDetalhe();
  }
});
aumentarQtdBtn.addEventListener('click', () => {
  quantidadeAtual++;
  qtdAtualEl.textContent = quantidadeAtual;
  atualizarTotalDetalhe();
});

listaAdicionaisEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-add-adicional');
  if (!btn) return;
  const idx = parseInt(btn.dataset.idx);
  const adicional = produtoAtual.adicionais[idx];
  const posicao = adicionaisSelecionados.findIndex(a => a.nome === adicional.nome);

  if (posicao === -1) {
    adicionaisSelecionados.push(adicional);
    btn.textContent = '✓';
    btn.classList.add('selecionado');
  } else {
    adicionaisSelecionados.splice(posicao, 1);
    btn.textContent = '+';
    btn.classList.remove('selecionado');
  }
  atualizarTotalDetalhe();
});

function atualizarTotalDetalhe() {
  const totalAdicionais = adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  const total = (produtoAtual.preco + totalAdicionais) * quantidadeAtual;
  btnAdicionarDetalhe.textContent = `Adicionar R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ==============================================
// ✅ ADICIONAR DO DETALHES PARA O CARRINHO
// ==============================================
btnAdicionarDetalhe.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;

  const nomeCompleto = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a => a.nome).join(', ')})`
    : produtoAtual.nome;

  const precoTotal = produtoAtual.preco + adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);

  const itemExistente = carrinho.find(i => i.nome === nomeCompleto);
  if (itemExistente) {
    itemExistente.quantidade += quantidadeAtual;
  } else {
    carrinho.push({ nome: nomeCompleto, preco: precoTotal, quantidade: quantidadeAtual });
  }

  atualizarCarrinho();
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// ==============================================
// 🔄 ATUALIZAR CARRINHO
// ==============================================
function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let total = 0; let qtdTotal = 0;
  if (carrinho.length === 0) {
    valorTotalEl.textContent = '0,00';
    carrinhoContainer.style.display = 'none';
    return;
  }
  carrinhoContainer.style.display = 'flex';
  carrinho.forEach((item, index) => {
    const totalItem = item.preco * item.quantidade;
    total += totalItem; qtdTotal += item.quantidade;
    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div><h4 style="font-size:14px;margin-bottom:3px;">${item.nome}</h4><p style="font-size:11px;color:#666;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p></div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="qtd-btn diminuir-item" data-index="${index}">-</button>
        <span style="font-weight:600;font-size:14px;">${item.quantidade}</span>
        <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
        <span style="font-weight:700;min-width:75px;text-align:right;font-size:14px;">R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
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
  document.querySelectorAll('.aumentar-item').forEach(b => b.addEventListener('click', () => {
    const idx = parseInt(b.dataset.index); carrinho[idx].quantidade++; atualizarCarrinho();
  }));
  document.querySelectorAll('.diminuir-item').forEach(b => b.addEventListener('click', () => {
    const idx = parseInt(b.dataset.index);
    if (carrinho[idx].quantidade > 1) carrinho[idx].quantidade--;
    else carrinho.splice(idx, 1);
    atualizarCarrinho();
  }));
}

// ==============================================
// 📂 ABRIR / FECHAR CARRINHO
// ==============================================
abrirCarrinhoBtn.addEventListener('click', () => {
  if (carrinho.length === 0) return;
  if (!verificarStatusLoja(true)) return;
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  avisoGeral.classList.add('oculto');
});
fecharModalBtns.forEach(b => b.addEventListener('click', () => {
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}));

// ==============================================
// 🗂️ FILTRAR E BUSCAR
// ==============================================
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const cat = botao.dataset.categoria;
    document.querySelectorAll('.produto').forEach(p => {
      p.style.display = (cat === 'todos' || p.dataset.categoria === cat) ? 'flex' : 'none';
    });
    campoBusca.value = '';
  });
});
campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(p => {
    p.style.display = p.dataset.nome.toLowerCase().includes(termo) ? 'flex' : 'none';
  });
});

// ==============================================
// ✅ FINALIZAR PEDIDO (SEM OBSERVAÇÕES)
// ==============================================
document.getElementById('btn-finalizar').addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  const nome = nomeEl.value.trim();
  const pagamento = pagamentoEl.value;
  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxaEntrega = parseFloat(taxaEntregaEl.value.replace(',', '.')) || 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalGeral = totalItens + taxaEntrega;

  // Dados do pedido (número e data iguais ao exemplo)
  const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
  const dataPedido = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Validações mantidas exatamente como no seu código
  if (carrinho.length === 0) { avisoGeral.textContent = 'Adicione pelo menos um produto!'; avisoGeral.classList.remove('oculto'); return; }
  if (!nome) { avisoGeral.textContent = 'Informe seu nome completo!'; avisoGeral.classList.remove('oculto'); return; }
  if (tipoAtendimento === 'entrega') {
    const cepValido = cepEl.value.trim().replace(/\D/g, '').length === 8;
    if (!cepValido) { avisoGeral.textContent = 'Informe um CEP válido!'; avisoGeral.classList.remove('oculto'); return; }
    if (!ruaEl.value.trim()) { avisoGeral.textContent = 'Aguarde o preenchimento do endereço!'; avisoGeral.classList.remove('oculto'); return; }
    if (!numeroEl.value.trim()) { avisoGeral.textContent = 'Informe o número da residência!'; avisoGeral.classList.remove('oculto'); return; }
  }

  // Endereço quebrado em linhas separadas (não passa da tela)
  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += `\n  Complemento: ${complementoEl.value.trim()}`;
    enderecoCompleto += `\n  Bairro: ${bairroEl.value}`;
    enderecoCompleto += `\n  Cidade/UF: ${cidadeUfEl.value}`;
    enderecoCompleto += `\n  CEP: ${cepEl.value}`;
    if (referenciaEl.value.trim()) enderecoCompleto += `\n  Referência: ${referenciaEl.value.trim()}`;
  }

  // ✨ MENSAGEM EXATAMENTE IGUAL À COMANDA QUE VOCÊ MOSTROU ✨
  let mensagem = `=====================================\n`;
  mensagem += `          PEDIDO — ${CONFIG.nomeLoja}\n`;
  mensagem += `=====================================\n`;
  mensagem += `Nº ${numeroPedido}  |  ${dataPedido}\n\n`;

  mensagem += `Tipo de atendimento: ${tipoAtendimento === 'entrega' ? 'Entrega' : 'Retirada'}\n`;
  mensagem += `Cliente:            ${nome}\n`;

  if (tipoAtendimento === 'entrega') {
    mensagem += `Endereço:\n  ${enderecoCompleto}\n`;
  }

  mensagem += `Pagamento:          ${pagamento}\n\n`;

  mensagem += `-------------------------------------\n`;
  mensagem += `PRODUTO                QTD   VALOR\n`;
  mensagem += `-------------------------------------\n`;

  carrinho.forEach(i => {
    const totalItem = (i.preco * i.quantidade).toFixed(2).replace('.', ',');
    mensagem += `${i.nome.padEnd(20)} ${String(i.quantidade).padStart(3)}  R$ ${totalItem}\n`;
  });

  mensagem += `-------------------------------------\n`;
  mensagem += `Subtotal............ R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;

  if (tipoAtendimento === 'entrega') {
    mensagem += `Entrega............. R$ ${taxaEntrega.toFixed(2).replace('.', ',')}\n`;
  }

  mensagem += `\nVALOR TOTAL......... R$ ${totalGeral.toFixed(2).replace('.', ',')}\n`;

  // Observação aparece só se for preenchida, no lugar certo
  const observacao = observacaoEl ? observacaoEl.value.trim() : '';
  if (observacao) {
    mensagem += `\n-------------------------------------\n`;
    mensagem += `Observação: ${observacao}\n`;
  }

  mensagem += `=====================================\n`;
  mensagem += `Confirmaremos o pedido em breve.\n`;
  mensagem += `Obrigado pela preferência!\n`;
  mensagem += `=====================================`;

  window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
});
