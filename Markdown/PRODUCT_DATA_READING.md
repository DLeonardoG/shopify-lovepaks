# 📦 CÓMO SE LEEN LOS PRODUCTOS DESDE SHOPIFY

## ✅ IMPLEMENTACIÓN COMPLETA

Todos los componentes están configurados para leer datos directamente desde Shopify usando Liquid.

---

## 🎯 TEMPLATE DE PRODUCTO (`templates/product.liquid`)

### Datos que se leen automáticamente:

1. **Información Básica:**
   ```liquid
   {{ product.id }}              # ID del producto
   {{ product.title }}            # Título del producto
   {{ product.description }}      # Descripción completa
   {{ product.handle }}           # Handle/URL del producto
   ```

2. **Imágenes:**
   ```liquid
   {{ product.featured_image }}   # Imagen principal
   {{ product.images }}           # Todas las imágenes
   {% for image in product.images %}
     {{ image | image_url: width: 2000 }}
   {% endfor %}
   ```

3. **Variantes:**
   ```liquid
   {{ product.variants }}         # Todas las variantes
   {{ product.selected_or_first_available_variant }}
   {{ variant.id }}
   {{ variant.price }}
   {{ variant.compare_at_price }}
   {{ variant.available }}
   {{ variant.title }}
   {{ variant.option1 }}, {{ variant.option2 }}, {{ variant.option3 }}
   ```

4. **Opciones de Variantes:**
   ```liquid
   {{ product.options_with_values }}
   {% for option in product.options_with_values %}
     {{ option.name }}            # "Flavor", "Size", etc.
     {{ option.values }}           # Array de valores
   {% endfor %}
   ```

5. **Suscripciones:**
   ```liquid
   {{ product.selling_plan_groups }}
   {% for group in product.selling_plan_groups %}
     {{ group.selling_plans }}
   {% endfor %}
   ```

6. **Metafields:**
   ```liquid
   {{ product.metafields.custom.ingredients }}
   {{ product.metafields.custom.directions }}
   {{ product.metafields.custom.benefits }}
   {{ product.metafields.reviews.rating }}
   ```

---

## 📋 SECCIONES QUE LEEN PRODUCTOS

### 1. **Sección de Productos (`sections/products.liquid`)**

Lee productos desde colecciones de Shopify:

```liquid
{% assign products_collection = collections.all %}
{% if collections.featured %}
  {% assign products_collection = collections.featured %}
{% endif %}

{% for product in products_collection.products %}
  {{ product.title }}
  {{ product.price | money }}
  {{ product.featured_image | image_url: width: 800 }}
  {{ product.url }}
{% endfor %}
```

**Características:**
- ✅ Lee todos los productos de la colección
- ✅ Excluye productos con tags 'wholesale' o 'master-case'
- ✅ Muestra imagen, título, precio, descripción
- ✅ Links a página individual del producto

### 2. **Recomendaciones (`sections/product-recommendations.liquid`)**

Lee productos relacionados:

```liquid
{% if recommendations.products_count > 0 %}
  {% assign recommended_products = recommendations.products %}
{% elsif product.collections.size > 0 %}
  {% assign recommended_products = product.collections.first.products %}
{% elsif collections.all.products.size > 0 %}
  {% assign recommended_products = collections.all.products %}
{% endif %}
```

**Fallbacks:**
1. Shopify Recommendations API (si está disponible)
2. Productos de la misma colección
3. Otros productos de la colección "all"

---

## 🔧 SNIPPETS QUE LEEN DATOS DEL PRODUCTO

### 1. **Product Gallery (`snippets/product-gallery.liquid`)**

```liquid
{% render 'product-gallery', product: product %}
```

Lee:
- `product.featured_image`
- `product.images` (para thumbnails)
- `product.selected_or_first_available_variant.featured_image`

### 2. **Product Price (`snippets/product-price.liquid`)**

```liquid
{% render 'product-price', product: product %}
```

Lee:
- `product.selected_or_first_available_variant.price`
- `product.selected_or_first_available_variant.compare_at_price`
- Calcula precio por día basado en variant title

### 3. **Variant Selectors**

**Flavor Selector:**
```liquid
{% render 'variant-selector-flavor', option: option, product: product %}
```

Lee:
- `product.options_with_values` (para opción "Flavor")
- `product.selected_or_first_available_variant.option1`
- `product.metafields.custom.flavor_images` (opcional)

**Size Selector:**
```liquid
{% render 'variant-selector-size', option: option, product: product %}
```

Lee:
- `product.options_with_values` (para opción "Size")
- `product.selected_or_first_available_variant.option2`

### 4. **Subscription Widget (`snippets/subscription-widget.liquid`)**

```liquid
{% render 'subscription-widget', product: product %}
```

Lee:
- `product.selling_plan_groups`
- `product.selling_plan_groups.first.selling_plans`
- `selling_plan.price_adjustments` (descuentos)

### 5. **Add to Cart Button (`snippets/add-to-cart-button.liquid`)**

```liquid
{% render 'add-to-cart-button', product: product %}
```

Lee:
- `product.selected_or_first_available_variant.available`
- `product.selected_or_first_available_variant.id`
- `product.tags` (para military discount)

---

## 📊 DATOS EN JAVASCRIPT

El template genera un JSON con todos los datos de variantes:

```javascript
// En product.liquid se genera:
<script type="application/json" id="product-variants-json">
{
  "product": {
    "id": {{ product.id }},
    "variants": [
      {
        "id": {{ variant.id }},
        "title": "{{ variant.title }}",
        "price": {{ variant.price }},
        "compare_at_price": {{ variant.compare_at_price }},
        "available": {{ variant.available }},
        "option1": "{{ variant.option1 }}",
        "option2": "{{ variant.option2 }}",
        "option3": "{{ variant.option3 }}",
        "image": "{{ variant.image | img_url: '2000x' }}"
      }
    ]
  }
}
</script>
```

Este JSON es leído por `product-page.js` para:
- Actualizar precios dinámicamente
- Cambiar imágenes según variante
- Actualizar disponibilidad
- Manejar selección de variantes

---

## 🛒 CART DRAWER

El cart drawer lee datos del carrito de Shopify:

```liquid
{{ cart.item_count }}              # Cantidad de items
{{ cart.total_price | money }}     # Precio total
{% for item in cart.items %}
  {{ item.product.title }}
  {{ item.variant.title }}
  {{ item.price | money }}
  {{ item.quantity }}
  {{ item.image | image_url: width: 200 }}
  {{ item.selling_plan_allocation }} # Si es suscripción
{% endfor %}
```

---

## ✅ VERIFICACIÓN

Para verificar que los productos se están leyendo correctamente:

1. **En el template de producto, descomenta el debug:**
   ```liquid
   Product ID: {{ product.id }}
   Product Title: {{ product.title }}
   Variants Count: {{ product.variants.size }}
   ```

2. **Verifica en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Busca el objeto `productData` en `product-page.js`

3. **Verifica en Network:**
   - Abre DevTools → Network
   - Recarga la página
   - Busca requests a `/cart.js` o `/products/[handle].json`

---

## 🔍 TROUBLESHOOTING

### Si los productos no se muestran:

1. **Verifica que hay productos en Shopify:**
   - Admin → Products
   - Asegúrate de que hay productos publicados

2. **Verifica que las colecciones existen:**
   - Admin → Collections
   - Verifica que `collections.all` o `collections.featured` tienen productos

3. **Verifica que los productos tienen:**
   - ✅ Imágenes
   - ✅ Variantes (al menos una)
   - ✅ Precio
   - ✅ Estado: Published

4. **Verifica el template:**
   - Asegúrate de que `templates/product.liquid` existe
   - Verifica que Shopify está usando este template

5. **Verifica los snippets:**
   - Asegúrate de que todos los snippets existen
   - Verifica que los nombres coinciden con los `{% render %}`

---

## 📝 NOTAS IMPORTANTES

- **Todos los datos se leen en tiempo real desde Shopify**
- **No hay caché local** - siempre se leen datos frescos
- **Los metafields son opcionales** - si no existen, las secciones no se muestran
- **Las variantes son requeridas** - cada producto debe tener al menos una variante
- **Las imágenes son opcionales** - hay fallbacks si no hay imágenes

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Verificar que los productos están en Shopify
2. ✅ Verificar que las colecciones tienen productos
3. ✅ Verificar que los productos tienen variantes
4. ✅ Probar el flujo completo: Homepage → Product → Add to Cart → Checkout

