"use client";

import { useState } from 'react';
import { Servicio, ServiciosMasConsumidos, EstadiaActiva } from '@/lib/schemas';

interface Props {
  services: Servicio[];
  popular: ServiciosMasConsumidos[];
  activeStays: EstadiaActiva[];
}

export default function ServicesClient({ services, popular, activeStays }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [idServicio, setIdServicio] = useState('');
  const [idEstadia, setIdEstadia] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const stay = activeStays.find(s => s.id_estadia === Number(idEstadia));
    if (!stay) {
      setError("Estadía no encontrada");
      setLoading(false);
      return;
    }

    const payload = {
      id_servicio: Number(idServicio),
      id_habitacion: stay.id_habitacion
    };

    try {
      const res = await fetch(`http://localhost:8000/api/estadias/${idEstadia}/consumo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error al registrar el consumo');
      }
      alert('Consumo registrado exitosamente!');
      setIsOpen(false);
      setIdServicio('');
      setIdEstadia('');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-on-background text-xl">Gestión de Consumos</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-container text-on-primary-container font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">room_service</span>
          Registrar Consumo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-headline-md text-on-background text-lg mb-4">Servicios Disponibles</h4>
          <ul className="space-y-4">
            {services.map((s) => (
              <li key={s.id_servicio} className="flex justify-between items-center p-3 border border-surface-variant/40 rounded-xl bg-surface-container-low">
                <span className="font-semibold text-on-background">{s.tipo_servicio}</span>
                <span className="font-bold text-secondary">${Number(s.precio).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-headline-md text-on-background text-lg mb-4">Consumos Populares por Tipo Habitación</h4>
          <ul className="space-y-3">
            {popular.map((p, index) => (
              <li key={index} className="p-3 border-b border-surface-variant/30 flex justify-between text-sm text-on-surface-variant">
                <div>
                  <span className="font-semibold text-on-background">{p.tipo_servicio}</span>
                  <div className="text-xs text-outline">En habitaciones {p.tipo_habitacion}</div>
                </div>
                <span className="font-bold text-primary-container">{p.total_consumos} consumos</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-md bg-surface rounded-3xl p-6 shadow-2xl relative animate-fade-in border border-surface-variant">
            <h3 className="text-xl font-bold text-on-background mb-4">Registrar Consumo</h3>
            {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Huésped Hospedado</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={idEstadia}
                  onChange={(e) => setIdEstadia(e.target.value)}
                >
                  <option value="">Selecciona huésped...</option>
                  {activeStays.map(s => (
                    <option key={s.id_estadia} value={s.id_estadia}>
                      {s.nombre_huesped} (Hab. {s.numero_habitacion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Servicio</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={idServicio}
                  onChange={(e) => setIdServicio(e.target.value)}
                >
                  <option value="">Selecciona servicio...</option>
                  {services.map(s => (
                    <option key={s.id_servicio} value={s.id_servicio}>
                      {s.tipo_servicio} (${Number(s.precio).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-outline font-semibold hover:bg-surface-variant/40 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-secondary text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Registrando...' : 'Registrar Consumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

