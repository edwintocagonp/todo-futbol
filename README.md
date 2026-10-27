# TODO FÚTBOL · Tienda de fútbol

Tienda en línea de artículos de fútbol: uniformes sublimados, camisetas, pantalonetas, medias, calentadores, balones, pupos, canilleras, guantes de arquero, material de entrenamiento y tecnología. Cada producto tiene su foto y se puede ver en grande y elegir la talla. En uniformes, camisetas, pantalonetas y petos cada diseño o color tiene su propia foto. En las camisetas se pone el número y el nombre de la espalda. El inicio es un estadio en 3D donde se patea el balón al arco.

El carrito aplica el precio por docena desde 12 unidades del mismo producto (se pueden mezclar tallas), calcula el envío y arma el pedido completo como un mensaje de WhatsApp. No hay pago con tarjeta: el pedido se confirma por WhatsApp.

TODO FÚTBOL es una tienda de ejemplo. El número de WhatsApp es de prueba (593000000000) y los precios son referenciales.

## Tecnología

- React 19, TypeScript y Vite
- three.js con React Three Fiber y drei
- Motion para las animaciones de la interfaz
- Fotos de productos gratuitas de Unsplash, Pexels y Pixabay, recortadas a 5:4 y en WebP de 600 y 1200 px (ver `CREDITS.md`)
- El estadio, la cancha y el balón se generan por código

## Cómo se hace el estadio

- **Balón**: los 12 pentágonos y 20 hexágonos salen del icosaedro. Cada punto de la esfera toma el color del centro más cercano, y en los bordes la superficie se hunde para marcar las costuras.
- **Estadio**: cancha con franjas de corte y líneas a escala real, arco con red, reflectores y polvo en el aire. Al tocar la cancha, el balón sale disparado al arco.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # revisa los tipos y genera dist/
npm run preview  # sirve dist/
```

## Estructura

| Archivo | Contenido |
|---|---|
| `src/content.ts` | Productos, precios unitarios y por docena, colores, tallas y entregas |
| `src/cart.ts` | Carrito guardado en el navegador, precio por docena, totales y mensaje de WhatsApp |
| `src/models/geometry.ts` | Geometría del balón y textura de la red |
| `src/scene/Hero.tsx` | Estadio de noche y balón |
| `src/scene/Ball.tsx` | Balón y sombra |
| `public/productos/` | Fotos de los productos |
| `src/ui/` | Catálogo, ventana de producto y carrito |

## Despliegue en Cloudflare Pages

- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Versión de Node: la indica `.node-version` (22)
