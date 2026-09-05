const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "ABERTO AGORA",
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

// ✅ Elementos — ATUALIZADO PARA O NOVO CABEÇALHO
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const contadorCarrinhoEl = document.querySelector('.contador-badge');
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
const pontoCab = document.querySelector('.bolinha-verde');
const textoCab = document.querySelector('.texto-status');

// ==============================================
// NAVEGAÇÃO — NÃO SAI DO SITE
// ==============================================
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
  window.scrollTo({top:0});
  history.pushState({fixo: true}, '');
});

// ==============================================
// Status da Loja
// ==============================================
function verificarStatusLoja(mostrarAviso = false) {
  const horaAtual = new Date().getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;
  if(pontoCab && textoCab){
    pontoCab.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
    textoCab.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
  }
  if (!lojaAberta && mostrarAviso) alertaFechado.classList.add("oculto");
  return lojaAberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi?.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// ==============================================
// Funções Auxiliares
// ==============================================
function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contadorCarrinhoEl.textContent = totalItens;
    badgeQtdEl.textContent = totalItens;
    if (totalItens > 0) {
        contadorCarrinhoEl.classList.remove('oculto');
        carrinhoContainer.classList.add('ativo');
    } else {
        contadorCarrinhoEl.classList.add('oculto');
        carrinhoContainer.classList.remove('ativo');
    }
}

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
  atualizarContadorCarrinho();
}
btnLimparCarrinho?.addEventListener('click', limparTudoCarrinho);

// Tipo de Atendimento
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

// ==============================================
// Abrir Produto no Detalhe
// ==============================================
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

// Quantidade no Detalhe
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

// ==============================================
// Adicionar ao Carrinho — RESET TOTAL APÓS
// ==============================================
btnAdicionarDetalhe?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  
  observacaoProdutoAtual = observacaoItemEl ? observacaoItemEl.value.trim() : "";
  const nomeCompleto = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a => a.nome).join(', ')
