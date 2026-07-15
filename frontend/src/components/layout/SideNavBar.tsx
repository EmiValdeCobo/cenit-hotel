�import Image from "next/image";
import Link from "next/link";

export default function SideNavBar() {
  return (
    <nav className="h-screen w-64 fixed left-0 top-0 overflow-y-auto dark:bg-primary-container shadow-lg shadow-primary/10 z-50 hidden md:flex flex-col py-6 bg-primary-container">
      <ul className="flex-1 space-y-2 mt-4">
        <li>
          <Link
            href="/"
            className="bg-secondary-container text-on-secondary-container rounded-lg font-bold mx-2 px-4 py-3 flex items-center gap-3 transition-all duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/hotels"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">domain</span>
            <span className="font-label-md text-label-md">Hoteles</span>
          </Link>
        </li>
        <li>
          <Link
            href="/reservations"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-label-md text-label-md">Reservations</span>
          </Link>
        </li>
        <li>
          <Link
            href="/guests"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="font-label-md text-label-md">Guests</span>
          </Link>
        </li>
        <li>
          <Link
            href="/billing"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-md text-label-md">Billing</span>
          </Link>
        </li>
        <li>
          <Link
            href="/employees"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">badge</span>
            <span className="font-label-md text-label-md">Employees</span>
          </Link>
        </li>
        <li>
          <Link
            href="/services"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">room_service</span>
            <span className="font-label-md text-label-md">Services</span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="text-primary-fixed-dim hover:text-surface-bright rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-primary-container/50 duration-200"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
        </li>
      </ul>
      
      <div className="mt-auto px-6 flex items-center gap-3 opacity-70">
        <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
        </div>
        <span className="font-label-md text-label-md text-primary-fixed-dim">Admin Profile</span>
      </div>
    </nav>
  );
}

