const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "ABERTO",
  textoStatusFechado: "FECHADO",
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
const pontoStatusEl = document.getElementById('ponto-status');
const textoStatusEl = document.getElementById('texto-status');
const btnMeusPedidos = document.getElementById('btn-meus-pedidos');

// Navegação — não sai do site ao voltar
window.addEventListener('load', () => {
  history.pushState({fixo: true}, '');
  history.pushState({fixo: true}, '');
});
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (modalProduto && !modalProduto.classList.contains('oculto')) {
    modalProduto.classList.add('oculto');
    document.body.style.overflow = 'auto';
    history.pushState({fixo: true}, '');
    return;
  }
  if (modalCarrinho && !modalCarrinho.classList.contains('oculto')) {
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
    history.pushState({fixo: true}, '');
    return;
  }
  history.pushState({fixo: true}, '');
});

// Verificar status da loja
function verificarStatusLoja(mostrarAviso = false) {
  const horaAtual = new Date().getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;
  if(pontoStatusEl && textoStatusEl){
    pontoStatusEl.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
    textoStatusEl.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
    pontoStatusEl.classList.toggle('fechado', !lojaAberta);
  }
  if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove("oculto");
  return lojaAberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi?.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// Botão Meus Pedidos
btnMeusPedidos?.addEventListener('click', () => {
  alert('Em breve: acompanhe seus pedidos aqui! 🚀');
});

// Limpar carrinho
function limparTudoCarrinho() {
  carrinho.length = 0; listaItensCarrinho.innerHTML = '';
  subtotaisEl.textContent = '0,00'; valorTotalEl.textContent = '0,00';
  badgeQtdEl.textContent = '0'; resumoValorEl.textContent = 'R$ 0,00';
  carrinhoContainer.classList.remove('ativo'); 
  nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada'; pagamentoEl.value = 'Dinheiro';
  observacaoGeralEl.value = ''; avisoGeral.classList.add('oculto');
  campoTaxaEntregaEl.classList.add('oculto'); blocoEnderecoEl.classList.add('oculto');
  cepEl.value = ''; numeroEl.value = ''; complementoEl.value = '';
  ruaEl.value = ''; bairroEl.value = ''; cidadeUfEl.value = '';
  modalCarrinho.classList.add('oculto'); document.body.style.overflow = 'auto';
}
btnLimparCarrinho?.addEventListener('click', limparTudoCarrinho);

// Tipo de atendimento
tipoAtendimentoEl?.addEventListener('change', () => {
  if (tipoAtendimentoEl.value === 'entrega') {
    campoTaxaEntregaEl.classList.remove('oculto');
    blocoEnderecoEl.classList.remove('oculto');
    taxaEntregaEl.textContent = CONFIG.taxaEntregaFixa.toFixed(2).replace('.', ',');
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
        <div>
          <div class="adicional-nome">${add.nome}</div>
          <div class="adicional-preco">+ R$ ${add.preco.toFixed(2).replace('.', ',')}</div>
        </div>
        <button class="btn-add-adicional" data-idx="${idx}">+</button>
      `;
      listaAdicionaisEl.appendChild(addEl);
    });
    modalProduto.classList.remove('oculto'); 
    document.body.style.overflow = 'hidden';
    history.pushState({fixo: true}, '');
  });
});

btnVoltarLista?.addEventListener('click', () => {
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// Quantidade
diminuirQtdBtn?.addEventListener('click', () => {
  if (quantidadeAtual > 1) { quantidadeAtual--; qtdAtualEl.textContent = quantidadeAtual; atualizarTotalDetalhe(); }
});
aumentarQtdBtn?.addEventListener('click', () => {
  quantidadeAtual++; qtdAtualEl.textContent = quantidadeAtual; atualizarTotalDetalhe();
});

// Adicionais
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

// Adicionar ao carrinho e RESET
btnAdicionarDetalhe?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  
  observacaoProdutoAtual = observacaoItemEl ? observacaoItemEl.value.trim() : "";
  const nomeCompleto = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a => a.nome).join(', ')})`
    : produtoAtual.nome;
  const precoTotal = produtoAtual.preco + adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  
  carrinho.push({ 
    nome: nomeCompleto, 
    preco: precoTotal, 
    quantidade: quantidadeAtual,
    observacao: observacaoProdutoAtual
  });
  
  atualizarCarrinho();
  
  // Aviso
  const aviso = document.createElement('div');
  aviso.style.cssText = 'position:fixed;top:15px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:10px 20px;border-radius:6px;font-weight:bold;z-index:99999;';
  aviso.textContent = '✅ Adicionado!';
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 1500);
  
  // RESET COMPLETO
  quantidadeAtual = 1;
  adicionaisSelecionados = [];
  observacaoProdutoAtual = "";
  qtdAtualEl.textContent = "1";
  if(observacaoItemEl) observacaoItemEl.value = "";
  document.querySelectorAll('.btn-add-adicional').forEach(botao => {
    botao.textContent = '+';
    botao.classList.remove('selecionado');
  });
  atualizarTotalDetalhe();
});

// Atualizar carrinho visual
function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let totalItens = 0; let qtdTotal = 0;
  const usaTaxaEntrega = tipoAtendimentoEl.value === 'entrega';
  const taxa = usaTaxaEntrega ? CONFIG.taxaEntregaFixa : 0;
  
  if (carrinho.length === 0) {
    subtotaisEl.textContent = '0,00'; 
    valorTotalEl.textContent = '0,00';
    badgeQtdEl.textContent = '0'; 
    resumoValorEl.textContent = 'R$ 0,00';
    carrinhoContainer.classList.remove('ativo');
    return;
  }
  
  carrinhoContainer.classList.add('ativo');
  
  carrinho.forEach((item, index) => {
    const totalItem = item.preco * item.quantidade;
    totalItens += totalItem; 
    qtdTotal += item.quantidade;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div>
        <h4 class="item-nome">${item.nome}</h4>
        ${item.observacao ? `<p class="item-obs">Obs: ${item.observacao}</p>` : ''}
        <p>R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
      </div>
      <div class="qtd-controle">
        <button class="qtd-btn diminuir-item" data-index="${index}">&minus;</button>
        <span>${item.quantidade}</span>
        <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
      </div>
      <div class="item-total">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
    `;
    listaItensCarrinho.appendChild(itemEl);
  });
  
  const totalGeral = totalItens + taxa;
  subtotaisEl.textContent = totalItens.toFixed(2).replace('.', ',');
  valorTotalEl.textContent = totalGeral.toFixed(2).replace('.', ',');
  badgeQtdEl.textContent = qtdTotal;
  resumoValorEl.textContent = `R$ ${totalItens.toFixed(2).replace('.', ',')}`;
}

// Alterar quantidade no carrinho
listaItensCarrinho?.addEventListener('click', (e) => {
  const btn = e.target.closest('.qtd-btn');
  if (!btn) return;
  const idx = parseInt(btn.dataset.index);
  if (btn.classList.contains('aumentar-item')) {
    carrinho[idx].quantidade++;
  } else {
    if (carrinho[idx].quantidade === 1) {
      carrinho.splice(idx, 1);
      atualizarCarrinho();
      return;
    }
    carrinho[idx].quantidade--;
  }
  atualizarCarrinho();
});

// Abrir e fechar carrinho
abrirCarrinhoBtn?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  if (carrinho.length === 0) {
    avisoGeral.textContent = '🛒 Seu carrinho está vazio! Adicione produtos primeiro.';
    avisoGeral.classList.remove('oculto');
    setTimeout(() => avisoGeral.classList.add('oculto'), 2500);
    return;
  }
  avisoGeral.classList.add('oculto');
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  history.pushState({fixo: true}, '');
});

fecharModalBtn?.addEventListener('click', () => {
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// Finalizar pedido
document.getElementById('btn-finalizar')?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  
  if (!nomeEl.value.trim()) {
    avisoGeral.textContent = '⚠️ Digite seu nome completo!';
    avisoGeral.classList.remove('oculto');
    return;
  }
  
  if (tipoAtendimentoEl.value === 'entrega') {
    if (!cepEl.value.trim() || !numeroEl.value.trim()) {
      avisoGeral.textContent = '⚠️ Preencha CEP e Número da entrega!';
      avisoGeral.classList.remove('oculto');
      return;
    }
  }
  avisoGeral.classList.add('oculto');
  
  let mensagem = `🛒 *NOVO PEDIDO — ${CONFIG.nomeLoja}*\n\n`;
  mensagem += `👤 Cliente: ${nomeEl.value.trim()}\n`;
  mensagem += `📦 Tipo: ${tipoAtendimentoEl.value === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'}\n`;
  
  if (tipoAtendimentoEl.value === 'entrega') {
    mensagem += `📍 Endereço: ${ruaEl.value}, ${numeroEl.value} — ${bairroEl.value}\n`;
    mensagem += `   ${complementoEl.value ? `Compl: ${complementoEl.value} — ` : ''}${cidadeUfEl.value}\n`;
  }
  
  mensagem += `\n📋 Itens:\n`;
  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome} — R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    if(item.observacao) mensagem += `  ⤷ Obs: ${item.observacao}\n`;
  });
  
  const subtotal = carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0);
  const taxaEnt = tipoAtendimentoEl.value === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalFinal = subtotal + taxaEnt;
  
  mensagem += `\n💰 Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  if(taxaEnt>0) mensagem += `🚚 Taxa: R$ ${taxaEnt.toFixed(2).replace('.', ',')}\n`;
  mensagem += `✅ TOTAL: R$ ${totalFinal.toFixed(2).replace('.', ',')}\n`;
  mensagem += `💳 Pagamento: ${pagamentoEl.value}\n`;
  if(observacaoGeralEl.value.trim()) mensagem += `📝 Obs: ${observacaoGeralEl.value.trim()}\n`;
  
  const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
  
  setTimeout(limparTudoCarrinho, 600);
});

// Busca
campoBusca?.addEventListener('input', (e) => {
  const termo = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.produto').forEach(prod => {
    const texto = `${prod.dataset.nome} ${prod.dataset.descricao}`.toLowerCase();
    prod.style.display = !termo || texto.includes(termo) ? 'flex' : 'none';
  });
});

// Filtro categorias
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const cat = botao.dataset.categoria;
    document.querySelectorAll('.produto').forEach(prod => {
      prod.style.display = cat === 'todos' || prod.dataset.categoria === cat ? 'flex' : 'none';
    });
    window.scrollTo({top:0});
  });
});
