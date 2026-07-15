import { z } from 'zod';
import ReservationsClient from '@/components/reservations/ReservationsClient';
import { DiasRestantesReservacionResponseSchema, HabitacionDisponibleResponseSchema, HuespedResponseSchema } from '@/lib/schemas';

async function getData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [resvRes, roomsRes, guestsRes] = await Promise.all([
    fetch(`${apiBase}/api/reservaciones/dias-restantes`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/habitaciones/disponibles`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/huespedes`, { cache: 'no-store' })
  ]);

  if (!resvRes.ok || !roomsRes.ok || !guestsRes.ok) throw new Error('Fallo al obtener datos de reservaciones');

  const resvJson = await resvRes.json();
  const roomsJson = await roomsRes.json();
  const guestsJson = await guestsRes.json();

  return {
    reservations: z.array(DiasRestantesReservacionResponseSchema).parse(resvJson),
    rooms: z.array(HabitacionDisponibleResponseSchema).parse(roomsJson),
    guests: z.array(HuespedResponseSchema).parse(guestsJson)
  };
}

export default async function ReservationsPage() {
  const { reservations, rooms, guests } = await getData();

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Reservaciones</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Gesti�n de estad�as y habitaciones del hotel C�nit</p>
      </div>
      <ReservationsClient initialReservations={reservations} rooms={rooms} guests={guests} />
    </main>
  );
}
