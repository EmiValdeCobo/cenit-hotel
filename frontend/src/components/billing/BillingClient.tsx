"use client";

import { useState, useEffect } from 'react';
import { FacturaSimplificada, FacturaCompleta } from '@/lib/schemas';

interface Props {
  initialBills: FacturaSimplificada[];
}

export default function BillingClient({ initialBills }: Props) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [bills] = useState<FacturaSimplificada[]>(initialBills);
  const [search, setSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState<FacturaCompleta | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');

  // BUG FIX (UI/UX & a11y):
  // Bloqueo de scroll en body y listener de la tecla Escape para el modal de detalle de factura.
  useEffect(() => {
    if (!selectedBill) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBill(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBill]);

  const filteredBills = bills.filter(b =>
    b.nombre_huesped.toLowerCase().includes(search.toLowerCase()) ||
    b.id_factura.toString().includes(search)
  );

  const fetchDetails = async (id: number) => {
    setLoadingDetails(true);
    setDetailError('');
    try {
      const res = await fetch(`${apiBase}/api/reportes/factura/${id}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSelectedBill(data);
      } else {
        setDetailError('No se pudo cargar el detalle de la factura.');
      }
    } catch (err) {
      console.error(err);
      setDetailError('Error de conexión al cargar el detalle.');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Campo de búsqueda responsivo con icono y a11y */}
      <div className="flex w-full">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por ID factura o huésped..."
            aria-label="Buscar por ID factura o huésped"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-sm text-on-surface"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {detailError && (
        <div role="alert" className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-semibold animate-fade-in">
          {detailError}
        </div>
      )}

      {/* Tabla de Facturas con estilos responsive y hover refinado */}
      <div className="glass-card rounded-2xl overflow-hidden flex-1 border border-surface-variant/50 shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/40 border-b border-surface-variant font-label-md text-outline">
                <th className="p-4">N° Factura</th>
                <th className="p-4">Huésped</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-outline">No se encontraron facturas.</td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id_factura} className="border-b border-surface-variant/30 hover:bg-surface-variant/20 transition-colors">
                    <td className="p-4 font-bold text-on-background">#FC-{b.id_factura}</td>
                    <td className="p-4 text-on-background font-medium">{b.nombre_huesped}</td>
                    <td className="p-4 text-sm text-on-surface-variant">{new Date(b.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                    <td className="p-4 text-sm text-on-surface-variant font-medium">{b.metodo_pago}</td>
                    <td className="p-4 font-bold text-secondary">${Number(b.total_a_pagar).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => fetchDetails(b.id_factura)}
                        disabled={loadingDetails}
                        className="text-primary-container font-semibold hover:underline text-sm disabled:opacity-50 focus:outline-none"
                      >
                        Ver Detalle
                      </button>
                      <span className="mx-2 text-outline">|</span>
                      <a
                        href={`${apiBase}/api/reportes/factura/${b.id_factura}/html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary font-semibold hover:underline text-sm"
                      >
                        Factura Completa
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Factura con Accesibilidad ARIA y Cierre por Backdrop */}
      {selectedBill && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBill(null);
          }}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle Factura FC-${selectedBill.id_factura}`}
            className="bg-surface-bright border border-surface-variant w-full min-w-[320px] sm:min-w-[400px] max-w-lg shrink-0 max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative animate-scale-in"
          >
            <div className="text-center border-b border-dashed border-surface-variant pb-4 mb-4">
              <h3 className="text-2xl font-bold text-primary">CÉNIT BOUTIQUE HOTEL</h3>
              <p className="text-xs text-outline font-semibold tracking-wider uppercase mt-1">Factura Electrónica</p>
              <p className="text-xs text-outline mt-0.5">N° Factura: #FC-{selectedBill.id_factura}</p>
              <p className="text-xs text-outline mt-0.5">Fecha: {new Date(selectedBill.fecha).toLocaleString()}</p>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between border-b border-surface-variant/40 pb-2">
                <span className="text-outline">Huésped:</span>
                <span className="font-bold text-on-surface">{selectedBill.nombre_huesped} ({selectedBill.correo_huesped})</span>
              </div>
              <div className="flex justify-between border-b border-surface-variant/40 pb-2">
                <span className="text-outline">Atendido por:</span>
                <span className="font-semibold text-on-surface">{selectedBill.nombre_empleado}</span>
              </div>
              <div className="flex justify-between border-b border-surface-variant/40 pb-2">
                <span className="text-outline">Método de Pago:</span>
                <span className="font-semibold text-on-surface">{selectedBill.metodo_pago}</span>
              </div>
            </div>

            {/* Detalle de Líneas de Factura */}
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-outline mb-2">Desglose de Servicios</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedBill.detalle_factura?.map((det, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2.5 rounded-xl bg-surface-container border border-surface-variant/40">
                    <div>
                      <p className="font-bold text-on-surface">{det.concepto}</p>
                      <p className="text-[10px] text-outline">Cant: {det.cantidad} x ${Number(det.precio_unitario).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary">${Number(det.precio_total).toFixed(2)}</p>
                      {det.monto_descuento > 0 && <p className="text-[10px] text-secondary">Desc: -${Number(det.monto_descuento).toFixed(2)}</p>}
                      {det.monto_aumento > 0 && <p className="text-[10px] text-error">Recargo: +${Number(det.monto_aumento).toFixed(2)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-surface-variant pt-4 flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-on-surface">Total a Pagar:</span>
              <span className="text-2xl font-bold text-secondary">${Number(selectedBill.total_a_pagar).toFixed(2)}</span>
            </div>

            <button
              onClick={() => setSelectedBill(null)}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-95 transition-opacity focus:ring-2 focus:ring-secondary/50 outline-none"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
