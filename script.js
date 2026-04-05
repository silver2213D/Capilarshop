// BASE DE DATOS DE PRODUCTOS - Inicialmente vacía (se carga desde Supabase)
let productos = [];

// PRODUCTOS DE FALLBACK (solo si Supabase no funciona)
const productosLocal = [
    { id: 1, nombre: 'Shampoo Reparador con Keratina', categoria: 'shampoo', seccion: 'general', precio: 1450, imagen: 'images/piel-sensible.jpg', descripcion: 'Shampoo nutritivo que refuerza la fibra capilar y mejora la elasticidad en cada lavado.', rating: 4.8, stock: 18 },
    { id: 2, nombre: 'Acondicionador Hidratante', categoria: 'acondicionador', seccion: 'general', precio: 1305, imagen: 'images/piel-sensible.jpg', descripcion: 'Acondicionador ligero que desenreda y aporta brillo sin apelmazar.', rating: 4.7, stock: 20 },
    { id: 3, nombre: 'Mascarilla Intensiva de Argán', categoria: 'tratamiento', seccion: 'general', precio: 1734, imagen: 'images/piel-sensible.jpg', descripcion: 'Tratamiento profundo para recuperar el cabello seco y dañado en minutos.', rating: 4.9, descuento: 15, stock: 12 },
    { id: 4, nombre: 'Serum Anti-frizz', categoria: 'estilo', seccion: 'general', precio: 1159, imagen: 'images/piel-sensible.jpg', descripcion: 'Serum ligero que controla el frizz y aporta un acabado suave y sedoso.', rating: 4.6, stock: 10 },
    { id: 5, nombre: 'Spray Protector Térmico', categoria: 'estilo', seccion: 'general', precio: 1073, imagen: 'images/piel-sensible.jpg', descripcion: 'Protege el cabello del calor de planchas y secadores hasta 230°C.', rating: 4.5, stock: 22 },
    { id: 6, nombre: 'Aceite de Argán Puro', categoria: 'tratamiento', seccion: 'general', precio: 1392, imagen: 'images/piel-sensible.jpg', descripcion: 'Aceite nutritivo para puntas abiertas y brillo intenso.', rating: 4.8, stock: 14 },
    { id: 7, nombre: 'Crema para Puntas Secas', categoria: 'tratamiento', seccion: 'general', precio: 985, imagen: 'images/piel-sensible.jpg', descripcion: 'Reducción de puntas abiertas con efecto reparador inmediato.', rating: 4.4, stock: 27 },
    { id: 8, nombre: 'Gel Fijador Suave', categoria: 'estilo', seccion: 'general', precio: 869, imagen: 'images/piel-sensible.jpg', descripcion: 'Fijación flexible con acabado natural y sin residuos.', rating: 4.3, descuento: 10, stock: 16 },
    { id: 9, nombre: 'Shampoo Detox de Carbón', categoria: 'shampoo', seccion: 'general', precio: 1275, imagen: 'images/piel-sensible.jpg', descripcion: 'Limpia profundamente eliminando residuos y exceso de grasa.', rating: 4.7, stock: 19 },
    { id: 10, nombre: 'Mascarilla Nocturna Revitalizante', categoria: 'tratamiento', seccion: 'general', precio: 1595, imagen: 'images/piel-sensible.jpg', descripcion: 'Repara mientras duermes para un cabello más suave al despertar.', rating: 4.9, descuento: 12, stock: 11 },
    { id: 11, nombre: 'Crema para Definición de Rizos', categoria: 'estilo', seccion: 'general', precio: 1160, imagen: 'images/piel-sensible.jpg', descripcion: 'Define rizos sin frizz y con movimiento natural.', rating: 4.6, stock: 13 },
    { id: 12, nombre: 'Mascarilla de Colágeno + Vitamina E', categoria: 'tratamiento', seccion: 'general', precio: 1508, imagen: 'images/piel-sensible.jpg', descripcion: 'Repara y fortalece la fibra capilar dejándola elástica y brillante.', rating: 4.8, descuento: 15, stock: 9 }
];

// SECCIONES DE PRODUCTOS (ADMIN)
let secciones = [
    { id: 'general', nombre: 'General' }
];

// CARRITO
let carrito = [];

// CUPÓN APLICADO
let cuponAplicado = null;

// Cupones administrables
let cupones = [];

// RESEÑAS
let resenas = [];

// INICIALIZAR LA PÁGINA
document.addEventListener('DOMContentLoaded', async function() {
    await loadProductsFromSupabase();
    await loadCouponsFromSupabase();
    loadSectionsFromLocalStorage();
    loadSectionsInProductForm();

    loadProducts();
    loadHomeProducts();
    loadAdminProducts();
    loadAdminCoupons();

    // Event listener para el formulario de agregar producto
    const productForm = document.getElementById('add-product-form');
    if (productForm) productForm.addEventListener('submit', addProduct);

    const sectionForm = document.getElementById('add-section-form');
    if (sectionForm) sectionForm.addEventListener('submit', addSection);

    const couponForm = document.getElementById('add-coupon-form');
    if (couponForm) couponForm.addEventListener('submit', addCoupon);
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

// CARGAR PRODUCTOS EN LA PÁGINA DE INICIO
function loadHomeProducts() {
    const container = document.getElementById('home-products');
    if (!container) return;

    // Agrupamos los productos por sección
    const grouped = {};
    productos.forEach(p => {
        const key = p.seccion || 'general';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
    });

    // Asegurar que se muestren todas las secciones que existen en los productos
    const homeSections = [...secciones];
    Object.keys(grouped).forEach(sectionId => {
        if (!homeSections.find(sec => sec.id === sectionId)) {
            homeSections.push({
                id: sectionId,
                nombre: sectionId.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())
            });
        }
    });

    container.innerHTML = homeSections.map(sec => {
        const sectionProducts = grouped[sec.id] || [];
        if (!sectionProducts.length) return '';
        return `
            <div class="home-section">
                <h3 class="home-section-title">${sec.nombre}</h3>
                <div class="products-grid">${sectionProducts.map(p => createProductCard(p)).join('')}</div>
            </div>
        `;
    }).join('');

    attachProductCardListeners();
}

// CARGAR PRODUCTOS DESDE SUPABASE
async function loadProductsFromSupabase() {
    try {
        console.log('⏳ Cargando productos desde Supabase...');
        
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*');
        
        if (error) {
            console.error('❌ ERROR en Supabase:', error.message);
            console.warn('⚠️ Usando productos locales como fallback');
            productos.splice(0, productos.length, ...productosLocal);
            // Asegurar que todos los productos tengan sección
            productos.forEach(p => { if (!p.seccion) p.seccion = 'general'; });
            showNotification('Usando datos locales - No se pudo conectar a Supabase');
            return false;
        }
        
        if (data && data.length > 0) {
            productos.splice(0, productos.length, ...data);
            // Asegurar que todos los productos tengan sección
            productos.forEach(p => { if (!p.seccion) p.seccion = 'general'; });
            console.log('✓ Productos cargados desde Supabase:', data.length);
            return true;
        } else {
            console.warn('⚠️ Supabase está vacío, usando productos locales');
            productos.splice(0, productos.length, ...productosLocal);
            return false;
        }
    } catch (error) {
        console.error('❌ EXCEPCIÓN al cargar productos:', error);
        console.warn('⚠️ Usando productos locales como fallback');
        productos.splice(0, productos.length, ...productosLocal);
        // Asegurar que todos los productos tengan sección
        productos.forEach(p => { if (!p.seccion) p.seccion = 'general'; });
        return false;
    }
}

// GUARDAR/ACTUALIZAR PRODUCTO EN SUPABASE
async function saveProductToSupabase(product) {
    try {
        if (product.id) {
            // Actualizar existente
            const { error } = await supabaseClient
                .from('productos')
                .update(product)
                .eq('id', product.id);
            
            if (error) {
                console.error('Error actualizando producto:', error);
                throw error;
            }
            console.log('Producto actualizado en Supabase:', product.id);
        } else {
            // Insertar nuevo - generar ID único
            const newId = Math.max(...productos.map(p => p.id || 0), 0) + 1;
            const newProduct = { ...product, id: newId };
            
            const { data, error } = await supabaseClient
                .from('productos')
                .insert([newProduct]);
            
            if (error) {
                console.error('Error insertando producto:', error);
                throw error;
            }
            console.log('Producto insertado en Supabase:', newId);
            return data?.[0];
        }
    } catch (error) {
        console.error('Error guardando producto en Supabase:', error);
        showNotification('Error al guardar en Supabase: ' + error.message);
        return null;
    }
}

// BORRAR PRODUCTO DE SUPABASE
async function deleteProductFromSupabase(productId) {
    try {
        const { error } = await supabaseClient
            .from('productos')
            .delete()
            .eq('id', productId);
        
        if (error) {
            console.error('Error eliminando producto:', error);
            throw error;
        }
        console.log('Producto eliminado de Supabase:', productId);
        return true;
    } catch (error) {
        console.error('Error eliminando producto:', error);
        showNotification('Error al eliminar de Supabase: ' + error.message);
        return false;
    }
}

function loadSectionsFromLocalStorage() {
    const saved = localStorage.getItem('secciones');
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
            secciones = parsed;
        }
    } catch {
        // ignore
    }
    
    // Asegurar que siempre exista la sección 'general'
    if (!secciones.find(s => s.id === 'general')) {
        secciones.unshift({ id: 'general', nombre: 'General' });
    }
}

function saveSectionsToLocalStorage() {
    localStorage.setItem('secciones', JSON.stringify(secciones));
}

function loadSectionsInProductForm() {
    const select = document.getElementById('product-section');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccionar sección</option>' +
        secciones.map(sec => `<option value="${sec.id}">${sec.nombre}</option>`).join('');
}

function loadAdminSections() {
    const container = document.getElementById('admin-sections-list');
    if (!container) return;

    container.innerHTML = secciones.map(sec => `
        <div class="admin-section-item">
            <strong>${sec.nombre}</strong>
            ${sec.id !== 'general' ? `<button class="btn-secondary" onclick="deleteSection('${sec.id}')">Eliminar</button>` : ''}
        </div>
    `).join('');
}

function addSection(e) {
    e.preventDefault();
    const input = document.getElementById('section-name');
    if (!input) return;

    const nombre = input.value.trim();
    if (!nombre) {
        showNotification('Ingresa un nombre de sección válido.');
        return;
    }

    const id = nombre.toLowerCase().replace(/\s+/g, '-');
    if (secciones.some(s => s.id === id)) {
        showNotification('Ya existe una sección con ese nombre.');
        return;
    }

    secciones.push({ id, nombre });
    saveSectionsToLocalStorage();
    loadSectionsInProductForm();
    loadAdminSections();
    input.value = '';
    showNotification('Sección creada correctamente.');
}

function deleteSection(sectionId) {
    if (sectionId === 'general') return;
    secciones = secciones.filter(s => s.id !== sectionId);

    // re-asignar productos de la sección eliminada a la sección general
    productos.forEach(p => {
        if (p.seccion === sectionId) p.seccion = 'general';
    });

    saveSectionsToLocalStorage();
    saveProductsToLocalStorage();
    loadSectionsInProductForm();
    loadAdminSections();
    loadHomeProducts();
    showNotification('Sección eliminada. Los productos se movieron a "General".');
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
    const oldPrice = producto.descuento ? `<s style="color:#999;font-size:0.9rem">RD$${producto.precio.toFixed(2)}</s>` : '';
    
    const outOfStock = producto.stock <= 0;
    const stockLabel = outOfStock ? '<span class="stock out">Agotado</span>' : `<span class="stock">${producto.stock} disponibles</span>`;

    return `
        <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" onclick="showProductDetail(${producto.id})">
            <div class="product-image"><img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/piel-sensible.jpg'"></div>
            <div class="product-info">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-category">${producto.categoria}</div>
                <div class="product-rating">${'⭐'.repeat(Math.floor(producto.rating))} ${producto.rating}</div>
                <div class="product-price">${oldPrice} RD$${price}</div>
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

// ADMIN: LISTAR PRODUCTOS EN EL PANEL
function loadAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;

    container.innerHTML = productos.map(p => {
        const section = secciones.find(s => s.id === (p.seccion || 'general'));
        const sectionName = section ? section.nombre : 'General';
        return `
            <div class="admin-product-item">
                <div>
                    <strong>${p.nombre}</strong>
                    <div style="font-size:0.9rem;color:#555">${sectionName} • ${p.categoria} • RD$${p.precio.toFixed(2)}</div>
                </div>
                <button class="btn-secondary" onclick="deleteProduct(${p.id})">Eliminar</button>
            </div>
        `;
    }).join('');
}

// ADMIN: CARGAR Y MOSTRAR CUPONES
async function loadCouponsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('cupones')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error cargando cupones:', error);
            showNotification('Error cargando cupones (ver consola)');
            return false;
        }

        cupones = data || [];
        loadAdminCoupons();
        return true;
    } catch (err) {
        console.error('Excepción cargando cupones:', err);
        showNotification('Error cargando cupones');
        return false;
    }
}

function loadAdminCoupons() {
    const container = document.getElementById('admin-coupons-list');
    if (!container) return;

    if (cupones.length === 0) {
        container.innerHTML = '<p>No hay cupones cargados.</p>';
        return;
    }

    container.innerHTML = cupones.map(c => {
        const usos = c.usos_max ? `${c.usos_actuales || 0}/${c.usos_max}` : `${c.usos_actuales || 0} usos`;
        return `
            <div class="admin-coupon-item">
                <div><strong>${c.codigo}</strong> - ${c.descuento_valor}% descuento · usos ${usos}</div>
                <button onclick="deleteCoupon(${c.id})">Eliminar</button>
            </div>
        `;
    }).join('');
}

async function addCoupon(e) {
    e.preventDefault();

    const codeInput = document.getElementById('coupon-code-input');
    const valueInput = document.getElementById('coupon-value-input');
    const usesInput = document.getElementById('coupon-uses-input');

    const codigo = codeInput.value.trim().toUpperCase();
    const descuento_valor = parseFloat(valueInput.value);
    const usos_max = parseInt(usesInput.value, 10) || null;

    if (!codigo || isNaN(descuento_valor) || descuento_valor <= 0) {
        showNotification('Completa todos los datos correctos del cupón');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('cupones')
            .insert([{
                codigo,
                descuento_tipo: 'porcentaje',
                descuento_valor,
                valido_hasta: null,
                usos_max,
                usos_actuales: 0,
                activo: true
            }]);

        if (error) {
            console.error('Error agregando cupón:', error);
            showNotification('Error al agregar cupón (' + (error.message || 'ver consola') + ')');
            return;
        }

        showNotification('Cupón agregado satisfactoriamente');
        await loadCouponsFromSupabase();
        codeInput.value = '';
        valueInput.value = '';
        usesInput.value = '';
    } catch (err) {
        console.error('Exception agregando cupón:', err);
        showNotification('Error al agregar cupón');
    }
}

async function deleteCoupon(couponId) {
    try {
        const { error } = await supabaseClient
            .from('cupones')
            .delete()
            .eq('id', couponId);

        if (error) {
            console.error('Error eliminando cupón:', error);
            showNotification('Error eliminando cupón');
            return;
        }

        cupones = cupones.filter(c => c.id !== couponId);
        loadAdminCoupons();
        showNotification('Cupón eliminado');
    } catch (err) {
        console.error('Exception eliminando cupón:', err);
        showNotification('Error eliminando cupón');
    }
}

async function deleteProduct(productId) {
    const index = productos.findIndex(p => p.id === productId);
    if (index === -1) return;
    
    // Eliminar de Supabase primero
    const success = await deleteProductFromSupabase(productId);
    
    if (success) {
        productos.splice(index, 1);
        loadProducts();
        loadHomeProducts();
        loadAdminProducts();
        showNotification('Producto eliminado correctamente.');
    } else {
        showNotification('Error al eliminar el producto.');
    }
}

// AGREGAR PRODUCTO NUEVO
async function addProduct(e) {
    e.preventDefault();

    const nameInput = document.getElementById('product-name');
    const categorySelect = document.getElementById('product-category');
    const sectionSelect = document.getElementById('product-section');
    const priceInput = document.getElementById('product-price');
    const stockInput = document.getElementById('product-stock');
    const imageInput = document.getElementById('product-image');
    const ratingInput = document.getElementById('product-rating');
    const descriptionInput = document.getElementById('product-description');
    const discountInput = document.getElementById('product-discount');

    const nombre = nameInput.value.trim();
    const categoria = (categorySelect && categorySelect.value.trim()) ? categorySelect.value.trim() : 'general';
    const seccion = (sectionSelect && sectionSelect.value.trim()) ? sectionSelect.value.trim() : 'general';
    const precio = parseFloat(priceInput.value) || 0;
    const stock = parseInt(stockInput.value, 10) || 0;
    const rating = parseFloat(ratingInput.value) || 0;
    const descripcion = descriptionInput.value.trim();
    const descuento = parseFloat(discountInput.value) || 0;

    if (!nombre) {
        showNotification('Completa el nombre del producto.');
        return;
    }

    const newProduct = {
        nombre,
        categoria,
        seccion: seccion || 'general',
        precio,
        imagen: 'images/piel-sensible.jpg',
        descripcion,
        rating,
        descuento: descuento > 0 ? descuento : undefined,
        stock
    };

    if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = async function () {
            newProduct.imagen = reader.result;
            await saveProductToSupabase(newProduct);
            await loadProductsFromSupabase();
            afterProductAdded();
        };
        reader.readAsDataURL(file);
    } else {
        await saveProductToSupabase(newProduct);
        await loadProductsFromSupabase();
        afterProductAdded();
    }

    function afterProductAdded() {
        loadProducts();
        loadHomeProducts();
        loadAdminProducts();
        showNotification('Producto agregado correctamente.');
        e.target.reset();
        loadSectionsInProductForm();
    }
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
    const oldPrice = producto.descuento ? `<p style="text-decoration:line-through;color:#999">RD$${producto.precio.toFixed(2)}</p>` : '';
    
    const html = `
        <div class="product-detail-image"><img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/placeholder.jpg'"></div>
        <div class="product-detail-info">
            <h2>${producto.nombre}</h2>
            <div class="category">${producto.categoria}</div>
            <div class="rating" style="color:#ffc107;margin-bottom:1rem">⭐ ${producto.rating}</div>
            ${oldPrice}
            <div class="price">RD$${price}</div>
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
    document.getElementById('review-product-id').value = productId;
    loadReviews(productId);
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
        showNotification('❌ Producto agotado');
        return;
    }
    const existeEnCarrito = carrito.find(item => item.id === productId);
    
    if (existeEnCarrito) {
        if (existeEnCarrito.cantidad >= producto.stock) {
            showNotification(`❌ No hay más stock disponible. Máx: ${producto.stock}`);
            return;
        }
        existeEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    updateCartCount();
    showNotification(`✅ ${producto.nombre} añadido al carrito (Stock: ${producto.stock - (existeEnCarrito ? 1 : 0)})`);
}

// AÑADIR AL CARRITO DESDE DETALLE
function addToCartFromDetail(productId) {
    const cantidad = parseInt(document.getElementById('quantity').value);
    const producto = productos.find(p => p.id === productId);
    const existeEnCarrito = carrito.find(item => item.id === productId);
    
    // Validar stock disponible
    const cantidadActual = existeEnCarrito ? existeEnCarrito.cantidad : 0;
    if (cantidadActual + cantidad > producto.stock) {
        showNotification(`❌ No hay suficiente stock. Disponible: ${producto.stock - cantidadActual}`);
        return;
    }
    
    if (existeEnCarrito) {
        existeEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad: cantidad });
    }
    
    updateCartCount();
    showNotification(`✅ ${producto.nombre} añadido al carrito`);
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
        document.getElementById('discount').textContent = '0.00';
        document.getElementById('shipping').textContent = '0.00';
        document.getElementById('total').textContent = '0.00';
        cuponAplicado = null; // Reset cupón cuando carrito vacío
        document.getElementById('coupon-code').value = '';
        document.getElementById('coupon-message').textContent = '';
        return;
    }
    
    container.innerHTML = carrito.map((item, index) => {
        const finalPrice = item.descuento ? (item.precio * (1 - item.descuento / 100)) : item.precio;
        return `
            <div class="cart-item">
                <div class="cart-item-image"><img src="${item.imagen}" alt="${item.nombre}"></div>
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>RD$${finalPrice.toFixed(2)} c/u</p>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" value="${item.cantidad}" min="1" onchange="updateCartItemQty(${index}, this.value)">
                </div>
                <div class="cart-item-price">RD$${(finalPrice * item.cantidad).toFixed(2)}</div>
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

// OBSERVADOR PARA MOSTRAR CARRITO CUANDO SE HACE CLICK
const observer = new MutationObserver(() => {
    if (document.getElementById('carrito').style.display !== 'none') {
        displayCart();
    }
    if (document.getElementById('admin').style.display !== 'none') {
        loadAdminProducts();
        loadAdminCoupons();
    }
});

observer.observe(document.getElementById('carrito'), { attributes: true });
observer.observe(document.getElementById('admin'), { attributes: true });

// ENVIAR CONTACTO
function sendContact(e) {
    e.preventDefault();
    showNotification('Mensaje enviado. Nos pondremos en contacto pronto.');
    e.target.reset();
}

// NOTIFICACIÓN
function showNotification(msg) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#2d5347;color:#d4af37;padding:15px 25px;border-radius:5px;z-index:1000;animation:slideIn 0.3s';
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

function showSuccessModal() {
    document.getElementById('success-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
    setTimeout(() => {
        document.getElementById('success-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

// FUNCIONES PARA RESEÑAS
async function loadReviews(productId) {
    try {
        const { data, error } = await supabaseClient
            .from('resenas')
            .select('*')
            .eq('producto_id', productId)
            .order('fecha', { ascending: false });
        
        if (error) {
            console.error('Error cargando reseñas:', error);
            document.getElementById('reviews-list').innerHTML = '<p>Error al cargar reseñas</p>';
            return;
        }
        
        const reviewsHtml = data.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-name">${review.usuario}</span>
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                </div>
                <div class="review-date">${new Date(review.fecha).toLocaleDateString()}</div>
                <div class="review-comment">${review.comentario}</div>
            </div>
        `).join('');
        
        document.getElementById('reviews-list').innerHTML = reviewsHtml || '<p>No hay reseñas aún. ¡Sé el primero en opinar!</p>';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reviews-list').innerHTML = '<p>Error al cargar reseñas</p>';
    }
}

async function submitReview(event) {
    event.preventDefault();
    
    const productId = document.getElementById('review-product-id').value;
    const name = document.getElementById('review-name').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;
    
    try {
        const { error } = await supabaseClient
            .from('resenas')
            .insert([{
                producto_id: productId,
                usuario: name,
                comentario: comment,
                rating: parseInt(rating)
            }]);
        
        if (error) {
            console.error('Error enviando reseña:', error);
            showNotification('❌ Error al enviar la reseña');
            return;
        }
        
        showNotification('✅ Reseña enviada exitosamente');
        document.getElementById('review-form').reset();
        loadReviews(productId);
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al enviar la reseña');
    }
}

// FUNCIONES PARA CUPONES
async function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    if (!code) {
        showCouponMessage('Ingresa un código de cupón', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('cupones')
            .select('*')
            .ilike('codigo', code)
            .eq('activo', true)
            .limit(1);
        
        if (error) {
            console.error('Error leyendo cupón:', error);
            showCouponMessage('Error al buscar cupón', 'error');
            return;
        }

        if (!data || data.length === 0) {
            showCouponMessage('Cupón inválido o expirado', 'error');
            return;
        }

        const coupon = data[0];
        console.log('Cupón encontrado:', coupon);
        
        // Verificar fecha de validez
        if (coupon.valido_hasta && new Date(coupon.valido_hasta) < new Date()) {
            showCouponMessage('Cupón expirado', 'error');
            return;
        }
        
        // Verificar usos máximos (asegurar valores numéricos)
        const usos_actuales = coupon.usos_actuales || 0;
        if (coupon.usos_max && usos_actuales >= coupon.usos_max) {
            showCouponMessage('Cupón agotado', 'error');
            return;
        }
        
        // Asegurar que usos_actuales sea un número en el objeto
        coupon.usos_actuales = usos_actuales;
        
        cuponAplicado = coupon;
        showCouponMessage(`Cupón aplicado: ${coupon.descuento_tipo === 'porcentaje' ? coupon.descuento_valor + '%' : 'RD$' + coupon.descuento_valor}`, 'success');
        updateCartTotal();
    } catch (error) {
        console.error('Error aplicando cupón:', error);
        showCouponMessage('Error al aplicar cupón', 'error');
    }
}

function showCouponMessage(message, type) {
    const element = document.getElementById('coupon-message');
    element.textContent = message;
    element.className = type;
    element.style.color = type === 'error' ? '#dc3545' : '#28a745';
}

// MODIFICAR CALCULAR TOTAL DEL CARRITO PARA INCLUIR CUPÓN
let shippingOption = 'standard';

function calculateCartTotals() {
    let subtotal = 0;
    carrito.forEach(item => {
        const finalPrice = item.descuento ? (item.precio * (1 - item.descuento / 100)) : item.precio;
        subtotal += finalPrice * item.cantidad;
    });
    
    let discount = 0;
    if (cuponAplicado) {
        if (cuponAplicado.descuento_tipo === 'porcentaje') {
            discount = subtotal * (cuponAplicado.descuento_valor / 100);
        } else {
            discount = cuponAplicado.descuento_valor;
        }
        discount = Math.min(discount, subtotal); // No más descuento que el subtotal
    }
    
    const shipping = carrito.length > 0 ? (shippingOption === 'priority' ? 105 : 55) : 0;
    const total = subtotal - discount + shipping;
    const productsTotal = Math.max(0, subtotal - discount);
    
    return { subtotal, discount, shipping, total, productsTotal };
}

function handleShippingOptionChange() {
    const selected = document.querySelector('input[name="shipping-option"]:checked');
    if (!selected) return;
    shippingOption = selected.value;
    updateCheckoutSummary();
    updateCartTotal();
}

function updateCartTotal() {
    const totals = calculateCartTotals();
    document.getElementById('subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('discount').textContent = totals.discount.toFixed(2);
    document.getElementById('shipping').textContent = totals.shipping.toFixed(2);
    document.getElementById('total').textContent = totals.total.toFixed(2);
}

function updateCheckoutSummary() {
    const totals = calculateCartTotals();
    document.getElementById('checkout-subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('checkout-discount').textContent = totals.discount.toFixed(2);
    document.getElementById('checkout-products-total').textContent = totals.productsTotal.toFixed(2);
    document.getElementById('checkout-shipping').textContent = totals.shipping.toFixed(2);
    document.getElementById('checkout-total').textContent = totals.total.toFixed(2);
}

function openCheckoutModal() {
    if (!carrito.length) {
        showNotification('Tu carrito está vacío. Agrega productos antes de pagar.');
        return;
    }
    updateCartTotal();
    updateCheckoutSummary();
    document.getElementById('checkout-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
    handlePaymentMethodChange();
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function handlePaymentMethodChange() {
    const method = document.querySelector('input[name="payment-method"]:checked').value;
    const cardSection = document.getElementById('card-details');
    cardSection.style.display = method === 'visa' || method === 'mastercard' ? 'grid' : 'none';
}

function confirmCheckout(e) {
    e.preventDefault();

    const nombre = document.getElementById('checkout-name').value.trim();
    const identificacion = document.getElementById('checkout-id').value.trim();
    const telefono = document.getElementById('checkout-phone').value.trim();
    const correo = document.getElementById('checkout-email').value.trim();
    const direccion = document.getElementById('checkout-address').value.trim();
    const ciudad = document.getElementById('checkout-city').value.trim();
    const codigoPostal = document.getElementById('checkout-zip').value.trim();
    const metodo = document.querySelector('input[name="payment-method"]:checked').value;

    if (!nombre || !identificacion || !telefono || !correo || !direccion || !ciudad || !codigoPostal) {
        showNotification('Completa todos los datos del destinatario y la dirección de entrega.');
        return;
    }

    if (metodo === 'visa' || metodo === 'mastercard') {
        const numero = document.getElementById('card-number').value.trim();
        const vencimiento = document.getElementById('card-expiry').value.trim();
        const cvv = document.getElementById('card-cvv').value.trim();

        if (!numero || !vencimiento || !cvv) {
            showNotification('Completa los datos de la tarjeta.');
            return;
        }
    }

    closeCheckoutModal();
    processCheckout();
}

async function processCheckout() {
    // Validar stock disponible
    for (let item of carrito) {
        const producto = productos.find(p => p.id === item.id);
        if (!producto || producto.stock < item.cantidad) {
            showNotification(`❌ Stock insuficiente: ${item.nombre}`);
            return;
        }
    }

    // Procesar compra: actualizar stock en Supabase
    try {
        for (let item of carrito) {
            const producto = productos.find(p => p.id === item.id);
            const nuevoStock = producto.stock - item.cantidad;
            
            // Actualizar en Supabase
            const { error } = await supabaseClient
                .from('productos')
                .update({ stock: nuevoStock })
                .eq('id', item.id);
            
            if (error) {
                console.error('Error actualizando stock:', error);
                showNotification('❌ Error al procesar la compra');
                return;
            }
        }
        
        // Registrar uso del cupón si se aplicó
        if (cuponAplicado) {
            const usos_actuales = cuponAplicado.usos_actuales || 0;
            console.log(`📌 Actualizando cupón ${cuponAplicado.codigo}: ${usos_actuales} → ${usos_actuales + 1}`);
            
            const { error: couponError } = await supabaseClient
                .from('cupones')
                .update({ usos_actuales: usos_actuales + 1 })
                .eq('id', cuponAplicado.id);
            
            if (couponError) {
                console.error('❌ Error actualizando uso del cupón:', couponError);
            } else {
                console.log('✓ Uso del cupón actualizado en Supabase');
            }
        }

        // Si todo va bien, mostrar confirmación
        closeCheckoutModal();
        showSuccessModal();
        
        // Limpiar carrito y cupón
        carrito = [];
        cuponAplicado = null;
        updateCartCount();
        displayCart();
        
        // Recargar productos Y cupones para actualizar todo localmente
        console.log('🔄 Recargando datos desde Supabase...');
        await loadProductsFromSupabase();
        await loadCouponsFromSupabase();
    } catch (error) {
        console.error('Error en checkout:', error);
        showNotification('❌ Error al procesar la compra');
    }
}