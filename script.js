// ==============================================
// ⚙️ CONFIGURAÇÕES GERAIS — ALTERE APENAS AQUI
// ==============================================
const CONFIG = {
    horaAbertura: 23,
    horaFechamento: 6,
    textoStatusAberto: "Aberto até às 06:00",
    textoStatusFechado: "Fechado",
    corStatusAberto: "#10b981",
    corStatusFechado: "#ef4444",
    numeroWhatsApp: "5519989021323", // Coloque seu número com DDD
    nomeLoja: "ALISON BURGER",
    subtituloLoja: "Sabor de verdade!",
    iniciarNumeroPedido: 2250,
    taxaEntregaPadrao: 6.00 // Valor da taxa de entrega padrão
};

// ==============================================
// 🛒 VARIÁVEIS ELEMENTOS DA PÁGINA
// ==============================================
let numeroPedidoAtual = CONFIG.iniciarNumeroPedido;
const carrinho = [];

const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal')];
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const valorTotalEl = document.getElementById('resumo-carrinho');
const qtdCarrinhoEl = document.getElementById('qtd-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const textoStatusEl = document.getElementById('texto-status');
const pontoStatusEl = document.getElementById('ponto-status');
const campoBusca = document.getElementById('campoBusca');
const carrinhoContainer = document.getElementById('carrinho-container');

// Campos do formulário
const nomeEl = document.getElementById('nome-cliente');
const cepEl = document.getElementById('cep-cliente');
const ruaEl = document.getElementById('rua-cliente');
const bairroEl = document.getElementById('bairro-cliente');
const cidadeEl = document.getElementById('cidade-cliente');
const ufEl = document.getElementById('uf-cliente');
const numeroEl = document.getElementById('numero-cliente');
const semNumeroEl = document.getElementById('sn-cliente');
const complementoEl = document.getElementById('complemento-cliente');
const referenciaEl = document.getElementById('referencia-cliente');
const pagamentoEl = document.getElementById('forma-pagamento');
const obsEl = document.getElementById('observacoes');
const avisoEndereco = document.getElementById('aviso-endereco');

// Novos campos
const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
const campoTaxaEntregaEl = document.getElementById('campo-taxa-entrega');
const taxaEntregaEl = document.getElementById('taxa-entrega');

// ==============================================
// 🚀 FUNÇÕES AUXILIARES
// ==============================================

// Máscara para CEP
function aplicarMascaraCEP(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    return valor;
}

cepEl.addEventListener('input', () => {
    cepEl.value = aplicarMascaraCEP(cepEl.value);
});

// Buscar endereço pelo CEP
async function buscarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            avisoEndereco.textContent = 'CEP não encontrado, preencha manualmente.';
            avisoEndereco.classList.remove('oculto');
            return;
        }

        ruaEl.value = dados.logradouro || '';
        bairroEl.value = dados.bairro || '';
        cidadeEl.value = dados.localidade || '';
        ufEl.value = dados.uf || '';
        avisoEndereco.classList.add('oculto');

    } catch (erro) {
        avisoEndereco.textContent = 'Erro ao buscar CEP, preencha manualmente.';
        avisoEndereco.classList.remove('oculto');
    }
}

cepEl.addEventListener('blur', () => buscarCEP(cepEl.value));

// Mostrar/ocultar campos conforme tipo de recebimento
tipoAtendimentoEl.addEventListener('change', () => {
    if (tipoAtendimentoEl.value === 'entrega') {
        campoTaxaEntregaEl.classList.remove('oculto');
        taxaEntregaEl.value = CONFIG.taxaEntregaPadrao.toFixed(2).replace('.', ',');
        cepEl.disabled = false;
        ruaEl.disabled = false;
        bairroEl.disabled = false;
        cidadeEl.disabled = false;
        ufEl.disabled = false;
        numeroEl.disabled = false;
        semNumeroEl.disabled = false;
        complementoEl.disabled = false;
        referenciaEl.disabled = false;
    } else {
        campoTaxaEntregaEl.classList.add('oculto');
        taxaEntregaEl.value = '0,00';
        cepEl.disabled = true;
        ruaEl.disabled = true;
        bairroEl.disabled = true;
        cidadeEl.disabled = true;
        ufEl.disabled = true;
        numeroEl.disabled = true;
        semNumeroEl.disabled = true;
        complementoEl.disabled = true;
        referenciaEl.disabled = true;
    }
});

// Verificar horário de funcionamento
function verificarStatusLoja(mostrarAviso = false) {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const lojaAberta = horaAtual >= CONFIG.horaAbertura || horaAtual < CONFIG.horaFechamento;

    if (lojaAberta) {
        pontoStatusEl.style.backgroundColor = CONFIG.corStatusAberto;
        textoStatusEl.textContent = CONFIG.textoStatusAberto;
        textoStatusEl.classList.remove('status-fechado');
        textoStatusEl.classList.add('status-aberto');
    } else {
        pontoStatusEl.style.backgroundColor = CONFIG.corStatusFechado;
        textoStatusEl.textContent = CONFIG.textoStatusFechado;
        textoStatusEl.classList.remove('status-aberto');
        textoStatusEl.classList.add('status-fechado');
    }

    if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove('oculto');
    return lojaAberta;
}

verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi.addEventListener('click', () => alertaFechado.classList.add('oculto'));

// ==============================================
// 🛍️ CONTROLE DO CARRINHO
// ==============================================

// Alterar quantidade nos produtos
document.querySelectorAll('.aumentar').forEach(btn => {
    btn.addEventListener('click', () => {
        const qtd = btn.parentElement.querySelector('.qtd-valor');
        qtd.textContent = parseInt(qtd.textContent) + 1;
    });
});

document.querySelectorAll('.diminuir').forEach(btn => {
    btn.addEventListener('click', () => {
        const qtd = btn.parentElement.querySelector('.qtd-valor');
        if (parseInt(qtd.textContent) > 0) qtd.textContent = parseInt(qtd.textContent) - 1;
    });
});

// Adicionar item ao carrinho
document.querySelectorAll('.add-carrinho').forEach(botao => {
    botao.addEventListener('click', () => {
        if (!verificarStatusLoja(true)) return;

        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco);
        const qtd = parseInt(botao.closest('.produto').querySelector('.qtd-valor').textContent);

        if (qtd <= 0) {
            alert('Selecione uma quantidade!');
            return;
        }

        const existe = carrinho.find(item => item.nome === nome);
        if (existe) {
            existe.quantidade += qtd;
        } else {
            carrinho.push({ nome, preco, quantidade: qtd });
        }

        atualizarCarrinho();
        botao.closest('.produto').querySelector('.qtd-valor').textContent = '0';

        // Feedback visual
        const original = botao.innerHTML;
        botao.innerHTML = '<i class="fa fa-check"></i> Adicionado';
        setTimeout(() => botao.innerHTML = original, 1200);
    });
});

// Atualizar visual do carrinho
function atualizarCarrinho() {
    listaItensCarrinho.innerHTML = '';
    let total = 0;
    let qtdTotal = 0;

    if (carrinho.length === 0) {
        carrinhoContainer.classList.add('oculto');
        qtdCarrinhoEl.textContent = '0';
        return;
    }

    carrinhoContainer.classList.remove('oculto');

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        qtdTotal += item.quantidade;

        const div = document.createElement('div');
        div.className = 'flex justify-between items-center border-b pb-2';
        div.innerHTML = `
            <div>
                <p class="font-medium">${item.quantidade}x ${item.nome}</p>
                <p class="text-sm text-gray-600">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
            </div>
            <div class="flex items-center gap-2">
                <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                <button class="text-red-500 text-sm remover-item" data-index="${index}">×</button>
            </div>
        `;
        listaItensCarrinho.appendChild(div);
    });

    valorTotalEl.innerHTML = `Total dos itens: <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
    qtdCarrinhoEl.textContent = qtdTotal;

    // Adicionar evento de remoção
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', () => {
            carrinho.splice(parseInt(btn.dataset.index), 1);
            atualizarCarrinho();
        });
    });
}

// Abrir e fechar modal
abrirCarrinhoBtn.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Adicione itens ao pedido primeiro!');
        return;
    }
    if (!verificarStatusLoja(true)) return;
    modalCarrinho.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modalCarrinho.classList.add('oculto');
        document.body.style.overflow = 'auto';
    });
});

// Filtrar produtos
campoBusca.addEventListener('input', () => {
    const termo = campoBusca.value.toLowerCase().trim();
    document.querySelectorAll('.produto').forEach(produto => {
        const nome = produto.dataset.nome.toLowerCase();
        produto.style.display = nome.includes(termo) ? 'block' : 'none';
    });
});

document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo', 'bg-primary', 'text-white').classList.add('bg-gray-200'));
        btn.classList.remove('bg-gray-200').classList.add('ativo', 'bg-primary', 'text-white');
        const categoria = btn.dataset.categoria;

        document.querySelectorAll('.produto').forEach(produto => {
            produto.style.display = (categoria === 'todos' || produto.dataset.categoria === categoria) ? 'block' : 'none';
        });
    });
});

// ==============================================
// ✅ FINALIZAR PEDIDO E ENVIAR PARA WHATSAPP
// ==============================================
document.getElementById('btn-finalizar').addEventListener('click', () => {
    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR');

    const nome = nomeEl.value.trim();
    const tipoAtendimento = tipoAtendimentoEl.value;
    const taxaEntrega = parseFloat(taxaEntregaEl.value.replace(',', '.')) || 0;
    const pagamento = pagamentoEl.value;
    const obs = obsEl.value.trim() || 'Nenhuma';

    // Validações básicas
    if (!nome) {
        avisoEndereco.textContent = 'Por favor, informe seu nome!';
        avisoEndereco.classList.remove('oculto');
        return;
    }

    if (tipoAtendimento === 'entrega') {
        if (!ruaEl.value.trim() || !bairroEl.value.trim() || !cidadeEl.value.trim() || !ufEl.value.trim() || (!numeroEl.value.trim() && !semNumeroEl.checked)) {
            avisoEndereco.textContent = 'Preencha todos os dados de entrega!';
            avisoEndereco.classList.remove('oculto');
            return;
        }
    }

    avisoEndereco.classList.add('oculto');

    // Cálculo dos valores
    const subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    const totalFinal = subtotal + taxaEntrega;

    // Montar endereço
    let enderecoTexto = '';
    if (tipoAtendimento === 'entrega') {
        enderecoTexto = `${ruaEl.value}, ${semNumeroEl.checked ? 'S/N' : `Nº ${numeroEl.value}`}`;
        if (complementoEl.value) enderecoTexto += `\nComplemento: ${complementoEl.value}`;
        enderecoTexto += `\nBairro: ${bairroEl.value}\n${cidadeEl.value} - ${ufEl.value.toUpperCase()}`;
        if (referenciaEl.value) enderecoTexto += `\nReferência: ${referenciaEl.value}`;
        if (cepEl.value) enderecoTexto += `\nCEP: ${cepEl.value}`;
    }

    // Montar mensagem formatada
    let mensagem = `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `PEDIDO Nº ${numeroPedidoAtual}\n`;
    mensagem += `*${CONFIG.nomeLoja}*\n`;
    mensagem += `${CONFIG.subtituloLoja}\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    mensagem += `Data/Hora: ${dataHora}\n\n`;
    mensagem += `Tipo: ${tipoAtendimento === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}\n\n`;
    mensagem += `Cliente: ${nome}\n\n`;

    if (tipoAtendimento === 'entrega') {
        mensagem += `Endereço:\n${enderecoTexto}\n\n`;
    }

    mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `ITENS DO PEDIDO\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    carrinho.forEach(item => {
        const totalItem = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
        const valorUnit = item.preco.toFixed(2).replace('.', ',');
        mensagem += `• ${item.quantidade}x ${item.nome}\n  R$ ${valorUnit} cada | Total R$ ${totalItem}\n\n`;
    });

    mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensagem += `Forma de pagamento: ${pagamento}\n\n`;
    mensagem += `Observações: ${obs}\n\n`;

    mensagem += `Resumo dos valores:\n`;
    mensagem += `• Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (tipoAtendimento === 'entrega') {
        mensagem += `• Taxa de entrega: R$ ${taxaEntrega.toFixed(2).replace('.', ',')}\n`;
    }
    mensagem += `• *TOTAL GERAL: R$ ${totalFinal.toFixed(2).replace('.', ',')}*\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Enviar para o WhatsApp
    const url = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    // Incrementar número do pedido
    numeroPedidoAtual++;

    // Limpar carrinho após envio
    carrinho.length = 0;
    atualizarCarrinho();
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
    document.getElementById('form-pedido').reset();
});