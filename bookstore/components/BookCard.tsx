
"use client";

import { BookOpen, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Libro,
  obtenerPortada,
} from "@/lib/open-library";

import {
  calcularPrecioFinal,
  formatoPrecio,
  obtenerDatosComerciales,
} from "@/lib/catalogo";

interface BookCardProps {
  libro: Libro;
  onAgregar: (libro: Libro) => void;
}

export default function BookCard({
  libro,
  onAgregar,
}: BookCardProps) {
  const datos = obtenerDatosComerciales(libro.key);

  const precioFinal = calcularPrecioFinal(
    datos.precio,
    datos.descuento
  );

  const portada = obtenerPortada(libro.cover_i);
  const id = libro.key.split("/").pop();

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <div className="relative flex h-56 items-center justify-center bg-muted rounded-md">
          {portada ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portada}
              alt={`Portada de ${libro.title}`}
              className="h-full max-w-full object-contain"
            />
          ) : (
            <BookOpen
              className="h-16 w-16 text-muted-foreground"
              aria-hidden="true"
            />
          )}

          {datos.descuento > 0 && (
            <Badge className="absolute right-2 top-2">
              -{datos.descuento}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <CardTitle className="line-clamp-2 text-lg">
          {libro.title}
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          {libro.author_name?.join(", ") ??
            "Autor desconocido"}
        </p>

        <p className="text-xs text-muted-foreground">
          {libro.first_publish_year ?? "Sin fecha"}
        </p>

        <div>
          {datos.descuento > 0 && (
            <p className="text-sm text-muted-foreground line-through">
              {formatoPrecio(datos.precio)}
            </p>
          )}

          <p className="text-xl font-bold">
            {formatoPrecio(precioFinal)}
          </p>
        </div>

        <Badge variant="secondary">
          Stock simulado: {datos.stock}
        </Badge>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() => onAgregar(libro)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>

        <Link
          href={`/libros/${id}`}
          className={buttonVariants({ variant: "outline", className: "w-full" })}
        >
          Ver detalles
        </Link>
      </CardFooter>
    </Card>
  );
}
