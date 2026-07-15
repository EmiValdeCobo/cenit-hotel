"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TopAppBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 shrink-0 w-full z-40 flex justify-between items-center px-[24px] border-b border-outline-variant dark:border-primary-container bg-surface-container-lowest">
      <div className="flex items-center gap-6">
        <button className="md:hidden text-primary" type="button">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">hotel</span>
          </div>
          <span className="font-headline-lg text-headline-lg font-bold text-primary hidden sm:block">
            Cénit
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-3 border-l border-outline-variant pl-6">
          <button className="bg-secondary text-on-secondary font-label-md text-label-md px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-ambient">
            <span className="material-symbols-outlined text-lg">add</span>
            Nueva Reservación
          </button>
          <button className="bg-surface-container text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            Facturar Estadía
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-primary dark:text-primary-fixed">
        <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 relative" type="button">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" type="button">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-2"></div>
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer active:opacity-80 hover:bg-surface-container-low p-1 pr-3 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
            </div>
            <span className="font-label-md text-label-md hidden sm:block">Admin Profile</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-2xl z-50">
              <div className="rounded-xl bg-surface-container p-3 mb-2">
                <p className="font-semibold text-on-surface">Administrador</p>
                <p className="text-sm text-on-surface-variant">admin@cenithotel.com</p>
              </div>
              <div className="space-y-2">
                <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container transition-colors" onClick={() => setIsProfileOpen(false)}>
                  Ver perfil
                </button>
                <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container transition-colors" onClick={() => setIsProfileOpen(false)}>
                  Configuración
                </button>
                <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm text-error hover:bg-error-container/30 transition-colors" onClick={() => setIsProfileOpen(false)}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

