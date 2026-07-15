"use client";
import { useState, useEffect } from 'react';

export default function HotelsClient() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    estrellas: 3
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/hoteles/datos-generales');
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
        nombre: hotel.nombre_hotel || '',
        direccion: hotel.direccion || '',
        telefono: hotel.telefono || '',
        correo: hotel.correo || '',
        estrellas: hotel.estrellas || 3
      });
    } else {
      setEditingId(null);
      setFormData({ nombre: '', direccion: '', telefono: '', correo: '', estrellas: 3 });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Note: This relies on the backend POST/PUT implementation
    const url = editingId
      ? `http://localhost:8000/api/hoteles/${editingId}`
      : 'http://localhost:8000/api/hoteles';

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsOpen(false);
        fetchHotels();
      } else {
        alert("Error al guardar hotel. Asegúrese de que el backend tenga el endpoint configurado.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este hotel?')) {
      try {
        const res = await fetch(`http://localhost:8000/api/hoteles/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setHotels(hotels.filter(h => h.id_hotel !== id));
        } else {
          alert("Error al eliminar hotel. Puede que tenga dependencias o el endpoint falte.");
        }
      } catch (err) {
        console.error(err);
      }
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
                    {Array.from({ length: h.estrellas || 3 }).map((_, i) => (
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
                    <span className="material-symbols-outlined text-sm opacity-70">call</span>
                    <span>{h.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm opacity-70">mail</span>
                    <span className="truncate">{h.correo}</span>
                  </div>
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
                  onClick={() => handleDelete(h.id_hotel)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl relative border border-surface-variant">
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
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Estrellas</label>
                  <input
                    type="number"
                    min="1" max="5"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                    value={formData.estrellas}
                    onChange={(e) => setFormData({ ...formData, estrellas: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-primary"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
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
    </div>
  );
}

