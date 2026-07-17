"use client";

import { useState } from 'react';
import { DiasRestantesReservacion, Habitacion, Huesped } from '@/lib/schemas';
import { AlertDialog } from '@/components/ui/Dialog';

interface Props {
  initialReservations: DiasRestantesReservacion[];
  rooms: Habitacion[];
  guests: Huesped[];
}

export default function ReservationsClient({ initialReservations, rooms, guests }: Props) {
  const [reservations, setReservations] = useState<DiasRestantesReservacion[]>(initialReservations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODAS');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [idHuesped, setIdHuesped] = useState('');
  const [idHabitacion, setIdHabitacion] = useState('');
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [cantHuespedes, setCantHuespedes] = useState(1);

  // States for custom modals
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    onClose?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.nombre_huesped?.toLowerCase().includes(search.toLowerCase()) ||
      r.documento_huesped.includes(search);
    const matchesStatus = statusFilter === 'TODAS' || r.estado_reservacion === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      id_empleado: 1, // Administrador
      id_huesped: Number(idHuesped),
      cant_huespedes_totales: Number(cantHuespedes),
      detalles: [
        {
          id_habitacion: Number(idHabitacion),
          cant_huespedes: Number(cantHuespedes),
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida
        }
      ]
    };

    try {
      const res = await fetch('http://localhost:8000/api/reservaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error al crear la reservación');
      }
      setIsOpen(false);
      setAlertDialog({
        isOpen: true,
        title: 'Reservación Creada',
        message: 'La reservación ha sido registrada exitosamente en el sistema.',
        type: 'success',
        onClose: () => window.location.reload()
      });
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
        <div className="flex flex-1 gap-4 w-full">
          <input
            type="text"
            placeholder="Buscar por huésped..."
            className="flex-1 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="TODAS">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="COMPLETADA">Completadas</option>
          </select>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-primary-container text-on-primary-container font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nueva Reservación
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden p-6 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/40 border-b border-surface-variant font-label-md text-outline">
                <th className="p-4">Huésped</th>
                <th className="p-4">Días Restantes</th>
                <th className="p-4">Entrada / Salida</th>
                <th className="p-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-outline">No hay reservaciones que coincidan.</td>
                </tr>
              ) : (
                filteredReservations.map((r) => (
                  <tr key={r.id_reservacion} className="border-b border-surface-variant/30 hover:bg-surface-variant/10 transition-colors">
                    <td className="p-4 font-semibold text-on-background">
                      {r.nombre_huesped}
                      <div className="text-xs font-normal text-outline">{r.documento_huesped}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-secondary">
                      {r.dias_para_iniciar} días
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      <div>Entrada: {r.fecha_entrada_proxima}</div>
                      <div>Salida: {r.fecha_salida_proxima}</div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        r.estado_reservacion === 'PENDIENTE' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                        r.estado_reservacion === 'CONFIRMADA' ? 'bg-secondary-container text-on-secondary-container' :
                        'bg-surface-variant text-outline'
                      }`}>
                        {r.estado_reservacion}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-bright border border-surface-variant w-full min-w-[320px] sm:min-w-[400px] max-w-lg shrink-0 max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative animate-fade-in">
            <h3 className="text-xl font-bold text-on-background mb-4">Nueva Reservación</h3>
            {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Huésped</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={idHuesped}
                  onChange={(e) => setIdHuesped(e.target.value)}
                >
                  <option value="">Selecciona un huésped...</option>
                  {guests.map(g => (
                    <option key={g.id_huesped} value={g.id_huesped}>{g.nombre} ({g.documento})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Habitación Disponible</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={idHabitacion}
                  onChange={(e) => setIdHabitacion(e.target.value)}
                >
                  <option value="">Selecciona habitación...</option>
                  {rooms.filter(r => r.estado === 'DISPONIBLE').map(r => (
                    <option key={r.id_habitacion} value={r.id_habitacion}>
                      Hab. {r.numero_habitacion} ({r.tipo_habitacion}) - ${Number(r.precio).toFixed(2)}/noche
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Entrada</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={fechaEntrada}
                    onChange={(e) => setFechaEntrada(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Salida</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={fechaSalida}
                    onChange={(e) => setFechaSalida(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Huéspedes Totales</label>
                <input
                  type="number"
                  min={1}
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={cantHuespedes}
                  onChange={(e) => setCantHuespedes(Number(e.target.value))}
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
                  {loading ? 'Guardando...' : 'Crear Reservación'}
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
