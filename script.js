// script.js - VERSIÓN FINAL CORREGIDA (PARA RENDER)

// 1. Base de Datos Completa (20 Productos)
const products = [
    // --- POLLOS A LA BRASA ---
    { id: 1, category: "Pollos", name: "Pollo a la Brasa (Entero)", price: 68.00, desc: "Marinado secreto, papas nativas, ensalada familiar y cremas." },
    { id: 2, category: "Pollos", name: "1/2 Pollo Clásico", price: 38.00, desc: "Papas onduladas, ensalada fresca y todas las cremas." },
    { id: 3, category: "Pollos", name: "1/4 de Pollo (Parte Pecho)", price: 24.00, desc: "Jugoso pecho con papas doradas y ensalada." },
    { id: 4, category: "Pollos", name: "1/4 de Pollo (Parte Pierna)", price: 22.00, desc: "Pierna y encuentro con papas y ensalada." },
    { id: 5, category: "Pollos", name: "Mostrito Royal", price: 28.00, desc: "1/4 de pollo, arroz chaufa, papas fritas y huevo montado." },
    
    // --- PARRILLAS Y ANTICUCHOS ---
    { id: 6, category: "Parrillas", name: "Anticuchos de Corazón", price: 28.00, desc: "2 palos, papas doradas, choclo y ají de la casa." },
    { id: 7, category: "Parrillas", name: "Mollejitas a la Parrilla", price: 22.00, desc: "Mollejas marinadas al limón con papas doradas." },
    { id: 8, category: "Parrillas", name: "Parrilla Mixta Simple", price: 45.00, desc: "Chuleta, anticucho, mollejitas y pechuga." },
    { id: 9, category: "Parrillas", name: "Bife de Chorizo (300g)", price: 55.00, desc: "Corte argentino con papas fritas y ensalada cocida." },
    { id: 10, category: "Parrillas", name: "Chuleta de Cerdo", price: 30.00, desc: "2 chuletas jugosas con papas y ensalada." },

    // --- SALCHIPAPAS Y PIQUEOS ---
    { id: 11, category: "Piqueos", name: "Salchipapa Clásica", price: 18.00, desc: "Hot dog frankfurter y papas amarillas." },
    { id: 12, category: "Piqueos", name: "Salchipapa 'La Bestia'", price: 28.00, desc: "Salchicha, chorizo, huevo, queso y tocino." },
    { id: 13, category: "Piqueos", name: "Tequeños de Pollo a la Brasa", price: 20.00, desc: "12 unidades con salsa de palta." },
    
    // --- GUARNICIONES ---
    { id: 14, category: "Extras", name: "Porción de Papas Nativas", price: 15.00, desc: "Papas tumbay fritas al momento." },
    { id: 15, category: "Extras", name: "Arroz Chaufa (Porción)", price: 12.00, desc: "Al estilo oriental con trozos de pollo." },
    { id: 16, category: "Extras", name: "Ensalada Waldorf", price: 14.00, desc: "Manzana, apio, nueces y mayonesa dulce." },

    // --- BEBIDAS ---
    { id: 17, category: "Bebidas", name: "Jarra Chicha Morada (1L)", price: 15.00, desc: "Maíz morado, piña, canela y clavo (Casera)." },
    { id: 18, category: "Bebidas", name: "Limonada Frozen (1L)", price: 18.00, desc: "Clásica o con hierba luisa." },
    { id: 19, category: "Bebidas", name: "Inca Kola (1.5L)", price: 12.00, desc: "La compañera perfecta." },
    { id: 20, category: "Bebidas", name: "Pisco Sour Catedral", price: 25.00, desc: "Quebranta, limón y amargo de angostura." }
];

let cart = [];

// 2. Renderizar Productos
const container = document.getElementById('products-container');

function renderProducts() {
    container.innerHTML = "";
    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-badge">${prod.category}</div>
            <div class="product-title">${prod.name}</div>
            <div class="product-desc">${prod.desc}</div>
            <div class="product-footer">
                <span class="price">S/ ${prod.price.toFixed(2)}</span>
                <button class="add-btn" onclick="addToCart(${prod.id})">Agregar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Lógica del Carrito
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    
    // Animación visual
    const countBadge = document.getElementById('cart-count');
    countBadge.style.transform = "scale(1.5)";
    setTimeout(() => countBadge.style.transform = "scale(1)", 200);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    
    let total = 0;
    cart.forEach((item) => {
        total += item.price;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <div style="flex:1">
                    <strong>${item.name}</strong>
                    <div style="font-size:0.8em; color:#ccc">${item.category}</div>
                </div>
                <span>S/ ${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// 4. Checkout (AQUÍ ESTÁ LA CORRECCIÓN)
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(cart.length === 0) { alert("Tu carrito está vacío"); return; }

    const btn = document.querySelector('.btn-checkout');
    btn.innerText = "Procesando...";
    btn.disabled = true;

    const orderData = {
        customer: {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            address: document.getElementById('client-address').value
        },
        items: cart,
        total: document.getElementById('cart-total').innerText
    };

    try {
        // --- CAMBIO CLAVE ---
        // Se borró "http://localhost:3000" y se dejó solo la ruta relativa
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        
        if(result.success) {
            alert('¡Pedido Recibido! Revisa tu correo para confirmar.');
            cart = [];
            updateCartUI();
            toggleCart();
        } else {
            alert('Error en el servidor: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el pedido. Intenta nuevamente.');
    } finally {
        btn.innerText = "Pagar y Enviar Pedido";
        btn.disabled = false;
    }
});

// Inicializar
renderProducts();
