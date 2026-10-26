# TODO FÚTBOL · Tienda de fútbol en 3D

Tienda en línea de artículos de fútbol con productos en 3D: uniformes sublimados, camisetas, pantalonetas, medias, calentadores, balones, pupos, canilleras, guantes de arquero, material de entrenamiento y tecnología. Cada producto gira en su tarjeta y se puede ver en grande, cambiar de color y, en las camisetas, poner número y nombre en la espalda.

El carrito aplica el precio por docena desde 12 unidades del mismo producto (se pueden mezclar tallas y colores), calcula el envío y arma el pedido completo como un mensaje de WhatsApp. No hay pago con tarjeta: el pedido se confirma por WhatsApp.

TODO FÚTBOL es una tienda de ejemplo. El número de WhatsApp es de prueba (593000000000) y los precios son referenciales.

## Tecnología

- React 19, TypeScript y Vite
- three.js con React Three Fiber y drei
- Motion para las animaciones de la interfaz
- Un solo canvas para toda la página: el estadio del inicio y las 19 tarjetas se dibujan con `View` de drei, cada una en el rectángulo de su elemento
- Nada descargado: productos, estadio, cancha y texturas se generan por código

## Cómo se hacen los productos

- **Ropa, calzado y accesorios**: siluetas 2D extruidas con bordes redondeados, con estilo de ícono 3D "inflado". La tela se pinta en un canvas (rayas, franja, mitades, aros).
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
| `src/models/geometry.ts` | Siluetas, extrusión, texturas pintadas y geometría del balón |
| `src/models/Models.tsx` | Cada producto en 3D |
| `src/scene/Hero.tsx` | Estadio de noche y balón |
| `src/scene/ProductStage.tsx` | Luces y escena de cada tarjeta |
| `src/ui/` | Catálogo, ventana de producto y carrito |

## Despliegue en Cloudflare Pages

- Comando de build: `npm run build`
- Directorio de salida: `dist`
- Versión de Node: la indica `.node-version` (22)
