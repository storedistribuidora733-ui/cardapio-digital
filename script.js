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
const observacaoEl = document.getElementById('observacao');

// Modal Produto
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
  observacaoEl.value = '';
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
    cupom += `<p>${item.quantidade}x ${item.nome} ............ R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>`;
  });

  cupom += `
    <hr>
    <p>Subtotal .................. R$ ${totalItens.toFixed(2).replace('.', ',')}</p>
    ${tipoAtendimento === 'entrega' ? `<p>Taxa Entrega .............. R$ ${taxa.toFixed(2).replace('.', ',')}</p>` : ''}
    <p class="linha-total">TOTAL ..................... R$ ${totalGeral.toFixed(2).replace('.', ',')}</p>
    <p><strong>Pagamento:</strong> ${pagamentoEl.value}</p>
    ${observacaoEl.value.trim() ? `<p><strong>Obs:</strong> ${observacaoEl.value.trim()}</p>` : ''}
    <hr>
    <p style="text-align:center; font-size:10px;">Obrigado pela preferência! Volte sempre!</p>
    <br><br><br>
    </div>
  `;

  return cupom;
}

// Botão Imprimir
btnImprimir?.addEventListener('click', () => {
  const cupom = gerarCupomHTML();
  if (!cupom) return;
  
  areaCupom.innerHTML = cupom;
  areaCupom.classList.remove('oculto');
  
  setTimeout(() => {
    window.print();
    areaCupom.classList.add('oculto');
  }, 100);
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

// ====================== Atualização do carrinho ======================
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
    carrinhoContainer.style.display = 'none';
    return;
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
  document.querySelectorAll('.diminuir-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      if (carrinho[idx].quantidade > 1) {
        carrinho[idx].quantidade--;
      } else {
        carrinho.splice(idx, 1);
      }
      atualizarCarrinho();
    });
  });

  document.querySelectorAll('.aumentar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      carrinho[idx].quantidade++;
      atualizarCarrinho();
    });
  });
}

// Abrir e fechar carrinho
abrirCarrinhoBtn?.addEventListener('click', () => {
  if (carrinho.length === 0) {
    avisoGeral.textContent = 'Adicione produtos ao carrinho primeiro!';
    avisoGeral.classList.remove('oculto');
    setTimeout(() => avisoGeral.classList.add('oculto'), 3000);
    return;
  }
  atualizarCarrinho();
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(btn => {
  btn?.addEventListener('click', () => {
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });
});

// Busca de produtos
campoBusca?.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(produto => {
    const nome = produto.dataset.nome.toLowerCase();
    const desc = (produto.dataset.descricao || '').toLowerCase();
    produto.style.display = nome.includes(termo) || desc.includes(termo) ? 'flex' : 'none';
  });
});

// Filtro por categorias
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    
    const categoriaEscolhida = botao.dataset.categoria;
    document.querySelectorAll('.produto').forEach(produto => {
      const catProduto = produto.dataset.categoria;
      produto.style.display = (categoriaEscolhida === 'todos' || catProduto === categoriaEscolhida) ? 'flex' : 'none';
    });
  });
});

// Enviar pedido pelo WhatsApp
document.getElementById('btn-finalizar')?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  
  if (!nomeEl.value.trim()) {
    avisoGeral.textContent = 'Preencha seu nome completo!';
    avisoGeral.classList.remove('oculto');
    return;
  }

  const tipo = tipoAtendimentoEl.value;
  const taxa = tipo === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalFinal = totalItens + taxa;

  let mensagem = `📦 *NOVO PEDIDO - ${CONFIG.nomeLoja}*\n`;
  mensagem += `👤 Cliente: ${nomeEl.value.trim()}\n`;
  mensagem += `🛍️ Tipo: ${tipo === 'retirada' ? 'RETIRADA NA LOJA' : 'ENTREGA'}\n\n`;
  mensagem += `📝 *ITENS:*\n`;

  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n💰 *RESUMO:*\n`;
  mensagem += `Subtotal: R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;
  if (tipo === 'entrega') mensagem += `Taxa de entrega: R$ ${taxa.toFixed(2).replace('.', ',')}\n`;
  mensagem += `*TOTAL: R$ ${totalFinal.toFixed(2).replace('.', ',')}*\n\n`;

  if (tipo === 'entrega') {
    mensagem += `📍 *ENDEREÇO:*\n`;
    mensagem += `Rua: ${ruaEl.value || 'Não informado'}, Nº ${numeroEl.value || 'Não informado'}\n`;
    if (complementoEl.value.trim()) mensagem += `Complemento: ${complementoEl.value.trim()}\n`;
    mensagem += `Bairro: ${bairroEl.value || 'Não informado'} | ${cidadeUfEl.value || 'Não informado'} | CEP: ${cepEl.value || 'Não informado'}\n`;
    if (referenciaEl.value.trim()) mensagem += `Ponto de referência: ${referenciaEl.value.trim()}\n\n`;
  }

  mensagem += `💳 *Pagamento:* ${pagamentoEl.value}\n`;
  if (observacaoEl.value.trim()) mensagem += `📌 *Observação:* ${observacaoEl.value.trim()}`;

  const linkWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(linkWhatsApp, '_blank');
  
  limparTudoCarrinho();
});
