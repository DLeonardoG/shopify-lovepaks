# 🎯 SISTEMA "BECOME A PARTNER" - GUÍA DE CONFIGURACIÓN COMPLETA

**Fecha:** Enero 2026  
**Estado:** Listo para implementación

Esta guía detalla todos los pasos necesarios para configurar el sistema completo de "Become a Partner" en Shopify Admin.

---

## 📋 CHECKLIST DE CONFIGURACIÓN

### Fase 1: Metafields (CRÍTICO)
- [ ] Crear Customer Metafields con namespace `custom`

### Fase 2: Páginas
- [ ] Crear página "partner-signup" con template correcto
- [ ] Crear página "partner-dashboard" con template correcto
- [ ] Verificar que las páginas estén publicadas

### Fase 3: Shopify Flow (Opcional pero recomendado)
- [ ] Configurar workflow para aplicar tags automáticamente
- [ ] Configurar email de bienvenida

### Fase 4: Testing
- [ ] Probar formulario completo
- [ ] Verificar que metafields se guarden
- [ ] Verificar que tags se apliquen
- [ ] Verificar dashboard muestra datos correctos

---

## 🔧 CONFIGURACIÓN PASO A PASO

### PASO 1: CREAR CUSTOMER METAFIELDS

#### 1.1 Ir a Settings → Custom Data → Customers

1. En Shopify Admin, ve a **Settings** (Configuración)
2. En el menú lateral, haz clic en **Custom Data**
3. Selecciona **Customers**

#### 1.2 Crear Metafields de Partner Info

Haz clic en **"Add definition"** y crea los siguientes metafields:

**Metafield 1: Company Legal Name**
- **Name:** Company Legal Name
- **Namespace and key:** `custom.company_legal_name`
- **Type:** Single line text
- **Description:** Legal name of the partner company
- **Validation:** Required
- **Save**

**Metafield 2: EIN**
- **Name:** EIN
- **Namespace and key:** `custom.ein`
- **Type:** Single line text
- **Description:** Employer Identification Number
- **Validation:** Required
- **Save**

**Metafield 3: Address**
- **Name:** Address
- **Namespace and key:** `custom.address`
- **Type:** Multi-line text
- **Description:** Company address
- **Validation:** Required
- **Save**

**Metafield 4: Phone**
- **Name:** Phone
- **Namespace and key:** `custom.phone`
- **Type:** Single line text
- **Description:** Company phone number
- **Validation:** Required
- **Save**

**Metafield 5: Contact Name**
- **Name:** Contact Name
- **Namespace and key:** `custom.contact_name`
- **Type:** Single line text
- **Description:** Main contact person name
- **Validation:** Required
- **Save**

#### 1.3 Crear Metafield de Signature

**Metafield 6: Signature Data**
- **Name:** Signature Data
- **Namespace and key:** `custom.signature_data`
- **Type:** JSON
- **Description:** Digital signature information (name, title, date, IP, timestamp)
- **Save**

#### 1.4 Crear Metafield de Agreements

**Metafield 7: Agreements Accepted**
- **Name:** Agreements Accepted
- **Namespace and key:** `custom.agreements_accepted`
- **Type:** JSON
- **Description:** Records which agreements were accepted and when
- **Save**

---

### PASO 2: CREAR PÁGINAS EN SHOPIFY

#### 2.1 Crear Página "Partner Signup"

1. Ve a **Online Store → Pages**
2. Haz clic en **"Add page"**
3. Configura:
   - **Title:** "Become a Partner" o "Partner Signup"
   - **Content:** Puede estar vacío (el template maneja todo)
   - **Template:** Selecciona `page.partner-signup`
   - **Search engine listing:**
     - **Page title:** "Become a Partner - Love Brands"
     - **Description:** "Join Love Brands as a wholesale partner"
   - **Handle:** `partner-signup` (IMPORTANTE - debe ser exacto)
   - **Visibility:** Visible
4. **Save**

#### 2.2 Crear Página "Partner Dashboard"

1. Ve a **Online Store → Pages**
2. Haz clic en **"Add page"**
3. Configura:
   - **Title:** "Partner Dashboard"
   - **Content:** Puede estar vacío
   - **Template:** Selecciona `page.partner-dashboard`
   - **Search engine listing:**
     - **Page title:** "Partner Dashboard - Love Brands"
     - **Description:** "Manage your Love Brands partnership"
   - **Handle:** `partner-dashboard` (IMPORTANTE - debe ser exacto)
   - **Visibility:** Visible (pero solo accesible para partners)
4. **Save**

---

### PASO 3: CONFIGURAR SHOPIFY FLOW (OPCIONAL)

Shopify Flow permite automatizar acciones cuando se crea un customer con ciertos tags.

#### 3.1 Crear Workflow de Partner Signup

1. Ve a **Apps → Shopify Flow** (o instala la app si no la tienes)
2. Haz clic en **"Create workflow"**
3. Configura:

**Trigger:**
- **Event:** Customer created or updated
- **Condition:** Customer tags contain "partner-pending-approval"

**Actions:**
1. **Send email:**
   - **To:** Customer email
   - **Subject:** "Welcome to Love Brands Partnership!"
   - **Body:** (Personaliza el mensaje)
   
2. **Add customer tag:**
   - **Tag:** "partner-welcome-sent"

**Save workflow**

#### 3.2 Crear Workflow de Partner Approval (Opcional)

**Trigger:**
- **Event:** Customer updated
- **Condition:** Customer tags contain "partner-approved"

**Actions:**
1. **Send email:** "Your partnership has been approved!"
2. **Remove tag:** "partner-pending-approval"
3. **Add tag:** "wholesale-partner"

---

### PASO 4: CONFIGURAR SHOPIFY FORMS + FLOW (IMPLEMENTADO)

**✅ IMPLEMENTADO:** El código ahora usa Shopify Forms (`{% form 'contact' %}`) correctamente.

#### Cómo Funciona

1. **El formulario se envía a `/contact`** - Endpoint nativo de Shopify
2. **Shopify Flow captura el submission** - Automáticamente
3. **Workflow procesa los datos** - Crea customer y guarda metafields

#### Configuración de Shopify Flow

**Workflow 1: Partner Signup Processing**

1. Ve a **Apps → Shopify Flow**
2. Haz clic en **"Create workflow"**
3. Configura:

**Trigger:**
- **Event:** Form submission
- **Condition:** Form type equals "partner_signup"

**Actions (en orden):**

1. **Create customer:**
   - **Email:** `{{ form.email }}`
   - **First name:** `{{ form.contact_name }}` (primer nombre)
   - **Last name:** `{{ form.contact_name }}` (apellido)
   - **Phone:** `{{ form.phone }}`
   - **Tags:** `wholesale,partner,partner-pending-approval`
   - **Note:** `Partner Application - {{ form.company_legal_name }}`

2. **Update customer metafield:**
   - **Customer:** El customer creado en el paso anterior
   - **Namespace:** `custom`
   - **Key:** `company_legal_name`
   - **Value:** `{{ form.company_legal_name }}`

3. **Update customer metafield:**
   - **Key:** `ein`
   - **Value:** `{{ form.ein }}`

4. **Update customer metafield:**
   - **Key:** `address`
   - **Value:** `{{ form.address }}`

5. **Update customer metafield:**
   - **Key:** `phone`
   - **Value:** `{{ form.phone }}`

6. **Update customer metafield:**
   - **Key:** `contact_name`
   - **Value:** `{{ form.contact_name }}`

7. **Update customer metafield:**
   - **Key:** `signature_data`
   - **Value:** `{{ form.signature_data }}` (JSON string)

8. **Update customer metafield:**
   - **Key:** `agreements_accepted`
   - **Value:** `{{ form.agreements_accepted }}` (JSON string)

9. **Send email:**
   - **To:** `{{ form.email }}`
   - **Subject:** "Welcome to Love Brands Partnership!"
   - **Body:** (Personaliza el mensaje)

**Save workflow**

#### Notas Importantes

- El formulario envía todos los datos como campos `contact[field_name]`
- Shopify Flow puede acceder a estos campos usando `{{ form.field_name }}`
- Los campos JSON (`signature_data`, `agreements_accepted`) se envían como strings
- El workflow debe parsear los JSON strings si es necesario

---

### PASO 5: CONFIGURAR PRODUCTOS WHOLESALE

#### 5.1 Verificar Productos Master Case

1. Ve a **Products**
2. Verifica que existan:
   - "Master Case - Citrus Flower Blossom" (o similar)
   - "Master Case - Dye & Scent Free" (o similar)
3. Asegúrate de que tengan:
   - **Price:** $229.00 (o el precio wholesale)
   - **Tags:** `wholesale`, `master-case`
   - **Visibility:** Visible (pero solo para partners)

#### 5.2 Configurar Customer Groups (Opcional)

Para restringir productos a partners:

1. Ve a **Settings → Customer groups**
2. Crea grupo: "Wholesale Partners"
3. Asigna productos solo a este grupo
4. O usa tags para filtrar en el código

---

### PASO 6: CONFIGURAR EMAIL TEMPLATES

#### 6.1 Email de Bienvenida

1. Ve a **Settings → Notifications**
2. Crea nueva notificación: "Partner Welcome"
3. O usa Shopify Flow para enviar emails personalizados

**Template sugerido:**
```
Subject: Welcome to Love Brands Partnership!

Hi {{ customer.first_name }},

Thank you for becoming a Love Brands partner!

Your application has been received and is being reviewed. 
You'll receive access to your partner dashboard shortly.

Best regards,
Love Brands Team
```

---

## 🧪 TESTING CHECKLIST

### Test 1: Formulario de Signup
- [ ] Paso 1: Completar todos los campos
- [ ] Validación de email funciona
- [ ] Validación de EIN funciona (formato XX-XXXXXXX)
- [ ] Validación de teléfono funciona
- [ ] No permite avanzar sin completar campos

### Test 2: Legal Disclosures
- [ ] Los 3 agreements se muestran
- [ ] Scroll detection funciona (debe llegar al final)
- [ ] Botón "Continue" se habilita solo cuando los 3 están leídos
- [ ] Indicadores visuales muestran estado "Read"

### Test 3: Authorization
- [ ] Resumen muestra datos correctos
- [ ] Fecha se auto-completa
- [ ] Validación de firma (mínimo 3 caracteres)
- [ ] Checkbox de autorización funciona
- [ ] No permite submit sin completar todo

### Test 4: Integración Shopify
- [ ] Customer se crea correctamente
- [ ] Tags se aplican: "wholesale", "partner", "partner-pending-approval"
- [ ] Metafields se guardan correctamente
- [ ] Email de confirmación se envía

### Test 5: Dashboard
- [ ] Dashboard solo accesible para partners
- [ ] Muestra información de company desde metafields
- [ ] Muestra orders recientes
- [ ] Muestra agreements con fechas
- [ ] Links funcionan correctamente

---

## 🔍 VERIFICACIÓN DE METAFIELDS

Para verificar que los metafields se guardaron:

1. Ve a **Customers**
2. Busca el customer que se registró
3. Haz clic en el customer
4. Scroll hasta **"Metafields"**
5. Verifica que aparezcan:
   - `custom.company_legal_name`
   - `custom.ein`
   - `custom.address`
   - `custom.phone`
   - `custom.contact_name`
   - `custom.signature_data`
   - `custom.agreements_accepted`

---

## 🐛 TROUBLESHOOTING

### Los metafields no se guardan
**Causa:** No hay backend/App Proxy configurado  
**Solución:** 
1. Configurar App Proxy endpoint, O
2. Usar Shopify Forms + Flow para procesar, O
3. Crear customer manualmente y actualizar metafields después

### Los tags no se aplican
**Causa:** El código no tiene acceso a Admin API  
**Solución:** 
1. Usar App Proxy para aplicar tags, O
2. Configurar Shopify Flow para aplicar tags automáticamente

### El dashboard no muestra datos
**Causa:** Metafields no existen o tienen namespace/key incorrecto  
**Solución:** 
1. Verificar que los metafields estén creados con los nombres exactos
2. Verificar que el customer tenga los metafields guardados
3. Usar `{{ customer.metafields.custom.company_legal_name }}` en Liquid

### El formulario no avanza entre pasos
**Causa:** JavaScript no está cargado o hay errores  
**Solución:** 
1. Abrir consola del navegador (F12)
2. Verificar errores de JavaScript
3. Verificar que `partner-signup.js` esté cargado

---

## 📝 NOTAS IMPORTANTES

### Limitaciones de Shopify Customer API

**Desde el frontend (JavaScript):**
- ❌ No puedes crear customers directamente desde el navegador
- ❌ No puedes guardar metafields directamente
- ❌ No puedes aplicar tags directamente

**Soluciones:**
1. **App Proxy:** Crea un endpoint backend que use Admin API
2. **Shopify Forms:** Usa Forms API + Flow para procesar
3. **Customer Account:** Usa `{% form 'create_customer' %}` de Liquid

### Recomendación de Implementación

**Para producción, usa esta arquitectura:**

```
Frontend (JavaScript)
    ↓
App Proxy Endpoint (/apps/partner-signup)
    ↓
Shopify Admin API
    ├─ Create/Update Customer
    ├─ Save Metafields
    └─ Apply Tags
    ↓
Shopify Flow (Automation)
    ├─ Send Welcome Email
    └─ Additional Processing
```

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE CONFIGURAR

1. **Probar flujo completo:**
   - Completar signup
   - Verificar metafields
   - Verificar tags
   - Verificar email

2. **Configurar aprobación manual:**
   - Crear proceso para revisar aplicaciones
   - Cambiar tag de "partner-pending-approval" a "partner-approved"

3. **Configurar productos wholesale:**
   - Asegurar que solo partners puedan ver/comprar
   - Configurar precios wholesale

4. **Optimizar:**
   - Agregar analytics tracking
   - Mejorar emails
   - Agregar más automatizaciones

---

## 📚 REFERENCIAS

- [Shopify Customer Metafields](https://help.shopify.com/en/manual/custom-data/metafields)
- [Shopify Admin API - Customers](https://shopify.dev/docs/api/admin-graphql/latest/objects/Customer)
- [Shopify App Proxy](https://shopify.dev/docs/apps/online-store/app-proxies)
- [Shopify Flow](https://help.shopify.com/en/manual/automation/flow)

---

**Última actualización:** Enero 2026

