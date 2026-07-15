"use client";

import { useState } from 'react';
import { Huesped, DiasRestantesReservacion, EstadiaActiva } from '@/lib/schemas';

interface Props {
  initialGuests: Huesped[];
  reservations: DiasRestantesReservacion[];
  activeStays: EstadiaActiva[];
}

export default function GuestsClient({ initialGuests, reservations, activeStays }: Props) {
  const [guests, setGuests] = useState<Huesped[]>(initialGuests);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DUI');

  const [checkinResId, setCheckinResId] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);

  const [checkoutStay, setCheckoutStay] = useState<EstadiaActiva | null>(null);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const filteredGuests = guests.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase()) ||
    g.documento.includes(search)
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      nombre,
      correo,
      telefono,
      documento,
      tipo_documento: tipoDocumento === 'DUI' ? 'DUI' : tipoDocumento === 'Pasaporte' ? 'PASAPORTE' : 'CONSTANCIA DE RESIDENCIA'
    };

    try {
      const res = await fetch('http://localhost:8000/api/huespedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail?.[0]?.msg || errData.detail || 'Error al registrar huésped');
      }
      const newGuest = await res.json();
      setGuests([...guests, newGuest]);
      setIsOpen(false);
      setNombre('');
      setCorreo('');
      setTelefono('');
      setDocumento('');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (idReservacion: number) => {
    setCheckinLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/estadias/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_reservacion: idReservacion })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Fallo en check-in');
      }
      alert('Check-in registrado con éxito!');
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutStay) return;
    setCheckoutLoading(true);

    const payload = {
      id_empleado: 1, // Administrador
      metodo_pago: metodoPago
    };

    try {
      const res = await fetch(`http://localhost:8000/api/estadias/${checkoutStay.id_estadia}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Fallo en checkout');
      }
      alert('Check-out procesado exitosamente. Factura generada.');
      setCheckoutStay(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Buscar huésped por nombre o documento..."
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-primary-container text-on-primary-container font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Registrar Huésped
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col p-6 space-y-4">
          <h3 className="font-headline-md text-on-background text-xl">Directorio de Huéspedes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/40 border-b border-surface-variant font-label-md text-outline">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Documento</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-outline">No se encontraron huéspedes.</td>
                  </tr>
                ) : (
                  filteredGuests.map((g) => (
                    <tr key={g.id_huesped} className="border-b border-surface-variant/30 hover:bg-surface-variant/10 transition-colors">
                      <td className="p-4 font-semibold text-on-background">{g.nombre}</td>
                      <td className="p-4 text-sm text-on-surface-variant">
                        <span className="bg-surface-variant px-2 py-0.5 rounded text-[10px] uppercase font-bold text-outline mr-2">{g.tipo_documento}</span>
                        {g.documento}
                      </td>
                      <td className="p-4 text-sm text-on-surface-variant">
                        <div>{g.correo}</div>
                        <div className="text-xs text-outline">{g.telefono}</div>
                      </td>
                      <td className="p-4 flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setNombre(g.nombre);
                            setCorreo(g.correo);
                            setTelefono(g.telefono);
                            setDocumento(g.documento);
                            setTipoDocumento(g.tipo_documento);
                            setIsOpen(true);
                          }}
                          className="p-2 bg-surface-variant rounded-lg hover:bg-surface-variant/80 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm text-primary">edit</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('¿Eliminar huésped?')) {
                              try {
                                const res = await fetch(`http://localhost:8000/api/huespedes/${g.id_huesped}`, { method: 'DELETE' });
                                if (res.ok) setGuests(guests.filter(h => h.id_huesped !== g.id_huesped));
                                else alert('No se puede eliminar el huésped. Posibles dependencias activas.');
                              } catch (e) {
                                console.error(e);
                              }
                            }
                          }}
                          className="p-2 bg-error-container text-on-error-container rounded-lg hover:bg-error-container/80 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-headline-md text-on-background text-lg mb-4">Realizar Check-in</h3>
            <div className="space-y-4">
              <select
                className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                value={checkinResId}
                onChange={(e) => setCheckinResId(e.target.value)}
              >
                <option value="">Selecciona reserva pendiente...</option>
                {reservations.filter(r => r.estado_reservacion === 'PENDIENTE').map(r => (
                  <option key={r.id_reservacion} value={r.id_reservacion}>
                    {r.nombre_huesped} ({r.fecha_entrada_proxima})
                  </option>
                ))}
              </select>
              <button
                onClick={() => checkinResId && handleCheckin(Number(checkinResId))}
                disabled={!checkinResId || checkinLoading}
                className="w-full bg-secondary text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {checkinLoading ? 'Procesando...' : 'Iniciar Estadía'}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-headline-md text-on-background text-lg mb-4">Huéspedes Hospedados</h3>
            <ul className="space-y-4 max-h-[300px] overflow-y-auto">
              {activeStays.length === 0 ? (
                <p className="text-outline text-xs">No hay huéspedes alojados actualmente.</p>
              ) : (
                activeStays.map(s => (
                  <li key={s.id_estadia} className="p-4 border border-surface-variant/40 rounded-xl bg-surface-container-low flex justify-between items-center animate-fade-in">
                    <div>
                      <h4 className="font-semibold text-on-background text-sm">{s.nombre_huesped}</h4>
                      <p className="text-xs text-outline">Habitación {s.numero_habitacion} ({s.tipo_habitacion})</p>
                    </div>
                    <button
                      onClick={() => setCheckoutStay(s)}
                      className="bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90"
                    >
                      Check-out
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[92vw] sm:max-w-lg max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-surface shadow-2xl relative animate-fade-in border border-surface-variant">
            <h3 className="text-xl font-bold text-on-background mb-4">Registrar Nuevo Huésped</h3>
            {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Teléfono</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Tipo</label>
                  <select
                    className="w-full px-2 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                  >
                    <option value="DUI">DUI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Residencia">Residencia</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Documento</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                  />
                </div>
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {checkoutStay && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[92vw] sm:max-w-lg max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-surface shadow-2xl relative animate-fade-in border border-surface-variant">
            <h3 className="text-xl font-bold text-on-background mb-4">Procesar Check-out</h3>
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-4 bg-surface-container rounded-xl text-sm space-y-1 text-on-surface-variant">
                <p><strong>Huésped:</strong> {checkoutStay.nombre_huesped}</p>
                <p><strong>Habitación:</strong> Hab. {checkoutStay.numero_habitacion}</p>
                <p><strong>Tipo:</strong> {checkoutStay.tipo_habitacion}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Método de Pago</label>
                <select
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="TARJETA">TARJETA</option>
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                  <option value="BITCOIN">BITCOIN</option>
                </select>
              </div>
              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStay(null)}
                  className="px-4 py-2 text-outline font-semibold hover:bg-surface-variant/40 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="px-6 py-2 bg-secondary text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {checkoutLoading ? 'Procesando...' : 'Completar check-out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

