# 🛠️ CONFIGURACIÓN REQUERIDA EN SHOPIFY ADMIN

**Fecha:** Enero 2026  
**Estado:** Pendiente de configuración

Este documento lista todo lo que necesita configurarse en Shopify Admin para que el nuevo layout de Products Page funcione correctamente.

---

## ✅ LO QUE YA ESTÁ IMPLEMENTADO EN EL CÓDIGO

- ✅ Hero section con copy correcto
- ✅ Subscription block (BEST VALUE) con selector de fórmula
- ✅ Bundles section con 3 cards
- ✅ Singles section con cards mejorados
- ✅ JavaScript para agregar bundles y suscripciones al carrito
- ✅ Estilos CSS completos
- ✅ Responsive design

---

## 🔧 CONFIGURACIÓN REQUERIDA EN SHOPIFY ADMIN

### 1. PRODUCTOS INDIVIDUALES

#### A. Verificar que existan los productos

**Producto 1: Citrus Flower Blossom**
- **Handle:** `citrus-flower-blossom` (debe ser exacto)
- **Precio:** $39.99 (o el precio que corresponda)
- **Tags requeridos:**
  - `most-popular` (para mostrar badge)
  - `featured` (para que aparezca en colecciones)

**Producto 2: Dye & Scent Free**
- **Handle:** `dye-scent-free` (debe ser exacto)
- **Precio:** $39.99 (o el precio que corresponda)
- **Tags requeridos:**
  - `sensitive-skin` (para mostrar badge)
  - `featured` (para que aparezca en colecciones)

#### B. Verificar que NO tengan estos tags
- ❌ `wholesale`
- ❌ `master-case`
- ❌ `bundle` (a menos que sean productos bundle separados)

---

### 2. SELLING PLANS (SUSCRIPCIONES) ⚠️ CRÍTICO

El subscription block requiere que los productos tengan Selling Plans configurados.

#### Pasos:

1. **Ir a Settings → Subscriptions**
   - Si no ves esta opción, necesitas activar Subscriptions en tu plan de Shopify

2. **Crear Selling Plan Group:**
   - **Name:** "Quarterly Subscription"
   - **Description:** "Delivered quarterly (3 pouches / 3-month supply)"

3. **Crear Selling Plan dentro del grupo:**
   - **Name:** "Quarterly (3 pouches)"
   - **Frequency:** Every 3 months
   - **Price adjustment:** 20% off
   - **Free shipping:** Yes (si está disponible)

4. **Asignar a productos:**
   - Seleccionar "Citrus Flower Blossom"
   - Seleccionar "Dye & Scent Free"
   - Guardar

#### Nota importante:
Si no configuras Selling Plans, el botón "Start Subscription" mostrará un error. El código está preparado para manejar este caso y mostrará un mensaje apropiado.

---

### 3. DISCOUNT CODES (PARA BUNDLES) ⚠️ OPCIONAL PERO RECOMENDADO

Para que los bundles apliquen descuentos automáticamente, crea estos discount codes:

#### Discount Code 1: TRYBOTH10
- **Type:** Percentage
- **Value:** 10% off
- **Applies to:** Specific products
  - Citrus Flower Blossom
  - Dye & Scent Free
- **Minimum requirements:** 
  - Minimum quantity: 1 de cada producto
- **Usage limits:** Sin límite (o según necesites)
- **Customer eligibility:** Everyone

#### Discount Code 2: CITRUS3MONTH15
- **Type:** Percentage
- **Value:** 15% off
- **Applies to:** Specific products
  - Citrus Flower Blossom
- **Minimum requirements:**
  - Minimum quantity: 3
- **Free shipping:** Yes
- **Usage limits:** Sin límite
- **Customer eligibility:** Everyone

#### Discount Code 3: FRAGRANCE3MONTH15
- **Type:** Percentage
- **Value:** 15% off
- **Applies to:** Specific products
  - Dye & Scent Free
- **Minimum requirements:**
  - Minimum quantity: 3
- **Free shipping:** Yes
- **Usage limits:** Sin límite
- **Customer eligibility:** Everyone

#### Nota:
El código JavaScript (`bundle-cart.js`) está preparado para aplicar estos discount codes automáticamente. Los códigos se almacenan en `sessionStorage` y deberían aplicarse en el checkout.

**Alternativa:** Si prefieres no usar discount codes, puedes crear productos bundle separados en Shopify con los precios ya descontados.

---

### 4. COLECCIÓN DE PRODUCTOS

#### Crear o verificar colección "Featured"

1. **Ir a Products → Collections**
2. **Crear o editar colección "Featured"**
3. **Agregar productos:**
   - Citrus Flower Blossom
   - Dye & Scent Free
   - ❌ NO agregar Master Case

#### O usar colección "All"
- El código también funciona con `collections.all`
- Asegúrate de que los productos individuales no tengan tags `wholesale` o `master-case`

---

### 5. PÁGINA DE PRODUCTOS

#### Verificar que la página exista

1. **Ir a Online Store → Pages**
2. **Buscar página "Products"**
3. **Verificar:**
   - **Handle:** `products` (debe ser exacto)
   - **Template:** `page.products` (debe estar seleccionado)
   - **Visibility:** Visible

Si no existe, créala:
- **Title:** "Products"
- **Handle:** `products`
- **Template:** `page.products`
- **Content:** Puede estar vacío (el template maneja todo)

---

### 6. FREE SHIPPING THRESHOLD

#### Configurar free shipping en $75+

1. **Ir a Settings → Shipping and delivery**
2. **Crear shipping rate:**
   - **Name:** "Free Shipping"
   - **Conditions:** Order price is greater than or equal to $75.00
   - **Price:** $0.00

#### Nota:
Los bundles 2 y 3 (3-Month Supply) tienen free shipping automático según el spec. Esto se maneja con los discount codes que incluyen free shipping.

---

## 🧪 CHECKLIST DE VERIFICACIÓN

Antes de probar, verifica:

- [ ] Producto "Citrus Flower Blossom" existe con handle `citrus-flower-blossom`
- [ ] Producto "Dye & Scent Free" existe con handle `dye-scent-free`
- [ ] Ambos productos tienen tags correctos (`most-popular`, `sensitive-skin`, `featured`)
- [ ] Selling Plans configurados para ambos productos (20% off, quarterly)
- [ ] Discount codes creados (TRYBOTH10, CITRUS3MONTH15, FRAGRANCE3MONTH15)
- [ ] Colección "Featured" existe y contiene los productos
- [ ] Página "Products" existe con handle `products` y template `page.products`
- [ ] Free shipping configurado para órdenes $75+

---

## 🐛 TROUBLESHOOTING

### El subscription block no aparece
- **Causa:** Los productos no tienen Selling Plans configurados
- **Solución:** Configurar Selling Plans en Settings → Subscriptions

### Los bundles no aplican descuento
- **Causa:** Los discount codes no están creados o no se aplican correctamente
- **Solución:** 
  1. Verificar que los discount codes existan
  2. Verificar que los códigos se apliquen en el checkout
  3. O crear productos bundle separados con precios ya descontados

### Los productos no aparecen en Singles section
- **Causa:** Los handles de los productos no coinciden
- **Solución:** Verificar que los handles sean exactamente `citrus-flower-blossom` y `dye-scent-free`

### El botón "Add Bundle" no funciona
- **Causa:** El JavaScript no está cargado o hay un error
- **Solución:** 
  1. Verificar que `bundle-cart.js` esté cargado
  2. Abrir consola del navegador para ver errores
  3. Verificar que los productos existan y tengan variantes disponibles

### El botón "Start Subscription" muestra error
- **Causa:** No hay Selling Plans configurados o el producto no tiene variantes disponibles
- **Solución:** 
  1. Configurar Selling Plans
  2. Verificar que los productos tengan al menos una variante disponible

---

## 📝 NOTAS ADICIONALES

### Estrategia de Bundles

El código actual implementa bundles agregando múltiples productos al carrito. Hay dos estrategias posibles:

**Opción A: Discount Codes (Actual)**
- Agregar productos al carrito
- Aplicar discount code automáticamente
- ✅ Más flexible
- ⚠️ Requiere que el usuario ingrese el código o se aplique automáticamente en checkout

**Opción B: Productos Bundle Separados**
- Crear productos bundle en Shopify
- Precios ya descontados
- ✅ Más simple para el usuario
- ⚠️ Requiere crear productos adicionales

**Recomendación:** Usar Opción A (discount codes) para máxima flexibilidad, pero asegurarse de que se apliquen automáticamente en el checkout.

### Free Shipping en Bundles

Los bundles 2 y 3 incluyen "Free Shipping" según el spec. Esto se maneja con:
1. Discount codes que incluyen free shipping, O
2. Configuración de shipping rates en Shopify

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE CONFIGURAR

1. Probar agregar suscripción desde products page
2. Probar agregar cada bundle al carrito
3. Verificar que los descuentos se apliquen correctamente
4. Verificar que free shipping funcione en bundles
5. Probar agregar productos individuales (singles)
6. Verificar responsive design en mobile
7. Probar flujo completo hasta checkout

---

## 📚 REFERENCIAS

- [Shopify Selling Plans](https://help.shopify.com/en/manual/products/subscriptions)
- [Shopify Discount Codes](https://help.shopify.com/en/manual/discounts)
- [Shopify Shipping Settings](https://help.shopify.com/en/manual/shipping)

---

**Última actualización:** Enero 2026

