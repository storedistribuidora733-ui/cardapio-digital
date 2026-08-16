const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "Aberto 24h",
  textoStatusFechado: "Fechado • Abre às 07:00",
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

// Elementos gerais
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal')];
const btnLimparCarrinho = document.getElementById('btn-limpar');
const btnImprimir = document.getElementById('btn-imprimir-pedido');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const campoBusca = document.getElementById('campoBusca');
const carrinhoContainer = document.getElementById('carrinho-container');
const resumoValorEl = document.getElementById('resumo-valor');
const badgeQtdEl = document.getElementById('badge-qtd');
const areaCupom = document.getElementById('area-cupom-impressao');

// Resumo valores
const subtotaisEl = document.getElementById('subtotal-itens');
const valorTotalEl = document.getElementById('valor-total');

// Formulário
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
const observacaoGeralEl = document.getElementById('observacao-geral');

// Modal Produto
const modalProduto = document.getElementById('modal-produto');
const btnVoltarLista = document.getElementById('btn-voltar');
const imgDetalhe = document.getElementById('img-detalhe');
const nomeDetalhe = document.getElementById('nome-detalhe');
const descricaoDetalhe = document.getElementById('descricao-detalhe');
const precoOriginalEl = document.getElementById('preco-original');
const precoPromocionalEl = document.getElementById('preco-promocional');
const listaAdicionaisEl = document.getElementById('lista-adicionais');
const observacaoProdutoEl = document.getElementById('observacao-produto');
const qtdAtualEl = document.getElementById('qtd-atual');
const diminuirQtdBtn = document.getElementById('diminuir-qtd');
const aumentarQtdBtn = document.getElementById('aumentar-qtd');
const btnAdicionarDetalhe = document.getElementById('btn-adicionar-detalhe');

const pontoCab = document.getElementById('cab-ponto-status');
const textoCab = document.getElementById('cab-texto-status');

// ====================== Status da loja ======================
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

// ====================== Limpar carrinho ======================
function limparTudoCarrinho() {
  carrinho.length = 0;
  listaItensCarrinho.innerHTML = '';
  subtotaisEl.textContent = '0,00';
  valorTotalEl.textContent = '0,00';
  badgeQtdEl.textContent = '0';
  resumoValorEl.textContent = 'R$ 0,00';
  carrinhoContainer.style.display = 'none';
  nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada';
  pagamentoEl.value = 'Dinheiro';
  observacaoGeralEl.value = '';
  avisoGeral.classList.add('oculto');
  limparCamposEndereco();
  campoTaxaEntregaEl.classList.add('oculto');
  blocoEnderecoEl.classList.add('oculto');
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}
btnLimparCarrinho?.addEventListener('click', limparTudoCarrinho);

// ====================== Gerar Cupom para Impressão ======================
function gerarCupomHTML() {
  if (carrinho.length === 0 || !nomeEl.value.trim()) {
    alert('Preencha os dados do pedido primeiro!');
    return null;
  }

  const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
  const dataPedido = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxa = tipoAtendimento === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalGeral = totalItens + taxa;

  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += ` - ${complementoEl.value.trim()}`;
    enderecoCompleto += `\nBairro: ${bairroEl.value} | ${cidadeUfEl.value} | CEP: ${cepEl.value}`;
    if (referenciaEl.value.trim()) enderecoCompleto += `\nRef: ${referenciaEl.value.trim()}`;
  }

  let cupom = `
    <div class="area-impressao">
      <h2>${CONFIG.nomeLoja.toUpperCase()}</h2>
      <p style="text-align:center;">Pedido Nº ${numeroPedido}</p>
      <p style="text-align:center;">${dataPedido}</p>
      <hr>
      <p><strong>Cliente:</strong> ${nomeEl.value.trim()}</p>
      <p><strong>Tipo:</strong> ${tipoAtendimento === 'retirada' ? 'RETIRADA NA LOJA' : 'ENTREGA'}</p>
      ${tipoAtendimento === 'entrega' ? `<p><strong>Endereço:</strong><br>${enderecoCompleto}</p>` : ''}
      <hr>
      <p><strong>ITENS DO PEDIDO:</strong></p>
  `;

  carrinho.forEach(item => {
    cupom += `<p>${item.quantidade}x ${item.nome}`;
    if(item.observacao && item.observacao !== "Sem observação"){
      cupom += `\n   Obs: ${item.observacao}`;
    }
    cupom += ` ............ R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>`;
  });

  cupom += `
    <hr>
    <p>Subtotal .................. R$ ${totalItens.toFixed(2).replace('.', ',')}</p>
    ${tipoAtendimento === 'entrega' ? `<p>Taxa Entrega .............. R$ ${taxa.toFixed(2).replace('.', ',')}</p>` : ''}
    <p class="linha-total">TOTAL ..................... R$ ${totalGeral.toFixed(2).replace('.', ',')}</p>
    <p><strong>Pagamento:</strong> ${pagamentoEl.value}</p>
    ${observacaoGeralEl.value.trim() ? `<p><strong>Obs Geral:</strong> ${observacaoGeralEl.value.trim()}</p>` : ''}
    <hr>
    <p style="text-align:center; font-size:10px;">Obrigado pela preferência! Volte sempre!</p>
    <br><br><br>
    </div>
  `;

  return cupom;
}

// Botão Imprimir - DIRETO NA IMPRESSORA SEM TELA EXTRA
btnImprimir?.addEventListener('click', () => {
  const cupom = gerarCupomHTML();
  if (!cupom) return;
  
  areaCupom.innerHTML = cupom;
  areaCupom.classList.remove('oculto');
  
  setTimeout(() => {
    window.print();
    areaCupom.classList.add('oculto');
  }, 150);
});

// ====================== Atendimento e endereço ======================
tipoAtendimentoEl?.addEventListener('change', () => {
  if (tipoAtendimentoEl.value === 'entrega') {
    campoTaxaEntregaEl.classList.remove('oculto');
    blocoEnderecoEl.classList.remove('oculto');
    taxaEntregaEl.value = CONFIG.taxaEntregaFixa.toFixed(2).replace('.', ',');
  } else {
    campoTaxaEntregaEl.classList.add('oculto');
    blocoEnderecoEl.classList.add('oculto');
    limparCamposEndereco();
  }
  atualizarCarrinho();
});

cepEl?.addEventListener('input', () => {
  let cep = cepEl.value.replace(/\D/g, '');
  if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  cepEl.value = cep;
});

cepEl?.addEventListener('blur', async () => {
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
  if(!cepEl) return;
  cepEl.value = ''; numeroEl.value = ''; complementoEl.value = ''; referenciaEl.value = '';
  ruaEl.value = ''; bairroEl.value = ''; cidadeUfEl.value = '';
  avisoCepEl.textContent = 'Digite o CEP para preencher automaticamente';
  avisoCepEl.style.color = '#2563eb';
}

// ====================== Produtos e Modal ======================
document.querySelectorAll('.produto').forEach(produto => {
  produto.addEventListener('click', () => {
    if (!verificarStatusLoja(true)) return;

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

    quantidadeAtual = 1;
    adicionaisSelecionados = [];
    qtdAtualEl.textContent = quantidadeAtual;
    observacaoProdutoEl.value = ""; // Limpa observação ao abrir novo produto

    imgDetalhe.src = produtoAtual.imagem;
    nomeDetalhe.textContent = produtoAtual.nome;
    descricaoDetalhe.textContent = produtoAtual.descricao;
    precoOriginalEl.textContent = `R$ ${(produtoAtual.preco * 1.2).toFixed(2).replace('.', ',')}`;
    precoPromocionalEl.textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    atualizarTotalDetalhe();

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
  });
});

btnVoltarLista?.addEventListener('click', () => {
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

diminuirQtdBtn?.addEventListener('click', () => {
  if (quantidadeAtual > 1) {
    quantidadeAtual--;
    qtdAtualEl.textContent = quantidadeAtual;
    atualizarTotalDetalhe();
  }
});
aumentarQtdBtn?.addEventListener('click', () => {
  quantidadeAtual++;
  qtdAtualEl.textContent = quantidadeAtual;
  atualizarTotalDetalhe();
});

listaAdicionaisEl?.addEventListener('click', (e) => {
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
  if(!produtoAtual) return;
  const totalAdicionais = adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  const total = (produtoAtual.preco + totalAdicionais) * quantidadeAtual;
  btnAdicionarDetalhe.textContent = `Adicionar R$ ${total.toFixed(2).replace('.', ',')}`;
}

btnAdicionarDetalhe?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;

  const observacao = observacaoProdutoEl.value.trim() || "Sem observação";

  const nomeCompleto = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a => a.nome).join(', ')})`
    : produtoAtual.nome;

  const precoTotal = produtoAtual.preco + adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);

  const itemExistente = carrinho.find(i => i.nome === nomeCompleto && i.observacao === observacao);
  if (itemExistente) {
    itemExistente.quantidade += quantidadeAtual;
  } else {
    carrinho.push({ 
      nome: nomeCompleto, 
      preco: precoTotal, 
      quantidade: quantidadeAtual,
      observacao: observacao
    });
  }

  atualizarCarrinho();
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// ====================== Atualização do carrinho ======================
function
