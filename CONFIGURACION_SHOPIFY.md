# Configuración de Shopify - Estructura Correcta

## 📋 Resumen de la Estructura

### Flujo de Compra:
1. **Homepage** → Muestra productos de la colección → Enlace a `/pages/products` o página de producto individual
2. **Página de Productos** (`/pages/products`) → Muestra todos los productos de la colección → Enlace a páginas de producto individuales
3. **Página de Producto Individual** (Shopify nativo) → Agregar al carrito → Checkout
4. **Shop Landing** (`/pages/shop-landing`) → Master Case (10 unidades) → Solo para wholesale/partners

---

## 🛠️ Configuración en Shopify Admin

### 1. Crear Colección de Productos

1. Ve a **Products > Collections**
2. Haz clic en **"Create collection"**
3. Configura:
   - **Title**: "Featured" o "All Products"
   - **Description**: (opcional)
   - **Collection type**: Manual o Automated
   - **Handle**: `featured` (si usas manual) o deja que Shopify lo genere

4. **Agregar productos a la colección:**
   - Agrega los productos individuales (Citrus Flower Blossom, Dye & Scent Free)
   - **NO agregues** el Master Case a esta colección

### 2. Configurar Productos Individuales

#### Producto: Citrus Flower Blossom
- **Title**: "Citrus Flower Blossom" o "Love Paks - Citrus Flower Blossom"
- **Handle**: `citrus-flower-blossom` (o el que prefieras)
- **Price**: $39.00
- **Tags**: 
  - `most-popular` (para mostrar badge "Most Popular")
  - `featured` (si usas colección automática)
- **Description**: Incluye descripción del producto
- **Images**: Sube imagen del producto
- **Variants**: Si tiene variantes (tamaños, etc.), configúralas

#### Producto: Dye & Scent Free
- **Title**: "Dye & Scent Free" o "Love Paks - Dye & Scent Free"
- **Handle**: `dye-scent-free` (o el que prefieras)
- **Price**: $39.00
- **Tags**: 
  - `sensitive-skin` (para mostrar badge "Sensitive Skin")
  - `featured` (si usas colección automática)
- **Description**: Incluye descripción del producto
- **Images**: Sube imagen del producto
- **Variants**: Si tiene variantes, configúralas

### 3. Configurar Master Case (Wholesale)

#### Producto: Master Case
- **Title**: "Master Case" o "Love Paks Master Case"
- **Handle**: `master-case`
- **Price**: $229.00 (wholesale)
- **Tags**: 
  - `wholesale`
  - `master-case`
  - **NO agregar** `featured` (para que no aparezca en la página de productos)
- **Description**: 
  - "Each Master Case contains 10 pouches. Each pouch contains 39 Love Paks. Total: 390 Love Paks per Master Case."
- **Variants**: Si tiene variantes, configúralas
- **Customer Groups**: Puedes restringir a clientes con tag `wholesale-partner`

### 4. Crear Página de Productos

1. Ve a **Online Store > Pages**
2. Haz clic en **"Add page"**
3. Configura:
   - **Title**: "Products" o "Shop"
   - **Content**: Puedes dejar vacío o agregar texto breve
   - **Template**: Selecciona `page.products`
   - **Search engine listing**:
     - **Page title**: "Shop Love Paks - Wellness Laundry Detergent"
     - **Description**: "Shop our wellness laundry detergent products infused with rose quartz microcrystals"
   - **Handle**: `products` (IMPORTANTE - debe ser exactamente `products`)
4. **Visibility**: Visible
5. **Save**

---

## 🏷️ Sistema de Tags

### Tags para Productos Individuales:
- `most-popular` → Muestra badge "Most Popular"
- `sensitive-skin` → Muestra badge "Sensitive Skin"
- `featured` → Para colecciones automáticas

### Tags para Excluir de Página de Productos:
- `wholesale` → Producto no aparece en página de productos
- `master-case` → Producto no aparece en página de productos

### Tags para Clientes:
- `wholesale-partner` → Para acceso a precios mayoristas

---

## 🔄 Flujo Completo

### Para Clientes Regulares:
1. **Homepage** → Ve sección de productos
2. Click en "Shop Now" → Va a `/pages/products` o directamente a página de producto
3. **Página de Productos** → Ve todos los productos disponibles
4. Click en producto → Va a página de producto individual de Shopify
5. **Página de Producto** → Selecciona variante (si aplica) → "Add to Cart"
6. **Cart** → Checkout normal de Shopify

### Para Partners/Wholesale:
1. **Homepage** → Puede ver productos regulares
2. **Partner Dashboard** → Acceso a `/pages/shop-landing`
3. **Shop Landing** → Ve Master Case (10 unidades)
4. Click "Add to Cart" → Agrega Master Case al carrito
5. **Cart** → Checkout con precio wholesale

---

## ✅ Checklist de Configuración

- [ ] Colección "Featured" o "All Products" creada
- [ ] Producto "Citrus Flower Blossom" creado con tag `most-popular`
- [ ] Producto "Dye & Scent Free" creado con tag `sensitive-skin`
- [ ] Producto "Master Case" creado con tags `wholesale` y `master-case`
- [ ] Productos individuales agregados a colección "Featured"
- [ ] Master Case NO agregado a colección "Featured"
- [ ] Página "Products" creada con handle `products` y template `page.products`
- [ ] Imágenes de productos subidas
- [ ] Precios configurados correctamente
- [ ] Descripciones de productos completas

---

## 🎨 Personalización Adicional

### Si quieres usar una colección diferente:
En `templates/page.products.liquid` y `sections/products.liquid`, cambia:
```liquid
{% assign products_collection = collections.all %}
{% if collections.featured %}
    {% assign products_collection = collections.featured %}
{% endif %}
```

Por:
```liquid
{% assign products_collection = collections['tu-coleccion'] %}
```

### Si quieres mostrar más productos:
En `sections/products.liquid`, cambia:
```liquid
{% for product in products_collection.products limit: 2 %}
```

Por:
```liquid
{% for product in products_collection.products limit: 4 %}
```

---

## 📝 Notas Importantes

1. **El Master Case debe tener los tags `wholesale` o `master-case`** para que no aparezca en la página de productos regulares
2. **Los productos individuales deben estar en la colección** para aparecer en la página de productos
3. **Cada producto debe tener su propia página de producto** en Shopify (esto es automático)
4. **El flujo de carrito usa el sistema nativo de Shopify**, así que funciona automáticamente
5. **Los precios se muestran dinámicamente** desde Shopify usando `{{ product.price | money }}`

---

## 🐛 Troubleshooting

### Los productos no aparecen en la página:
- Verifica que los productos estén en la colección
- Verifica que no tengan tags `wholesale` o `master-case`
- Verifica que la colección tenga productos

### El Master Case aparece en la página de productos:
- Agrega tags `wholesale` o `master-case` al producto Master Case
- Verifica que el código esté excluyendo estos productos

### Los precios no se muestran:
- Verifica que los productos tengan precio configurado en Shopify
- Verifica que el formato de dinero esté correcto: `{{ product.price | money }}`

### Los enlaces no funcionan:
- Verifica que los productos existan en Shopify
- Verifica que los handles sean correctos
- Usa `{{ product.url }}` para enlaces automáticos









