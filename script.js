const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "Aberto até às 24:00",
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
let observacaoProdutoAtual = "";

// Elementos gerais
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal')];
const btnLimparCarrinho = document.getElementById('btn-limpar');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const campoBusca = document.getElementById('campoBusca');
const carrinhoFixoEl = document.querySelector('.carrinho-fixo'); // Pegamos o carrinho de baixo
const resumoValorEl = document.getElementById('resumo-valor');
const badgeQtdEl = document.getElementById('badge-qtd');

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

// Modal Produto
const modalProduto = document.getElementById('modal-produto');
const btnVoltarLista = document.getElementById('btn-voltar');
const imgDetalhe = document.getElementById('img-detalhe');
const nomeDetalhe = document.getElementById('nome-detalhe');
const descricaoDetalhe = document.getElementById('descricao-detalhe');
const precoOriginalEl = document.getElementById('preco-original');
const precoPromocionalEl = document.getElementById('preco-promocional');
const listaAdicionaisEl = document.getElementById('lista-adicionais');
const blocoAdicionais = document.querySelector('.bloco-adicionais');
const obsProdutoEl = document.getElementById('obs-produto');
const qtdAtualEl = document.getElementById('qtd-atual');
const diminuirQtdBtn = document.getElementById('diminuir-qtd');
const aumentarQtdBtn = document.getElementById('aumentar-qtd');
const btnAdicionarDetalhe = document.getElementById('btn-adicionar-detalhe');

const pontoCab = document.getElementById('cab-ponto-status');
const textoCab = document.getElementById('cab-texto-status');

// ======================
// Status da loja
// ======================
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

// ======================
// Limpar carrinho → ESCONDE TUDO
// ======================
function limparTudoCarrinho() {
  carrinho.length = 0;
  listaItensCarrinho.innerHTML = '';
  subtotaisEl.textContent = '0,00';
  valorTotalEl.textContent = '0,00';
  badgeQtdEl.textContent = '0';
  resumoValorEl.textContent = 'R$ 0,00';
  carrinhoFixoEl.classList.remove('ativo'); // ✅ TIRA ATIVO → some
  nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada';
  pagamentoEl.value = 'Dinheiro';
  avisoGeral.classList.add('oculto');
  removerBordasVermelhas();
  campoTaxaEntregaEl.classList.add('oculto');
  blocoEnderecoEl.classList.add('oculto');
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}
btnLimparCarrinho?.addEventListener('click', limparTudoCarrinho);

// ======================
// Funções auxiliares bordas vermelhas
// ======================
function adicionarBordaVermelha(el) {
  if(el) el.style.border = '2px solid #dc2626';
}
function removerBordaVermelha(el) {
  if(el) el.style.border = '';
}
function removerBordasVermelhas() {
  removerBordaVermelha(nomeEl);
  removerBordaVermelha(cepEl);
  removerBordaVermelha(numeroEl);
}

// ======================
// Atendimento e endereço / ViaCEP
// ======================
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
  removerBordaVermelha(cepEl);
  let cep = cepEl.value.replace(/\D/g, '');
  if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  cepEl.value = cep;
});
numeroEl?.addEventListener('input', () => removerBordaVermelha(numeroEl));
nomeEl?.addEventListener('input', () => removerBordaVermelha(nomeEl));

cepEl?.addEventListener('blur', async () => {
  const cepNumeros = cepEl.value.replace(/\D/g, '');
  if (cepNumeros.length !== 8) {
    avisoCepEl.textContent = 'CEP inválido! Digite 8 dígitos.';
    avisoCepEl.style.color = '#dc2626';
    adicionarBordaVermelha(cepEl);
    limparCamposEndereco();
    return;
  }
  avisoCepEl.textContent = 'Buscando endereço...';
  avisoCepEl.style.color = '#2563eb';
  removerBordaVermelha(cepEl);
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
    adicionarBordaVermelha(cepEl);
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

// ======================
// Abrir produto individual
// ======================
document.querySelectorAll('.produto').forEach(produto => {
  produto.addEventListener('click', () => {
    if (!verificarStatusLoja(true)) return;

    const categoriaProduto = produto.dataset.categoria;

    produtoAtual = {
      nome: produto.dataset.nome,
      preco: parseFloat(produto.dataset.preco),
      descricao: produto.dataset.descricao || 'Sem descrição.',
      imagem: produto.dataset.imagem || '',
      categoria: categoriaProduto,
      adicionais: [
        { nome: 'Bacon Suculento', preco: 2.90 },
        { nome: 'Queijo Extra', preco: 2.50 },
        { nome: 'Catupiry', preco: 2.00 },
        { nome: 'Ovo', preco: 1.50 }
      ]
    };

    quantidadeAtual = 1;
    adicionaisSelecionados = [];
    if(obsProdutoEl) obsProdutoEl.value = "";
    qtdAtualEl.textContent = quantidadeAtual;

    imgDetalhe.src = produtoAtual.imagem;
    nomeDetalhe.textContent = produtoAtual.nome;
    descricaoDetalhe.textContent = produtoAtual.descricao;
    precoOriginalEl.textContent = `R$ ${(produtoAtual.preco * 1.2).toFixed(2).replace('.', ',')}`;
    precoPromocionalEl.textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
    atualizarTotalDetalhe();

    if (produtoAtual.categoria === 'bebidas') {
      blocoAdicionais.classList.add('oculto');
      listaAdicionaisEl.innerHTML = '';
    } else {
      blocoAdicionais.classList.remove('oculto');
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
    }

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

// ======================
// Adicionar ao carrinho → ATIVA O CARRINHO
// ======================
btnAdicionarDetalhe?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;

  const totalAdicionais = adicionaisSelecionados.reduce((soma, a) => soma + a.preco, 0);
  const precoTotal = produtoAtual.preco + totalAdicionais;
  const obsProduto = obsProdutoEl ? obsProdutoEl.value.trim() : "";

  carrinho.push({
    nome: produtoAtual.nome,
    preco: precoTotal,
    quantidade: quantidadeAtual,
    adicionais: [...adicionaisSelecionados],
    observacao: obsProduto
  });

  atualizarCarrinho(); // ✅ Ativa e mostra
  modalProduto.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// ======================
// Atualizar carrinho → CONTROLA .ativo
// ======================
function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let totalItens = 0; let qtdTotal = 0;
  const usaTaxaEntrega = tipoAtendimentoEl.value === 'entrega';
  const taxa = usaTaxaEntrega ? CONFIG.taxaEntregaFixa : 0;

  // SE VAZIO → TIRA ATIVO
  if (carrinho.length === 0) {
    subtotaisEl.textContent = '0,00';
    valorTotalEl.textContent = '0,00';
    badgeQtdEl.textContent = '0';
    resumoValorEl.textContent = 'R$ 0,00';
    carrinhoFixoEl.classList.remove('ativo'); // ✅ SOME
    return;
  }

  // SE TEM ITEM → COLOCA ATIVO
  carrinhoFixoEl.classList.add('ativo'); // ✅ APARECE

  carrinho.forEach((item, index) => {
    const totalItem = item.preco * item.quantidade;
    totalItens += totalItem; qtdTotal += item.quantidade;

    let txtAdicionais = "";
    if(item.adicionais.length > 0){
      txtAdicionais = `<p style="font-size:0.8rem; color:#22c55e; margin:2px 0;">+ Adicionais: ${item.adicionais.map(a=>a.nome).join(', ')}</p>`;
    }
    let txtObs = "";
    if(item.observacao){
      txtObs = `<p style="font-size:0.8rem; color:#e67e22; font-style:italic; margin:2px 0;">📝 Obs: ${item.observacao}</p>`;
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div class="item-info">
        <h4 class="item-nome">${item.quantidade}x ${item.nome}</h4>
        ${txtAdicionais}
        ${txtObs}
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
    atualizarCarrinho(); // ✅ Se apagar último, some automaticamente
  }));
}

// ======================
// Abrir carrinho → só se tem item
// ======================
abrirCarrinhoBtn?.addEventListener('click', () => {
  if (carrinho.length === 0) {
    avisoGeral.textContent = "⚠️ Adicione um produto primeiro!";
    avisoGeral.style.color = "#dc2626";
    avisoGeral.classList.remove('oculto');
    setTimeout(() => avisoGeral.classList.add('oculto'), 3000);
    return;
  }
  if (!verificarStatusLoja(true)) return;
  atualizarCarrinho();
  removerBordasVermelhas();
  avisoGeral.classList.add('oculto');
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(b => b.addEventListener('click', () => {
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}));

// ======================
// Categorias e Busca
// ======================
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

// ======================
// Enviar pedido WhatsApp
// ======================
document.getElementById('btn-finalizar')?.addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  removerBordasVermelhas();

  const nome = nomeEl.value.trim();
  const pagamento = pagamentoEl.value;
  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxa = tipoAtendimento === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalGeral = totalItens + taxa;

  const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
  const dataPedido = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const observacaoEl = document.getElementById('observacao');
  const observacaoGeral = observacaoEl ? observacaoEl.value.trim() : '';

  let temErro = false;

  if (carrinho.length === 0) {
    avisoGeral.textContent = "Adicione pelo menos um produto!";
    avisoGeral.style.color = "#dc2626";
    avisoGeral.classList.remove('oculto');
    return;
  }

  if (!nome) { adicionarBordaVermelha(nomeEl); temErro = true; }

  if (tipoAtendimento === 'entrega') {
    const cepValido = cepEl.value.trim().replace(/\D/g, '').length === 8;
    if (!cepValido) { adicionarBordaVermelha(cepEl); temErro = true; }
    if (!ruaEl.value.trim()) { adicionarBordaVermelha(cepEl); temErro = true; }
    if (!numeroEl.value.trim()) { adicionarBordaVermelha(numeroEl); temErro = true; }
  }

  if (temErro) {
    avisoGeral.textContent = "⚠️ Preencha os campos com borda vermelha!";
    avisoGeral.style.color = "#dc2626";
    avisoGeral.classList.remove('oculto');
    return;
  }

  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += `\n  Complemento: ${complementoEl.value.trim()}`;
    enderecoCompleto += `\n  Bairro: ${bairroEl.value}`;
    enderecoCompleto += `\n  Cidade/UF: ${cidadeUfEl.value}`;
    enderecoCompleto += `\n  CEP: ${cepEl.value}`;
    if (referenciaEl.value.trim()) enderecoCompleto += `\n  Ponto de referência: ${referenciaEl.value.trim()}`;
  }

  let mensagem = `🍔 *PEDIDO #${numeroPedido} — ${CONFIG.nomeLoja}*
📅 ${dataPedido}
👤 Cliente: ${nome}
📦 Tipo: ${tipoAtendimento === 'retirada' ? 'Retirada na loja' : 'Entrega'}`;

  if (tipoAtendimento === 'entrega') mensagem += `\n📍 Endereço:\n${enderecoCompleto}`;

  mensagem += `\n\n📋 *ITENS DO PEDIDO*:\n`;
  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome}`;
    if(item.adicionais.length > 0) mensagem += `\n   ➕ Adicionais: ${item.adicionais.map(a=>a.nome).join(', ')}`;
    if(item.observacao) mensagem += `\n   📝 Obs: ${item.observacao}`;
    mensagem += `\n   → R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n💵 *RESUMO DE VALORES*
Subtotal: R$ ${totalItens.toFixed(2).replace('.', ',')}
${tipoAtendimento === 'entrega' ? `Taxa de entrega: R$ ${taxa.toFixed(2).replace('.', ',')}` : 'Sem taxa de retirada'}
*TOTAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*

💳 Forma de pagamento: ${pagamento}`;

  if (observacaoGeral) mensagem += `\n📝 Observação geral do pedido: ${observacaoGeral}`;

  const urlWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsApp, '_blank');

  limparTudoCarrinho();
});
