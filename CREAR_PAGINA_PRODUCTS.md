# Cómo Crear la Página de Productos en Shopify

## Problema
Cuando intentas acceder a `/pages/products`, Shopify muestra "The page you were looking for does not exist" porque la página aún no ha sido creada en el admin de Shopify.

## Solución: Crear la Página en Shopify Admin

### Pasos:

1. **Accede al Admin de Shopify**
   - Ve a tu tienda Shopify
   - Inicia sesión en el admin

2. **Navega a Online Store > Pages**
   - En el menú lateral, ve a **Online Store**
   - Haz clic en **Pages**

3. **Crea una Nueva Página**
   - Haz clic en el botón **"Add page"** o **"Add"**

4. **Configura la Página:**
   - **Title**: "Products" (o "Shop Products")
   - **Content**: Puedes dejar esto vacío o agregar un texto breve (el template maneja todo el contenido)
   - **Search engine listing preview**: 
     - **Page title**: "Shop Love Paks - Wellness Laundry Detergent"
     - **Description**: "Shop our wellness laundry detergent products infused with rose quartz microcrystals"

5. **IMPORTANTE - Configurar el Template:**
   - En la sección **"Template"** (generalmente en la parte inferior o en el menú lateral)
   - Selecciona: **`page.products`**
   - Esto es CRÍTICO - sin esto, la página no usará nuestro template personalizado

6. **Configurar el Handle:**
   - En **"Search engine listing"** o en la configuración avanzada
   - Asegúrate de que el **Handle** sea exactamente: **`products`**
   - El handle es lo que determina la URL: `/pages/products`

7. **Guardar y Publicar:**
   - Haz clic en **"Save"**
   - Asegúrate de que la página esté **"Published"** (publicada)
   - La visibilidad debe estar en **"Visible"**

8. **Verificar:**
   - Ve a tu tienda y navega a `/pages/products`
   - Deberías ver la página de productos con los dos productos (Citrus Flower Blossom y Dye & Scent Free)

## Notas Importantes:

- **Handle**: Debe ser exactamente `products` (en minúsculas, sin espacios)
- **Template**: Debe ser `page.products` (esto hace que Shopify use nuestro template `page.products.liquid`)
- **URL**: La página será accesible en `tutienda.myshopify.com/pages/products`

## Si No Ves la Opción del Template:

Si no ves la opción para seleccionar el template `page.products`:

1. Asegúrate de que el archivo `templates/page.products.liquid` esté subido al tema
2. Verifica que el tema esté activo
3. Intenta refrescar la página del admin
4. Si usas Shopify CLI, ejecuta `shopify theme push` para subir los cambios

## Verificación Final:

Una vez creada la página, todos estos enlaces deberían funcionar:
- Botón "Shop" en el hero → `/pages/products`
- Botones "Shop Now" en la sección de productos → `/pages/products`
- Botón "Shop" en el header → `/pages/products`
- Botón "Shop" en el CTA → `/pages/products`

