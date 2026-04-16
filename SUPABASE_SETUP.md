# Configuración de Supabase para Escencia Capilar

## Paso 1: Crear la tabla en Supabase

1. Ve a tu proyecto en [https://app.supabase.com](https://app.supabase.com)
2. Abre el **SQL Editor**
3. Copia y ejecuta este código SQL:

```sql
-- Crear tabla resenas
CREATE TABLE resenas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  usuario VARCHAR NOT NULL,
  comentario TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS para resenas
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;

-- Políticas para resenas
CREATE POLICY "Enable read access for all users" ON resenas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON resenas FOR INSERT WITH CHECK (true);

-- Crear tabla cupones
CREATE TABLE cupones (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  codigo VARCHAR UNIQUE NOT NULL,
  descuento_tipo VARCHAR NOT NULL CHECK (descuento_tipo IN ('porcentaje', 'fijo')),
  descuento_valor NUMERIC NOT NULL,
  valido_hasta TIMESTAMP,
  usos_max INTEGER,
  usos_actuales INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true
);

-- Habilitar RLS para cupones
ALTER TABLE cupones ENABLE ROW LEVEL SECURITY;

-- Políticas para cupones
CREATE POLICY "Enable read access for all users" ON cupones FOR SELECT USING (true);
```

## Paso 2: Verificar que los datos existan

Después de crear la tabla, ve a la pestaña **Table Editor** y verifica:
- La tabla `productos` está creada
- Las columnas coinciden con el script SQL

## Paso 4: Poblar tablas con datos de ejemplo (opcional)

Después de crear las tablas, puedes insertar algunos datos de ejemplo:

### Insertar productos de ejemplo:
```sql
INSERT INTO productos (id, nombre, categoria, seccion, precio, imagen, descripcion, rating, descuento, stock) VALUES
(1, 'Shampoo Reparador con Keratina', 'shampoo', 'general', 1450, 'images/piel-sensible.jpg', 'Shampoo nutritivo que refuerza la fibra capilar y mejora la elasticidad en cada lavado.', 4.8, NULL, 18),
(2, 'Acondicionador Hidratante', 'acondicionador', 'general', 1305, 'images/piel-sensible.jpg', 'Acondicionador ligero que desenreda y aporta brillo sin apelmazar.', 4.7, NULL, 20),
(3, 'Mascarilla Intensiva de Argán', 'tratamiento', 'general', 1734, 'images/piel-sensible.jpg', 'Tratamiento profundo para recuperar el cabello seco y dañado en minutos.', 4.9, 15, 12);
```

### Insertar cupones de ejemplo:
```sql
INSERT INTO cupones (codigo, descuento_tipo, descuento_valor, valido_hasta, usos_max, activo) VALUES
('DESCUENTO10', 'porcentaje', 10, '2025-12-31', 100, true),
('FIJO50', 'fijo', 50, '2025-12-31', NULL, true);
```

### Insertar reseñas de ejemplo:
```sql
INSERT INTO reseñas (producto_id, usuario, comentario, rating, fecha) VALUES
(1, 'María García', 'Excelente shampoo, mi cabello se siente mucho más fuerte después de usarlo.', 5, CURRENT_TIMESTAMP),
(1, 'Carlos López', 'Buen producto, pero el olor es un poco fuerte al principio.', 4, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 'Ana Rodríguez', 'La mascarilla es increíble, mi cabello seco se transformó completamente.', 5, CURRENT_TIMESTAMP - INTERVAL '1 day');
```

1. En la página Admin, haz clic en "Añadir Producto"
2. Agrega los productos nuevamente
3. Se guardarán automáticamente en Supabase

## Paso 4: Verificar sincronización

Abre la **consola del navegador** (F12) para ver los mensajes de Supabase:
- `Productos cargados desde Supabase: X`
- `Producto insertado en Supabase`
- `Producto eliminado de Supabase`

## Troubleshooting

### Los productos no se sincroniza
- Verifica que la tabla `productos` existe en Supabase
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que las políticas RLS están habilitadas

### Todo se guarda en el navegador pero no en Supabase
- Verifica tu conexión a internet
- Revisa que estés usando el SUPABASE_URL y SUPABASE_KEY correctos
- Asegúrate de que la tabla tiene las columnas correctas

### La tabla está vacía
- Agrega productos nuevos desde la página Admin

<!-- Cambio mínimo para commit -->
- Verifica que los permisos RLS están configurados correctamente
