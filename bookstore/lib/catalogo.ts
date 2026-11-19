
/**
 * lib/catalogo.ts
 *
 * Información comercial simulada para LibroStore.
 * Open Library no proporciona precios ni stock.
 */

export interface DatosComerciales {
  precio: number;
  stock: number;
  descuento: number;
  moneda: "CLP";
}

/**
 * Genera información comercial estable
 * a partir del identificador de Open Library.
 *
 * El mismo libro siempre obtiene el mismo
 * precio, stock y descuento.
 */
export function obtenerDatosComerciales(
  id: string
): DatosComerciales {
  let semilla = 0;

  for (const caracter of id) {
    semilla =
      (semilla * 31 + caracter.charCodeAt(0)) >>> 0;
  }

  return {
    precio: 7990 + (semilla % 15) * 1000,
    stock: 1 + (semilla % 20),
    descuento: semilla % 4 === 0 ? 10 : 0,
    moneda: "CLP",
  };
}

/**
 * Calcula el precio aplicando un descuento.
 *
 * Ejemplo:
 * precio = 10000
 * descuento = 10
 * resultado = 9000
 */
export function calcularPrecioFinal(
  precio: number,
  descuento: number
): number {
  return Math.round(
    precio * (1 - descuento / 100)
  );
}

/**
 * Formatea un precio en pesos chilenos.
 *
 * Ejemplo:
 * formatoPrecio(12990) => "$12.990"
 */
export function formatoPrecio(
  precio: number
): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(precio);
}
