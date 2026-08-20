const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "ABERTO ",
  textoStatusFechado: "FECHADO ",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaFixa: 8.00
};

const carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;
let adicionaisSelecionados = [];
let observacaoProdutoAtual = "";

// Elementos
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtn = document.getElementById('fechar-modal');
const btnLimparCarrinho = document.getElementById('btn-limpar');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const campoBusca = document.getElementById('campoBusca');
const carrinhoContainer = document.getElementById('carrinho-container');
const resumoValorEl = document.getElementById('resumo-valor');
const badgeQtdEl = document.getElementById('badge-qtd');
const blocoAdicionaisEl = document.getElementById('bloco-adicionais');
const observacaoItemEl = document.getElementById('observacao-item');
const subtotaisEl = document.getElementById('subtotal-itens');
const valorTotalEl = document.getElementById('valor-total');
const nomeEl = document.getElementById('nome-cliente');
const avisoGeral = document.getElementById('aviso-geral');
const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
const campoTaxaEntregaEl = document.getElementById('campo-taxa-entrega');
const blocoEnderecoEl = document.getElementById('bloco-endereco');
const taxaEntregaEl = document.getElementById('taxa-entrega');
const cepEl = document.getElementById('cep');
const numeroEl = document.getElementById('numero');
const complementoEl = document.getElementById('complemento');
const ruaEl = document.getElementById('rua');
const bairroEl = document.getElementById('bairro');
const cidadeUfEl = document.getElementById('cidade-uf');
const pagamentoEl = document.getElementById('forma-pagamento');
const observacaoGeralEl = document.getElementById('observacao');
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
const pontoCab = document.getElementById('cab-ponto-status');
const textoCab = document.getElementById('cab-texto-status');

// ==============================================
// 📱 NAVEGAÇÃO BOTÃO VOLTAR
// ==============================================
window.addEventListener('load', () => {
  history.replaceState({}, '');
});

function fecharModalProduto() {
  if(modalProduto) modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
}
function fecharCarrinho() {
  if(modalCarrinho) modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}

window.addEventListener('popstate', (e) => {
  e.preventDefault();
  
  if (modalProduto && !modalProduto.classList.contains('oculto')) {
    fecharModalProduto();
    return;
  }
  
  if (modalCarrinho && !modalCarrinho.classList.contains('oculto')) {
    fecharCarrinho();
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({}, '');
});
// ==============================================

// Função de aviso de produto adicionado
function mostrarAvisoAdicionado() {
  const aviso = document.createElement('div');
  aviso.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px;
    font-family: 'Poppins', sans-serif; font-weight: 600; z-index: 99999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  aviso.textContent = '✅ Produto adicionado ao carrinho!';
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2000);
}

// Status da loja
function verificarStatusLoja(mostrarAviso = false) {
  const horaAtual = new Date().getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;
  if(pontoCab && textoCab){
    pontoCab.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
    textoCab.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
    pontoCab.className = "ponto-status " + (lojaAberta ? "aberto" : "fechado");
  }
  if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove("oculto");
  return lojaAberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi?.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// Limpar carrinho
function limparTudoCarrinho() {
  carrinho.length = 0; listaItensCarrinho.innerHTML = '';
  subtotaisEl.textContent = '0,00'; valorTotalEl.textContent = '0,00';
  badgeQtdEl.textContent = '0'; resumoValorEl.textContent = 'R$ 0,00';
  carrinhoContainer.style.display = 'none'; nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada'; pagamentoEl.value = 'Dinheiro';
  observacaoGeralEl.value = ''; avisoGeral.classList.add('oculto');
  campoTaxaEntregaEl.classList.add('oculto'); blocoEnderecoEl.classList.add('oculto');
  modalCarrinho.classList.add('oculto'); document.body.style.overflow = 'auto';
}
btnLimparCarrinho?.addEventListener('click', limparTudoCarrinho);

// Tipo de atendimento
tipoAtendimentoEl?.addEventListener('change', () => {
  if (tipoAtendimentoEl.value === 'entrega') {
    campoTaxaEntregaEl.classList.remove('oculto');
    blocoEnderecoEl.classList.remove('oculto');
    taxaEntregaEl.value = CONFIG.taxaEntregaFixa.toFixed(2).replace('.', ',');
  } else {
    campoTaxaEntregaEl.classList.add('oculto');
    blocoEnderecoEl.classList.add('oculto');
  }
  atualizarCarrinho();
});

// Abrir produto
document.querySelectorAll('.produto').forEach(produto => {
  produto.addEventListener('click', () => {
    if (!verificarStatusLoja(true)) return;
    const temAdicionais = (produto.dataset.temAdicionais || 'sim').toLowerCase() === 'sim';
    produtoAtual = {
      nome: produto.dataset.nome,
      preco: parseFloat(produto.dataset.preco),
      descricao: produto.dataset.descricao || 'Sem descrição.',
      imagem: produto.dataset.imagem || '',
      adicionais: temAdicionais ? [
        { nome: 'Bacon Suculento', preco: 2.90 },
        { nome: 'Queijo Extra', preco: 2.50 },
        { nome: 'Catupiry', preco: 2.00 },
        { nome: 'Ovo', preco: 1.50 }
      ] : []
    };
    quantidadeAtual = 1; adicionaisSelecionados = []; observacaoProdutoAtual = "";
    qtdAtualEl.textContent = quantidadeAtual; observacaoItemEl.value = "";
    imgDetalhe.src = produtoAtual.imagem;
    nomeDetalhe.textContent = produtoAtual.nome;
    descricaoDetalhe.textContent = produtoAtual.descricao;
    precoOriginalEl.textContent = `R$ ${(produtoAtual.preco * 1.2).toFixed(2).replace('.', ',')}`;
    precoPromocionalEl.textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    atualizarTotalDetalhe();
    blocoAdicionaisEl.classList.toggle('oculto', !temAdicionais);
    listaAdicionaisEl.innerHTML = '';
    produtoAtual.adicionais.forEach((add, idx) => {
      const addEl = document.createElement('div');
      addEl.className = 'adicional-item';
      addEl.innerHTML = `
        <div><div class="adicional-nome">${add.nome}</div><div class="adicional-preco">+ R$ ${add.preco.toFixed(2).replace('.', ',')}</div></div>
        <button class="btn-add-adicional" data-idx="${idx}">+</button>
      `;
      listaAdicionaisEl.appendChild(addEl);
    });
    modalProduto.classList.remove('oculto'); 
    document.body.style.overflow = 'hidden';
    history.pushState({}, '');
  });
});

btnVoltarLista?.addEventListener('click', fecharModalProduto);

diminuirQtdBtn?.addEventListener('click', () => {
  if (quantidadeAtual > 1) { quantidadeAtual--; qtdAtualEl.textContent = quantidadeAtual; atualizarTotalDetalhe(); }
});
aumentarQtdBtn?.addEventListener('click', () => {
  quantidadeAtual++; qtdAtualEl.textContent = quantidadeAtual; atualizarTotalDetalhe();
});

listaAdicionaisEl?.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-add-adicional');
  if (!btn) return;
  const idx = parseInt(btn.dataset.idx);
  const adicional = produtoAtual.adicionais[idx];
  const posicao = adicionaisSelecionados.findIndex(a => a.nome === adicional.nome);
  if (posicao === -1) {
    adicionaisSelecionados.push(adicional); btn.textContent = '✓'; btn.classList.add('selecionado');
  } else {
    adicionaisSelecionados.splice(posicao, 1); btn.textContent = '+'; btn.classList.remove('selecionado');
  }
  atualizarTotalDetalhe();
});

function atualizarTotalDetalhe() {
  if(!produtoAtual) return;
  const totalAdicionais = adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  const total = (produtoAtual.preco + totalAdicionais) * quantidadeAtual;
  btnAdicionarDetalhe.textContent = `Adicionar R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ✅ AQUI É A PARTE PRINCIPAL: NÃO FECHA TELA + MOSTRA AVISO
btnAdicionarDetalhe?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  observacaoProdutoAtual = observacaoItemEl ? observacaoItemEl.value.trim() : "";
  const nomeCompleto = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a => a.nome).join(', ')})`
    : produtoAtual.nome;
  const precoTotal = produtoAtual.preco + adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  
  // Adiciona ao carrinho
  carrinho.push({ 
    nome: nomeCompleto, preco: precoTotal, quantidade: quantidadeAtual,
    observacao: observacaoProdutoAtual
  });
  
  atualizarCarrinho();
  mostrarAvisoAdicionado(); // Mostra que deu certo
  // ❌ REMOVIDO: fecharModalProduto() → NÃO VOLTA MAIS PARA TELA INICIAL
});

function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let totalItens = 0; let qtdTotal = 0;
  const usaTaxaEntrega = tipoAtendimentoEl.value === 'entrega';
  const taxa = usaTaxaEntrega ? CONFIG.taxaEntregaFixa : 0;
  if (carrinho.length === 0) {
    subtotaisEl.textContent = '0,00'; valorTotalEl.textContent = '0,00';
    badgeQtdEl.textContent = '0'; resumoValorEl.textContent = 'R$ 0,00';
    carrinhoContainer.style.display = 'none'; return;
  }
  carrinhoContainer.style.display = 'flex';
  carrinho.forEach((item, index) => {
    const totalItem = item.preco * item.quantidade;
    totalItens += totalItem; qtdTotal += item.quantidade;
    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div class="item-info">
        <h4 class="item-nome">${item.nome}</h4>
        ${item.observacao ? `<p class="item-obs">Obs: ${item.observacao}</p>` : ''}
        <p class="item-preco-unit">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
      </div>
      <div class="qtd-controle">
        <button class="qtd-btn diminuir-item" data-index="${index}">&minus;</button>
        <span class="qtd-valor">${item.quantidade}</span>
        <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
      </div>
      <div class="item-total">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
    `;
    listaItensCarrinho.appendChild(itemEl);
  });
  const totalFinal = totalItens + taxa;
  subtotaisEl.textContent = totalItens.toFixed(2).replace('.', ',');
  valorTotalEl.textContent = totalFinal.toFixed(2).replace('.', ',');
  badgeQtdEl.textContent = qtdTotal;
  resumoValorEl.textContent = `R$ ${totalItens.toFixed(2).replace('.', ',')}`;
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

abrirCarrinhoBtn?.addEventListener('click', () => {
  if (carrinho.length === 0) return;
  if (!verificarStatusLoja(true)) return;
  atualizarCarrinho(); 
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden'; 
  avisoGeral.classList.add('oculto');
  history.pushState({}, '');
});
fecharModalBtn?.addEventListener('click', fecharCarrinho);

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
campoBusca?.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(p => {
    p.style.display = p.dataset.nome.toLowerCase().includes(termo) ? 'flex' : 'none';
  });
});

document.getElementById('btn-finalizar')?.addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  const nome = nomeEl.value.trim();
  const pagamento = pagamentoEl.value;
  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxa = tipoAtendimento === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalGeral = totalItens + taxa;
  const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
  const dataPedido = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const observacaoGeral = observacaoGeralEl ? observacaoGeralEl.value.trim() : '';

  if (carrinho.length === 0) { avisoGeral.textContent = 'Adicione pelo menos um produto!'; avisoGeral.classList.remove('oculto'); return; }
  if (!nome) { avisoGeral.textContent = 'Informe seu nome completo!'; avisoGeral.classList.remove('oculto'); return; }
  if (tipoAtendimento === 'entrega') {
    const cepValido = cepEl.value.trim().replace(/\D/g, '').length === 8;
    if (!cepValido) { avisoGeral.textContent = 'Informe um CEP válido!'; avisoGeral.classList.remove('oculto'); return; }
    if (!ruaEl.value.trim()) { avisoGeral.textContent = 'Aguarde o preenchimento do endereço!'; avisoGeral.classList.remove('oculto'); return; }
    if (!numeroEl.value.trim()) { avisoGeral.textContent = 'Informe o número da residência!'; avisoGeral.classList.remove('oculto'); return; }
  }

  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += `\n  Complemento: ${complementoEl.value.trim()}`;
    enderecoCompleto += `\n  Bairro: ${bairroEl.value}`;
    enderecoCompleto += `\n  Cidade/UF: ${cidadeUfEl.value}`;
    enderecoCompleto += `\n  CEP: ${cepEl.value}`;
  }

  let mensagem = `=====================================
            ALISON BURGER
=====================================
PEDIDO Nº: ${numeroPedido}
EMITIDO EM: ${dataPedido}
-------------------------------------
CLIENTE: ${nome}
TIPO DE ATENDIMENTO: ${tipoAtendimento === 'retirada' ? 'RETIRADA NA LOJA' : 'ENTREGA'}
${tipoAtendimento === 'entrega' ? `
-------------------------------------
ENDEREÇO:
${enderecoCompleto}` : ''}
-------------------------------------
ITEM                   QTD   VALOR
-------------------------------------
`;

  carrinho.forEach(item => {
    const valorItem = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
    mensagem += `${item.nome.padEnd(22)} ${String(item.quantidade).padStart(2)}    R$ ${valorItem}\n`;
    if(item.observacao) mensagem += `⚠️ Obs do item: ${item.observacao}\n`;
    mensagem += `\n`;
  });

  mensagem += `-------------------------------------
SUBTOTAL...............: R$ ${totalItens.toFixed(2).replace('.', ',')}
TAXA DE ENTREGA........: R$ ${taxa.toFixed(2).replace('.', ',')}
-------------------------------------
TOTAL A PAGAR..........: R$ ${totalGeral.toFixed(2).replace('.', ',')}
-------------------------------------
FORMA DE PAGAMENTO.....: ${pagamento}
${observacaoGeral ? `
-------------------------------------
📝 OBSERVAÇÃO GERAL DO PEDIDO:
${observacaoGeral}` : ''}
=====================================
      OBRIGADO PELA PREFERÊNCIA!
`;

  const urlWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, '_blank');
  limparTudoCarrinho();
});
 