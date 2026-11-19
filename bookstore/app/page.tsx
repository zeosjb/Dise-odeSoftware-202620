
"use client";

import { BookOpen, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import BookCard from "@/components/BookCard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  buscarLibros,
  Libro,
} from "@/lib/open-library";

import {
  calcularPrecioFinal,
  formatoPrecio,
  obtenerDatosComerciales,
} from "@/lib/catalogo";

interface ItemCarrito {
  libro: Libro;
  cantidad: number;
}

export default function Home() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [carritoCargado, setCarritoCargado] = useState(false);

  // Recuperar carrito local (solo se puede leer localStorage en el navegador,
  // por eso se hace después del primer render y no en useState).
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("librostore-carrito");

      if (guardado) {
        const datos = JSON.parse(guardado);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(datos)) setCarrito(datos);
      }
    } catch {
      localStorage.removeItem("librostore-carrito");
    }

    setCarritoCargado(true);
  }, []);

  // Guardar carrito cuando cambie
  useEffect(() => {
    if (!carritoCargado) return;

    localStorage.setItem(
      "librostore-carrito",
      JSON.stringify(carrito)
    );
  }, [carrito, carritoCargado]);

  async function cargarLibros(consulta: string) {
    setCargando(true);
    setError("");

    try {
      const resultados = await buscarLibros(consulta, 20);
      setLibros(resultados);
    } catch {
      setError("No fue posible consultar los libros.");
    } finally {
      setCargando(false);
    }
  }

  // Carga inicial: "cargando" ya empieza en true, así que solo consultamos la API.
  useEffect(() => {
    buscarLibros("classics", 20)
      .then(setLibros)
      .catch(() => setError("No fue posible consultar los libros."))
      .finally(() => setCargando(false));
  }, []);

  function agregarCarrito(libro: Libro) {
    const stock = obtenerDatosComerciales(libro.key).stock;

    setCarrito((actual) => {
      const encontrado = actual.find(
        (item) => item.libro.key === libro.key
      );

      if (encontrado) {
        return actual.map((item) =>
          item.libro.key === libro.key
            ? {
                ...item,
                cantidad: Math.min(
                  item.cantidad + 1,
                  stock
                ),
              }
            : item
        );
      }

      return [...actual, { libro, cantidad: 1 }];
    });
  }

  function eliminarCarrito(id: string) {
    setCarrito((actual) =>
      actual.filter((item) => item.libro.key !== id)
    );
  }

  function cambiarCantidad(id: string, cambio: number) {
    setCarrito((actual) =>
      actual.map((item) => {
        if (item.libro.key !== id) return item;

        const stock = obtenerDatosComerciales(id).stock;

        return {
          ...item,
          cantidad: Math.max(
            1,
            Math.min(stock, item.cantidad + cambio)
          ),
        };
      })
    );
  }

  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const total = carrito.reduce((suma, item) => {
    const datos = obtenerDatosComerciales(item.libro.key);

    const precio = calcularPrecioFinal(
      datos.precio,
      datos.descuento
    );

    return suma + precio * item.cantidad;
  }, 0);

  return (
    <main className="mx-auto max-w-7xl p-6">
      {/* Encabezado */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8" />

          <h1 className="text-3xl font-bold">
            LibroStore
          </h1>
        </div>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Carrito
            <Badge className="ml-2">{cantidadTotal}</Badge>
          </SheetTrigger>

          <SheetContent className="flex flex-col">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Mi carrito</SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              {carrito.length === 0 ? (
                <p className="text-muted-foreground">
                  Tu carrito está vacío.
                </p>
              ) : (
                carrito.map((item) => {
                  const datos = obtenerDatosComerciales(
                    item.libro.key
                  );

                  const precio = calcularPrecioFinal(
                    datos.precio,
                    datos.descuento
                  );

                  return (
                    <div key={item.libro.key} className="space-y-2">
                      <p className="font-medium">
                        {item.libro.title}
                      </p>

                      <p className="text-sm">
                        {formatoPrecio(precio)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            cambiarCantidad(item.libro.key, -1)
                          }
                        >
                          -
                        </Button>

                        <span>{item.cantidad}</span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            cambiarCantidad(item.libro.key, 1)
                          }
                        >
                          +
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            eliminarCarrito(item.libro.key)
                          }
                        >
                          Eliminar
                        </Button>
                      </div>

                      <Separator />
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t p-4">
              <div className="mb-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatoPrecio(total)}</span>
              </div>

              <Button
                className="w-full"
                disabled={carrito.length === 0}
                onClick={() =>
                  alert("Compra simulada: " + formatoPrecio(total))
                }
              >
                Simular compra
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Buscador */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          Descubre tu próximo libro
        </h2>

        <form
          className="flex gap-2"
          onSubmit={(evento) => {
            evento.preventDefault();

            if (busqueda.trim()) {
              cargarLibros(busqueda.trim());
            }
          }}
        >
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, autor o categoría..."
          />

          <Button type="submit" disabled={cargando}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </form>
      </section>

      {/* Catálogo */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          Catálogo de libros
        </h2>

        {cargando && (
          <p role="status">Cargando libros...</p>
        )}

        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}

        {!cargando && !error && libros.length === 0 && (
          <p>No se encontraron libros.</p>
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {libros.map((libro) => (
              <BookCard
                key={libro.key}
                libro={libro}
                onAgregar={agregarCarrito}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        Datos bibliográficos de Open Library.
        Precios y compras simulados con fines educativos.
      </footer>
    </main>
  );
}