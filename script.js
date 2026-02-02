// script.js - VERSIÓN FINAL CLOUD (24 PRODUCTOS)

// 1. CARTA DE PRODUCTOS
const products = [
    // --- POLLOS ---
    { id: 1, category: "Pollos", name: "Pollo a la Brasa (Entero)", price: 68.00, desc: "Marinado secreto, papas nativas, ensalada familiar y cremas." },
    { id: 2, category: "Pollos", name: "1/2 Pollo Clásico", price: 38.00, desc: "Papas onduladas, ensalada fresca y todas las cremas." },
    { id: 3, category: "Pollos", name: "1/4 de Pollo (Parte Pecho)", price: 24.00, desc: "Jugoso pecho con papas doradas y ensalada." },
    { id: 4, category: "Pollos", name: "1/4 de Pollo (Parte Pierna)", price: 22.00, desc: "Pierna y encuentro con papas y ensalada." },
    { id: 5, category: "Pollos", name: "Mostrito Royal", price: 28.00, desc: "1/4 de pollo, arroz chaufa, papas fritas y huevo montado." },
    { id: 6, category: "Pollos", name: "Pack Familiar Golden", price: 75.00, desc: "1 Pollo + Papas + Ensalada + Gaseosa 1.5L + Aguadito." },

    // --- PARRILLAS ---
    { id: 7, category: "Parrillas", name: "Anticuchos de Corazón", price: 28.00, desc: "2 palos, papas doradas, choclo y ají de la casa." },
    { id: 8, category: "Parrillas", name: "Mollejitas a la Parrilla", price: 22.00, desc: "Mollejas marinadas al limón con papas doradas." },
    { id: 9, category: "Parrillas", name: "Parrilla Mixta Golden", price: 55.00, desc: "Bife, chuleta, anticucho, mollejitas y pechuga." },
    { id: 10, category: "Parrillas", name: "Bife de Chorizo (350g)", price: 58.00, desc: "Corte argentino importado con papas y ensalada cocida." },
    { id: 11, category: "Parrillas", name: "Lomo Fino a la Parrilla", price: 65.00, desc: "El corte más suave, término medio recomendado." },
    { id: 12, category: "Parrillas", name: "Chuleta de Cerdo BBQ", price: 32.00, desc: "2 chuletas bañadas en salsa BBQ ahumada." },

    // --- PIQUEOS ---
    { id: 13, category: "Piqueos", name: "Salchipapa Clásica", price: 18.00, desc: "Hot dog frankfurter y papas amarillas." },
    { id: 14, category: "Piqueos", name: "Salchipapa 'La Bestia'", price: 28.00, desc: "Salchicha, chorizo, huevo, queso y tocino." },
    { id: 15, category: "Piqueos", name: "Tequeños de Lomo (6 un)", price: 24.00, desc: "Rellenos de lomo saltado con salsa de palta." },
    { id: 16, category: "Piqueos", name: "Alitas BBQ (12 un)", price: 30.00, desc: "Alitas crocantes bañadas en salsa BBQ o Picante." },
    { id: 17, category: "Piqueos", name: "Chicharrón de Pollo", price: 26.00, desc: "Trozos de pechuga crocantes con papas y tártara." },

    // --- GUARNICIONES ---
    { id: 18, category: "Extras", name: "Porción Papas Nativas", price: 15.00, desc: "Papas tumbay fritas al momento (500g)." },
    { id: 19, category: "Extras", name: "Arroz Chaufa (Porción)", price: 14.00, desc: "Al estilo oriental con trozos de pollo y huevo." },
    { id: 20, category: "Extras", name: "Ensalada Waldorf", price: 16.00, desc: "Manzana, apio, nueces y mayonesa dulce." },

    // --- BEBIDAS ---
    { id: 21, category: "Bebidas", name: "Jarra Chicha Morada (1L)", price: 18.00, desc: "Maíz morado, piña, canela y clavo (100% fruta)." },
    { id: 22, category: "Bebidas", name: "Limonada Frozen (1L)", price: 20.00, desc: "Refrescante, clásica o con hierba luisa." },
    { id: 23, category: "Bebidas", name: "Inca Kola (1.5L)", price: 12.00, desc: "La compañera perfecta para tu pollo." },
    { id: 24, category: "Bebidas", name: "Pisco Sour Catedral", price: 28.00, desc: "Doble medida de Pisco Quebranta." }
];

let cart = [];
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

function addToCart(id) {
    cart.push(products.find(p => p.id === id));
    updateCartUI();
    const badge = document.getElementById('cart-count');
    badge.style.transform = "scale(1.5)";
    setTimeout(()=> badge.style.transform = "scale(1)", 200);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').innerText = total.toFixed(2);
    
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map(item => 
        `<div class="cart-item">
            <div><strong>${item.name}</strong></div>
            <span>S/ ${item.price.toFixed(2)}</span>
         </div>`
    ).join('');
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// --- CHECKOUT ---
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert("Tu carrito está vacío");

    const btn = document.querySelector('.btn-checkout');
    const originalText = btn.innerText;
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
        // RUTA RELATIVA: Funciona en Localhost y en Render automáticamente
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        
        if(result.success) {
            alert('✅ ¡PEDIDO ENVIADO! Revisa tu correo.');
            cart = [];
            updateCartUI();
            toggleCart();
        } else {
            alert('❌ Error del servidor: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

renderProducts();
