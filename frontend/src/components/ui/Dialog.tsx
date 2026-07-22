"use client";

import React, { useEffect, useId } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'info',
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  // BUG FIX (UI/UX & a11y):
  // 1. Bloqueo de scroll en body al abrir el modal para prevenir "scroll bleed".
  // 2. Escucha de tecla Escape para cerrar el diálogo modal de forma intuitiva.
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => {
        // Cierre al hacer clic en el backdrop exterior
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-surface w-full min-w-[320px] sm:min-w-[400px] max-w-md shrink-0 rounded-3xl p-6 shadow-2xl relative border border-surface-variant animate-scale-in"
      >
        <h3 id={titleId} className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p id={descriptionId} className="text-sm text-on-surface-variant mb-6">{message}</p>
        
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-outline hover:bg-surface-variant/40 transition-colors focus:ring-2 focus:ring-secondary/50 outline-none"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-secondary/50 outline-none ${
              type === 'danger' ? 'bg-error' : 'bg-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  confirmText?: string;
}

export function AlertDialog({
  isOpen,
  title,
  message,
  onClose,
  type = 'info',
  confirmText = 'Entendido',
}: AlertDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  // BUG FIX (UI/UX & a11y):
  // Bloqueo de scroll y listener de Escape para alertas flotantes.
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-secondary',
      icon: 'check_circle',
      iconColor: 'text-secondary-container bg-secondary/10',
    },
    error: {
      bg: 'bg-error',
      icon: 'error',
      iconColor: 'text-error bg-error/10',
    },
    info: {
      bg: 'bg-primary',
      icon: 'info',
      iconColor: 'text-primary bg-primary/10',
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-surface w-full min-w-[320px] sm:min-w-[400px] max-w-md shrink-0 rounded-3xl p-6 shadow-2xl relative border border-surface-variant animate-scale-in flex flex-col items-center text-center"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${currentStyle.iconColor}`}>
          <span className="material-symbols-outlined text-2xl">{currentStyle.icon}</span>
        </div>
        
        <h3 id={titleId} className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p id={descriptionId} className="text-sm text-on-surface-variant mb-6">{message}</p>
        
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-secondary/50 outline-none ${currentStyle.bg}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
