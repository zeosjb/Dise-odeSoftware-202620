
const API_URL = "https://openlibrary.org";

export interface Libro {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

interface RespuestaLibros {
  docs: Libro[];
  numFound?: number;
  num_found?: number;
}

export interface DetalleLibro {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
}

export async function buscarLibros(
  busqueda: string,
  limite = 20
): Promise<Libro[]> {
  const params = new URLSearchParams({
    q: busqueda,
    limit: String(limite),
    fields:
      "key,title,author_name,first_publish_year,cover_i,edition_count",
  });

  const respuesta = await fetch(
    `${API_URL}/search.json?${params}`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los libros");
  }

  const datos: RespuestaLibros = await respuesta.json();

  return datos.docs ?? [];
}

export async function obtenerLibro(
  id: string
): Promise<DetalleLibro> {
  if (!/^OL\d+W$/.test(id)) {
    throw new Error("Identificador de libro inválido");
  }

  const respuesta = await fetch(
    `${API_URL}/works/${id}.json`,
    { next: { revalidate: 3600 } }
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el libro");
  }

  return respuesta.json();
}

export function obtenerPortada(
  id?: number,
  tamaño: "S" | "M" | "L" = "M"
) {
  if (!id) return null;

  return `https://covers.openlibrary.org/b/id/${id}-${tamaño}.jpg`;
}
