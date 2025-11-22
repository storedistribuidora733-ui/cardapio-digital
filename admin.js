// Login simples
function login() {
    const u = document.getElementById("user").value;
    const p = document.getElementById("pass").value;
    if (u === "admin" && p === "admin2025") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminBox").style.display = "block";
        loadProducts();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Load product list (static example — connect to real data later)
function loadProducts() {
    const products = [
        { name: "Hambúrguer Simples", price: 10.00 },
        { name: "Coca-Cola Lata", price: 5.00 }
    ];
    let html = "";
    products.forEach(p => {
        html += `
            <div class='product-item'>
                <b>${p.name}</b><br>
                Preço: R$ ${p.price.toFixed(2)}<br>
                <button onclick="edit('${p.name}')">Editar</button>
            </div>
        `;
    });
    document.getElementById("products").innerHTML = html;
}

function edit(name) {
    alert("Em breve: editor completo para " + name);
}
