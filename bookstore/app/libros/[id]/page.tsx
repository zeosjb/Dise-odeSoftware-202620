import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import {
  calcularPrecioFinal,
  formatoPrecio,
  obtenerDatosComerciales,
} from "@/lib/catalogo";
import { obtenerLibro, obtenerPortada } from "@/lib/open-library";

async function DetalleLibro({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let libro;
  try {
    libro = await obtenerLibro(id);
  } catch {
    return (
      <p role="alert" className="text-destructive">
        No se pudo cargar el libro.
      </p>
    );
  }

  const datos = obtenerDatosComerciales(`/works/${id}`);
  const precio = calcularPrecioFinal(datos.precio, datos.descuento);
  const portada = obtenerPortada(libro.covers?.[0], "L");
  const descripcion =
    typeof libro.description === "string"
      ? libro.description
      : libro.description?.value;

  return (
    <article className="grid gap-8 md:grid-cols-[280px_1fr]">
      <div className="flex h-96 items-center justify-center rounded-md bg-muted">
        {portada ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portada}
            alt={`Portada de ${libro.title}`}
            className="h-full max-w-full object-contain"
          />
        ) : (
          <BookOpen className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{libro.title}</h1>

        {libro.first_publish_date && (
          <p className="text-sm text-muted-foreground">
            Primera publicación: {libro.first_publish_date}
          </p>
        )}

        <p className="text-2xl font-bold">{formatoPrecio(precio)}</p>
        <Badge variant="secondary">Stock simulado: {datos.stock}</Badge>

        {descripcion && <p className="whitespace-pre-line">{descripcion}</p>}

        {libro.subjects && (
          <div className="flex flex-wrap gap-2">
            {libro.subjects.slice(0, 8).map((tema) => (
              <Badge key={tema} variant="outline">
                {tema}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function PaginaLibro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className={buttonVariants({ variant: "outline" }) + " mb-6"}>
        ← Volver al catálogo
      </Link>

      <Suspense fallback={<p role="status">Cargando libro...</p>}>
        <DetalleLibro params={params} />
      </Suspense>
    </main>
  );
}
