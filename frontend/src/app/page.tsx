import { z } from 'zod';
import { DatosGeneralesHotelResponseSchema, DiasRestantesReservacionResponseSchema } from '@/lib/schemas';

async function getDashboardData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [hotelsRes, resvRes] = await Promise.all([
    fetch(`${apiBase}/api/hoteles/datos-generales`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/reservaciones/dias-restantes`, { cache: 'no-store' })
  ]);

  if (!hotelsRes.ok || !resvRes.ok) throw new Error('Error al obtener datos del Dashboard');

  const hotelsJson = await hotelsRes.json();
  const resvJson = await resvRes.json();

  return {
    hotels: z.array(DatosGeneralesHotelResponseSchema).parse(hotelsJson),
    reservations: z.array(DiasRestantesReservacionResponseSchema).parse(resvJson)
  };
}

export default async function Dashboard() {
  const { hotels, reservations } = await getDashboardData();

  const totalOccupied = hotels.reduce((sum, h) => sum + h.habitaciones_ocupadas, 0);
  const totalRooms = hotels.reduce((sum, h) => sum + h.habitaciones_totales, 0);
  const totalMaintenance = hotels.reduce((sum, h) => sum + h.habitaciones_mantenimiento, 0);
  const totalAvailable = hotels.reduce((sum, h) => sum + h.habitaciones_disponibles, 0);
  const averageIncome = hotels.reduce((sum, h) => sum + h.ganancia_promedio_mensual, 0);

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Dashboard Overview</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Instant�nea del estado del hotel en tiempo real</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[40px] overflow-hidden">
        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-ambient-hover hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/20 rounded-xl">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bed</span>
            </div>
          </div>
          <p className="font-label-md text-label-md text-outline uppercase tracking-wider mb-1">Habitaciones Ocupadas</p>
          <h3 className="font-headline-xl text-headline-xl text-on-background">{totalOccupied}<span className="font-headline-md text-outline">/{totalRooms}</span></h3>
        </div>
        
        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-ambient-hover hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/20 rounded-xl">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
          </div>
          <p className="font-label-md text-label-md text-outline uppercase tracking-wider mb-1">Ganancias Promedio Mensuales</p>
          <h3 className="font-headline-xl text-on-background text-3xl">${averageIncome.toLocaleString()}<span className="font-headline-md text-outline">.00</span></h3>
        </div>
        
        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-ambient-hover hover:-translate-y-1 duration-300 border-l-secondary border-t">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container/10 rounded-xl">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>meeting_room</span>
            </div>
          </div>
          <p className="font-label-md text-label-md text-outline uppercase tracking-wider mb-1">Habitaciones Disponibles</p>
          <h3 className="font-headline-xl text-headline-xl text-on-background">{totalAvailable}</h3>
        </div>
        
        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-ambient-hover hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant rounded-xl">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>construction</span>
            </div>
          </div>
          <p className="font-label-md text-label-md text-outline uppercase tracking-wider mb-1">En Mantenimiento</p>
          <h3 className="font-headline-xl text-headline-xl text-on-background">{totalMaintenance}</h3>
        </div>
      </div>
      
      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] overflow-hidden">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-background">Detalles del Complejo</h3>
          </div>
          <div className="space-y-4">
            {hotels.map(h => (
              <div key={h.id_hotel} className="border-b border-surface-variant/40 pb-4">
                <h4 className="font-bold text-on-background">{h.nombre_hotel}</h4>
                <p className="text-xs text-outline mb-2">{h.direccion}</p>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <div className="text-secondary font-bold">Disponibles: {h.habitaciones_disponibles}</div>
                  <div className="text-primary-container font-bold">Ocupadas: {h.habitaciones_ocupadas}</div>
                  <div className="text-outline font-bold">Mantenimiento: {h.habitaciones_mantenimiento}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pr�ximas Reservas */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-0 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-bright/50">
            <h3 className="font-headline-md text-headline-md text-on-background text-2xl">Pr�ximas Reservas</h3>
            <span className="material-symbols-outlined text-outline">calendar_today</span>
          </div>
          <ul className="flex-1 overflow-y-auto max-h-[400px]">
            {reservations.length === 0 ? (
              <p className="p-6 text-center text-outline text-sm">No hay pr�ximas reservas registradas.</p>
            ) : (
              reservations.slice(0, 5).map((r) => (
                <li key={r.id_reservacion} className="p-4 border-b border-surface-variant flex items-center justify-between hover:bg-secondary-fixed-dim/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary-container font-bold text-label-md">
                      {r.nombre_huesped.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-background">{r.nombre_huesped}</p>
                      <p className="font-label-md text-label-md text-outline">{r.fecha_entrada_proxima} al {r.fecha_salida_proxima}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full">
                      {r.dias_para_iniciar} d�as
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
