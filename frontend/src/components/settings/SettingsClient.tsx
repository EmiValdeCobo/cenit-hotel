�"use client";

import { useState } from 'react';
import { AumentoCosto, Descuento } from '@/lib/schemas';

interface Props {
  seasonalCosts: AumentoCosto[];
  discounts: Descuento[];
}

export default function SettingsClient({ seasonalCosts, discounts }: Props) {
  const [costs, setCosts] = useState<AumentoCosto[]>(seasonalCosts);

  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/configuraciones/temporadas/${id}/toggle`, {
        method: 'POST'
      });
      if (res.ok) {
        setCosts(costs.map(c => c.id_aumento_costo === id ? { ...c, activado: !c.activado } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 flex flex-col space-y-6">
        <div>
          <h3 className="font-headline-md text-on-background text-xl">Temporadas Especiales</h3>
          <p className="text-xs text-outline">Definir incrementos de costos por temporada</p>
        </div>
        <ul className="space-y-4 flex-1">
          {costs.map((c) => (
            <li key={c.id_aumento_costo} className="flex justify-between items-center p-4 border border-surface-variant/40 rounded-xl bg-surface-container-low">
              <div>
                <p className="font-semibold text-on-background text-sm">{c.nombre_temporada || 'Temporada Especial'}</p>
                <p className="text-[10px] text-outline">{c.fecha_inicio} a {c.fecha_fin}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-error text-sm">+{Number(c.porcentaje_aumento).toFixed(2)}%</span>
                <button
                  onClick={() => handleToggle(c.id_aumento_costo)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex ${
                    c.activado ? 'bg-secondary justify-end' : 'bg-surface-variant/60 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md transform"></span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col space-y-6">
        <div>
          <h3 className="font-headline-md text-on-background text-xl">Políticas de Descuento por Larga Estancia</h3>
          <p className="text-xs text-outline">Descuentos según la cantidad de días hospedados</p>
        </div>
        <ul className="space-y-4 flex-1">
          {discounts.map((d) => (
            <li key={d.id_descuento} className="flex justify-between items-center p-4 border border-surface-variant/40 rounded-xl bg-surface-container-low">
              <div>
                <p className="font-semibold text-on-background text-sm">Estancia Larga ({d.cant_dia_hospedado} días o más)</p>
                <p className="text-[10px] text-outline">Aplicado automáticamente</p>
              </div>
              <span className="font-bold text-secondary text-base">-{Number(d.porcentaje_descuento).toFixed(2)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

