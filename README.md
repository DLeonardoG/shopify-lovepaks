# Love Brands - Shopify Theme

Este es el tema de Shopify migrado desde el proyecto HTML estático original.

## 📁 Estructura del Tema

```
shopify-theme/
├── assets/              # CSS, JS, imágenes, videos
│   ├── theme.css
│   ├── theme.js
│   └── ...
├── config/              # Configuración del tema
│   └── settings_schema.json
├── layout/              # Layouts principales
│   └── theme.liquid
├── sections/            # Secciones reutilizables
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── features.liquid
│   ├── products.liquid
│   └── ...
├── snippets/            # Componentes pequeños
├── templates/           # Templates de páginas
│   ├── index.liquid
│   └── page.*.liquid
└── locales/            # Traducciones
```

## 🚀 Instalación

### Opción 1: Shopify CLI (Recomendado)

1. Instalar Shopify CLI:
```bash
npm install -g @shopify/cli @shopify/theme
```

2. Navegar a la carpeta del tema:
```bash
cd shopify-theme
```

3. Iniciar servidor de desarrollo:
```bash
shopify theme dev
```

4. Conectar a tu tienda Shopify cuando se solicite.

### Opción 2: Subir Manualmente

1. Comprimir la carpeta `shopify-theme` en un archivo ZIP
2. En Shopify Admin: Online Store > Themes > Upload theme
3. Subir el archivo ZIP

## 📝 Configuración Inicial

### 1. Subir Assets (Imágenes y Videos)

En Shopify Admin, ve a **Content > Files** y sube:
- `LOVE_1.png` (logo)
- `LoveBrands-Favicon.png` (favicon)
- `before.png`, `after.png` (imágenes de comparación)
- `video_start.mp4` (video hero)
- `family_happy.mp4` (video rose quartz)

### 2. Configurar Productos

1. Crear productos en **Products > Add product**
2. Para precios mayoristas, usar **Customer Tags**:
   - Tag: `wholesale-partner`
   - Aplicar descuento del 50% a clientes con este tag

### 3. Crear Páginas

Crear las siguientes páginas en **Online Store > Pages**:

- **Products**: Handle `products` - Template: `page.products`
- **Shop Landing**: Handle `shop-landing` - Template: `page.shop-landing`
- **Partner Signup**: Handle `partner-signup` - Template: `page.partner-signup`
- **Partner Dashboard**: Handle `partner-dashboard` - Template: `page.partner-dashboard`
- **Checkout**: Handle `checkout` - Template: `page.checkout` (o usar Shopify Checkout)
- **Upsell**: Handle `upsell` - Template: `page.upsell`

### 4. Configurar Collections

Crear una colección "Featured" para mostrar productos en la homepage:
- **Products > Collections > Create collection**
- Nombre: "Featured"
- Agregar productos a esta colección

## 🔧 Personalización

### Colores y Estilos

Editar en **Theme Settings** (Online Store > Themes > Customize):
- Primary Color
- Burgundy Color
- Logo
- Announcement Bar Text

### Precios Mayoristas

Para implementar precios mayoristas:

1. **Opción A: Customer Tags** (Recomendado)
   - Asignar tag `wholesale-partner` a clientes mayoristas
   - En `sections/products.liquid`, agregar:
   ```liquid
   {% if customer.tags contains 'wholesale-partner' %}
     {% assign price = product.price | times: 0.5 %}
   {% else %}
     {% assign price = product.price %}
   {% endif %}
   ```

2. **Opción B: App de Wholesale**
   - Instalar app como "Wholesale Club" o "Bold Commerce"
   - Configurar precios mayoristas en la app

## 📄 Templates Convertidos

- ✅ `index.html` → `templates/index.liquid`
- ✅ Secciones principales convertidas
- ⏳ `shop-landing.html` → `templates/page.shop-landing.liquid` (pendiente)
- ⏳ `partner-signup.html` → `templates/page.partner-signup.liquid` (pendiente)
- ⏳ `partner-dashboard.html` → `templates/page.partner-dashboard.liquid` (pendiente)

## 🔄 Cambios Principales vs HTML Original

### 1. Carrito de Compra

**Antes (localStorage):**
```javascript
localStorage.setItem('lovebrands_cart', JSON.stringify(cart));
```

**Ahora (Shopify Cart API):**
```javascript
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: variantId, quantity: 1 }]
  })
});
```

### 2. Productos

**Antes (HTML estático):**
```html
<div class="product-card">
  <h3>Citrus Flower Blossom</h3>
  <div class="price">$39.00</div>
</div>
```

**Ahora (Liquid dinámico):**
```liquid
{% for product in collections.featured.products %}
  <div class="product-card">
    <h3>{{ product.title }}</h3>
    <div class="price">{{ product.price | money }}</div>
  </div>
{% endfor %}
```

### 3. Autenticación de Partners

**Antes (localStorage):**
```javascript
const isPartner = localStorage.getItem('lovebrands_is_partner');
```

**Ahora (Shopify Customer Tags):**
```liquid
{% if customer.tags contains 'wholesale-partner' %}
  <!-- Mostrar contenido de partner -->
{% endif %}
```

## 📦 Funcionalidades Pendientes

- [ ] Convertir `shop-landing.html` a template de página
- [ ] Convertir `partner-signup.html` a template de página
- [ ] Convertir `partner-dashboard.html` a template de página
- [ ] Implementar sistema de partners con Customer Metafields
- [ ] Integrar checkout personalizado (si es necesario)
- [ ] Configurar newsletter con Shopify Email o integración externa
- [ ] Optimizar imágenes y videos
- [ ] Agregar SEO meta tags
- [ ] Configurar Google Analytics

## 🧪 Testing

1. Probar navegación entre páginas
2. Verificar que los productos se muestren correctamente
3. Probar carrito de compra
4. Verificar responsive design
5. Probar flujo de partner signup
6. Verificar precios mayoristas

## 📚 Recursos

- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)
- [Storefront API](https://shopify.dev/api/storefront)

## ⚠️ Notas Importantes

1. **Checkout**: Shopify Checkout no se puede personalizar completamente (solo en Shopify Plus)
2. **Precios Mayoristas**: Requiere plan Plus o app de terceros para funcionalidad completa
3. **Customer Accounts**: Usar cuentas de cliente nativas de Shopify
4. **Assets**: Todas las imágenes/videos deben subirse a Shopify Files

## 🆘 Soporte

Si tienes problemas:
1. Revisar console del navegador para errores
2. Verificar que todos los assets estén subidos
3. Verificar que las páginas tengan los handles correctos
4. Revisar configuración de productos y collections

---

**Versión**: 1.0.0  
**Fecha**: Enero 2026  
**Migrado desde**: Proyecto HTML estático original

