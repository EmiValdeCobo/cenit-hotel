import { z } from 'zod';
import SettingsClient from '@/components/settings/SettingsClient';
import { AumentoCostoResponseSchema, DescuentoResponseSchema } from '@/lib/schemas';

async function getData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [costsRes, discountsRes] = await Promise.all([
    fetch(`${apiBase}/api/configuraciones/temporadas`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/configuraciones/descuentos`, { cache: 'no-store' })
  ]);

  if (!costsRes.ok || !discountsRes.ok) throw new Error('Fallo al obtener configuraciones');

  const costsJson = await costsRes.json();
  const discountsJson = await discountsRes.json();

  return {
    seasonalCosts: z.array(AumentoCostoResponseSchema).parse(costsJson),
    discounts: z.array(DescuentoResponseSchema).parse(discountsJson)
  };
}

export default async function SettingsPage() {
  const { seasonalCosts, discounts } = await getData();

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Configuraciones</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Gesti�n de incrementos de costos por temporada y pol�ticas de descuento</p>
      </div>
      <SettingsClient seasonalCosts={seasonalCosts} discounts={discounts} />
    </main>
  );
}
