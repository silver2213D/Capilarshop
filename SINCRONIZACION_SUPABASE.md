# ✅ Conexión Supabase - Guía de Sincronización

## Cómo funciona ahora:

### 1️⃣ Inicialización (cuando cargas la página)
```
┌─────────────────────────┐
│ Página lista            │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ ¿Supabase conectado?    │
└──────────┬──────────────┘
           │
    ┌──────┴──────┐
    │             │
   SÍ ✓          NO ✗
    │             │
    ▼             ▼
CARGA DE      USA FALLBACK
SUPABASE      (productos locales)
 (REAL)
```

### 2️⃣ Flujo de datos

**Antes (INCORRECTO):**
- ❌ Usa siempre los hardcodeados del script.js
- ❌ Supuestamente envía a Supabase pero usa los locales
- ❌ Los cambios no se sincronizaban

**Ahora (CORRECTO):**
- ✓ Carga PRIMERO desde Supabase
- ✓ Si Supabase está vacío, usa fallback local
- ✓ Los cambios se guardan SOLO en Supabase
- ✓ Los datos locales solo son respaldo

## Archivos modificados:

### `script.js`
- `const productos = [...]` → `let productos = []` (vacío)
- Los datos hardcodeados movidos a `productosLocal` (solo fallback)
- Mejorada función `loadProductsFromSupabase()` con mejor manejo de errores

### `supabase-config.js`
- Agregado test de conexión automático
- Mensajes detallados en consola

## Proceso de sincronización correcto:

1. **Agregar producto:**
   - Se guarda EN SUPABASE primero
   - Se recarga la lista desde Supabase
   - Se muestra en la tienda

2. **Eliminar producto:**
   - Se elimina DE SUPABASE primero
   - Se recarga la lista desde Supabase
   - Se refresca la vista

3. **Ver tienda:**
   - Lee los datos de Supabase (o fallback si no conecta)
   - Nunca de los hardcodeados

## Pasos para hacer que funcione:

1. **En Supabase**, ejecuta este SQL:
```sql
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON productos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON productos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON productos FOR DELETE USING (true);
```

2. **En el navegador, abre F12** (consola)

3. **Recarga la página** y busca:
   - ✓ `✓ Conexión a Supabase OK` → Está conectado
   - ❌ `❌ ERROR en Supabase` → Hay un problema

4. **Agrega un producto nuevo** desde Admin

5. **Verifica en Supabase → Table Editor** que aparezca

## Cómo ver los logs:

**Abre F12 → Console → Busca mensajes:**

```
=== SUPABASE CONFIGURATION ===
URL: https://vzvbeblwmmblnnbpdzqx.supabase.co
Cliente inicializado: SÍ ✓
✓ Conexión a Supabase OK
✓ Productos cargados desde Supabase: 5
```

## Si algo falla:

**Error: "No hay productos en Supabase"**
- Agrega nuevos productos desde Admin
- Verifica que la tabla `productos` existe en Supabase

**Error: "RLS Disabled"**
- Ejecuta el SQL anterior para habilitar RLS

**Los productos siguen siendo los hardcodeados**

<!-- Cambio mínimo para commit -->
- Abre F12 y busca qué dice la consola para saber el error