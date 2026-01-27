# Configuración de la Página de Wholesale

Esta guía te ayudará a configurar la nueva página de wholesale en tu tienda Shopify.

## 📋 Archivos Creados

1. **Template**: `templates/page.wholesale.liquid`
2. **JavaScript**: `assets/wholesale.js`
3. **Estilos**: Reutiliza `assets/shop-landing-styles.css`
4. **Layout actualizado**: `layout/theme.liquid` (incluye estilos y scripts)

## 🚀 Pasos para Configurar en Shopify

### 1. Crear la Página en Shopify Admin

1. Ve a **Online Store > Pages** en tu Shopify Admin
2. Haz clic en **Add page**
3. Configura la página:
   - **Title**: "Wholesale" o "Become a Partner"
   - **Content**: Puedes dejar esto vacío o agregar contenido adicional
   - **Search engine listing**: Configura SEO si lo deseas
   - **Template**: Selecciona `page.wholesale`
   - **Visibility**: Público o privado según necesites
4. Guarda la página
5. **Importante**: El **handle** de la página debe ser `wholesale` (esto es automático si el título es "Wholesale")

### 2. Crear el Producto "Master Case"

1. Ve a **Products > Add product**
2. Configura el producto:
   - **Title**: "Master Case"
   - **Handle**: `master-case` (importante para que el template lo encuentre)
   - **Description**: "Each Master Case contains 10 pouches. Each pouch contains 39 Love Paks. Total: 390 Love Paks per Master Case."
   - **Price**: $229.00 (o el precio que desees)
   - **Inventory**: Configura según necesites
3. Guarda el producto

### 3. Configurar Precios Mayoristas (Opcional)

Si quieres mostrar precios diferentes para clientes mayoristas:

#### Opción A: Usar Customer Tags
1. Ve a **Customers** en Shopify Admin
2. Para clientes mayoristas, agrega el tag: `wholesale-partner`
3. El template automáticamente mostrará el precio con 50% de descuento para estos clientes

#### Opción B: Usar Variantes con Precios Diferentes
1. En el producto "Master Case", crea variantes:
   - Variante 1: "Retail" - Precio: $229.00
   - Variante 2: "Wholesale" - Precio: $114.50
2. Actualiza el template para usar la variante correcta según el tipo de cliente

### 4. Subir Imágenes de Producto

1. Ve a **Content > Files** en Shopify Admin
2. Sube las siguientes imágenes:
   - `packaging-normal.jpg` (Citrus Blossom)
   - `packaging-piel-sensibles.jpg` (Dye & Scent Free)
3. O actualiza las URLs en el template `page.wholesale.liquid` con las URLs de tus imágenes

### 5. Verificar la Configuración

1. Visita la página: `https://tu-tienda.myshopify.com/pages/wholesale`
2. Verifica que:
   - El hero section se muestre correctamente
   - Las imágenes de producto se vean
   - El precio se muestre correctamente
   - El botón "Add to Cart" funcione
   - El FAQ accordion funcione

## 🔧 Personalización

### Cambiar el Precio

Edita el template `templates/page.wholesale.liquid` y busca:
```liquid
<span class="price-amount">$229</span>
```

O mejor aún, asegúrate de que el producto "Master Case" esté creado correctamente y el template lo detectará automáticamente.

### Cambiar el Variant ID

Si necesitas usar un variant ID específico, edita el template y busca:
```liquid
<input type="hidden" name="id" value="REPLACE_WITH_VARIANT_ID">
```

Reemplaza `REPLACE_WITH_VARIANT_ID` con el ID real de la variante del producto.

### Modificar el Contenido

Puedes editar directamente el template `templates/page.wholesale.liquid` para:
- Cambiar textos del hero
- Modificar descripciones de productos
- Agregar más preguntas al FAQ
- Cambiar estilos (editando `shop-landing-styles.css`)

## 📝 Notas Importantes

1. **Handle de la página**: Debe ser exactamente `wholesale` para que los estilos y scripts se carguen correctamente
2. **Handle del producto**: Debe ser `master-case` para que el template lo encuentre
3. **Variant ID**: Si el producto no existe, el template mostrará un placeholder. Asegúrate de reemplazarlo con el ID real
4. **Imágenes**: Las imágenes usan URLs externas por defecto. Sube las imágenes a Shopify Files para mejor rendimiento

## 🐛 Solución de Problemas

### El precio no se muestra
- Verifica que el producto "Master Case" exista con handle `master-case`
- Verifica que el producto tenga al menos una variante disponible

### El botón "Add to Cart" no funciona
- Verifica que el variant ID esté configurado correctamente
- Abre la consola del navegador para ver errores
- Asegúrate de que `shopify-cart.js` esté cargado

### Los estilos no se aplican
- Verifica que el handle de la página sea exactamente `wholesale`
- Verifica que `shop-landing-styles.css` exista en `assets/`
- Limpia la caché del navegador

### El FAQ no se expande
- Verifica que `wholesale.js` esté cargado
- Abre la consola del navegador para ver errores de JavaScript

## 📚 Recursos Adicionales

- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Shopify Cart API](https://shopify.dev/api/ajax/reference/cart)

---

**Versión**: 1.0.0  
**Fecha**: Enero 2026  
**Basado en**: shop-landing.html reference

