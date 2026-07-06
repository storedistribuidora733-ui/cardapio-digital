// CONFIGURAÇÕES
const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  numeroWhatsApp: "5519989021323",
  taxaEntregaPadrao: 8.00
};

// CARRINHO PRINCIPAL
let carrinho = [];

// INICIA TODAS AS FUNÇÕES QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Sistema carregado!");
  iniciarEventos();
  verificarStatusLoja();
});

// ATRIBUI TODOS OS EVENTOS DE CLIQUE E AÇÃO
function iniciarEventos() {
  // BOTOES DE QUANTIDADE DOS PRODUTOS
  document.querySelectorAll('.qtd-btn').forEach(botao => {
    botao.addEventListener('click', (e) => {
      const produto = e.target.closest('.produto');
      const valorEl = produto.querySelector('.qtd-valor');
      let valor = parseInt(valorEl.textContent);
      
      if (botao.classList.contains('aumentar')) valor++;
      if (botao.classList.contains('diminuir') && valor > 0) valor--;
      
      valorEl.textContent = valor;
    });
  });

  // BOTOES ADICIONAR AO CARRINHO
  document.querySelectorAll('.add-carrinho').forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!verificarStatusLoja(true)) return;

      const produto = e.target.closest('.produto');
      const nome = botao.dataset.nome;
      const preco = parseFloat(botao.dataset.preco);
      const qtd = parseInt(produto.querySelector('.qtd-valor').textContent);

      if (qtd <= 0) {
        alert("⚠️ Escolha a quantidade primeiro!");
        return;
      }

      // ADICIONA NO CARRINHO
      const itemExistente = carrinho.find(item => item.nome === nome);
      if (itemExistente) {
        itemExistente.quantidade += qtd;
      } else {
        carrinho.push({ nome, preco, quantidade: qtd });
      }

      // ATUALIZA TELA
      atualizarCarrinho();
      produto.querySelector('.qtd-valor').textContent = '0';
      console.log("🛒 Item adicionado:", nome, "Quantidade:", qtd);
    });
  });

  // ABRIR E FECHAR CARRINHO
  document.getElementById('abrir-carrinho').addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert("Adicione itens ao carrinho primeiro!");
      return;
    }
    document.getElementById('modal-carrinho').classList.remove('oculto');
  });

  document.getElementById('fechar-modal').addEventListener('click', () => {
    document.getElementById('modal-carrinho').classList.add('oculto');
  });

  document.getElementById('btn-fechar').addEventListener('click', () => {
    document.getElementById('modal-carrinho').classList.add('oculto');
  });

  // TIPO DE ENTREGA / RETIRADA
  document.getElementById('tipo-atendimento').addEventListener('change', (e) => {
    const entrega = e.target.value === 'entrega';
    document.getElementById('campo-taxa-entrega').classList.toggle('oculto', !entrega);
    document.getElementById('bloco-endereco').classList.toggle('oculto', !entrega);
  });

  // BOTÃO FINALIZAR PEDIDO
  document.getElementById('btn-finalizar').addEventListener('click', enviarPedidoWhatsApp);
}

// ATUALIZA A VISUALIZAÇÃO DO CARRINHO
function atualizarCarrinho() {
  const listaEl = document.getElementById('lista-itens-carrinho');
  const totalEl = document.getElementById('valor-total');
  const qtdCarrinhoEl = document.getElementById('qtd-carrinho');
  const resumoEl = document.getElementById('resumo-carrinho');
  const carrinhoFixoEl = document.getElementById('carrinho-container');

  listaEl.innerHTML = '';
  let total = 0;
  let qtdTotal = 0;

  if (carrinho.length === 0) {
    carrinhoFixoEl.style.display = 'none';
    totalEl.textContent = '0,00';
    resumoEl.textContent = '0 itens • R$ 0,00';
    return;
  }

  carrinhoFixoEl.style.display = 'flex';

  carrinho.forEach((item, indice) => {
    const totalItem = item.preco * item.quantidade;
    total += totalItem;
    qtdTotal += item.quantidade;

    listaEl.innerHTML += `
      <div class="item-carrinho">
        <div>
          <strong>${item.nome}</strong><br>
          <small>R$ ${item.preco.toFixed(2).replace('.', ',')} cada</small>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="qtd-btn" onclick="alterarQuantidade(${indice}, -1)">-</button>
          <span>${item.quantidade}</span>
          <button class="qtd-btn" onclick="alterarQuantidade(${indice}, 1)">+</button>
          <strong>R$ ${totalItem.toFixed(2).replace('.', ',')}</strong>
        </div>
      </div>
    `;
  });

  totalEl.textContent = total.toFixed(2).replace('.', ',');
  qtdCarrinhoEl.textContent = qtdTotal;
  resumoEl.textContent = `${qtdTotal} itens • R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ALTERA QUANTIDADE DENTRO DO CARRINHO
function alterarQuantidade(indice, mudanca) {
  carrinho[indice].quantidade += mudanca;
  if (carrinho[indice].quantidade <= 0) {
    carrinho.splice(indice, 1);
  }
  atualizarCarrinho();
}

// VERIFICA SE A LOJA ESTÁ ABERTA
function verificarStatusLoja() {
  const horaAtual = new Date().getHours();
  const aberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;
  return aberta;
}

// ENVIA O PEDIDO PARA O WHATSAPP
function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    alert("Adicione itens ao carrinho!");
    return;
  }

  const nome = document.getElementById('nome-cliente').value.trim();
  if (!nome) {
    alert("Informe seu nome!");
    return;
  }

  const tipo = document.getElementById('tipo-atendimento').value;
  const rua = document.getElementById('rua').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const pagamento = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacoes').value.trim();
  const taxa = tipo === 'entrega' ? CONFIG.taxaEntregaPadrao : 0;
  const totalItens = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
  const totalGeral = totalItens + taxa;

  // MENSAGEM DO PEDIDO
  let mensagem = `🍔 *PEDIDO ALISON BURGER*\n\n`;
  mensagem += `👤 Nome: ${nome}\n`;
  mensagem += `📦 Tipo: ${tipo === 'entrega' ? 'Entrega' : 'Retirada'}\n`;
  
  if (tipo === 'entrega') {
    mensagem += `📍 Endereço: ${rua}, Nº ${numero} - ${bairro}\n`;
    mensagem += `🚚 Taxa: R$ ${taxa.toFixed(2).replace('.', ',')}\n`;
  }

  mensagem += `\n📝 *ITENS DO PEDIDO:*\n`;
  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome} | R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n💰 Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n`;
  mensagem += `💳 Pagamento: ${pagamento}\n`;
  if (obs) mensagem += `📌 Observações: ${obs}`;

  // ABRE O WHATSAPP
  const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
