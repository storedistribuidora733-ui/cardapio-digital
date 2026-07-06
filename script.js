const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoStatusAberto: "Aberto até às 23:00",
  textoStatusFechado: "Fechado",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

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

cepEl.addEventListener('input', () => {
  let cep = cepEl.value.replace(/\D/g, '');
  if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  cepEl.value = cep;
});

cepEl.addEventListener('blur', async () => {
  const cepNumeros = cepEl.value.replace(/\D/g, '');
  if (cepNumeros.length !== 8) {
    avisoCepEl.textContent = 'Preencha o CEP ou os dados manualmente';
    avisoCepEl.style.color = '#2563eb';
    return;
  }

  avisoCepEl.textContent = 'Buscando endereço...';
  avisoCepEl.style.color = '#2563eb';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      avisoCepEl.textContent = 'CEP não encontrado! Preencha manualmente.';
      avisoCepEl.style.color = '#dc2626';
      return;
    }

    ruaEl.value = dados.logradouro || '';
    bairroEl.value = dados.bairro || '';
    cidadeUfEl.value = `${dados.localidade} / ${dados.uf}`;
    avisoCepEl.textContent = 'Endereço preenchido! Você pode alterar se precisar.';
    avisoCepEl.style.color = '#22c55e';

  } catch (erro) {
    avisoCepEl.textContent = 'Erro ao buscar CEP. Preencha manualmente.';
    avisoCepEl.style.color = '#dc2626';
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
  avisoCepEl.textContent = '💡 Digite o CEP ou preencha os dados abaixo manualmente';
  avisoCepEl.style.color = '#2563eb';
}

function verificarStatusLoja(mostrarAviso = false) {
  const agora = new Date();
  const horaAtual = agora.getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;

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

document.querySelectorAll('.qtd-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    const valorEl = botao.parentElement.querySelector('.qtd-valor');
    let valor = parseInt(valorEl.textContent);
    if (botao.classList.contains('aumentar')) valor++;
    if (botao.classList.contains('diminuir') && valor > 0) valor--;
    valorEl.textContent = valor;
  });
});

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
  resumoCarrinhoEl.innerHTML = `${qtdTotal} itens • R$ ${total.toFixed(2).replace('.', ',')}`;

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

document.getElementById('btn-finalizar').addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  const nome = nomeEl.value.trim();
  const pagamento = pagamentoEl.value;
  const obs = obsEl.value.trim();

  const tipoAtendimento = tipoAtendimentoEl.value;
  const taxaEntrega = parseFloat(taxaEntregaEl.value.replace(',', '.')) || 0;
  const totalItens = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
  const totalGeral = totalItens + taxaEntrega;

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

  if (tipoAtendimento === 'entrega') {
    const rua = ruaEl.value.trim();
    const numero = numeroEl.value.trim();

    if (!rua) {
      avisoGeral.textContent = 'Preencha o endereço! Você pode usar o CEP ou digitar manualmente.';
      avisoGeral.classList.remove('oculto');
      return;
    }
    if (!numero) {
      avisoGeral.textContent = 'Informe o número da residência!';
      avisoGeral.classList.remove('oculto');
      return;
    }
  }

  let enderecoCompleto = '';
  if (tipoAtendimento === 'entrega') {
    enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
    if (complementoEl.value.trim()) enderecoCompleto += ` - ${complementoEl.value.trim()}`;
    enderecoCompleto += ` | Bairro: ${bairroEl.value} | ${cidadeUfEl.value} | CEP: ${cepEl.value}`;
    if (referenciaEl.value.trim()) enderecoCompleto += ` | Referência: ${referenciaEl.value.trim()}`;
  }

  let mensagem = `
