// Cardápio Completo
const menuData = [
    {
        id: 1,
        name: "Pizza de Mussarela",
        category: "pizzas",
        price: 45.90,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
        description: "Molho de tomate, mussarela, orégano e azeitonas",
        options: [
            { id: "size", title: "Tamanho", required: true, items: [
                { label: "Broto", price: 0 },
                { label: "Média", price: 5 },
                { label: "Grande", price: 10 }
            ]},
            { id: "border", title: "Borda", required: false, items: [
                { label: "Sem recheio", price: 0 },
                { label: "Recheada de queijo", price: 5 }
            ]}
        ]
    },
    {
        id: 2,
        name: "Pizza Calabresa",
        category: "pizzas",
        price: 52.90,
        image: "https://images.unsplash.com/photo-1593584708970-1c565c0b7c60?w=400&q=80",
        description: "Calabresa fatiada, cebola, mussarela e molho",
        options: [
            { id: "size", title: "Tamanho", required: true, items: [
                { label: "Broto", price: 0 },
                { label: "Média", price: 6 },
                { label: "Grande", price: 12 }
            ]},
            { id: "border", title: "Borda", required: false, items: [
                { label: "Sem recheio", price: 0 },
                { label: "Recheada de queijo", price: 5 }
            ]}
        ]
    },
    {
        id: 3,
        name: "Pizza Portuguesa",
        category: "pizzas",
        price: 58.90,
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80",
        description: "Presunto, ovos, cebola, ervilha, palmito e mussarela",
        options: [
            { id: "size", title: "Tamanho", required: true, items: [
                { label: "Broto", price: 0 },
                { label: "Média", price: 7 },
                { label: "Grande", price: 14 }
            ]},
            { id: "border", title: "Borda", required: false, items: [
                { label: "Sem recheio", price: 0 },
                { label: "Recheada de queijo", price: 5 }
            ]}
        ]
    },
    {
        id: 4,
        name: "Lasanha Bolonhesa",
        category: "meals",
        price: 38.90,
        image: "https://images.unsplash.com/photo-1619895092538-128836cb4945?w=400&q=80",
        description: "Massa fresca, carne moída, molho branco e queijo gratinado",
        options: [
            { id: "portion", title: "Tamanho da porção", required: true, items: [
                { label: "Individual", price: 0 },
                { label: "Família", price: 15 }
            ]}
        ]
    },
    {
        id: 5,
        name: "Macarrão Carbonara",
        category: "meals",
        price: 42.00,
        image: "https://images.unsplash.com/photo-1612874742237-652622158bd3?w=400&q=80",
        description: "Espaguete, bacon, ovos e queijo parmesão",
        options: [
            { id: "doneness", title: "Ponto da massa", required: false, items: [
                { label: "Ao dente", price: 0 },
                { label: "Bem cozida", price: 0 }
            ]}
        ]
    },
    {
        id: 6,
        name: "Refrigerante Lata",
        category: "drinks",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1625772230130-8c7110d83e92?w=400&q=80",
        description: "350ml — gelado",
        options: [
            { id: "flavor", title: "Sabor", required: true, items: [
                { label: "Coca-Cola", price: 0 },
                { label: "Guaraná Antarctica", price: 0 },
                { label: "Fanta Laranja", price: 0 },
                { label: "Fanta Uva", price: 0 }
            ]}
        ]
    },
    {
        id: 7,
        name: "Suco Natural",
        category: "drinks",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1590369387948-9954c9c1361c?w=400&q=80",
        description: "400ml — frutas frescas",
        options: [
            { id: "flavor", title: "Sabor", required: true, items: [
                { label: "Laranja", price: 0 },
                { label: "Maracujá", price: 0 },
                { label: "Limão", price: 0 },
                { label: "Abacaxi", price: 0 }
            ]}
        ]
    },
    {
        id: 8,
        name: "Cerveja Garrafa",
        category: "drinks",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
        description: "600ml",
        options: [
            { id: "brand", title: "Marca", required: true, items: [
                { label: "Skol", price: 0 },
                { label: "Brahma", price: 0 },
                { label: "Antarctica", price: 0 }
            ]}
        ]
    },
    {
        id: 9,
        name: "Pudim",
        category: "desserts",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
        description: "Leite condensado com calda de caramelo",
        options: []
    },
    {
        id: 10,
        name: "Sorvete 3 Sabores",
        category: "desserts",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        description: "Bola de 150ml cada",
        options: [
            { id: "flavor1", title: "1º Sabor", required: true, items: [
                { label: "Chocolate", price: 0 },
                { label: "Morango", price: 0 },
                { label: "Coco", price: 0 },
                { label: "Baunilha", price: 0 }
            ]},
            { id: "flavor2", title: "2º Sabor", required: true, items: [
                { label: "Chocolate", price: 0 },
                { label: "Morango", price: 0 },
                { label: "Coco", price: 0 },
                { label: "Baunilha", price: 0 }
            ]},
            { id: "flavor3", title: "3º Sabor", required: true, items: [
                { label: "Chocolate", price: 0 },
                { label: "Morango", price: 0 },
                { label: "Coco", price: 0 },
                { label: "Baunilha", price: 0 }
            ]}
        ]
    }
];

// Estado
let tableNumber = null;
let cart = [];
let currentProduct = null;
let quantity = 1;
let selectedOptions = {};

// Elementos das Telas
const screens = {
    entry: document.getElementById('screenEntry'),
    menu: document.getElementById('screenMenu'),
    cart: document.getElementById('screenCart'),
    success: document.getElementById('screenSuccess')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(menuData);
    setupEventListeners();
});

// Trocar Tela
function switchScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo(0, 0);
}

// Renderizar Produtos
function renderProducts(list) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    list.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="add-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Delegar cliques
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-btn');
        if (btn) {
            openProductModal(parseInt(btn.dataset.id));
        }
        const card = e.target.closest('.product-card');
        if (card && !e.target.closest('.add-btn')) {
            const id = parseInt(card.querySelector('.add-btn').dataset.id);
            openProductModal(id);
        }
    });
}

// Configurar Eventos
function setupEventListeners() {
    // Entrada
    document.getElementById('startBtn').addEventListener('click', () => {
        const input = document.getElementById('tableNumber');
        const val = parseInt(input.value.trim());
        if (!val || val < 1) {
            input.style.borderColor = '#e63946';
            input.focus();
            return;
        }
        tableNumber = val;
        document.getElementById('currentTable').textContent = tableNumber;
        switchScreen('menu');
    });

    // Categorias
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;
            const filtered = cat === 'all' ? menuData : menuData.filter(p => p.category === cat);
            renderProducts(filtered);
        });
    });

    // Navegação
    document.getElementById('cartBtn').addEventListener('click', () => {
        updateCartScreen();
        switchScreen('cart');
    });
    document.getElementById('backToMenu').addEventListener('click', () => switchScreen('menu'));
    document.getElementById('goToMenuBtn').addEventListener('click', () => switchScreen('menu'));

    // Modal
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeModal);
    document.getElementById('qtyMinus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('qtyValue').textContent = quantity;
            updateModalTotal();
        }
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
        quantity++;
        document.getElementById('qtyValue').textContent = quantity;
        updateModalTotal();
    });
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);

    // Enviar Pedido
    document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);

    // Novo Pedido
    document.getElementById('newOrderBtn').addEventListener('click', () => {
        cart = [];
        updateCartBadge();
        switchScreen('menu');
    });
}

// Abrir Modal
function openProductModal(id) {
    currentProduct = menuData.find(p => p.id === id);
    if (!currentProduct) return;

    quantity = 1;
    selectedOptions = {};

    // Preencher dados
    document.getElementById('modalImg').src = currentProduct.image;
    document.getElementById('modalName').textContent = currentProduct.name;
    document.getElementById('modalDesc').textContent = currentProduct.description;
    document.getElementById('modalPrice').textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('qtyValue').textContent = '1';
    document.getElementById('noteInput').value = '';

    // Montar opções
    const optionsContainer = document.getElementById('optionsSection');
    optionsContainer.innerHTML = '';
    
    if (currentProduct.options.length === 0) {
        optionsContainer.innerHTML = '<p style="color:#9ca3af;font-size:14px;">Sem opções adicionais</p>';
    } else {
        currentProduct.options.forEach(optionGroup => {
            const groupEl = document.createElement('div');
            groupEl.className = 'option-group';
            groupEl.innerHTML = `
                <h4>${optionGroup.title}${optionGroup.required ? ' *' : ''}</h4>
                <div class="option-buttons" data-group="${optionGroup.id}">
                    ${optionGroup.items.map((item, idx) => `
                        <button class="option-btn" data-group="${optionGroup.id}" data-index="${idx}" data-price="${item.price}">
                            ${item.label}${item.price > 0 ? ` (+R$ ${item.price.toFixed(2).replace('.', ',')})` : ''}
                        </button>
                    `).join('')}
                </div>
            `;
            optionsContainer.appendChild(groupEl);

            // Selecionar primeira opção automaticamente se obrigatória
            setTimeout(() => {
                const buttons = groupEl.querySelectorAll('.option-btn');
                if (optionGroup.required && buttons.length > 0) {
                    buttons[0].classList.add('selected');
                    selectedOptions[optionGroup.id] = {
                        label: optionGroup.items[0].label,
                        price: optionGroup.items[0].price
                    };
                    updateModalTotal();
                }
                buttons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        buttons.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        const idx = parseInt(btn.dataset.index);
                        selectedOptions[optionGroup.id] = {
                            label: optionGroup.items[idx].label,
                            price: optionGroup.items[idx].price
                        };
                        updateModalTotal();
                    });
                });
            }, 0);
        });
    }

    updateModalTotal();

    // Mostrar modal
    document.getElementById('modalBackdrop').classList.add('active');
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar Modal
function closeModal() {
    document.getElementById('modalBackdrop').classList.remove('active');
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
    selectedOptions = {};
}

// Atualizar Total no Modal
function updateModalTotal() {
    if (!currentProduct) return;
    
    let extras = 0;
    Object.values(selectedOptions).forEach(opt => {
        if (opt.price) extras += opt.price;
    });
    
    const unitPrice = currentProduct.price + extras;
    const total = unitPrice * quantity;
    document.getElementById('addTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Adicionar ao Carrinho
function addToCart() {
    if (!currentProduct) return;

    // Validar opções obrigatórias
    const missingRequired = currentProduct.options.filter(g => 
        g.required && !selectedOptions[g.id]
    );
    if (missingRequired.length > 0) {
        alert(`Escolha: ${missingRequired.map(g => g.title).join(', ')}`);
        return;
    }

    // Montar detalhes
    let details = '';
    let extraSum = 0;
    for (const key in selectedOptions) {
        const opt = selectedOptions[key];
        if (details) details += ' • ';
        details += opt.label;
        if (opt.price) extraSum += opt.price;
    }

    const note = document.getElementById('noteInput').value.trim();
    if (note) {
        details += (details ? ' • ' : '') + `Obs: ${note}`;
    }

    const unitPrice = currentProduct.price + extraSum;

    // Verificar se já existe mesmo item
    const itemId = `${currentProduct.id}-${btoa(details).slice(0, 20)}`;
    const existingIndex = cart.findIndex(i => i.uid === itemId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            uid: itemId,
            id: currentProduct.id,
            name: currentProduct.name,
            basePrice: currentProduct.price,
            extraPrice: extraSum,
            unitPrice: unitPrice,
            quantity: quantity,
            details: details,
            image: currentProduct.image
        });
    }

    updateCartBadge();
    closeModal();

    // Feedback visual
    const btn = document.getElementById('addToCartBtn');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
    }, 1500);
}

// Atualizar Contador do Carrinho
function updateCartBadge() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = total;
}

// Atualizar Tela do Carrinho
function updateCartScreen() {
    const emptyState = document.getElementById('emptyCart');
    const itemsList = document.getElementById('cartItemsList');
    const footer = document.getElementById('cartFooter');

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        itemsList.innerHTML = '';
        footer.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    footer.style.display = 'block';

    itemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-top">
                <span class="cart-item-name">${item.name}</span>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            ${item.details ? `<p class="cart-item-details">${item.details}</p>` : ''}
            <div class="cart-item-bottom">
                <div class="cart-item-qty">
                    <button class="cart-qty-btn" data-action="minus" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" data-action="plus" data-index="${index}">+</button>
                </div>
                <span class="cart-item-price">R$ ${(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
    `).join('');

    // Eventos
    itemsList.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            if (btn.dataset.action === 'minus') {
                cart[idx].quantity--;
                if (cart[idx].quantity <= 0) cart.splice(idx, 1);
            } else {
                cart[idx].quantity++;
            }
            updateCartScreen();
            updateCartBadge();
        });
    });

    itemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            cart.splice(parseInt(btn.dataset.index), 1);
            updateCartScreen();
            updateCartBadge();
        });
    });

    // Total
    const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    document.getElementById('subtotalValue').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Enviar Pedido
function submitOrder() {
    if (cart.length === 0) {
        alert('Adicione itens ao pedido!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    // Criar objeto do pedido
    const pedido = {
        mesa: tableNumber,
        data: new Date().toLocaleString('pt-BR'),
        itens: cart.map(item => ({
            nome: item.name,
            detalhes: item.details,
            quantidade: item.quantity,
            precoUnitario: item.unitPrice.toFixed(2),
            subtotal: (item.unitPrice * item.quantity).toFixed(2)
        })),
        total: total.toFixed(2)
    };

    // Salvar no localStorage
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidosSalvos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosSalvos));

    console.log('✅ PEDIDO ENVIADO:', JSON.stringify(pedido, null, 2));

    // Limpar e mostrar confirmação
    cart = [];
    updateCartBadge();
    document.getElementById('confirmedTable').textContent = tableNumber;
    switchScreen('success');
}
