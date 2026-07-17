"use client";

import { useEffect, useRef, useState } from "react";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce logic for the search filter
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsSearching(false);
    }, 200); // 200ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Sync selected option text
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on debounced search query
  const filteredOptions = options.filter((opt) => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      opt.label.toLowerCase().includes(query) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    );
  });

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Combobox Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
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
        <span className="material-symbols-outlined text-outline shrink-0 ml-2 select-none">
          unfold_more
        </span>
      </button>

      {/* Hidden input to support native form validation (required) */}
      <input
        type="text"
        required={required}
        value={value || ""}
        onChange={() => {}}
        tabIndex={-1}
        className="opacity-0 absolute inset-x-0 bottom-0 h-0 w-full pointer-events-none"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-surface-bright border border-surface-variant shadow-2xl p-2 animate-fade-in max-h-[300px] flex flex-col">
          {/* Search Box */}
          <div className="relative flex items-center mb-2">
            <span className="material-symbols-outlined text-outline absolute left-3 text-lg select-none">
              search
            </span>
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-surface-container border border-outline-variant focus:outline-none focus:border-secondary"
            />
            {isSearching && (
              <div className="absolute right-3 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Options List */}
          <ul className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <li className="text-xs text-outline text-center py-6 px-4">
                {noResultsText}
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        isSelected
                          ? "bg-secondary-container text-on-secondary-container font-semibold"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className={`text-xs truncate mt-0.5 ${isSelected ? "text-on-secondary-container/80" : "text-outline"}`}>
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-lg shrink-0 ml-2 select-none">
                          check
                        </span>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
