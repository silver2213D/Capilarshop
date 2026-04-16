# Escencia capilar

## Imagen de fondo para "Escencia capilar"

Para que la tarjeta de la pestaña **Escencia capilar** muestre el fondo solicitado, coloca tu imagen dentro de la carpeta `images` y nómbrala `escencia-capilar.jpg`. El archivo ya existe como marcador de posición; reemplázalo con la imagen real.

## Nuevas funcionalidades implementadas

### ✅ Sistema de reseñas y comentarios
- Los usuarios pueden ver reseñas de productos en la página de detalle
- Los usuarios pueden agregar nuevas reseñas con calificación y comentario

<!-- Cambio mínimo para commit -->
- Formulario para agregar nuevas reseñas con calificación de 1-5 estrellas
- Las reseñas se almacenan en Supabase y se muestran ordenadas por fecha

### ✅ Sistema de cupones de descuento
- Campo para ingresar códigos de cupón en el carrito
- Soporte para descuentos porcentuales y fijos
- Validación de cupones (expiración, usos máximos)
- Aplicación automática del descuento al total

## Configuración de base de datos

Sigue las instrucciones en `SUPABASE_SETUP.md` para crear las tablas necesarias:
- `productos` (productos de la tienda)
- `resenas` (comentarios y calificaciones de productos)
- `cupones` (códigos de descuento)

Los datos se sincronizan automáticamente con Supabase para persistencia.
