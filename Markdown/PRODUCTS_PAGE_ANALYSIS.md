# 📊 ANÁLISIS COMPLETO: Products Page Layout con Bundles y Subscription

**Fecha:** Enero 2026  
**Estado:** Análisis de implementación requerida

---

## 🎯 RESUMEN EJECUTIVO

### Lo que EXISTE actualmente:
✅ Template básico de página de productos (`page.products.liquid`)  
✅ Sistema de suscripciones en páginas de producto individual (`subscription-widget.liquid`)  
✅ Integración con Shopify Cart API (`shopify-cart.js`)  
✅ Sistema de productos dinámicos desde colecciones  
✅ Estilos CSS básicos para productos

### Lo que FALTA para el nuevo layout:
❌ Hero section con el copy específico requerido  
❌ Bloque de suscripción destacado (BEST VALUE) en la página de productos  
❌ Sistema de bundles (3 bundles diferentes)  
❌ Lógica de descuentos para bundles (10%, 15%, 20%)  
❌ Sección de "Singles" separada de bundles  
❌ CTAs específicos ("Start Subscription", "Add Bundle")  
❌ Nudges de suscripción en bundles y singles

---

## 📋 ANÁLISIS DETALLADO POR SECCIÓN

### 1. HERO SECTION ❌ NO IMPLEMENTADO

**Requerido según spec:**
```
Eyebrow: Products
Headline: Wellness laundry, your way.
Subhead: Rose quartz micro‑crystal–infused detergent Paks® in two formulas—scented or fragrance-free.
Offer line: Free shipping at $75+ • Save more with bundles & subscription
```

**Estado actual:**
- Hero básico con título genérico "Shop Love Paks"
- No tiene el copy específico requerido
- No tiene la línea de oferta

**Archivo:** `templates/page.products.liquid` (líneas 8-16)

**Acción requerida:**
- Actualizar el hero con el copy exacto del spec
- Agregar la línea de oferta con estilos apropiados

---

### 2. SUBSCRIPTION BLOCK (BEST VALUE) ❌ NO IMPLEMENTADO

**Requerido según spec:**
- Bloque destacado con badge "★ BEST VALUE"
- Título: "Subscribe & Save 20% + Free Shipping"
- Descripción: "Delivered quarterly (3 pouches / 3-month supply)"
- Selector de fórmula (Citrus Flower Blossom / Dye & Scent Free)
- CTA: "Start Subscription"
- Texto pequeño: "Pause, skip, or cancel anytime"
- Ubicación: ARRIBA de bundles y singles

**Estado actual:**
- Existe `subscription-widget.liquid` pero es para páginas de producto individual
- NO existe bloque de suscripción en la página de productos
- NO hay integración con Selling Plans en la página de productos

**Archivos relacionados:**
- `snippets/subscription-widget.liquid` (existe pero para PDP)
- `assets/product-page.js` (maneja suscripciones en PDP)

**Acción requerida:**
- Crear nuevo snippet: `snippets/products-subscription-block.liquid`
- Integrar con Shopify Selling Plans API
- Agregar lógica para agregar suscripción al carrito directamente
- Estilos CSS para destacar como "BEST VALUE"
- JavaScript para manejar el selector de fórmula y agregar al carrito

---

### 3. BUNDLE OFFERS ❌ NO IMPLEMENTADO

**Requerido según spec:**

#### Bundle 1: Try Both (10% off)
- Incluye: 1 Citrus Flower Blossom + 1 Dye & Scent Free
- Descripción: "New here? Try both formulas—uplifting scent + truly fragrance-free."
- CTA: "Add Bundle"
- Nudge: "Or subscribe quarterly for 20% off + free shipping"

#### Bundle 2: Citrus 3-Month Supply (15% off + free shipping)
- Incluye: 3 Citrus Flower Blossom pouches
- Descripción: "Stock up on your brightest clean—made for everyday loads and active days."
- CTA: "Add Bundle"
- Nudge: "Best deal: subscribe quarterly for 20% off + free shipping"

#### Bundle 3: Fragrance-Free 3-Month Supply (15% off + free shipping)
- Incluye: 3 Dye & Scent Free pouches
- Descripción: "Gentle, simple, and consistent—ideal for sensitive skin and scent-sensitive homes."
- CTA: "Add Bundle"
- Nudge: "Best deal: subscribe quarterly for 20% off + free shipping"

**Estado actual:**
- ❌ NO existe sistema de bundles
- ❌ NO hay productos bundle creados en Shopify
- ❌ NO hay lógica de descuentos para bundles
- ❌ NO hay JavaScript para agregar múltiples productos al carrito

**Acción requerida:**
1. **Crear productos bundle en Shopify:**
   - Bundle 1: "Try Both Bundle" (producto con 2 variantes o producto compuesto)
   - Bundle 2: "Citrus 3-Month Supply" (producto con 3 unidades)
   - Bundle 3: "Fragrance-Free 3-Month Supply" (producto con 3 unidades)

2. **O usar Discount Codes:**
   - Crear discount codes para cada bundle
   - Aplicar automáticamente al agregar productos específicos

3. **O usar JavaScript:**
   - Agregar múltiples productos al carrito con un solo click
   - Aplicar descuento automáticamente

4. **Crear snippet:** `snippets/bundle-card.liquid`
   - Template reutilizable para cada bundle card

5. **Crear sección:** `sections/products-bundles.liquid`
   - Grid de 3 bundle cards

6. **JavaScript:** Agregar función para agregar bundles al carrito
   - Modificar `shopify-cart.js` o crear `bundle-cart.js`

---

### 4. SINGLES SECTION ⚠️ PARCIALMENTE IMPLEMENTADO

**Requerido según spec:**
- Sección separada con label "Shop Singles"
- 2 productos individuales (Citrus Flower Blossom, Dye & Scent Free)
- Precio: $39.99
- CTA: "Add to Cart"
- Nudge debajo: "Subscribe & save 20% + free ship →"

**Estado actual:**
- ✅ Existe grid de productos en `page.products.liquid`
- ✅ Muestra productos individuales
- ❌ NO está separado de bundles
- ❌ NO tiene el label "Shop Singles"
- ❌ NO tiene nudges de suscripción debajo de cada producto
- ❌ NO tiene el CTA específico "Add to Cart" (actualmente es "View Product")

**Archivo:** `templates/page.products.liquid` (líneas 30-210)

**Acción requerida:**
- Separar la sección de singles
- Agregar label "Shop Singles"
- Cambiar CTA de "View Product" a "Add to Cart" con funcionalidad AJAX
- Agregar nudge de suscripción debajo de cada producto
- Agregar link a suscripción

---

## 🔧 IMPLEMENTACIÓN TÉCNICA REQUERIDA

### 1. ESTRUCTURA DE ARCHIVOS NUEVOS

```
shopify-lovepaks/
├── templates/
│   └── page.products.liquid              ⚠️ MODIFICAR - Reestructurar completamente
│
├── sections/
│   └── products-bundles.liquid           ❌ CREAR - Grid de bundles
│
├── snippets/
│   ├── products-subscription-block.liquid ❌ CREAR - Bloque de suscripción
│   ├── bundle-card.liquid                 ❌ CREAR - Card de bundle reutilizable
│   └── product-single-card.liquid         ⚠️ CREAR/MODIFICAR - Card de producto individual
│
└── assets/
    ├── bundle-cart.js                     ❌ CREAR - Lógica para agregar bundles
    └── products-page.js                  ❌ CREAR - JS específico para products page
```

### 2. CONFIGURACIÓN EN SHOPIFY ADMIN

#### A. Productos Bundle (Opciones)

**Opción 1: Productos Bundle como Productos Separados**
- Crear 3 productos nuevos en Shopify:
  - "Try Both Bundle"
  - "Citrus 3-Month Supply"
  - "Fragrance-Free 3-Month Supply"
- Configurar precios con descuento ya aplicado
- Agregar tags: `bundle`, `bundle-try-both`, `bundle-3month-citrus`, `bundle-3month-fragrance-free`

**Opción 2: Usar Discount Codes**
- Crear 3 discount codes:
  - `TRYBOTH10` (10% off cuando se agregan ambos productos)
  - `CITRUS3MONTH15` (15% off + free shipping para 3x Citrus)
  - `FRAGRANCE3MONTH15` (15% off + free shipping para 3x Fragrance-Free)
- Aplicar automáticamente vía JavaScript

**Opción 3: Usar Product Bundles App**
- Instalar app como "Bundles" o "Bold Bundles"
- Crear bundles en la app
- Integrar con el tema

#### B. Selling Plans (Suscripciones)

**Requerido:**
1. Ir a Settings → Subscriptions
2. Crear Selling Plan Group: "Quarterly Subscription"
3. Crear Selling Plan:
   - Name: "Quarterly (3 pouches)"
   - Frequency: Every 3 months
   - Price adjustment: 20% off
   - Free shipping: Yes
4. Asignar a productos:
   - Citrus Flower Blossom
   - Dye & Scent Free

#### C. Productos Individuales

**Verificar que existan:**
- "Citrus Flower Blossom" (handle: `citrus-flower-blossom`)
- "Dye & Scent Free" (handle: `dye-scent-free`)

**Tags requeridos:**
- Citrus: `most-popular`, `featured`
- Fragrance-Free: `sensitive-skin`, `featured`

---

### 3. LÓGICA DE DESCUENTOS

**Bundle 1 - Try Both (10% off):**
```javascript
// Agregar 2 productos al carrito
// Aplicar descuento del 10% al total
// O usar discount code automáticamente
```

**Bundle 2 - Citrus 3-Month (15% off + free shipping):**
```javascript
// Agregar 3x Citrus Flower Blossom
// Aplicar descuento del 15%
// Activar free shipping
```

**Bundle 3 - Fragrance-Free 3-Month (15% off + free shipping):**
```javascript
// Agregar 3x Dye & Scent Free
// Aplicar descuento del 15%
// Activar free shipping
```

**Subscription (20% off + free shipping):**
```javascript
// Agregar producto con selling_plan_id
// Shopify aplica automáticamente el 20% off
// Free shipping se aplica automáticamente
```

---

### 4. JAVASCRIPT REQUERIDO

#### Funciones nuevas necesarias:

```javascript
// Agregar bundle al carrito
async function addBundleToCart(bundleType) {
  // bundleType: 'try-both', 'citrus-3month', 'fragrance-3month'
  // Agregar productos múltiples al carrito
  // Aplicar descuento si es necesario
}

// Agregar suscripción al carrito
async function addSubscriptionToCart(productHandle, sellingPlanId) {
  // Agregar producto con selling_plan_id
  // Redirigir o abrir cart drawer
}

// Calcular ahorro
function calculateSavings(originalPrice, discountedPrice) {
  // Calcular % y $ de ahorro
  // Mostrar en UI
}
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Preparación
- [ ] Crear productos bundle en Shopify (o configurar discount codes)
- [ ] Configurar Selling Plans para suscripciones
- [ ] Verificar que productos individuales existan y tengan tags correctos
- [ ] Crear discount codes si se usa esa opción

### Fase 2: Templates y Snippets
- [ ] Modificar `page.products.liquid` con nueva estructura
- [ ] Crear `snippets/products-subscription-block.liquid`
- [ ] Crear `snippets/bundle-card.liquid`
- [ ] Crear `sections/products-bundles.liquid`
- [ ] Crear/modificar `snippets/product-single-card.liquid`

### Fase 3: JavaScript
- [ ] Crear `assets/bundle-cart.js`
- [ ] Crear `assets/products-page.js`
- [ ] Integrar con `shopify-cart.js` existente
- [ ] Agregar funciones para agregar bundles
- [ ] Agregar funciones para agregar suscripciones

### Fase 4: Estilos CSS
- [ ] Estilos para hero section actualizado
- [ ] Estilos para subscription block (BEST VALUE badge)
- [ ] Estilos para bundle cards (grid de 3)
- [ ] Estilos para singles section
- [ ] Responsive design para mobile

### Fase 5: Testing
- [ ] Probar agregar bundle "Try Both"
- [ ] Probar agregar bundle "Citrus 3-Month"
- [ ] Probar agregar bundle "Fragrance-Free 3-Month"
- [ ] Probar agregar suscripción desde products page
- [ ] Verificar que descuentos se apliquen correctamente
- [ ] Verificar free shipping en bundles y suscripciones
- [ ] Probar responsive design
- [ ] Verificar que CTAs funcionen correctamente

---

## 🚨 DECISIONES PENDIENTES

### 1. Implementación de Bundles
**Pregunta:** ¿Cómo implementar los bundles?

**Opciones:**
- **A)** Productos bundle separados en Shopify (más simple, menos flexible)
- **B)** Discount codes automáticos (más flexible, requiere JS)
- **C)** App de bundles (más robusto, requiere app de terceros)

**Recomendación:** Opción B (Discount codes) para máxima flexibilidad sin apps adicionales.

### 2. Cálculo de Ahorros
**Pregunta:** ¿Mostrar solo % o también $ de ahorro?

**Según spec:** "Open items to confirm - Do we display % savings only or also $ savings?"

**Recomendación:** Mostrar ambos: "Save 20% ($8.00)" para mayor transparencia.

### 3. Free Shipping Threshold
**Pregunta:** ¿El free shipping en bundles es automático o solo si el total es $75+?

**Según spec:** Bundles 2 y 3 dicen "+ Free Shipping" explícitamente.

**Recomendación:** Free shipping automático en bundles (independiente del total).

### 4. Subscription Pause/Skip/Cancel
**Pregunta:** ¿Confirmar que se puede "Pause, skip, or cancel anytime"?

**Según spec:** "Small text (only if true): Pause, skip, or cancel anytime"

**Recomendación:** Verificar con Shopify Selling Plans si esto es posible, y mostrar solo si es verdadero.

---

## 📊 COMPARACIÓN: ACTUAL vs REQUERIDO

| Característica | Estado Actual | Requerido | Prioridad |
|---------------|---------------|-----------|-----------|
| Hero con copy específico | ❌ No | ✅ Sí | Alta |
| Subscription block destacado | ❌ No | ✅ Sí | Alta |
| Bundle "Try Both" | ❌ No | ✅ Sí | Alta |
| Bundle "Citrus 3-Month" | ❌ No | ✅ Sí | Alta |
| Bundle "Fragrance-Free 3-Month" | ❌ No | ✅ Sí | Alta |
| Singles section separada | ⚠️ Parcial | ✅ Sí | Media |
| Nudges de suscripción | ❌ No | ✅ Sí | Media |
| CTAs específicos | ⚠️ Parcial | ✅ Sí | Media |
| Lógica de descuentos | ❌ No | ✅ Sí | Alta |
| Free shipping en bundles | ❌ No | ✅ Sí | Alta |

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### Prioridad ALTA (MVP)
1. Hero section con copy correcto
2. Subscription block (BEST VALUE)
3. Sistema de bundles básico (al menos 1 bundle funcionando)
4. Singles section con CTAs correctos

### Prioridad MEDIA
5. Nudges de suscripción en bundles y singles
6. Cálculo y display de ahorros
7. Free shipping automático

### Prioridad BAJA (Nice to have)
8. Animaciones y transiciones
9. Badges adicionales
10. Analytics tracking

---

## 📚 REFERENCIAS Y RECURSOS

### Documentación Shopify
- [Shopify Cart API](https://shopify.dev/docs/api/ajax/reference/cart)
- [Shopify Selling Plans](https://shopify.dev/docs/api/admin-graphql/latest/objects/SellingPlanGroup)
- [Shopify Discount Codes API](https://shopify.dev/docs/api/admin-graphql/latest/objects/DiscountCodeBasic)

### Archivos Clave del Proyecto
- `templates/page.products.liquid` - Template principal a modificar
- `assets/shopify-cart.js` - API de carrito existente
- `snippets/subscription-widget.liquid` - Referencia para suscripciones
- `assets/product-page.js` - Referencia para manejo de productos

---

## ✅ CONCLUSIÓN

**Estado general:** ~30% implementado

**Lo que funciona:**
- Estructura básica de página de productos
- Sistema de productos dinámicos
- Integración con Shopify Cart API
- Suscripciones en páginas de producto individual

**Lo que falta:**
- ~70% de la funcionalidad requerida
- Sistema completo de bundles
- Subscription block en products page
- Nueva estructura y layout según spec

**Tiempo estimado de implementación:** 2-3 días de desarrollo

**Próximo paso:** Decidir estrategia de bundles y comenzar con Fase 1 (Preparación en Shopify Admin).

