import HotelsClient from '@/components/hotels/HotelsClient';

export default function HotelsPage() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-background">Gestión de Hoteles</h1>
        <p className="text-on-surface-variant mt-2">Administra la red de hoteles Cénit y sus detalles operativos.</p>
      </div>
      <HotelsClient />
    </main>
  );
}
