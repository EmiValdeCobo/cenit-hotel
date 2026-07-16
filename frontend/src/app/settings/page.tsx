import { z } from 'zod';
import SettingsClient from '@/components/settings/SettingsClient';
import { AumentoCostoResponseSchema, DescuentoResponseSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

async function getData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const [costsRes, discountsRes] = await Promise.all([
      fetch(`${apiBase}/api/configuraciones/temporadas`, { cache: 'no-store' }),
      fetch(`${apiBase}/api/configuraciones/descuentos`, { cache: 'no-store' })
    ]);

    if (!costsRes.ok || !discountsRes.ok) {
      throw new Error(`Fallo al obtener configuraciones. Status: Costs(${costsRes.status}) Discounts(${discountsRes.status})`);
    }

    const costsJson = await costsRes.json();
    const discountsJson = await discountsRes.json();

    return {
      seasonalCosts: z.array(AumentoCostoResponseSchema).parse(costsJson),
      discounts: z.array(DescuentoResponseSchema).parse(discountsJson)
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Lanzar el error para que sea capturado por el error.tsx de Next.js
    throw new Error('No se pudieron cargar las configuraciones. Por favor, intenta de nuevo más tarde.');
  }
}

export default async function SettingsPage() {
  const { seasonalCosts, discounts } = await getData();

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Configuraciones</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Gestión de incrementos de costos por temporada y políticas de descuento</p>
      </div>
      <SettingsClient seasonalCosts={seasonalCosts} discounts={discounts} />
    </main>
  );
}
