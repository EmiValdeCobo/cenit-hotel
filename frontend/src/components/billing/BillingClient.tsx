"use client";

import { useState } from 'react';
import { FacturaSimplificada, FacturaCompleta } from '@/lib/schemas';

interface Props {
  initialBills: FacturaSimplificada[];
}

export default function BillingClient({ initialBills }: Props) {
  const [bills] = useState<FacturaSimplificada[]>(initialBills);
  const [search, setSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState<FacturaCompleta | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const filteredBills = bills.filter(b =>
    b.nombre_huesped.toLowerCase().includes(search.toLowerCase()) ||
    b.id_factura.toString().includes(search)
  );

  const fetchDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`http://localhost:8000/api/reportes/factura/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedBill(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex">
        <input
          type="text"
          placeholder="Buscar por ID factura o huésped..."
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
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
                  <tr key={b.id_factura} className="border-b border-surface-variant/30 hover:bg-surface-variant/10 transition-colors">
                    <td className="p-4 font-bold text-on-background">#FC-{b.id_factura}</td>
                    <td className="p-4 text-on-background">{b.nombre_huesped}</td>
                    <td className="p-4 text-sm text-on-surface-variant">{new Date(b.fecha).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-on-surface-variant">{b.metodo_pago}</td>
                    <td className="p-4 font-bold text-secondary">${Number(b.total_a_pagar).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => fetchDetails(b.id_factura)}
                        disabled={loadingDetails}
                        className="text-primary-container font-semibold hover:underline text-sm disabled:opacity-50"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-bright border border-surface-variant w-full max-w-[92vw] sm:max-w-lg max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative animate-fade-in">
            <div className="text-center border-b border-dashed border-surface-variant pb-4 mb-4">
              <h3 className="text-2xl font-bold text-primary">CÉNIT BOUTIQUE HOTEL</h3>
              <p className="text-xs text-outline">Factura Electrónica</p>
              <p className="text-xs text-outline">N° Factura: #FC-{selectedBill.id_factura}</p>
              <p className="text-xs text-outline">Fecha: {new Date(selectedBill.fecha).toLocaleString()}</p>
            </div>
            <div className="text-sm space-y-1 mb-4 text-on-surface-variant">
              <p><strong>Huésped:</strong> {selectedBill.nombre_huesped}</p>
              <p><strong>Atendido por:</strong> {selectedBill.nombre_empleado}</p>
              <p><strong>Método de Pago:</strong> {selectedBill.metodo_pago}</p>
            </div>
            <div className="space-y-2 border-b border-dashed border-surface-variant pb-4 mb-4 max-h-[200px] overflow-y-auto">
              <h4 className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Detalles</h4>
              {selectedBill.detalle_factura.map((det, index) => (
                <div key={index} className="flex justify-between text-sm text-on-surface-variant">
                  <div className="flex-1 pr-4">
                    <p className="font-semibold text-on-background">{det.concepto}</p>
                    <p className="text-xs text-outline">{det.cantidad} x ${Number(det.precio_unitario).toFixed(2)}</p>
                  </div>
                  <span className="font-semibold text-on-background">${Number(det.precio_total).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-on-background mb-6">
              <span>Total a Pagar:</span>
              <span className="text-2xl text-secondary">${Number(selectedBill.total_a_pagar).toFixed(2)}</span>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-surface-variant hover:bg-surface-variant/40 rounded-xl transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">print</span> Imprimir
              </button>
              <button
                onClick={() => setSelectedBill(null)}
                className="px-6 py-2 bg-secondary text-white font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

