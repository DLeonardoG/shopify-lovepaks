# Cómo hacer que Shopify y Appstle manejen la página de producto

Tu tema ya tiene una página de producto simple (solo Shopify). Para que el widget de **Appstle Subscriptions** (y/o Bundles) aparezca, haz lo siguiente en este orden.

---

## 1. App Embeds (lo primero)

1. En **Shopify Admin** ve a **Online Store → Themes**.
2. En tu tema activo, haz clic en **Customize** (Personalizar).
3. En el editor, abajo a la izquierda: **App embeds** (o **Incrustaciones de apps**).
4. Activa **Appstle Subscriptions** (y si usas bundles, **Appstle Bundles**).
5. **Guardar**.

En temas estándar esto suele bastar para que el widget se inyecte en la página de producto.

- Guía Appstle (draft theme): [How to install Appstle Subscriptions on a draft theme](https://intercom.help/appstle/en/articles/8070523-how-to-install-appstle-subscriptions-on-a-draft-theme)
- Instalación en tema no publicado: [Install on dev/unpublished theme](https://intercom.help/appstle/en/articles/4978590-how-to-install-appstle-subscriptions-on-your-shopify-dev-unpublished-theme)

---

## 2. Planes de suscripción en Appstle

Si no hay planes creados, el widget no se muestra.

1. En **Shopify Admin** entra a la app **Appstle Subscriptions**.
2. Crea al menos un **plan de suscripción** (ej. “Subscribe & Save 15%”, entrega cada 1–3 meses).
3. Asigna el producto **Love Paks | Dye & Scent Free** (y los que quieras) a ese plan.
4. Guarda y publica.

Sin esto, aunque el embed esté activo, no verás opciones de suscripción.

---

## 3. Si con App Embeds no aparece (tema personalizado)

En temas **custom** a veces la app no encuentra dónde inyectar. Entonces hay que instalar manualmente los archivos de Appstle en tu tema:

1. **Tema con Appstle ya funcionando**  
   Usa un tema donde el widget de Appstle **sí** se vea (por ejemplo el que tenías antes o un duplicado de Dawn con Appstle instalado).

2. **Editar código de ese tema**  
   En ese tema: **Edit code**.

3. **Copiar archivos de Appstle**  
   - En el buscador de archivos, busca **“Appstle”**.  
   - Copia **todos** los archivos/snippets y assets de Appstle.  
   - Pega en tu tema actual (el que usas en lovepaks) **misma estructura** (Snippets → Snippets, Assets → Assets).

4. **Incluir el helper en tu tema**  
   En tu tema actual, en **layout/theme.liquid**, justo después de `<body ...>` añade:

   ```liquid
   {% include 'appstle-subscription-helper' %}
   ```

5. En el tema actual: **App embeds** → activar **Appstle Subscriptions** (y Bundles si aplica).  
6. Guardar y revisar una página de producto.

Documentación oficial de este proceso:  
[How to install Appstle Subscriptions on your Shopify dev/unpublished theme](https://intercom.help/appstle/en/articles/4978590-how-to-install-appstle-subscriptions-on-your-shopify-dev-unpublished-theme)

---

## 4. Si el producto solo permite suscripción ("Variant can only be purchased with a selling plan")

Si al añadir al carrito sin elegir frecuencia sale el error **"Variant can only be purchased with a selling plan"**, ese producto está configurado como **solo suscripción**. Para permitir también **compra única** (one-time):

1. Entra en **Appstle Subscriptions** (desde Shopify Admin).
2. En la configuración del producto o del plan, busca la opción que permita **"One-time purchase"** o **"Allow one-time purchase"** además de la suscripción.
3. Actívala y guarda.

Así el cliente podrá elegir: **comprar una vez** o **suscribirse**. En el tema, cuando intenten añadir sin plan, se muestra un mensaje claro y se hace scroll a la zona de suscripción para que elijan una frecuencia.

---

## 5. Videos y recursos útiles

- **Appstle (Shopify App Store)**  
  [Subscriptions by Appstle](https://apps.shopify.com/subscriptions-by-appstle) – descripción, capturas y enlaces al soporte.

- **Centro de ayuda Appstle**  
  [Appstle Help Center](https://intercom.help/appstle/en/collections/2776373-subscriptions) – guías de instalación, widget y configuración.

- **Shopify – Ediciones 2024 (suscripciones)**  
  [How To Use The New Shopify Subscriptions App - Shopify Editions 2024](https://www.youtube.com/watch?v=9Wb1mOt1TEQ) – contexto de suscripciones en Shopify (no es solo Appstle, pero ayuda a entender el flujo).

- **Appstle – Build a Box**  
  [Appstle Subscriptions - Build a Box](https://www.youtube.com/watch?v=4ow4fxnh1pA) – ejemplo de uso de Appstle.

En el centro de ayuda de Appstle suele haber también videos o GIFs de instalación; entra desde la app o desde el enlace de la app en la App Store.

---

## 6. Resumen rápido

| Qué quieres | Qué hacer |
|-------------|-----------|
| Que Shopify “maneje” la página | Tu plantilla `product.liquid` ya es solo Shopify (galería, precio, variantes, add to cart). No hace falta cambiar nada más para “dejarlo en manos de Shopify”. |
| Que se vea el widget de Appstle | 1) App embeds activados. 2) Planes de suscripción creados y producto asignado. 3) Si no aparece, instalar manualmente (copiar archivos Appstle + `{% include 'appstle-subscription-helper' %}` en `theme.liquid`). |
| Ver pasos en video | Appstle Help Center + página de la app en Shopify; opcional: video de Shopify Editions 2024 (suscripciones) y “Appstle Build a Box” en YouTube. |

Si después de seguir esto el widget sigue sin salir, lo más útil es escribir a **soporte de Appstle** (desde la app o desde su web) y decirles: “Uso un tema custom; tengo App embeds activados y planes creados, pero el widget no se muestra en la página de producto.” Ellos pueden indicarte el ID/clase exacto que usa su script en tu tema.
