# Error: "Filename product already exists with liquid extension"

Este error aparece porque **en el tema de Shopify** (el que estás subiendo/actualizando) sigue existiendo `templates/product.liquid`. En Shopify no puede haber dos plantillas con el mismo nombre: no puede existir a la vez `product.liquid` y `product.json`.

## Qué hacer antes de subir el tema

**Borrar `product.liquid` del tema en Shopify** (solo una vez):

1. Entra en **Shopify Admin** → **Online Store** → **Themes**.
2. En el tema al que subes los archivos (el que editas con "Edit code"), haz clic en **Actions** → **Edit code**.
3. En la columna izquierda, abre **Templates**.
4. Localiza **product.liquid** y bórralo (icono de papelera o menú → Delete).
5. Guarda si hace falta.

Después de eso, vuelve a subir el tema (push o zip). El tema en tu repo solo tiene `product.json`; una vez eliminado `product.liquid` en Shopify, el conflicto desaparece y la página de producto usará la plantilla JSON (sección `main-product` y apps).

## Resumen

- **En tu repo:** solo existe `templates/product.json` (correcto).
- **En Shopify:** debe existir solo una plantilla "product". Si ahí sigue `product.liquid`, hay que borrarla; la plantilla que debe quedar es la que usa el tema actual: `product.json`.
