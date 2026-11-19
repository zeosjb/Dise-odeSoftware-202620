# LibroStore

Una tienda de libros en la web. Busca libros, mira sus detalles y agrégalos a un carrito. Los datos de los libros vienen de una API gratuita llamada **Open Library**.

Esta guía te lleva de la mano, paso a paso, desde cero hasta ver los libros en tu pantalla.

---

## Paso 1: Instala lo necesario

Necesitas dos programas:

1. **Node.js** (versión 20 o superior). Descárgalo desde <https://nodejs.org> y elige la versión "LTS". Instálalo dejando todas las opciones por defecto.
2. **Visual Studio Code** (el editor donde escribirás el código). Descárgalo desde <https://code.visualstudio.com>.

Para comprobar que Node quedó instalado, abre una **terminal** (en Windows: busca "PowerShell"; en Mac: busca "Terminal") y escribe:

```bash
node --version
```

Si aparece un número como `v20.11.0`, todo está bien.

## Paso 2: Crea el proyecto

En la terminal, ve a la carpeta donde quieres guardar tu trabajo y escribe:

```bash
npx create-next-app@latest bookstore
```

Te hará algunas preguntas. Responde con Enter para aceptar lo que aparece por defecto (usa TypeScript, Tailwind y App Router).

Cuando termine, entra a la carpeta del proyecto y ábrela en VS Code:

```bash
cd bookstore
code .
```

## Paso 3: Instala los componentes de diseño

Este proyecto usa **shadcn/ui**, una colección de botones, tarjetas y paneles ya diseñados. En la terminal, dentro de la carpeta `bookstore`:

```bash
npx shadcn@latest init
```

Acepta las opciones por defecto. Luego agrega los componentes que usamos:

```bash
npx shadcn@latest add button card input badge separator sheet
```

Instala también los íconos:

```bash
npm install lucide-react
```

## Paso 4: Conoce las carpetas

```
bookstore/
├── app/
│   ├── layout.tsx          → Estructura general de todas las páginas
│   ├── page.tsx            → La página principal (catálogo y carrito)
│   └── libros/[id]/page.tsx → La página con el detalle de un libro
├── components/
│   └── BookCard.tsx        → La tarjeta de cada libro
└── lib/
    ├── open-library.ts     → Aquí hablamos con la API
    └── catalogo.ts         → Precios y stock inventados (la API no los da)
```

## Paso 5: ¿Qué es una API?

Una **API** es una dirección de internet que, en vez de mostrar una página bonita, te entrega **datos**. Es como pedirle información a un bibliotecario: tú preguntas, él responde.

Open Library tiene una API para buscar libros. Pruébala tú mismo: copia esta dirección en tu navegador.

```
https://openlibrary.org/search.json?q=don+quijote&limit=3
```

Verás texto con llaves `{ }` y listas `[ ]`. Eso se llama **JSON**: son los datos de los libros (título, autor, año…).

## Paso 6: Consumir la API en el código

"Consumir" una API significa pedirle datos desde tu programa. Esto lo hace el archivo `lib/open-library.ts`. La idea es esta:

```ts
const respuesta = await fetch(
  "https://openlibrary.org/search.json?q=classics&limit=20"
);
const datos = await respuesta.json();
console.log(datos.docs); // la lista de libros
```

Paso a paso:

1. `fetch(...)` envía la pregunta a la dirección.
2. `await` significa "espera a que llegue la respuesta".
3. `respuesta.json()` convierte la respuesta en datos que JavaScript entiende.
4. `datos.docs` es la lista de libros.

En el proyecto esto está dentro de una función llamada `buscarLibros(texto, limite)`, que puedes llamar así:

```ts
const libros = await buscarLibros("harry potter", 10);
```

Para el detalle de un libro se usa `obtenerLibro(id)`, y para su imagen `obtenerPortada(numero)`.

## Paso 7: Mostrar los libros en pantalla

En `app/page.tsx` pasan estas cosas, en orden:

1. Al abrir la página se llama a `buscarLibros("classics")`.
2. Mientras llega la respuesta se muestra "Cargando libros...".
3. Cuando llegan, se guardan en una variable (`libros`) con `useState`.
4. Por cada libro se dibuja una tarjeta (`BookCard`).
5. Si algo falla (por ejemplo, sin internet) se muestra un mensaje de error.

Cuando escribes algo en el buscador y presionas **Buscar**, se repite el proceso con tu texto.

## Paso 8: El carrito

- **Agregar al carrito** guarda el libro en una lista.
- Dentro del carrito puedes subir, bajar la cantidad o eliminar.
- El carrito se guarda en tu navegador (`localStorage`), así que si recargas la página no se pierde.
- **Simular compra** solo muestra un aviso. No se cobra nada de verdad.

Los precios y el stock son inventados por el programa (`lib/catalogo.ts`) porque Open Library no tiene precios.

## Paso 9: Ejecuta el proyecto

En la terminal, dentro de la carpeta `bookstore`:

```bash
npm install
npm run dev
```

Abre <http://localhost:3000> en tu navegador. Deberías ver LibroStore con sus libros.

Para detenerlo, presiona `Ctrl + C` en la terminal.

## Paso 10: Si algo sale mal

| Problema | Qué hacer |
| --- | --- |
| `npm` no se reconoce | Cierra y vuelve a abrir la terminal; si sigue, reinstala Node.js |
| "No fue posible consultar los libros" | Revisa tu conexión a internet y recarga |
| El puerto 3000 está ocupado | Cierra otras terminales con `npm run dev` abiertas |
| Errores raros después de cambiar cosas | Detén el programa, ejecuta `npm install` y vuelve a `npm run dev` |

Para revisar que el código no tenga errores:

```bash
npm run lint
npm run build
```

---

Datos bibliográficos de [Open Library](https://openlibrary.org). Precios y compras simulados con fines educativos.
