# 🔧 CONFIGURACIÓN REQUERIDA EN SHOPIFY ADMIN

Este documento explica qué necesitas configurar directamente en Shopify Admin para que todo funcione correctamente según las especificaciones B2C.

---

## ✅ 1. PRODUCTOS (Products)

### Productos Requeridos:
Debes tener estos productos con estos **handles exactos**:

1. **Citrus Flower Blossom**
   - Handle: `citrus-flower-blossom`
   - Precio: Configurar según tu estrategia
   - Variantes: Al menos una variante disponible

2. **Dye & Scent Free**
   - Handle: `dye-scent-free`
   - Precio: Configurar según tu estrategia
   - Variantes: Al menos una variante disponible

### Cómo verificar/crear handles:
1. Ve a **Products** en Shopify Admin
2. Abre cada producto
3. En la sección **Search engine listing**, verifica que el **URL and handle** sea exactamente:
   - `citrus-flower-blossom` o `dye-scent-free`
4. Si no coincide, edítalo para que sea exacto

---

## ✅ 2. SELLING PLANS (Suscripciones - 20% descuento)

### Configuración Requerida:
Debes crear **Selling Plans** (planes de suscripción) con **20% de descuento** para ambos productos.

### Pasos:

1. **Ve a Settings → Customer account → Subscriptions**
   - O busca "Selling plans" en la barra de búsqueda de Shopify

2. **Crea un Selling Plan Group:**
   - Nombre: "Quarterly Subscription" (o similar)
   - Tipo: Recurring delivery
   - Frecuencia: Every 3 months (quarterly)
   - Descuento: **20% off**

3. **Asocia los Selling Plans a los productos:**
   - Ve a cada producto (Citrus Flower Blossom y Dye & Scent Free)
   - En la sección **Selling plans**, agrega el plan que creaste
   - Asegúrate de que el descuento sea **20%**

### Verificación:
- Los productos deben tener `selling_plan_groups.size > 0`
- El código verifica esto automáticamente y solo muestra el bloque de suscripción si existe

---

## ✅ 3. CÓDIGO DE DESCUENTO PARA BUNDLES (15% off)

### Configuración Requerida:
Crea un código de descuento llamado **`BUNDLE15`** que aplique **15% de descuento**.

### Pasos:

1. **Ve a Discounts → Create discount**
2. **Tipo:** Code discount
3. **Configuración:**
   - **Code:** `BUNDLE15` (exactamente así, en mayúsculas)
   - **Discount type:** Percentage
   - **Value:** 15%
   - **Applies to:** Entire order (o productos específicos si prefieres)
   - **Minimum requirements:** None (o configura según necesites)
   - **Usage limits:** Configura según necesites

### Nota Importante:
- El código JavaScript guarda este código en `sessionStorage` cuando se agrega un bundle
- El cliente debe ingresar el código manualmente en el checkout
- **Alternativa:** Puedes automatizar esto con Shopify Scripts o una app de terceros

---

## ✅ 4. FREE SHIPPING (Envío Gratis sobre $75)

### Configuración Requerida:
Configura el envío gratis automático para órdenes sobre $75.

### Pasos:

1. **Ve a Settings → Shipping and delivery**
2. **Crea o edita una Shipping Rate:**
   - Nombre: "Free Shipping"
   - Condición: **Order price is greater than or equal to $75.00**
   - Precio: $0.00

### Verificación:
- El código muestra "+ Free Shipping" en los bundles solo si el total después del descuento es > $75
- Esto se calcula automáticamente desde los precios de Shopify

---

## ✅ 5. METAFIELDS (Opcional pero recomendado)

### Metafield para cantidad de Paks:
Si quieres que el número de Paks se lea dinámicamente:

1. **Ve a Settings → Custom data → Products**
2. **Crea un metafield:**
   - Namespace and key: `custom.paks_count`
   - Type: Integer
   - Description: "Número de Paks en el producto"

3. **Asigna valores:**
   - Para cada producto, agrega el valor (ej: 39)

**Nota:** Si no configuras esto, el código usa 39 como valor por defecto.

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de publicar, verifica:

- [ ] Producto "Citrus Flower Blossom" existe con handle `citrus-flower-blossom`
- [ ] Producto "Dye & Scent Free" existe con handle `dye-scent-free`
- [ ] Ambos productos tienen al menos una variante disponible
- [ ] Ambos productos tienen Selling Plans configurados con 20% de descuento
- [ ] Código de descuento `BUNDLE15` existe con 15% de descuento
- [ ] Free shipping configurado para órdenes ≥ $75
- [ ] (Opcional) Metafield `custom.paks_count` configurado

---

## 🔍 CÓMO VERIFICAR QUE TODO FUNCIONA

### 1. Página de Productos (`/pages/products`):
- ✅ Debe mostrar Hero con "Free shipping at $75+"
- ✅ Debe mostrar Subscription Block con "Subscribe & Save 20%" (sin mencionar free shipping)
- ✅ Debe mostrar 4 bundles, todos con 15% off
- ✅ Debe mostrar "+ Free Shipping" solo en bundles donde el total > $75
- ✅ Debe mostrar Singles con formato "39 Paks® • $XX.XX"

### 2. Página Individual de Producto:
- ✅ Trust badge debe decir "Subscribe & save 20% + unlock more savings with bundles"
- ✅ NO debe mencionar "all orders ship FREE"

### 3. Funcionalidad:
- ✅ Al hacer clic en "Add Bundle", debe agregar los productos correctos al carrito
- ✅ Al hacer clic en "Start Subscription", debe agregar con selling plan
- ✅ Los precios deben calcularse correctamente desde Shopify

---

## 🚨 PROBLEMAS COMUNES

### Los bundles no se muestran:
- Verifica que los productos existan con los handles correctos
- Verifica que los productos tengan variantes disponibles

### La suscripción no funciona:
- Verifica que los productos tengan Selling Plans configurados
- Verifica que el descuento del Selling Plan sea 20%

### El código de descuento no se aplica:
- Verifica que el código `BUNDLE15` exista en Shopify
- El código se guarda en sessionStorage, el cliente debe ingresarlo manualmente en checkout
- Considera usar Shopify Scripts o una app para automatizar esto

### Free shipping no aparece:
- Verifica que el total del bundle después del descuento sea > $75
- Verifica la configuración de shipping en Shopify

---

## 📝 NOTAS ADICIONALES

1. **Código de Descuento Automático:**
   - Actualmente el código guarda `BUNDLE15` en sessionStorage
   - Para aplicarlo automáticamente, necesitarías:
     - Shopify Scripts (solo Shopify Plus)
     - O una app de terceros como "Discount Code Auto Apply"

2. **Precios Dinámicos:**
   - Todos los precios se calculan desde Shopify en tiempo real
   - Los descuentos se calculan en Liquid (server-side)
   - No hay hardcoding de precios

3. **Bundles:**
   - Los 4 bundles están configurados:
     - 3 Scent Free (15% off)
     - 3 Citrus (15% off)
     - 2 Citrus + 1 Scent Free (15% off)
     - 2 Scent Free + 1 Citrus (15% off)

---

## ✅ RESUMEN

**Lo que el código hace automáticamente:**
- ✅ Lee productos desde Shopify
- ✅ Calcula precios y descuentos dinámicamente
- ✅ Muestra bundles según especificaciones
- ✅ Maneja suscripciones con selling plans
- ✅ Calcula free shipping basado en total

**Lo que TÚ debes configurar en Shopify:**
- ⚙️ Productos con handles correctos
- ⚙️ Selling Plans con 20% de descuento
- ⚙️ Código de descuento BUNDLE15 (15% off)
- ⚙️ Free shipping para órdenes ≥ $75
- ⚙️ (Opcional) Metafields para Paks count

