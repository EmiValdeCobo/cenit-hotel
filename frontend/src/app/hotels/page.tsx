import HotelsClient from '@/components/hotels/HotelsClient';

export default function HotelsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-background">Gesti�n de Hoteles</h1>
        <p className="text-on-surface-variant mt-2">Administra la red de hoteles C�nit y sus detalles operativos.</p>
      </div>
      <HotelsClient />
    </div>
  );
}
