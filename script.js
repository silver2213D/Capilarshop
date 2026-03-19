// BASE DE DATOS DE PRODUCTOS LOGO EMPRESA
const productos = [
    { id: 1, nombre: 'Shampoo Reparador con Keratina', categoria: 'shampoo', precio: 25.00, imagen: 'images/piel-sensible.jpg', descripcion: 'Shampoo nutritivo que refuerza la fibra capilar y mejora la elasticidad en cada lavado.', rating: 4.8, stock: 18 },
    { id: 2, nombre: 'Acondicionador Hidratante', categoria: 'acondicionador', precio: 22.50, imagen: 'images/piel-sensible.jpg', descripcion: 'Acondicionador ligero que desenreda y aporta brillo sin apelmazar.', rating: 4.7, stock: 20 },
    { id: 3, nombre: 'Mascarilla Intensiva de Argán', categoria: 'tratamiento', precio: 29.90, imagen: 'images/piel-sensible.jpg', descripcion: 'Tratamiento profundo para recuperar el cabello seco y dañado en minutos.', rating: 4.9, descuento: 15, stock: 12 },
    { id: 4, nombre: 'Serum Anti-frizz', categoria: 'estilo', precio: 19.99, imagen: 'images/piel-sensible.jpg', descripcion: 'Serum ligero que controla el frizz y aporta un acabado suave y sedoso.', rating: 4.6, stock: 10 },
    { id: 5, nombre: 'Spray Protector Térmico', categoria: 'estilo', precio: 18.50, imagen: 'images/piel-sensible.jpg', descripcion: 'Protege el cabello del calor de planchas y secadores hasta 230°C.', rating: 4.5, stock: 22 },
    { id: 6, nombre: 'Aceite de Argán Puro', categoria: 'tratamiento', precio: 24.00, imagen: 'images/piel-sensible.jpg', descripcion: 'Aceite nutritivo para puntas abiertas y brillo intenso.', rating: 4.8, stock: 14 },
    { id: 7, nombre: 'Crema para Puntas Secas', categoria: 'tratamiento', precio: 16.99, imagen: 'images/piel-sensible.jpg', descripcion: 'Reducción de puntas abiertas con efecto reparador inmediato.', rating: 4.4, stock: 27 },
    { id: 8, nombre: 'Gel Fijador Suave', categoria: 'estilo', precio: 14.99, imagen: 'images/piel-sensible.jpg', descripcion: 'Fijación flexible con acabado natural y sin residuos.', rating: 4.3, descuento: 10, stock: 16 },
    { id: 9, nombre: 'Shampoo Detox de Carbón', categoria: 'shampoo', precio: 21.99, imagen: 'images/piel-sensible.jpg', descripcion: 'Limpia profundamente eliminando residuos y exceso de grasa.', rating: 4.7, stock: 19 },
    { id: 10, nombre: 'Mascarilla Nocturna Revitalizante', categoria: 'tratamiento', precio: 27.50, imagen: 'images/piel-sensible.jpg', descripcion: 'Repara mientras duermes para un cabello más suave al despertar.', rating: 4.9, descuento: 12, stock: 11 },
    { id: 11, nombre: 'Crema para Definición de Rizos', categoria: 'estilo', precio: 20.00, imagen: 'images/piel-sensible.jpg', descripcion: 'Define rizos sin frizz y con movimiento natural.', rating: 4.6, stock: 13 },
    { id: 12, nombre: 'Mascarilla de Colágeno + Vitamina E', categoria: 'tratamiento', precio: 26.00, imagen: 'images/piel-sensible.jpg', descripcion: 'Repara y fortalece la fibra capilar dejándola elástica y brillante.', rating: 4.8, descuento: 15, stock: 9 }
];

// CARRITO
let carrito = [];

// INICIALIZAR LA PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromLocalStorage();
    loadFeaturedProducts();
    loadProducts();
    
    // Event listener para el formulario de agregar producto
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
});

// MOSTRAR PÁGINA
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
    window.scrollTo(0, 0);
}

// CARGAR PRODUCTOS DESTACADOS
function loadFeaturedProducts() {
    const Featured = productos.filter(p => p.descuento).slice(0, 4);
    const container = document.getElementById('featured-products');
    container.innerHTML = Featured.map(p => createProductCard(p)).join('');
    container.querySelectorAll('.product-card').forEach((card, i) => {
        card.onclick = () => showProductDetail(Featured[i].id);
    });
}

// CARGAR TODOS LOS PRODUCTOS
function loadProducts() {
    const container = document.getElementById('products-grid');
    container.innerHTML = productos.map(p => createProductCard(p)).join('');
    attachProductCardListeners();
}

// CREAR TARJETA DE PRODUCTO
function createProductCard(producto) {
    const price = producto.descuento ? (producto.precio * (1 - producto.descuento / 100)).toFixed(2) : producto.precio.toFixed(2);
    const oldPrice = producto.descuento ? `<s style="color:#999;font-size:0.9rem">$${producto.precio.toFixed(2)}</s>` : '';
    
    const outOfStock = producto.stock <= 0;
    const stockLabel = outOfStock ? '<span class="stock out">Agotado</span>' : `<span class="stock">${producto.stock} disponibles</span>`;

    return `
        <div class="product-card ${outOfStock ? 'out-of-stock' : ''}">
            <div class="product-image"><img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/piel-sensible.jpg'"></div>
            <div class="product-info">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-category">${producto.categoria}</div>
                <div class="product-rating">${'⭐'.repeat(Math.floor(producto.rating))} ${producto.rating}</div>
                <div class="product-price">${oldPrice} $${price}</div>
                <div class="product-stock">${stockLabel}</div>
            </div>
        </div>
    `;
}

// ADJUNTAR LISTENERS A TARJETAS
function attachProductCardListeners() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
        card.querySelectorAll('button').forEach(btn => {
            btn.onclick = (e) => e.stopPropagation();
        });
    });
}

// BUSCAR PRODUCTOS
function searchProducts() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const filtered = productos.filter(p => 
        p.nombre.toLowerCase().includes(search) || 
        p.descripcion.toLowerCase().includes(search)
    );
    displayFilteredProducts(filtered);
}

// FILTRAR PRODUCTOS
function filterProducts() {
    const checkboxes = document.querySelectorAll('.filter-section input[type="checkbox"]:checked');
    const priceRange = document.getElementById('price-range').value;
    document.getElementById('price-value').textContent = priceRange;
    
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    
    let filtered = productos;
    
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.categoria));
    }
    
    filtered = filtered.filter(p => p.precio <= priceRange);
    
    displayFilteredProducts(filtered);
}

// MOSTRAR PRODUCTOS FILTRADOS
function displayFilteredProducts(filtered) {
    const container = document.getElementById('products-grid');
    container.innerHTML = filtered.map(p => createProductCard(p)).join('');
    attachProductCardListeners();
}

// VER DETALLE DEL PRODUCTO
function showProductDetail(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    const price = producto.descuento ? (producto.precio * (1 - producto.descuento / 100)).toFixed(2) : producto.precio.toFixed(2);
    const oldPrice = producto.descuento ? `<p style="text-decoration:line-through;color:#999">$${producto.precio.toFixed(2)}</p>` : '';
    
    const html = `
        <div class="product-detail-image"><img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/placeholder.jpg'"></div>
        <div class="product-detail-info">
            <h2>${producto.nombre}</h2>
            <div class="category">${producto.categoria}</div>
            <div class="rating" style="color:#ffc107;margin-bottom:1rem">⭐ ${producto.rating}</div>
            ${oldPrice}
            <div class="price">$${price}</div>
            <div class="desc">${producto.descripcion}</div>
            <div style="margin-bottom:1.5rem">Stock: <strong>${producto.stock} unidades disponibles</strong></div>
            <div class="quantity-selector">
                <button onclick="decreaseQty()">−</button>
                <input type="number" id="quantity" value="1" min="1" max="${producto.stock}">
                <button onclick="increaseQty()">+</button>
            </div>
            <button class="btn-primary" onclick="addToCartFromDetail(${productId})" style="width:100%;padding:15px">Añadir al Carrito</button>
        </div>
    `;
    
    document.getElementById('product-detail-container').innerHTML = html;
    showPage('detalle');
}

// CONTROLAR CANTIDAD
function increaseQty() {
    const input = document.getElementById('quantity');
    input.value = Math.min(parseInt(input.value) + 1, 10);
}

function decreaseQty() {
    const input = document.getElementById('quantity');
    input.value = Math.max(parseInt(input.value) - 1, 1);
}

// AÑADIR AL CARRITO
function addToCart(productId) {
    const producto = productos.find(p => p.id === productId);
    if (producto.stock <= 0) {
        showNotification('Producto agotado');
        return;
    }
    const existeEnCarrito = carrito.find(item => item.id === productId);
    
    if (existeEnCarrito) {
        if (existeEnCarrito.cantidad >= producto.stock) {
            showNotification('No hay suficiente stock disponible');
            return;
        }
        existeEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    updateCartCount();
    showNotification(`${producto.nombre} añadido al carrito`);
}

// AÑADIR AL CARRITO DESDE DETALLE
function addToCartFromDetail(productId) {
    const cantidad = parseInt(document.getElementById('quantity').value);
    const producto = productos.find(p => p.id === productId);
    const existeEnCarrito = carrito.find(item => item.id === productId);
    
    if (existeEnCarrito) {
        existeEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad: cantidad });
    }
    
    updateCartCount();
    showNotification(`${producto.nombre} añadido al carrito`);
}

// ACTUALIZAR CONTADOR DEL CARRITO
function updateCartCount() {
    const count = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('cart-count').textContent = count;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// MOSTRAR CARRITO
function displayCart() {
    const container = document.getElementById('cart-items');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <p style="font-size:2rem;margin-bottom:1rem">🛒</p>
                <p>Tu carrito está vacío</p>
                <button class="btn-primary" style="margin-top:1rem" onclick="showPage('tienda')">Continuar comprando</button>
            </div>
        `;
        document.getElementById('subtotal').textContent = '0.00';
        document.getElementById('shipping').textContent = '0.00';
        document.getElementById('total').textContent = '0.00';
        return;
    }
    
    container.innerHTML = carrito.map((item, index) => {
        const finalPrice = item.descuento ? (item.precio * (1 - item.descuento / 100)) : item.precio;
        return `
            <div class="cart-item">
                <div class="cart-item-image">${item.imagen}</div>
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>$${finalPrice.toFixed(2)} c/u</p>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" value="${item.cantidad}" min="1" onchange="updateCartItemQty(${index}, this.value)">
                </div>
                <div class="cart-item-price">$${(finalPrice * item.cantidad).toFixed(2)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
    }).join('');
    
    updateCartTotal();
}

// ACTUALIZAR CANTIDAD EN CARRITO
function updateCartItemQty(index, cantidad) {
    cantidad = Math.max(1, parseInt(cantidad));
    carrito[index].cantidad = cantidad;
    updateCartCount();
    displayCart();
}

// ELIMINAR DEL CARRITO
function removeFromCart(index) {
    const producto = carrito[index].nombre;
    carrito.splice(index, 1);
    updateCartCount();
    displayCart();
    showNotification(`${producto} eliminado del carrito`);
}

// CALCULAR TOTAL DEL CARRITO
function updateCartTotal() {
    let subtotal = 0;
    carrito.forEach(item => {
        const finalPrice = item.descuento ? (item.precio * (1 - item.descuento / 100)) : item.precio;
        subtotal += finalPrice * item.cantidad;
    });
    
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('shipping').textContent = shipping.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

// OBSERVADOR PARA MOSTRAR CARRITO CUANDO SE HACE CLICK
const observer = new MutationObserver(() => {
    if (document.getElementById('carrito').style.display !== 'none') {
        displayCart();
    }
    if (document.getElementById('admin').style.display !== 'none') {
        loadAdminProducts();
    }
});

observer.observe(document.getElementById('carrito'), { attributes: true });
observer.observe(document.getElementById('admin'), { attributes: true });

// PAGAR
function checkout() {
    const total = document.getElementById('total').textContent;
    showNotification(`¡Compra realizada! Total: $${total}`);
    carrito = [];
    updateCartCount();
    setTimeout(() => showPage('home'), 1500);
}

// ENVIAR CONTACTO
function sendContact(e) {
    e.preventDefault();
    showNotification('Mensaje enviado. Nos pondremos en contacto pronto.');
    e.target.reset();
}

// NOTIFICACIÓN
function showNotification(msg) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:20px;right:20px;background:#667eea;color:white;padding:15px 25px;border-radius:5px;z-index:1000;animation:slideIn 0.3s';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// CARGAR CARRITO DEL ALMACENAMIENTO LOCAL
window.addEventListener('load', () => {
    const saved = localStorage.getItem('carrito');
    if (saved) carrito = JSON.parse(saved);
    updateCartCount();
});

// ANIMACIÓN SLIDE IN
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);