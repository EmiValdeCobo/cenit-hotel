import { z } from 'zod';
import BillingClient from '@/components/billing/BillingClient';
import { FacturaSimplificadaResponseSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

async function getBills() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiBase}/api/reportes/facturas`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Fallo al obtener facturas');
  const json = await res.json();
  return z.array(FacturaSimplificadaResponseSchema).parse(json);
}

export default async function BillingPage() {
  const bills = await getBills();

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Facturación</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Historial y control de comprobantes fiscales y pagos del hotel Cénit</p>
      </div>
      <BillingClient initialBills={bills} />
    </main>
  );
}
