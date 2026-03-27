# 📋 DOCUMENTACIÓN COMPLETA - PROYECTO "ESCENCIA CAPILAR"

---

## 🎯 ¿QUÉ ES ESTE PROYECTO?

Es una **tienda web de productos para el cuidado del cabello** llamada "Escencia Capilar". 
Es una aplicación web completamente funcional que permite:
- Ver y buscar productos
- Filtrar por categoría y precio
- Agregar productos al carrito
- Usar cupones de descuento
- Dejar reseñas y comentarios
- Gestionar productos desde un panel de administración

**Base de datos**: Utiliza Supabase (base de datos en la nube)

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
Proyecto web capilar/
├── index.html               ← Página principal (interfaz visual)
├── script.js                ← Lógica y funcionalidades (JavaScript)
├── estilos.css              ← Diseño y colores (CSS)
├── supabase-config.js       ← Configuración de la base de datos
├── images/                  ← Carpeta con imágenes de productos
├── README.md                ← Información inicial
├── SUPABASE_SETUP.md        ← Guía de configuración de Supabase
├── SINCRONIZACION_SUPABASE.md ← Información de sincronización
└── DOCUMENTACION_COMPLETA.md  ← Este archivo (documentación)
```

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura de la página |
| **CSS3** | Diseño visual y estilos |
| **JavaScript** | Lógica de la aplicación |
| **Supabase** | Base de datos en la nube |
| **LocalStorage** | Almacenamiento local del navegador |
| **Font Awesome/Emojis** | Iconografía |

---

## 📄 EXPLICACIÓN DETALLADA DE CADA ARCHIVO

### 1️⃣ **index.html** - La Interfaz Visual

Este archivo contiene la estructura HTML de toda la página. Es donde se define QUÉ se ve en pantalla.

#### Secciones principales:

**📍 NAVBAR (Barra de Navegación)**
```html
<nav class="navbar">
```
- Logo de la empresa con nombre "Escencia capilar"
- Menú con enlaces a: Inicio, Colecciones, Acerca de, Contacto, Admin
- Icono de carrito con contador de productos

**🏠 PÁGINA INICIO (Home)**
```html
<div id="home" class="page">
```
- Banner principal (Hero) con texto motivacional
- Botón para explorar productos
- Grid de productos destacados

**🛍️ PÁGINA TIENDA (Tienda)**
```html
<div id="tienda" class="page">
```
- Barra de búsqueda
- Filtros laterales:
  - Categoría (Shampoo, Acondicionador, Tratamiento, etc.)
  - Rango de precio (slider)
- Grid de productos con opción de filtrar

**ℹ️ PÁGINA ACERCA DE**
```html
<div id="nosotros" class="page">
```
- Información sobre la empresa
- Misión y valores
- Ingredientes naturales

**📦 PÁGINA DETALLE DE PRODUCTO**
```html
<div id="detalle" class="page">
```
- Imagen grande del producto
- Información: nombre, precio, descripción
- Control de cantidad
- Botón "Añadir al carrito"
- Sección de reseñas

**🛒 PÁGINA CARRITO**
```html
<div id="carrito" class="page">
```
- Lista de productos en el carrito
- Cantidad de cada producto
- Opción para aplicar cupones
- Resumen de precio (subtotal, descuento, envío, total)
- Botón de pagar

**✉️ PÁGINA CONTACTO**
```html
<div id="contacto" class="page">
```
- Información de contacto (email, teléfono, dirección)
- Horarios de atención
- Formulario de contacto

**⚙️ PÁGINA ADMIN (Panel de Administración)**
```html
<div id="admin" class="page">
```
- Agregar productos nuevos
- Ver lista de productos existentes
- Eliminar productos
- Gestionar cupones
- Gestionar secciones

---

### 2️⃣ **script.js** - La Lógica de la Aplicación

Este archivo contiene TODA la lógica que hace funcionar la página. Es donde sucede la "magia".

#### Variables Globales (Datos principales):

```javascript
let productos = [];           // Lista de todos los productos
let carrito = [];             // Productos en el carrito
let cupones = [];             // Cupones disponibles
let secciones = [];           // Categorías de productos
let cuponAplicado = null;     // Cupón actualmente aplicado
let resenas = [];             // Reseñas de productos
```

#### Funciones Principales:

**🔄 INICIALIZACIÓN**
```javascript
document.addEventListener('DOMContentLoaded', async function() {
```
Se ejecuta cuando la página carga. Hace:
- Carga productos desde Supabase
- Carga cupones desde Supabase
- Carga secciones del almacenamiento local
- Prepara los formularios del admin
- Muestra productos en la página

**🔀 showPage(page)**
```javascript
function showPage(page)
```
**Qué hace**: Cambia entre páginas sin recargar la página
- Esconde todas las páginas
- Muestra solo la página solicitada
- Sube el scroll hacia arriba

**Ejemplo de uso**:
```javascript
showPage('tienda');    // Muestra la página de tienda
showPage('carrito');   // Muestra el carrito
showPage('admin');     // Muestra el panel admin
```

**📥 loadProductsFromSupabase()**
```javascript
async function loadProductsFromSupabase()
```
**Qué hace**: Conecta con Supabase y descarga todos los productos
- Si funciona → carga los productos reales
- Si falla → usa productos de fallback (locales)
- Muestra mensajes en la consola para debugging

**➕ addProduct(e)**
```javascript
async function addProduct(e)
```
**Qué hace**: Agrega un nuevo producto desde el panel Admin
1. Recoge datos del formulario (nombre, precio, categoría, etc.)
2. Valida que esté completo
3. Guarda en Supabase
4. Recarga la lista de productos
5. Muestra notificación

**🔍 searchProducts()**
```javascript
function searchProducts()
```
**Qué hace**: Busca productos por nombre o descripción
- Lee lo que escribiste en la barra de búsqueda
- Convierte a minúsculas para comparar
- Filtra productos que coincidan
- Muestra solo los resultados

**⚙️ filterProducts()**
```javascript
function filterProducts()
```
**Qué hacer**: Filtra productos por categoría y precio
- Recoge checkboxes marcados (categorías)
- Recoge el valor del slider de precio
- Filtra productos que cumplan ambos criterios
- Muestra resultados filtrados

**📦 createProductCard(producto)**
```javascript
function createProductCard(producto)
```
**Qué hace**: Crea el HTML de una tarjeta de producto
- Retorna el código HTML para mostrar:
  - Imagen del producto
  - Nombre, categoría, rating
  - Precio (con descuento si hay)
  - Disponibilidad de stock

**👁️ showProductDetail(productId)**
```javascript
function showProductDetail(productId)
```
**Qué hace**: Muestra la página de detalle de un producto
1. Busca el producto por ID
2. Calcula el precio (aplicando descuento si existe)
3. Crea el HTML con toda la información
4. Carga las reseñas
5. Muestra la página de detalle

**🛒 addToCart(productId)** y **addToCartFromDetail(productId)**
```javascript
function addToCart(productId)
function addToCartFromDetail(productId)
```
**Qué hace**: Agrega un producto al carrito
- Verifica que haya stock disponible
- Si ya está en el carrito → aumenta cantidad
- Si es nuevo → lo agrega
- Actualiza el contador del carrito
- Guarda el carrito en localStorage
- Muestra notificación

**🗑️ removeFromCart(index)**
```javascript
function removeFromCart(index)
```
**Qué hace**: Elimina un producto del carrito
- Recibe la posición del producto
- Lo elimina de la lista
- Actualiza contador
- Muestra carrito actualizado

**💳 updateCartTotal()**
```javascript
function updateCartTotal()
```
**Qué hace**: Calcula el total del carrito
- Suma todos los productos
- Aplica descuentos si hay cupón
- Calcula costo de envío (gratis si > RD$100)
- Muestra subtotal, descuento, envío y total

**🎟️ applyCoupon()**
```javascript
async function applyCoupon()
```
**Qué hace**: Aplica un código de cupón
1. Recoge el código de cupón
2. Busca en Supabase
3. Verifica que sea válido y no esté expirado
4. Verifica que tenga usos disponibles
5. Aplica el descuento
6. Recalcula el total

**✅ checkout()**
```javascript
async function checkout()
```
**Qué hace**: Procesa la compra
1. Verifica que todos los productos tengan stock
2. Actualiza el stock en Supabase
3. Registra el uso del cupón (si se aplicó)
4. Vacía el carrito
5. Muestra confirmación

**⭐ loadReviews(productId)**
```javascript
async function loadReviews(productId)
```
**Qué hace**: Carga las reseñas de un producto desde Supabase
- Busca todas las reseñas del producto
- Las ordena por fecha (más recientes primero)
- Las muestra en la página

**📝 submitReview(event)**
```javascript
async function submitReview(event)
```
**Qué hace**: Envía una nueva reseña a Supabase
1. Recoge datos del formulario (nombre, calificación, comentario)
2. Guarda en Supabase
3. Recarga las reseñas
4. Limpia el formulario
5. Muestra confirmación

---

### 3️⃣ **estilos.css** - El Diseño Visual

Este archivo controla CÓMO se ve todo. Colores, tamaños, fuentes, espaciados, etc.

#### Variables de Color (Palette):

```css
--primary: #2d5347;        /* Verde Bosque Oscuro (principal) */
--secondary: #d4af37;      /* Dorado Natural (acentos) */
--accent: #6b9080;         /* Verde Salvia (secundario) */
--light: #f5f1e8;          /* Crema Natural (fondo claro) */
--dark: #1a3a34;           /* Verde Oscuro (texto oscuro) */
--text: #4a5f5a;           /* Gris Verde (texto normal) */
```

#### Secciones Principales:

**Tipografía**:
- Fuente principal: "Lato" (moderna y legible)
- Fuente para títulos: "Playfair Display" (elegante)

**Diseño Responsive**:
- Se adapta a celulares, tablets y laptops
- Usa CSS Grid y Flexbox

**Componentes Estilizados**:
- `.navbar` - Barra de navegación
- `.page` - Contenedor de páginas
- `.product-card` - Tarjeta de producto
- `.btn-primary`, `.btn-secondary` - Botones
- `.cart-item` - Item del carrito
- `.hero` - Banner principal

---

### 4️⃣ **supabase-config.js** - La Conexión a la Base de Datos

Este archivo conecta tu aplicación con Supabase.

```javascript
const SUPABASE_URL = 'https://vzvbeblwmmblnnbpdzqx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
```

**Qué es**:
- URL: Es la dirección de tu base de datos en la nube
- KEY: Es la contraseña para acceder (pública, es segura para el cliente)
- supabaseClient: El "cliente" que usa tu app para hablar con la BD

**Tablas en Supabase**:
1. `productos` - Todos los productos
2. `cupones` - Códigos de descuento
3. `resenas` - Comentarios de clientes

---

## 🚀 ¿CÓMO EMPEZAR A TRABAJAR?

### Paso 1: Preparación
1. Abre la carpeta del proyecto en VS Code
2. Abre `index.html` en el navegador (doble click o arrastrarlo)
3. Abre la consola del navegador (F12 → Consola)

### Paso 2: Entender la estructura
- Haz click en "Inicio" → ves la página home
- Haz click en "Colecciones" → ves la tienda con productos
- Haz click en cualquier producto → ves el detalle
- Haz click en "🛒 0" → ves el carrito vacío
- Haz click en "Admin" → ves el panel de administración

### Paso 3: Agregar un producto (Admin)
1. Click en "Admin"
2. En la sección "Agregar Producto":
   - Nombre: "Mi Shampoo Especial"
   - Categoría: "shampoo"
   - Sección: "General"
   - Precio: 1500
   - Stock: 10
   - Rating: 4.5
   - Descripción: "Shampoo de excelente calidad"
3. Click en "Agregar Producto"
4. Recarga la página (F5)
5. Ve a "Colecciones" → ¡verás tu producto!

### Paso 4: Probar el carrito
1. Ve a "Colecciones"
2. Click en cualquier producto
3. Aumenta la cantidad si quieres
4. Click en "Añadir al Carrito"
5. Click en el icono 🛒 para ver el carrito

### Paso 5: Probar un cupón
1. En el Admin, agrega un cupón:
   - Código: "DESCUENTO10"
   - Descuento: 10
   - Usos máximos: 5
2. En el carrito, ingresa el código del cupón
3. ¡Verás el descuento aplicado!

---

## 📊 BASES DE DATOS EN SUPABASE

### Tabla: `productos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | Identificador único |
| nombre | text | Nombre del producto |
| categoria | text | Categoría (shampoo, acondicionador, etc.) |
| seccion | text | Sección (General, Premium, etc.) |
| precio | number | Precio en RD$ |
| imagen | text | URL o código base64 de la imagen |
| descripcion | text | Descripción del producto |
| rating | number | Calificación (1-5) |
| descuento | number | Descuento en % (opcional) |
| stock | number | Cantidad disponible |

**Ejemplo**:
```json
{
  "id": 1,
  "nombre": "Shampoo Reparador con Keratina",
  "categoria": "shampoo",
  "seccion": "general",
  "precio": 1450,
  "imagen": "images/piel-sensible.jpg",
  "descripcion": "Shampoo nutritivo que refuerza la fibra capilar",
  "rating": 4.8,
  "stock": 18
}
```

### Tabla: `cupones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | Identificador único |
| codigo | text | Código del cupón (ej: "DESCUENTO10") |
| descuento_tipo | text | "porcentaje" o "fijo" |
| descuento_valor | number | Valor del descuento |
| valido_hasta | date | Fecha de validez (opcional) |
| usos_max | number | Máximo de usos (null = ilimitado) |
| usos_actuales | number | Usos realizados hasta ahora |
| activo | boolean | ¿Está disponible? |

**Ejemplo**:
```json
{
  "id": 1,
  "codigo": "DESCUENTO10",
  "descuento_tipo": "porcentaje",
  "descuento_valor": 10,
  "valido_hasta": null,
  "usos_max": 5,
  "usos_actuales": 2,
  "activo": true
}
```

### Tabla: `resenas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | Identificador único |
| producto_id | number | ID del producto reseñado |
| usuario | text | Nombre del usuario |
| comentario | text | Texto de la reseña |
| rating | number | Calificación (1-5) |
| fecha | timestamp | Fecha de la reseña |

**Ejemplo**:
```json
{
  "id": 1,
  "producto_id": 1,
  "usuario": "María",
  "comentario": "Excelente producto, mi cabello está más suave",
  "rating": 5,
  "fecha": "2026-03-25T10:30:00"
}
```

---

## 🔧 FLUJO DE TRABAJO (CÓMO FUNCIONA PASO A PASO)

### 1. Usuario abre la página
```
index.html carga
        ↓
script.js se ejecuta (DOMContentLoaded)
        ↓
Conecta con Supabase
        ↓
Carga productos, cupones, secciones
        ↓
Muestra productos en la página
```

### 2. Usuario busca un producto
```
Usuario escribe en barra búsqueda
        ↓
Se ejecuta searchProducts()
        ↓
Filtra productos por nombre/descripción
        ↓
Muestra solo coincidencias
```

### 3. Usuario agrega producto al carrito
```
Click en "Añadir al carrito"
        ↓
Se ejecuta addToCart()
        ↓
Verifica stock disponible
        ↓
Si es nuevo: agrega a carrito[]
Si ya existe: aumenta cantidad
        ↓
Guarda en localStorage (para persistencia)
        ↓
Actualiza contador de carrito
        ↓
Muestra notificación
```

### 4. Usuario hace checkout (compra)
```
Click en "Ir a Pagar"
        ↓
Se ejecuta checkout()
        ↓
Verifica stock de todos los productos
        ↓
Actualiza stock en Supabase (resta cantidad)
        ↓
Si usó cupón: aumenta usos_actuales
        ↓
Limpia el carrito
        ↓
Muestra confirmación
```

---

## 💡 EJEMPLOS DE CÓMO MODIFICAR COSAS

### Ejemplo 1: Cambiar el color principal
En `estilos.css`:
```css
:root {
    --primary: #FF6B6B;  /* Cambiar a rojo */
}
```

### Ejemplo 2: Agregar una nueva categoría de producto
En el Admin, usa "Agregar Sección":
1. Nombre: "Bestsellers"
2. Se guarda en localStorage
3. Cuando agregues un producto, puedes seleccionar "Bestsellers"

### Ejemplo 3: Crear un cupón de 50% de descuento
En el Admin, "Agregar Cupón":
1. Código: "MITAD50"
2. Descuento: 50
3. Usos máximos: 100
4. Se guarda en Supabase

### Ejemplo 4: Cambiar el mensaje del botón
En `index.html`:
```html
<!-- ANTES -->
<button class="btn-primary" onclick="showPage('tienda')">EXPLORAR PRODUCTOS</button>

<!-- DESPUÉS -->
<button class="btn-primary" onclick="showPage('tienda')">VER TODOS LOS PRODUCTOS</button>
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema: Los productos no cargan
**Solución**:
1. Abre consola (F12)
2. Busca error rojo en Supabase
3. Verifica que SUPABASE_URL y SUPABASE_KEY en `supabase-config.js` sean correctos
4. Si falla, muestra "Usando datos locales" y carga los de fallback

### Problema: El carrito se vacía al recargar
**Solución**: Esto es normal porque los datos se guardan en localStorage.
- Para persistencia permanente, habría que guardar en Supabase

### Problema: Cupón no aplica descuento
**Solución**:
1. Verifica que el cupón esté activo (activo: true)
2. Verifica que no haya alcanzado max usos
3. Verifica la fecha (valido_hasta)

### Problema: No se ve imagen del producto
**Solución**:
1. La imagen carga de la URL especificada
2. Si falla, muestra imagen por defecto (piel-sensible.jpg)
3. Verifica que la ruta sea correcta: `images/nombre-archivo.jpg`

---

## 🎓 PRÓXIMOS PASOS PARA MEJORAR

### Mejoras Sugeridas:
1. **Sistema de pagos**: Integrar pasarela de pago (Stripe, Paypal)
2. **Autenticación**: Registrarse y loguear usuarios
3. **Favoritos**: Guardar productos favoritos
4. **Historial de compras**: Ver compras anteriores
5. **Sistema de puntos**: Puntos por compra para descuentos
6. **Envíos**: Integrar sistema de envíos reales
7. **Notificaciones**: Enviar emails de confirmación
8. **Stock en tiempo real**: Actualizar stock dinámicamente
9. **Recomendaciones**: Productos recomendados basados en historial
10. **Chat**: Soporte al cliente en tiempo real

---

## 📞 RESUMEN RÁPIDO PARA TU AMIGO

**"Este proyecto es una tienda online de productos para el cabello. Tiene:**
- **Frontend (lo que ves)**: HTML, CSS, JavaScript
- **Backend (la "nube")**: Supabase (base de datos)
- **Funcionalidades**: 
  - Ver/buscar/filtrar productos
  - Carrito de compras
  - Cupones de descuento
  - Reseñas de clientes
  - Panel de control para agregar/eliminar productos
  
**Los archivos principales son:**
- `index.html` - La interfaz (qué se ve)
- `script.js` - La lógica (cómo funciona)
- `estilos.css` - El diseño (cómo se ve)
- `supabase-config.js` - Conexión a la BD

**Para empezar:**
1. Abre index.html en el navegador
2. Ve al Admin
3. Agrega un producto
4. Prueba el carrito y cupones"

---

**¡Espero que esta documentación sea útil! Pregunta cualquier duda.** 🚀
