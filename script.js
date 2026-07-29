const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoStatusAberto: "Aberto até às 23:00",
  textoStatusFechado: "Fechado • Abre às 07:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "ALISON BURGER",
  taxaEntregaPadrao: 8.00
};

let carrinho = [];
let qtdAtual = 1;
let adicionaisEscolhidos = [];

function atualizarStatusLoja() {
  const agora = new Date();
  const hora = agora.getHours();
  let aberto = false;

  if (CONFIG.horaAbertura < CONFIG.horaFechamento) {
    aberto = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
  } else {
    aberto = hora >= CONFIG.horaAbertura || hora < CONFIG.horaFechamento;
  }

  const ponto = document.getElementById('cab-ponto-status');
  const texto = document.getElementById('cab-texto-status');

  if (aberto) {
    ponto.className = "ponto-status aberto";
    texto.textContent = CONFIG.textoStatusAberto;
  } else {
    ponto.className = "ponto-status fechado";
    texto.textContent = CONFIG.textoStatusFechado;
  }
  return aberto;
}

const listaProdutosEl = document.querySelector('.lista-produtos');
const botoesCategoria = document.querySelectorAll('.categoria-btn');
const campoBusca = document.getElementById('campoBusca');

botoesCategoria.forEach(btn => {
  btn.addEventListener('click', () => {
    botoesCategoria.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    filtrarProdutos(btn.dataset.categoria, campoBusca.value.trim().toLowerCase());
  });
});

campoBusca.addEventListener('input', () => {
  const cat = document.querySelector('.categoria-btn.ativo').dataset.categoria;
  filtrarProdutos(cat, campoBusca.value.trim().toLowerCase());
});

function filtrarProdutos(categoria, termo) {
  document.querySelectorAll('.produto').forEach(prod => {
    const catOk = categoria === 'todos' || prod.dataset.categoria === categoria;
    const nomeOk = prod.dataset.nome.toLowerCase().includes(termo);
    prod.style.display = (catOk && nomeOk) ? 'flex' : 'none';
  });
}

const modalProduto = document.getElementById('modal-produto');
document.querySelectorAll('.produto').forEach(prod => {
  prod.addEventListener('click', () => {
    qtdAtual = 1; adicionaisEscolhidos = [];
    document.getElementById('img-detalhe').src = prod.dataset.imagem;
    document.getElementById('nome-detalhe').textContent = prod.dataset.nome;
    document.getElementById('descricao-detalhe').textContent = prod.dataset.descricao;
    document.getElementById('preco-promocional').textContent = `R$ ${parseFloat(prod.dataset.preco).toFixed(2).replace('.', ',')}`;
    document.getElementById('qtd-atual').textContent = '1';
    document.getElementById('lista-adicionais').innerHTML = '';
    modalProduto.classList.remove('oculto');
  });
});
document.getElementById('btn-voltar').addEventListener('click', () => modalProduto.classList.add('oculto'));
document.getElementById('diminuir-qtd').addEventListener('click', () => { if(qtdAtual>1) qtdAtual--; document.getElementById('qtd-atual').textContent=qtdAtual; });
document.getElementById('aumentar-qtd').addEventListener('click', () => { qtdAtual++; document.getElementById('qtd-atual').textContent=qtdAtual; });
document.getElementById('btn-adicionar-detalhe').addEventListener('click', () => {
  const nome = document.getElementById('nome-detalhe').textContent;
  const precoTxt = document.getElementById('preco-promocional').textContent.replace('R$ ','').replace(',','.');
  const preco = parseFloat(precoTxt);
  carrinho.push({nome, preco, qtd: qtdAtual});
  atualizarCarrinhoTela();
  modalProduto.classList.add('oculto');
});

const modalCarrinho = document.getElementById('modal-carrinho');
document.getElementById('abrir-carrinho').addEventListener('click', () => modalCarrinho.classList.remove('oculto'));
document.getElementById('fechar-modal').addEventListener('click', () => modalCarrinho.classList.add('oculto'));
document.getElementById('btn-limpar').addEventListener('click', () => { carrinho=[]; atualizarCarrinhoTela(); modalCarrinho.classList.add('oculto'); });

function atualizarCarrinhoTela() {
  const container = document.getElementById('carrinho-container');
  const listaEl = document.getElementById('lista-itens-carrinho');
  const qtdEl = document.getElementById('qtd-carrinho');
  const totalEl = document.getElementById('valor-total');
  const resumoEl = document.getElementById('resumo-carrinho');

  const totalItens = carrinho.reduce((s,i)=>s+i.qtd,0);
  const totalValor = carrinho.reduce((s,i)=>s+(i.preco*i.qtd),0);

  qtdEl.textContent = totalItens;
  totalEl.textContent = totalValor.toFixed(2).replace('.',',');
  resumoEl.textContent = `${totalItens} itens • R$ ${totalValor.toFixed(2).replace('.',',')}`;

  listaEl.innerHTML = '';
  carrinho.forEach(item => {
    const el = document.createElement('div');
    el.className = 'item-carrinho';
    el.innerHTML = `<span>${item.qtd}x ${item.nome}</span><span>R$ ${(item.preco*item.qtd).toFixed(2).replace('.',',')}</span>`;
    listaEl.appendChild(el);
  });

  container.style.display = totalItens>0 ? 'block' : 'none';
}

const tipoAtend = document.getElementById('tipo-atendimento');
const blocoEnd = document.getElementById('bloco-endereco');
const campoTaxa = document.getElementById('campo-taxa-entrega');
tipoAtend.addEventListener('change', () => {
  const entrega = tipoAtend.value === 'entrega';
  blocoEnd.classList.toggle('oculto', !entrega);
  campoTaxa.classList.toggle('oculto', !entrega);
});
document.getElementById('cep').addEventListener('blur', async function() {
  const cep = this.value.replace(/\D/g,'');
  if(cep.length!==8) return;
  try{
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if(!d.erro){
      document.getElementById('rua').value = d.logradouro||'';
      document.getElementById('bairro').value = d.bairro||'';
      document.getElementById('cidade-uf').value = `${d.localidade||''} / ${d.uf||''}`;
    }
  }catch(e){}
});

const alertaFechado = document.getElementById('alerta-fechado');
document.getElementById('btn-entendi').addEventListener('click', () => alertaFechado.classList.add('oculto'));
document.getElementById('btn-finalizar').addEventListener('click', () => {
  const aberto = atualizarStatusLoja();
  if(!aberto){
    alertaFechado.classList.remove('oculto');
    return;
  }
  if(carrinho.length===0){
    document.getElementById('aviso-geral').textContent = 'Adicione itens ao carrinho!';
    document.getElementById('aviso-geral').classList.remove('oculto');
    return;
  }
  const nome = document.getElementById('nome-cliente').value.trim();
  if(!nome){
    document.getElementById('aviso-geral').textContent = 'Informe seu nome!';
    document.getElementById('aviso-geral').classList.remove('oculto');
    return;
  }
  const formaPag = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacao').value.trim();
  const entrega = tipoAtend.value === 'entrega';
  let enderecoTxt = '';
  if(entrega){
    const rua = document.getElementById('rua').value.trim();
    const num = document.getElementById('numero').value.trim();
    const bai = document.getElementById('bairro').value.trim();
    const cid = document.getElementById('cidade-uf').value.trim();
    enderecoTxt = `\n📍 Endereço: ${rua}, Nº ${num} - ${bai} - ${cid}`;
  }
  let mensagem = `🍔 *Pedido ${CONFIG.nomeLoja}*\n👤 Nome: ${nome}${enderecoTxt}\n📦 ${entrega?'Entrega':'Retirada'}\n💳 Pagamento: ${formaPag}\n`;
  mensagem += `\n📋 Itens:\n`;
  carrinho.forEach(i => mensagem += `• ${i.qtd}x ${i.nome} — R$ ${(i.preco*i.qtd).toFixed(2).replace('.',',')}\n`);
  const total = carrinho.reduce((s,i)=>s+i.preco*i.qtd,0);
  if(entrega) total += CONFIG.taxaEntregaPadrao;
  mensagem += `\n💰 Total: R$ ${total.toFixed(2).replace('.',',')}`;
  if(obs) mensagem += `\n📝 Obs: ${obs}`;

  const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url,'_blank');
  modalCarrinho.classList.add('oculto');
  carrinho=[]; atualizarCarrinhoTela();
});

window.addEventListener('DOMContentLoaded', () => {
  atualizarStatusLoja();
  atualizarCarrinhoTela();
});
