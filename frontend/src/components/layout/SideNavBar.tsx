"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDENAV_EXPANDED_WIDTH = "16rem";
const SIDENAV_COLLAPSED_WIDTH = "5rem";
const SIDENAV_STORAGE_KEY = "sidenav-collapsed";

// Lista centralizada de los items de navegacion.
// Al mantenerlos en un arreglo evitamos repetir el mismo bloque de JSX
// siete veces (antes cada enlace duplicaba las mismas clases de Tailwind).
const NAV_ITEMS = [
  { href: "/", label: "Panel", icon: "dashboard" },
  { href: "/hotels", label: "Hoteles", icon: "domain" },
  { href: "/reservations", label: "Reservas", icon: "calendar_month" },
  { href: "/guests", label: "Huespedes", icon: "person" },
  { href: "/billing", label: "Facturacion", icon: "receipt_long" },
  { href: "/employees", label: "Empleados", icon: "badge" },
  { href: "/services", label: "Servicios", icon: "room_service" },
  { href: "/settings", label: "Configuracion", icon: "settings" },
];

export default function SideNavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Al montar el componente en el cliente, leemos las preferencias guardadas en localStorage
  // y establecemos el ancho inicial de forma segura, evitando errores de hidratación de SSR.
  useEffect(() => {
    const stored = window.localStorage.getItem(SIDENAV_STORAGE_KEY);
    const initialCollapsed = stored === "true";

    if (initialCollapsed) {
      setIsCollapsed(true);
    }

    document.documentElement.style.setProperty(
      "--sidenav-width",
      initialCollapsed ? SIDENAV_COLLAPSED_WIDTH : SIDENAV_EXPANDED_WIDTH
    );

    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      document.documentElement.style.setProperty(
        "--sidenav-width",
        next ? SIDENAV_COLLAPSED_WIDTH : SIDENAV_EXPANDED_WIDTH
      );
      window.localStorage.setItem(SIDENAV_STORAGE_KEY, String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  };

  // Un item se considera activo solo si coincide exactamente con la ruta actual
  // (o si estamos en cualquier sub-ruta de esa seccion, excepto para el Panel).
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderNavList = (collapsed = false) => (
    <ul className="flex-1 space-y-1 mt-4 px-2">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`rounded-lg px-4 py-3 flex items-center gap-3 transition-colors duration-200 ${collapsed ? "justify-center" : ""
                } ${active
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-primary-fixed-dim hover:text-surface-bright hover:bg-primary-container/50"
                }`}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="font-label-md text-label-md whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Barra superior visible solo en movil/tablet, con boton para abrir el menu.
          Antes el nav completo tenia "hidden md:flex" y no existia ninguna
          alternativa en pantallas pequenas, dejando la app sin navegacion en movil. */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-primary-container shadow-lg shadow-primary/10 z-50">
        <span className="font-headline-md text-headline-md text-surface-bright">Cenit</span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu de navegacion"
          aria-expanded={isOpen}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-surface-bright hover:bg-primary-container/50 transition-colors duration-200"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Fondo semitransparente detras del menu movil. Se cierra al tocarlo fuera del panel. */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="md:hidden fixed inset-0 bg-black/40 z-50"
        />
      )}

      {/* Panel de navegacion movil: se desliza desde la izquierda. */}
      <nav
        className={`md:hidden fixed left-0 top-0 h-screen w-72 max-w-[80vw] overflow-y-auto bg-primary-container z-50 flex flex-col py-6 shadow-lg shadow-primary/10 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="font-headline-md text-headline-md text-surface-bright">Cenit</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menu de navegacion"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-surface-bright hover:bg-primary-container/50 transition-colors duration-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {renderNavList()}

        <div className="mt-auto px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-primary-fixed-dim select-none">
              Modo Nocturno
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar tema de color"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-surface-bright hover:bg-primary-container/50 transition-colors duration-200 shrink-0"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 opacity-70">
            <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
            </div>
            <span className="font-label-md text-label-md text-primary-fixed-dim">Perfil de administrador</span>
          </div>
        </div>
      </nav>

      {/* Menu fijo de escritorio: siempre visible a partir del breakpoint md.
          El ancho anima entre expandido y colapsado, y esta sincronizado con
          --sidenav-width para que el contenido de la pagina se desplace igual. */}
      <nav
        className={`hidden md:flex h-screen fixed left-0 top-0 overflow-y-auto shadow-lg shadow-primary/10 z-40 flex-col py-6 bg-primary-container dark:bg-primary-container transition-[width] duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        <div className={`flex items-center mb-2 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          {!isCollapsed && (
            <span className="font-headline-md text-headline-md text-surface-bright whitespace-nowrap overflow-hidden">
              Cenit
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-bright hover:bg-primary-container/50 transition-colors duration-200 shrink-0"
          >
            <span className="material-symbols-outlined text-xl">
              {isCollapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        {renderNavList(isCollapsed)}

        <div className={`mt-auto flex flex-col gap-4 ${isCollapsed ? "px-2" : "px-4"}`}>
          <div className={`flex ${isCollapsed ? "justify-center" : "items-center justify-between"}`}>
            {!isCollapsed && (
              <span className="font-label-md text-label-md text-primary-fixed-dim select-none">
                Modo Nocturno
              </span>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar tema de color"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-surface-bright hover:bg-primary-container/50 transition-colors duration-200 shrink-0"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>

          <div className={`flex items-center gap-3 opacity-70 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
            </div>
            {!isCollapsed && (
              <span className="font-label-md text-label-md text-primary-fixed-dim whitespace-nowrap overflow-hidden">
                Perfil de administrador
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}