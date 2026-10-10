import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';

export function LanguageSelector({ variant = 'default', className = '' }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const isLight = variant === 'light';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          isLight
            ? 'bg-white/90 hover:bg-white text-stone-800 border border-stone-200/80 shadow-sm'
            : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200/60 shadow-sm'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-forest-700 shrink-0" />
        <span>{currentLang.native}</span>
        <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-2xl bg-white shadow-elevated border border-stone-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
            Language / भाषा / ભાષા
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-forest-50 text-forest-900 font-bold'
                    : 'text-stone-700 hover:bg-stone-50 font-medium'
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-stone-400">{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-forest-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
