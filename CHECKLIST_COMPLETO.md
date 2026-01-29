# ✅ CHECKLIST COMPLETO - Products Page B2C

Este documento lista TODO lo que falta para completar la implementación según las especificaciones B2C.

---

## 📋 PARTE 1: CONFIGURACIÓN EN SHOPIFY ADMIN

### ✅ 1. PRODUCTOS
- [ ] **Producto "Citrus Flower Blossom"**
  - [ ] Existe en Shopify
  - [ ] Handle exacto: `citrus-flower-blossom`
  - [ ] Tiene al menos una variante disponible
  - [ ] Tiene precio configurado
  - [ ] Tiene imagen principal

- [ ] **Producto "Dye & Scent Free"**
  - [ ] Existe en Shopify
  - [ ] Handle exacto: `dye-scent-free`
  - [ ] Tiene al menos una variante disponible
  - [ ] Tiene precio configurado
  - [ ] Tiene imagen principal

### ✅ 2. SELLING PLANS (Suscripciones)
- [ ] **Crear Selling Plan Group:**
  - [ ] Nombre: "Quarterly Subscription" (o similar con "quarterly" o "3 month")
  - [ ] Tipo: Recurring delivery
  - [ ] Frecuencia: Every 3 months
  - [ ] Descuento: **20% off**

- [ ] **Asociar a productos:**
  - [ ] Asociar plan a "Citrus Flower Blossom"
  - [ ] Asociar plan a "Dye & Scent Free"
  - [ ] Verificar que el descuento sea 20% en ambos

- [ ] **Limpiar planes incorrectos:**
  - [ ] Eliminar o desasociar planes que no correspondan (ej: "Preorder ski wax", "Ski wax subscription")
  - [ ] Solo debe quedar el plan quarterly con 20% off

### ✅ 3. CÓDIGO DE DESCUENTO PARA BUNDLES
- [ ] **Crear código de descuento:**
  - [ ] Nombre: `BUNDLE15`
  - [ ] Tipo: Code discount
  - [ ] Descuento: 15% off
  - [ ] Aplica a: Entire order (o productos específicos)
  - [ ] Sin requisitos mínimos (o configurar según necesites)

### ✅ 4. FREE SHIPPING
- [ ] **Configurar shipping rate:**
  - [ ] Nombre: "Free Shipping"
  - [ ] Condición: Order price ≥ $75.00
  - [ ] Precio: $0.00

### ✅ 5. METAFIELDS (Opcional)
- [ ] **Crear metafield `custom.paks_count`:**
  - [ ] Namespace and key: `custom.paks_count`
  - [ ] Type: Integer
  - [ ] Asignar valor 39 a cada producto

### ✅ 6. PÁGINA DE PRODUCTOS
- [ ] **Crear/verificar página:**
  - [ ] Página "Products" existe
  - [ ] Handle: `products`
  - [ ] Template: `page.products`
  - [ ] Estado: Published

---

## 📋 PARTE 2: VERIFICACIÓN DEL CÓDIGO

### ✅ 1. ARCHIVOS PRINCIPALES
- [x] `templates/page.products.liquid` - ✅ Implementado
- [x] `sections/products-bundles.liquid` - ✅ Implementado
- [x] `snippets/products-subscription-block.liquid` - ✅ Implementado
- [x] `snippets/bundle-card.liquid` - ✅ Implementado
- [x] `snippets/product-single-card.liquid` - ✅ Implementado
- [x] `assets/bundle-cart.js` - ✅ Implementado
- [x] `assets/products-page.js` - ✅ Implementado
- [x] `templates/product.liquid` - ✅ Corregido (trust badge, variant selector)
- [x] `snippets/subscription-widget.liquid` - ✅ Corregido (filtrado de planes)

### ✅ 2. FUNCIONALIDADES
- [x] Hero section con copy correcto
- [x] Subscription block (BEST VALUE)
- [x] 4 bundles con 15% off
- [x] Singles section
- [x] Cálculo dinámico de precios
- [x] Free shipping condicional (>$75)
- [x] Eliminación de menciones incorrectas de "Free Shipping"
- [x] Filtrado de variant selector "Title"
- [x] Filtrado de selling plans incorrectos

---

## 📋 PARTE 3: TESTING Y VERIFICACIÓN

### ✅ 1. PÁGINA DE PRODUCTOS (`/pages/products`)

#### Hero Section
- [ ] Muestra "Products" como eyebrow
- [ ] Muestra "Wellness laundry, your way." como título
- [ ] Muestra subhead correcto
- [ ] Muestra "Free shipping at $75+ • Save more with bundles & subscription"

#### Subscription Block
- [ ] Aparece con badge "★ BEST VALUE"
- [ ] Título: "Subscribe & Save 20%" (SIN mencionar free shipping)
- [ ] Descripción: "Delivered quarterly (3 pouches / 3-month supply)"
- [ ] Selector de fórmula funciona (Citrus / Fragrance-Free)
- [ ] Botón "Start Subscription" funciona
- [ ] Texto: "Pause, skip, or cancel anytime"
- [ ] Link "Shop bundles instead" funciona

#### Bundles Section
- [ ] Muestra 4 bundles:
  - [ ] 3 Scent Free (15% off)
  - [ ] 3 Citrus (15% off)
  - [ ] 2 Citrus + 1 Scent Free (15% off)
  - [ ] 2 Scent Free + 1 Citrus (15% off)
- [ ] Cada bundle muestra:
  - [ ] Precio original tachado
  - [ ] Precio final con descuento
  - [ ] "Save $X" calculado
  - [ ] "+ Free Shipping" solo si total > $75
  - [ ] Botón "Add Bundle" funciona
  - [ ] Link de suscripción funciona

#### Singles Section
- [ ] Título: "Shop Singles"
- [ ] Muestra ambos productos:
  - [ ] Citrus Flower Blossom
  - [ ] Dye & Scent Free
- [ ] Cada producto muestra:
  - [ ] Formato: "39 Paks® • $XX.XX"
  - [ ] Botón "Add to Cart" funciona
  - [ ] Link "Subscribe & save 20% →" funciona

### ✅ 2. PÁGINA INDIVIDUAL DE PRODUCTO

#### Trust Badge
- [ ] Muestra: "Subscribe & save 20% + unlock more savings with bundles"
- [ ] NO muestra "all orders ship FREE"

#### Variant Selectors
- [ ] NO muestra selector "TITLE:" cuando solo hay "Default Title"
- [ ] Muestra selectores correctos (Flavor, Size, etc.)

#### Subscription Widget
- [ ] Toggle funciona
- [ ] Select solo muestra planes quarterly con 20% off
- [ ] NO muestra planes incorrectos (ej: "Preorder ski wax")
- [ ] Texto: "Pause, skip, or cancel anytime" (SIN mencionar free shipping)

### ✅ 3. FUNCIONALIDAD

#### Agregar Bundles
- [ ] Bundle "3 Scent Free" agrega 3x Dye & Scent Free al carrito
- [ ] Bundle "3 Citrus" agrega 3x Citrus Flower Blossom al carrito
- [ ] Bundle "2 Citrus + 1 Scent Free" agrega productos correctos
- [ ] Bundle "2 Scent Free + 1 Citrus" agrega productos correctos
- [ ] Toast muestra "Bundle added to cart! Save 15%"
- [ ] Código `BUNDLE15` se guarda en sessionStorage

#### Agregar Suscripción
- [ ] Botón "Start Subscription" agrega suscripción al carrito
- [ ] Selección de fórmula funciona (Citrus/Fragrance-Free)
- [ ] Se agrega con selling plan correcto
- [ ] Toast muestra "Subscription started! Save 20%"
- [ ] Carrito drawer se abre automáticamente

#### Agregar Singles
- [ ] Botón "Add to Cart" en singles funciona
- [ ] Agrega producto individual al carrito
- [ ] Carrito drawer se abre automáticamente

#### Cálculos de Precios
- [ ] Precios se calculan dinámicamente desde Shopify
- [ ] Descuentos de bundles (15%) se calculan correctamente
- [ ] Free shipping aparece solo cuando total > $75
- [ ] Precios se actualizan si cambian en Shopify

### ✅ 4. RESPONSIVE DESIGN
- [ ] Mobile: Hero se ve bien
- [ ] Mobile: Subscription block se adapta
- [ ] Mobile: Bundles se apilan verticalmente
- [ ] Mobile: Singles se apilan verticalmente
- [ ] Tablet: Layout intermedio funciona
- [ ] Desktop: Layout completo funciona

### ✅ 5. NAVEGACIÓN
- [ ] Links de suscripción (#subscription-block) funcionan
- [ ] Links de bundles (#bundles-section) funcionan
- [ ] Smooth scroll funciona
- [ ] Todos los CTAs funcionan

---

## 📋 PARTE 4: MEJORAS OPCIONALES

### ✅ 1. AUTOMATIZACIÓN DE DESCUENTOS
- [ ] **Opción A:** Usar Shopify Scripts (solo Shopify Plus)
  - [ ] Crear script para aplicar `BUNDLE15` automáticamente
  - [ ] Detectar cuando se agregan bundles al carrito

- [ ] **Opción B:** Usar app de terceros
  - [ ] Instalar app "Discount Code Auto Apply" o similar
  - [ ] Configurar para aplicar `BUNDLE15` automáticamente

### ✅ 2. ANALYTICS Y TRACKING
- [ ] Configurar eventos de Google Analytics:
  - [ ] "add_bundle" event
  - [ ] "start_subscription" event
  - [ ] "add_single_product" event

### ✅ 3. OPTIMIZACIÓN
- [ ] Lazy loading de imágenes
- [ ] Optimización de JavaScript
- [ ] Minificación de CSS

---

## 🚨 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema: Selling plans incorrectos aparecen en el select
**Solución:** 
- El código ahora filtra planes que no sean quarterly o 20% off
- Debes limpiar los planes incorrectos en Shopify Admin

### Problema: Código de descuento no se aplica automáticamente
**Solución:**
- Actualmente se guarda en sessionStorage
- Cliente debe ingresarlo manualmente en checkout
- Para automatizar: usar Shopify Scripts o app de terceros

### Problema: Free shipping no aparece en bundles
**Solución:**
- Verifica que el total después del descuento sea > $75
- Verifica configuración de shipping en Shopify

---

## ✅ RESUMEN FINAL

### Lo que está COMPLETO (Código):
- ✅ Hero section
- ✅ Subscription block
- ✅ 4 bundles con cálculos dinámicos
- ✅ Singles section
- ✅ JavaScript para agregar al carrito
- ✅ Filtrado de variant selectors
- ✅ Filtrado de selling plans
- ✅ Eliminación de menciones incorrectas de "Free Shipping"

### Lo que falta (Configuración Shopify):
- ⚙️ Productos con handles correctos
- ⚙️ Selling Plans quarterly con 20% off
- ⚙️ Limpiar selling plans incorrectos
- ⚙️ Código de descuento BUNDLE15
- ⚙️ Free shipping para órdenes ≥ $75
- ⚙️ (Opcional) Metafields para Paks count

### Lo que falta (Testing):
- 🧪 Probar todos los flujos
- 🧪 Verificar responsive design
- 🧪 Verificar cálculos de precios
- 🧪 Verificar funcionalidad de carrito

---

## 🎯 PRIORIDADES

### ALTA PRIORIDAD (Crítico para funcionar):
1. ✅ Configurar productos con handles correctos
2. ✅ Crear Selling Plans quarterly con 20% off
3. ✅ Limpiar selling plans incorrectos
4. ✅ Crear código de descuento BUNDLE15
5. ✅ Configurar free shipping ≥ $75

### MEDIA PRIORIDAD (Mejora experiencia):
1. ⚙️ Automatizar aplicación de código de descuento
2. ⚙️ Configurar metafields para Paks count
3. ⚙️ Testing completo de todos los flujos

### BAJA PRIORIDAD (Opcional):
1. 📊 Analytics y tracking
2. ⚡ Optimizaciones de performance

---

## 📝 NOTAS FINALES

**Estado actual:** ~95% completo en código, ~0% configurado en Shopify

**Próximo paso:** Comenzar con la configuración en Shopify Admin siguiendo `CONFIGURACION_SHOPIFY_B2C.md`

**Tiempo estimado para completar:**
- Configuración Shopify: 1-2 horas
- Testing: 1-2 horas
- **Total: 2-4 horas**
