import { z } from 'zod';
import GuestsClient from '@/components/guests/GuestsClient';
import { HuespedResponseSchema, DiasRestantesReservacionResponseSchema, EstadiaActivaResponseSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

async function getData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [guestsRes, resvRes, staysRes] = await Promise.all([
    fetch(`${apiBase}/api/huespedes`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/reservaciones/dias-restantes`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/estadias/activas`, { cache: 'no-store' })
  ]);

  if (!guestsRes.ok || !resvRes.ok || !staysRes.ok) throw new Error('Fallo al obtener datos de recepción');

  const guestsJson = await guestsRes.json();
  const resvJson = await resvRes.json();
  const staysJson = await staysRes.json();

  return {
    guests: z.array(HuespedResponseSchema).parse(guestsJson),
    reservations: z.array(DiasRestantesReservacionResponseSchema).parse(resvJson),
    activeStays: z.array(EstadiaActivaResponseSchema).parse(staysJson)
  };
}

export default async function GuestsPage() {
  const { guests, reservations, activeStays } = await getData();

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Recepción y Huéspedes</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Registro de huéspedes y control de Check-in y Check-out</p>
      </div>
      <GuestsClient initialGuests={guests} reservations={reservations} activeStays={activeStays} />
    </main>
  );
}
