"use client";

import { useState } from 'react';
import { Empleado } from '@/lib/schemas';

interface Props {
  initialEmployees: Empleado[];
}

export default function EmployeesClient({ initialEmployees }: Props) {
  const [employees, setEmployees] = useState<Empleado[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dui, setDui] = useState('');
  const [salario, setSalario] = useState(0);
  const [idTipoEmpleado, setIdTipoEmpleado] = useState('2'); // 2 = Recepcionista

  const filteredEmployees = employees.filter(e =>
    e.empleado.toLowerCase().includes(search.toLowerCase()) ||
    e.rol_de_trabajo.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      id_tipo_empleado: Number(idTipoEmpleado),
      nombre,
      correo,
      telefono: telefono || null,
      dui,
      salario: Number(salario)
    };

    try {
      const res = await fetch('http://localhost:8000/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error al registrar empleado');
      }
      const newEmp = await res.json();
      setEmployees([...employees, newEmp]);
      setIsOpen(false);
      setNombre('');
      setCorreo('');
      setTelefono('');
      setDui('');
      setSalario(0);
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre o rol..."
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-primary-container text-on-primary-container font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">badge</span>
          Registrar Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((e, index) => (
          <div key={index} className="glass-card rounded-2xl p-6 space-y-4 hover:shadow-ambient-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-on-background text-lg">{e.empleado}</h4>
                <p className="text-xs text-secondary font-bold uppercase tracking-wider">{e.rol_de_trabajo}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary-container font-bold">
                {e.empleado.slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="border-t border-surface-variant/30 pt-3 space-y-1.5 text-sm text-on-surface-variant">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span> {e.email}
              </p>
              {e.telefono && (
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">phone</span> {e.telefono}
                </p>
              )}
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">id_card</span> DUI: {e.documento_de_identidad}
              </p>
            </div>

            <div className="border-t border-surface-variant/30 pt-3 flex justify-between items-center">
              <span className="text-xs text-outline uppercase font-semibold">Salario</span>
              <span className="font-bold text-on-background text-lg">${Number(e.salario).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-md bg-surface rounded-3xl p-6 shadow-2xl relative animate-fade-in border border-surface-variant">
            <h3 className="text-xl font-bold text-on-background mb-4">Registrar Nuevo Empleado</h3>
            {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Teléfono</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">DUI</label>
                  <input
                    type="text"
                    required
                    placeholder="00000000-0"
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={dui}
                    onChange={(e) => setDui(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Salario ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={salario}
                    onChange={(e) => setSalario(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">Rol</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant focus:outline-none"
                    value={idTipoEmpleado}
                    onChange={(e) => setIdTipoEmpleado(e.target.value)}
                  >
                    <option value="1">Administrador</option>
                    <option value="2">Recepcionista</option>
                    <option value="3">Mucama</option>
                  </select>
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
                  {loading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

