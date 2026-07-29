// ⚙️ CONFIGURAÇÃO DA SENHA — ALTERE AQUI SE QUISER
const SENHA_ADMIN = "123456";

function verificarSenha() {
    const senha = document.getElementById('senha').value.trim();
    if (senha === SENHA_ADMIN) {
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-principal').style.display = 'block';
        carregarListaAdmin();
    } else {
        mostrarAcesso('Senha incorreta!', 'erro');
    }
}

function pegarLista() {
    const dados = localStorage.getItem('produtosAlisonBurger');
    return dados ? JSON.parse(dados) : [];
}

function salvarLista(lista) {
    localStorage.setItem('produtosAlisonBurger', JSON.stringify(lista));
    if (window.salvarProdutos) window.salvarProdutos(lista);
    carregarListaAdmin();
}

function mostrarAcesso(texto, tipo='sucesso') {
    const aviso = document.getElementById('mensagem');
    aviso.textContent = texto;
    aviso.className = `alerta ${tipo}`;
    aviso.classList.remove('oculto');
    setTimeout(() => aviso.classList.add('oculto'), 3000);
}

function limparForm() {
    document.getElementById('prod-codigo').value = '';
    document.getElementById('prod-nome').value = '';
    document.getElementById('prod-preco').value = '';
    document.getElementById('prod-categoria').value = 'hamburgueres';
    document.getElementById('prod-imagem').value = '';
    document.getElementById('prod-descricao').value = '';
    document.getElementById('indice-edicao').value = '';
}

function salvarProduto() {
    const codigo = document.getElementById('prod-codigo').value.trim();
    const nome = document.getElementById('prod-nome').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const categoria = document.getElementById('prod-categoria').value;
    const imagem = document.getElementById('prod-imagem').value.trim() || 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    const descricao = document.getElementById('prod-descricao').value.trim() || 'Sem descrição.';
    const indice = document.getElementById('indice-edicao').value;

    if (!codigo || !nome || isNaN(preco) || preco <= 0) {
        mostrarAcesso('Preencha código, nome e preço válido!', 'erro');
        return;
    }

    let lista = pegarLista();
    const novoProd = {
        id: Date.now(),
        codigo, nome, preco, categoria, imagem, descricao, ativo: true
    };

    if (indice !== '') {
        lista[indice] = novoProd;
        mostrarAcesso('Produto atualizado com sucesso!');
    } else {
        lista.push(novoProd);
        mostrarAcesso('Produto adicionado com sucesso!');
    }

    salvarLista(lista);
    limparForm();
}

function editar(indice) {
    const lista = pegarLista();
    const p = lista[indice];
    if (!p) return;
    document.getElementById('indice-edicao').value = indice;
    document.getElementById('prod-codigo').value = p.codigo;
    document.getElementById('prod-nome').value = p.nome;
    document.getElementById('prod-preco').value = p.preco;
    document.getElementById('prod-categoria').value = p.categoria;
    document.getElementById('prod-imagem').value = p.imagem;
    document.getElementById('prod-descricao').value = p.descricao;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function alternarAtivo(indice) {
    const lista = pegarLista();
    lista[indice].ativo = !lista[indice].ativo;
    salvarLista(lista);
    mostrarAcesso(lista[indice].ativo ? 'Produto ativado!' : 'Produto desativado!');
}

function remover(indice) {
    if (!confirm('Deseja excluir este produto definitivamente?')) return;
    const lista = pegarLista();
    lista.splice(indice, 1);
    salvarLista(lista);
    mostrarAcesso('Produto removido!');
}

function carregarListaAdmin() {
    const lista = pegarLista();
    const container = document.getElementById('lista-produtos-admin');

    if (lista.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nenhum produto cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = '';
    lista.forEach((prod, idx) => {
        const linha = document.createElement('div');
        linha.className = `border-b py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${prod.ativo ? '' : 'opacity-50'}`;
        linha.innerHTML = `
            <div>
                <span class="font-mono text-xs bg-gray-100 px-1 rounded">${prod.codigo}</span>
                <span class="font-semibold ml-1">${prod.nome}</span>
                <span class="text-sm text-gray-500 ml-2">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
                <span class="text-xs text-gray-400 block sm:inline">${prod.categoria}</span>
                ${!prod.ativo ? '<span class="text-xs text-red-500 ml-2">INATIVO</span>' : ''}
            </div>
            <div class="flex gap-1 text-sm">
                <button onclick="editar(${idx})" class="text-blue-600 hover:underline">✏️ Editar</button>
                <button onclick="alternarAtivo(${idx})" class="text-green-600 hover:underline">${prod.ativo ? '📴 Desativar' : '📲 Ativar'}</button>
                <button onclick="remover(${idx})" class="text-red-600 hover:underline">🗑️ Apagar</button>
            </div>
        `;
        container.appendChild(linha);
    });
}

function exportarDados() {
    alert(JSON.stringify(pegarLista(), null, 2));
}
