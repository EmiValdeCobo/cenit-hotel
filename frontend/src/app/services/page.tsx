import { z } from 'zod';
import ServicesClient from '@/components/services/ServicesClient';
import { ServicioResponseSchema, ServiciosMasConsumidosResponseSchema, EstadiaActivaResponseSchema } from '@/lib/schemas';

async function getData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [servicesRes, popularRes, staysRes] = await Promise.all([
    fetch(`${apiBase}/api/servicios`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/servicios/mas-consumidos`, { cache: 'no-store' }),
    fetch(`${apiBase}/api/estadias/activas`, { cache: 'no-store' })
  ]);

  if (!servicesRes.ok || !popularRes.ok || !staysRes.ok) throw new Error('Fallo al obtener servicios');

  const servicesJson = await servicesRes.json();
  const popularJson = await popularRes.json();
  const staysJson = await staysRes.json();

  return {
    services: z.array(ServicioResponseSchema).parse(servicesJson),
    popular: z.array(ServiciosMasConsumidosResponseSchema).parse(popularJson),
    activeStays: z.array(EstadiaActivaResponseSchema).parse(staysJson)
  };
}

export default async function ServicesPage() {
  const { services, popular, activeStays } = await getData();

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Servicios</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Registro de consumo de servicios adicionales por habitaci�n</p>
      </div>
      <ServicesClient services={services} popular={popular} activeStays={activeStays} />
    </main>
  );
}
