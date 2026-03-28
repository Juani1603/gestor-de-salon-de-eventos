'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface TimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  suffix?: string;
}

export default function TimeSelect({ value, onChange, options, suffix = '' }: TimeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 border rounded-xl text-sm bg-white transition-all focus:outline-none ${
          open ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30' : 'border-[#EBEBEB] hover:border-[#FF6B35]/50'
        }`}
      >
        <span className="text-[#1C1C1C] font-medium">{value}{suffix}</span>
        <ChevronDown size={14} className={`text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-50 py-1 w-full max-h-48 overflow-y-auto">
          {options.map(opt => (
            <button key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                opt === value
                  ? 'bg-[#FFF4F0] text-[#FF6B35] font-semibold'
                  : 'text-[#3C3C3C] hover:bg-[#FFF4F0] hover:text-[#FF6B35]'
              }`}
            >
              {opt}{suffix}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}