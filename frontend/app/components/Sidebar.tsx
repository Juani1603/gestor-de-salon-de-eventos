'use client';

import { Home, Calendar, Users, FileText, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Eventos', icon: Calendar, path: '/eventos' },
  { name: 'Reuniones', icon: Users, path: '/reuniones' },
  { name: 'Cotizaciones', icon: FileText, path: '/cotizaciones' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40
          bg-white border-r border-[#E8E8E8]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Salón Eventos Logo"
              width={150}
              height={40}
              className="rounded-lg"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    sidebar-item
                    ${isActive ? 'sidebar-item-active' : ''}
                  `}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer info */}
          <div className="pt-4 border-t border-[#E8E8E8]">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#3C3C3C] truncate">Admin</p>
                <p className="text-xs text-[#9CA3AF]">Sistema v1.0</p>
              </div>
            </div>
          </div>
        </div> {/* ← Cierre del div contenedor */}
      </aside>
    </>
  );
}