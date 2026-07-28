// ==============================================
// ⚙️ CONFIGURAÇÕES — AJUSTE AQUI SE PRECISAR
// ==============================================
const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 24,
  textoStatusAberto: "Aberto até às 24:00",
  textoStatusFechado: "Fechado • Abre às 07:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

// ==============================================
// 🛒 VARIÁVEIS GERAIS
// ==============================================
let carrinho = [];
let produtoAtual = null;
let qtdSelecionada = 1;
let adicionaisSelecionados = [];

// ==============================================
// 🚀 INICIALIZAÇÃO
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  atualizarStatusLoja();
  configurarCategorias();
  configurarBusca();
  configurarCliqueProdutos();
  configurarModalProduto();
  configurarCarrinho();
  configurarCEP();
  configurarRolagemCategorias();
});

// ==============================================
// ⏰ STATUS DA LOJA
// ==============================================
function atualizarStatusLoja() {
  const agora = new Date();
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  const horaTotal = hora + (minutos / 60);

  let aberto = false;
  if (CONFIG.horaAbertura < CONFIG.horaFechamento) {
    aberto = horaTotal >= CONFIG.horaAbertura && horaTotal < CONFIG.horaFechamento;
  } else {
    aberto = horaTotal >= CONFIG.horaAbertura || horaTotal < CONFIG.horaFechamento;
  }

  const pontos = document.querySelectorAll('.ponto-status');
  const textos = document.querySelectorAll('#texto-status, #texto-status-modal');

  pontos.forEach(p => p.style.backgroundColor = aberto ? CONFIG.corStatusAberto : CONFIG.corStatusFechado);
  textos.forEach(t => {
    t.textContent = aberto ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
    t.style.color = aberto ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  });
}

// ==============================================
// 📂 CATEGORIAS
// ==============================================
function configurarCategorias() {
  const botoes = document.querySelectorAll('.categoria-btn');
  const produtos = document.querySelectorAll('.produto');

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      botoes.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');

      const cat = btn.dataset.categoria;
      produtos.forEach(p => {
        p.classList.toggle('oculto', cat !== 'todos' && p.dataset.categoria !== cat);
      });
    });
  });
}

// ==============================================
// 🔍 BUSCA
// ==============================================
function configurarBusca() {
  const campo = document.getElementById('campoBusca');
  const produtos = document.querySelectorAll('.produto');

  campo.addEventListener('input', () => {
    const termo = campo.value.toLowerCase();
    produtos.forEach(p => {
      const nome = p.dataset.nome.toLowerCase();
      const desc = p.dataset.descricao.toLowerCase();
      p.classList.toggle('oculto', !(nome.includes(termo) || desc.includes(termo)));
    });
  });
}

// ==============================================
// 🖱️ CLIQUE NOS PRODUTOS — CORRIGIDO!
// ==============================================
function configurarCliqueProdutos() {
  const produtos = document.querySelectorAll('.produto');
  const modal = document.getElementById('modal-produto');

  produtos.forEach(prod => {
    prod.addEventListener('click', () => {
      // VERIFICA SE LOJA ESTÁ ABERTA
      const agora = new Date();
      const horaTotal = agora.getHours() + (agora.getMinutes() / 60);
      let aberto = CONFIG.horaAbertura < CONFIG.horaFechamento 
        ? (horaTotal >= CONFIG.horaAbertura && horaTotal < CONFIG.horaFechamento)
        : (horaTotal >= CONFIG.horaAbertura || horaTotal < CONFIG.horaFechamento);

      if (!aberto) {
        document.getElementById('alerta-fechado').classList.remove('oculto');
        return;
      }

      // CARREGA DADOS E ABRE SOMENTE ESSE MODAL
      produtoAtual = {
        nome: prod.dataset.nome,
        preco: parseFloat(prod.dataset.preco),
        descricao: prod.dataset.descricao,
        imagem: prod.dataset.imagem
      };

      qtdSelecionada = 1;
      adicionaisSelecionados = [];

      document.getElementById('img-detalhe').src = produtoAtual.imagem;
      document.getElementById('nome-detalhe').textContent = produtoAtual.nome;
      document.getElementById('descricao-detalhe').textContent = produtoAtual.descricao;
      document.getElementById('preco-promocional').textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
      document.getElementById('preco-original').textContent = '';
      document.getElementById('qtd-atual').textContent = qtdSelecionada;
      document.getElementById('lista-adicionais').innerHTML = '';

      // ABRE O MODAL DE PRODUTO — FECHA QUALQUER OUTRO
      document.getElementById('modal-carrinho').classList.add('oculto');
      modal.classList.remove('oculto');
      document.body.style.overflow = 'hidden';
    });
  });
}

// ==============================================
// 📦 MODAL DE DETALHES DO PRODUTO
// ==============================================
function configurarModalProduto() {
  const modal = document.getElementById('modal-produto');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnAdicionar = document.getElementById('btn-adicionar-detalhe');
  const btnMais = document.getElementById('aumentar-qtd');
  const btnMenos = document.getElementById('diminuir-qtd');

  btnVoltar.addEventListener('click', () => {
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });

  btnMais.addEventListener('click', () => {
    qtdSelecionada++;
    document.getElementById('qtd-atual').textContent = qtdSelecionada;
  });

  btnMenos.addEventListener('click', () => {
    if (qtdSelecionada > 1) {
      qtdSelecionada--;
      document.getElementById('qtd-atual').textContent = qtdSelecionada;
    }
  });

  btnAdicionar.addEventListener('click', () => {
    if (!produtoAtual) return;

    const item = {
      ...produtoAtual,
      quantidade: qtdSelecionada,
      adicionais: [...adicionaisSelecionados]
    };

    carrinho.push(item);
    atualizarCarrinhoTela();

    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });

  document.getElementById('btn-entendi').addEventListener('click', () => {
    document.getElementById('alerta-fechado').classList.add('oculto');
  });
}

// ==============================================
// 🛒 CARRINHO
// ==============================================
function configurarCarrinho() {
  const btnAbrir = document.getElementById('abrir-carrinho');
  const btnFechar = document.getElementById('fechar-modal');
  const btnLimpar = document.getElementById('btn-limpar');
  const btnFinalizar = document.getElementById('btn-finalizar');
  const selectTipo = document.getElementById('tipo-atendimento');

  btnAbrir.addEventListener('click', () => {
    document.getElementById('modal-carrinho').classList.remove('oculto');
    document.body.style.overflow = 'hidden';
  });

  btnFechar.addEventListener('click', () => {
    document.getElementById('modal-carrinho').classList.add('oculto');
    document.body.style.overflow = 'auto';
  });

  btnLimpar.addEventListener('click', () => {
    carrinho = [];
    atualizarCarrinhoTela();
  });

  selectTipo.addEventListener('change', () => {
    const entrega = selectTipo.value === 'entrega';
    document.getElementById('bloco-endereco').classList.toggle('oculto', !entrega);
    document.getElementById('campo-taxa-entrega').classList.toggle('oculto', !entrega);
    calcularTotal();
  });

  btnFinalizar.addEventListener('click', enviarPedidoWhatsApp);
}

function atualizarCarrinhoTela() {
  const container = document.getElementById('carrinho-container');
  const lista = document.getElementById('lista-itens-carrinho');
  const qtdBadge = document.getElementById('qtd-carrinho');
  const resumo = document.getElementById('resumo-carrinho');

  if (carrinho.length === 0) {
    container.classList.add('oculto');
    return;
  }

  container.classList.remove('oculto');
  qtdBadge.textContent = carrinho.length;

  let totalGeral = 0;
  lista.innerHTML = '';

  carrinho.forEach((item, idx) => {
    totalGeral += item.preco * item.quantidade;
    const div = document.createElement('div');
    div.className = 'item-carrinho';
    div.innerHTML = `
      <div>
        <strong>${item.nome}</strong>
        <br>Qtd: ${item.quantidade} • R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
      </div>
      <button style="color:red;border:none;background:none;cursor:pointer;" data-idx="${idx}">&times;</button>
    `;
    lista.appendChild(div);
  });

  resumo.innerHTML = `${carrinho.length} itens • R$ ${totalGeral.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;
  calcularTotal();

  lista.querySelectorAll('[data-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      carrinho.splice(parseInt(e.target.dataset.idx), 1);
      atualizarCarrinhoTela();
    });
  });
}

function calcularTotal() {
  let total = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  if (document.getElementById('tipo-atendimento').value === 'entrega') {
    total += CONFIG.taxaEntregaPadrao;
  }
  document.getElementById('valor-total').textContent = total.toFixed(2).replace('.', ',');
}

// ==============================================
// 📬 CEP
// ==============================================
function configurarCEP() {
  const campo = document.getElementById('cep');
  campo.addEventListener('blur', async () => {
    const cep = campo.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await res.json();
      if (dados.erro) throw Error();

      document.getElementById('rua').value = dados.logradouro;
      document.getElementById('bairro').value = dados.bairro;
      document.getElementById('cidade-uf').value = `${dados.localidade} / ${dados.uf}`;
      document.getElementById('aviso-cep').textContent = 'Endereço preenchido! Confira e complete.';
      document.getElementById('aviso-cep').className = 'aviso-info';
    } catch {
      document.getElementById('aviso-cep').textContent = 'CEP não encontrado. Preencha manualmente.';
      document.getElementById('aviso-cep').className = 'aviso-erro';
    }
  });
}

// ==============================================
// 📤 ENVIAR PEDIDO
// ==============================================
function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    document.getElementById('aviso-geral').textContent = 'Adicione itens ao carrinho!';
    document.getElementById('aviso-geral').classList.remove('oculto');
    return;
  }

  let texto = `📋 *PEDIDO - ${CONFIG.nomeLoja}*\n\n`;
  let total = 0;

  carrinho.forEach(i => {
    texto += `• ${i.nome} x${i.quantidade} = R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}\n`;
    total += i.preco * i.quantidade;
  });

  const tipo = document.getElementById('tipo-atendimento').value;
  if (tipo === 'entrega') {
    total += CONFIG.taxaEntregaPadrao;
    texto += `\n🚚 Entrega: R$ ${CONFIG.taxaEntregaPadrao.toFixed(2).replace('.',',')}`;
    texto += `\n📍 Endereço: ${document.getElementById('rua').value}, ${document.getElementById('numero').value} - ${document.getElementById('bairro').value}`;
    texto += `\n${document.getElementById('cidade-uf').value} | ${document.getElementById('complemento').value || 'Sem complemento'}`;
    texto += `\n📞 Referência: ${document.getElementById('referencia').value || 'Não informada'}`;
  } else {
    texto += `\n✅ Retirada na loja`;
  }

  texto += `\n👤 Nome: ${document.getElementById('nome-cliente').value || 'Não informado'}`;
  texto += `\n💳 Pagamento: ${document.getElementById('forma-pagamento').value}`;
  texto += `\n📝 Observação: ${document.getElementById('observacao').value || 'Nenhuma'}`;
  texto += `\n\n💰 *TOTAL: R$ ${total.toFixed(2).replace('.',',')}*`;

  const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
  document.getElementById('modal-carrinho').classList.add('oculto');
  document.body.style.overflow = 'auto';
}

// ==============================================
// 📜 ROLAGEM CATEGORIAS
// ==============================================
function configurarRolagemCategorias() {
  const categorias = document.querySelector('.categorias');
  window.addEventListener('scroll', () => {
    categorias.classList.toggle('sticky-visivel', window.scrollY > 20);
  });
}

// ATUALIZA STATUS A CADA 1 MINUTO
setInterval(atualizarStatusLoja, 60000);
