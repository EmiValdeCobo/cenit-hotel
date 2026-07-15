"use client";

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 bg-background">
      <div className="p-4 bg-error-container/20 rounded-full border border-error/20">
        <span className="material-symbols-outlined text-error text-5xl">warning</span>
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-bold text-on-background">Conexi�n de API fallida</h3>
        <p className="text-sm text-outline">
          No pudimos conectar con el backend de C�nit o la validaci�n de datos fall�. Verifica que el servidor FastAPI est� encendido en el puerto 8000.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-primary-container text-on-primary-container font-semibold rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">refresh</span> Reintentar Conexi�n
      </button>
    </main>
  );
}
