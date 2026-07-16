import { z } from 'zod';
import EmployeesClient from '@/components/employees/EmployeesClient';
import { EmpleadoResponseSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

async function getEmployees() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiBase}/api/empleados`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Fallo al obtener empleados');
  const json = await res.json();
  return z.array(EmpleadoResponseSchema).parse(json);
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <main className="flex-1 overflow-y-auto p-[16px] md:p-[32px] overflow-x-hidden">
      <div className="mb-[40px]">
        <h2 className="font-headline-md text-headline-md text-on-background">Empleados</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Directorio y roles del equipo del hotel Cénit</p>
      </div>
      <EmployeesClient initialEmployees={employees} />
    </main>
  );
}
