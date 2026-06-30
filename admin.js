const SENHA = "alison123";
const CHAVE = "produtos_alison";

let produtos = JSON.parse(localStorage.getItem(CHAVE)) || [
  { codigo: "01", nome: "Hambúrguer Simples", descricao: "Pão, carne, queijo, alface e tomate", preco: 10.00, categoria: "hamburgueres", imagem: "assets/hamburguer1.jpg", tag: "", tempo: "20-30min", icone: "fa fa-fire" }
];

function entrar() {
  if (document.getElementById("senha").value === SENHA) {
    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-admin").classList.remove("hidden");
    listar();
  } else alert("Senha incorreta!");
}

function listar() {
  const container = document.getElementById("lista-admin");
  container.innerHTML = "";
  produtos.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";
    div.innerHTML = `
      <div class="grid grid-cols-2 gap-2 mb-2">
        <input type="text" value="${p.codigo}" onchange="atualizar(${i}, 'codigo', this.value)" class="border p-2 rounded" placeholder="Código">
        <input type="text" value="${p.nome}" onchange="atualizar(${i}, 'nome', this.value)" class="border p-2 rounded" placeholder="Nome">
        <input type="number" step="0.01" value="${p.preco}" onchange="atualizar(${i}, 'preco', parseFloat(this.value))" class="border p-2 rounded" placeholder="Preço">
        <select onchange="atualizar(${i}, 'categoria', this.value)" class="border p-2 rounded">
          <option value="hamburgueres" ${p.categoria==="hamburgueres"?"selected":""}>Hambúrgueres</option>
          <option value="acompanhamentos" ${p.categoria==="acompanhamentos"?"selected":""}>Acompanhamentos</option>
          <option value="bebidas" ${p.categoria==="bebidas"?"selected":""}>Bebidas</option>
        </select>
      </div>
      <input type="text" value="${p.imagem}" onchange="atualizar(${i}, 'imagem', this.value)" class="w-full border p-2 rounded mb-2" placeholder="Caminho ou link da imagem">
      <textarea onchange="atualizar(${i}, 'descricao', this.value)" class="w-full border p-2 rounded mb-2" placeholder="Descrição">${p.descricao}</textarea>
      <button onclick="remover(${i})" class="bg-red-500 text-white px-3 py-1 rounded">🗑️ Remover</button>
    `;
    container.appendChild(div);
  });
}

function atualizar(i, campo, valor) {
  produtos[i][campo] = valor;
}

function novo() {
  produtos.push({ codigo: "", nome: "", descricao: "", preco: 0, categoria: "hamburgueres", imagem: "", tag: "", tempo: "", icone: "" });
  listar();
}

function remover(i) {
  if (confirm("Remover esse produto?")) { produtos.splice(i,1); listar(); }
}

function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(produtos));
  alert("✅ Salvo! Agora atualize o site para ver as mudanças.");
}
