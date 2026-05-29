# 🔧 Corrección: Envío de Facturas en GitHub Pages

## ✅ Lo que se corrigió

1. **Configuración de Supabase en GitHub Pages**
   - Agregué configuración inline de Supabase en todos los archivos HTML
   - Ahora la URL y API Key de Supabase se cargan incluso si `supabase-config.js` no funciona
   - Archivos actualizados: `index.html`, `tienda.html`, `admin.html`, `contacto.html`, `detalle.html`, `nosotros.html`, `carrito.html`

2. **Error de sintaxis en script.js**
   - Eliminé el `return true;` duplicado que causaba errores
   - Mejoré la función `enviarCorreoCompra()` para esperar a que Supabase esté disponible

---

## ⚠️ Falta configurar: API Key de Resend

**El envío de correos requiere una API Key de Resend configurada en Supabase.**

### Opciones:

### **Opción A: Usar Resend (Recomendado)**
1. Ve a https://resend.com y crea una cuenta gratuita
2. Obtén tu API Key
3. En tu proyecto de Supabase:
   - Ve a **Settings → Functions → Environment Variables**
   - Agrega: `RESEND_API_KEY = tu_api_key_aqui`

### **Opción B: Cambiar a Gmail SMTP**
Si prefieres usar Gmail, edita la función en `supabase/functions/enviar-factura/index.ts`:

```typescript
// Reemplaza la sección de Resend con esto:
const smtpResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        personalizations: [{
            to: [{ email: email }],
        }],
        from: { email: 'noreply@capilarshop.com' },
        subject: 'Confirmación de tu compra en Capilarshop',
        content: [{
            type: 'text/html',
            value: htmlSinImagenes
        }]
    })
});
```

---

## 🧪 Cómo probar

1. **En local (antes de enviar a GitHub Pages):**
   - Abre la página en `http://localhost`
   - Ve a Consola del navegador (F12)
   - Intenta enviar una factura
   - Deberías ver logs de depuración

2. **En GitHub Pages:**
   - Actualiza el repositorio con los cambios
   - Prueba desde tu sitio de GitHub Pages
   - Verifica la consola para ver si `SUPABASE_URL` se cargó correctamente

---

## 📋 Checklist

- [ ] Configuré la API Key de Resend en Supabase
- [ ] Probé el envío de correos localmente
- [ ] Actualicé el repositorio en GitHub
- [ ] Probé en GitHub Pages y funcionó ✓

