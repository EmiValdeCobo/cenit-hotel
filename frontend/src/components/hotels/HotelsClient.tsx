"use client";

import { useState, useEffect } from 'react';
import { ConfirmDialog, AlertDialog } from '@/components/ui/Dialog';

export default function HotelsClient() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    niveles_edificios: 1,
    descripcion: '',
    estrellas: 3
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // States for custom modals
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/hoteles/datos-generales?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  const openModal = (hotel: any = null) => {
    if (hotel) {
      setEditingId(hotel.id_hotel);
      setFormData({
        nombre: hotel.nombre_hotel || hotel.nombre || '',
        direccion: hotel.direccion || '',
        niveles_edificios: hotel.niveles_edificios || 1,
        descripcion: hotel.descripcion || '',
        estrellas: Math.round(Number(hotel.calificacion)) || 3
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        direccion: '',
        niveles_edificios: 1,
        descripcion: '',
        estrellas: 3
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId
      ? `http://localhost:8000/api/hoteles/${editingId}`
      : 'http://localhost:8000/api/hoteles';

    // Construct backend payload matching Pydantic schema
    const payload = {
      nombre: formData.nombre,
      direccion: formData.direccion || null,
      niveles_edificios: Number(formData.niveles_edificios) || 1,
      calificacion: Number(formData.estrellas),
      descripcion: formData.descripcion || null
    };

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsOpen(false);
        fetchHotels();
        setAlertDialog({
          isOpen: true,
          title: 'Éxito',
          message: editingId ? 'El hotel ha sido actualizado con éxito.' : 'El hotel ha sido registrado correctamente.',
          type: 'success'
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        const detailMsg = errorData.detail 
          ? (typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail)) 
          : 'Verifique los datos ingresados.';
        
        setAlertDialog({
          isOpen: true,
          title: 'Error al Guardar',
          message: `No se pudo registrar el hotel. Detalles: ${detailMsg}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error(err);
      setAlertDialog({
        isOpen: true,
        title: 'Error de Red',
        message: 'Ocurrió un error al intentar comunicarse con el servidor.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const executeDelete = async (id: number) => {
    setConfirmDialog({ isOpen: false, id: null });
    try {
      const res = await fetch(`http://localhost:8000/api/hoteles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHotels(hotels.filter(h => h.id_hotel !== id));
        setAlertDialog({
          isOpen: true,
          title: 'Eliminado',
          message: 'El hotel ha sido eliminado con éxito.',
          type: 'success'
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        setAlertDialog({
          isOpen: true,
          title: 'No se puede eliminar',
          message: errorData.detail || 'Error al intentar eliminar el hotel. Asegúrese de que no posea habitaciones asociadas.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error(err);
      setAlertDialog({
        isOpen: true,
        title: 'Error de Red',
        message: 'No se pudo comunicar con el servidor para eliminar el hotel.',
        type: 'error'
      });
    }
  };

  if (initialLoading) {
    return <div className="animate-pulse flex gap-4"><div className="w-full h-40 bg-surface-variant rounded-2xl"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Añadir Hotel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.length === 0 ? (
          <div className="col-span-full text-center text-outline p-8 bg-surface-container rounded-2xl">
            No hay hoteles registrados.
          </div>
        ) : (
          hotels.map((h) => (
            <div key={h.id_hotel} className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow border border-surface-variant">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-on-background line-clamp-1">{h.nombre_hotel || h.nombre}</h3>
                  <div className="flex text-amber-400">
                    {Array.from({ length: Math.round(Number(h.calificacion)) || 3 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-on-surface-variant mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm opacity-70">location_on</span>
                    <span className="line-clamp-1">{h.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm opacity-70">layers</span>
                    <span>{h.niveles_edificios || 1} Niveles / Pisos</span>
                  </div>
                  {h.descripcion && (
                    <p className="text-xs italic mt-2 text-outline line-clamp-2">{h.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-surface-variant">
                <button
                  onClick={() => openModal(h)}
                  className="p-2 bg-surface-variant rounded-lg hover:bg-surface-variant/80 transition-colors"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-sm text-primary">edit</span>
                </button>
                <button
                  onClick={() => triggerDelete(h.id_hotel)}
                  className="p-2 bg-error-container text-on-error-container rounded-lg hover:bg-error-container/80 transition-colors"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface w-full min-w-[320px] sm:min-w-[400px] max-w-lg shrink-0 max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative border border-surface-variant">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-6">
              {editingId ? 'Editar Hotel' : 'Añadir Hotel'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Nombre del Hotel</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Dirección</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Niveles / Pisos</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                    value={formData.niveles_edificios}
                    onChange={(e) => setFormData({ ...formData, niveles_edificios: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Calificación (Estrellas)</label>
                  <input
                    type="number"
                    min="1" max="5"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                    value={formData.estrellas}
                    onChange={(e) => setFormData({ ...formData, estrellas: parseInt(e.target.value) || 3 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Descripción</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary resize-none"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Eliminar Hotel?"
        message="¿Está seguro de eliminar este hotel? Esta acción no se puede deshacer y fallará si tiene habitaciones asociadas."
        confirmText="Eliminar"
        type="danger"
        onConfirm={() => confirmDialog.id && executeDelete(confirmDialog.id)}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />

      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />
    </div>
  );
}
