"use client";

import { useEffect, useRef, useState, useMemo, useId } from "react";

interface Option {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface Props {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  noResultsText?: string;
  className?: string;
}

export default function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción...",
  required = false,
  disabled = false,
  noResultsText = "No se encontraron resultados",
  className = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const listboxId = useId();

  // OPTIMIZACIÓN (Performance):
  // Filtrado memoizado con useMemo para evitar cómputos y parpadeos en cada renderizado.
  const filteredOptions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    );
  }, [options, searchTerm]);

  // Opción actualmente seleccionada
  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value]
  );

  // Al abrir el dropdown, enfocar automáticamente el input de búsqueda y resetear índice
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  // BUG FIX (a11y & UX): Cierre al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // BUG FIX (a11y): Soporte completo para navegación por teclado (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botón Trigger del Combobox con Atributos ARIA */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        role="combobox"
        aria-autocomplete="list"
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container border transition-all text-left outline-none ${
          isOpen
            ? "border-secondary ring-2 ring-secondary/20 bg-surface-bright"
            : "border-outline-variant hover:border-outline bg-surface-container"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex flex-col overflow-hidden">
          {selectedOption ? (
            <>
              <span className="text-sm font-semibold text-on-surface truncate">
                {selectedOption.label}
              </span>
              {selectedOption.sublabel && (
                <span className="text-xs text-outline truncate mt-0.5">
                  {selectedOption.sublabel}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-outline truncate">{placeholder}</span>
          )}
        </div>

        <span
          className={`material-symbols-outlined text-outline transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-secondary" : ""
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>

      {/* Desplegable de Opciones */}
      {isOpen && (
        <div 
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full bg-surface-bright border border-surface-variant rounded-2xl shadow-2xl overflow-hidden max-h-60 flex flex-col animate-fade-in"
        >
          {/* Input de Búsqueda Interno */}
          <div className="p-2 border-b border-surface-variant/60 sticky top-0 bg-surface-bright z-10">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-container border border-outline-variant/60 focus:border-secondary focus:outline-none text-on-surface"
              />
            </div>
          </div>

          {/* Lista de Resultados Opciones */}
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-xs text-center text-outline">
                {noResultsText}
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-secondary/15 text-secondary font-bold"
                        : isHighlighted
                        ? "bg-surface-variant/40 text-on-surface"
                        : "text-on-surface hover:bg-surface-variant/20"
                    }`}
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-outline truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 ml-2">
                        check
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
