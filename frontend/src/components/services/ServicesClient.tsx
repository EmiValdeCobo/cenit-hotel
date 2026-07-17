"use client";

import { useState } from 'react';
import { Servicio, ServiciosMasConsumidos, EstadiaActiva } from '@/lib/schemas';
import { AlertDialog } from '@/components/ui/Dialog';
import SearchableCombobox from '@/components/ui/SearchableCombobox';

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

  // States for custom modals
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    onClose?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

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
      setIsOpen(false);
      setIdServicio('');
      setIdEstadia('');
      setAlertDialog({
        isOpen: true,
        title: 'Consumo Registrado',
        message: 'El consumo ha sido cargado a la estadía exitosamente.',
        type: 'success',
        onClose: () => window.location.reload()
      });
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const activeStayOptions = activeStays.map(s => ({
    value: s.id_estadia,
    label: s.nombre_huesped,
    sublabel: `Habitación: ${s.numero_habitacion} (${s.tipo_habitacion})`
  }));

  const serviceOptions = services.map(s => ({
    value: s.id_servicio,
    label: s.tipo_servicio,
    sublabel: `$${Number(s.precio).toFixed(2)}`
  }));

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full min-w-[320px] sm:min-w-[400px] max-w-lg shrink-0 max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-surface shadow-2xl relative animate-fade-in border border-surface-variant">
            <h3 className="text-xl font-bold text-on-background mb-4">Registrar Consumo</h3>
            {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Huésped Hospedado</label>
                <SearchableCombobox
                  required
                  placeholder="Selecciona huésped..."
                  options={activeStayOptions}
                  value={idEstadia}
                  onChange={(val) => setIdEstadia(String(val))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Servicio</label>
                <SearchableCombobox
                  required
                  placeholder="Selecciona servicio..."
                  options={serviceOptions}
                  value={idServicio}
                  onChange={(val) => setIdServicio(String(val))}
                />
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

      {/* Reusable Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        onClose={() => {
          setAlertDialog({ ...alertDialog, isOpen: false });
          if (alertDialog.onClose) alertDialog.onClose();
        }}
      />
    </div>
  );
}
