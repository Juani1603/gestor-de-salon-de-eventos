'use client';

import { Home, Calendar, Users, FileText, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40
          glass-card-dark text-white p-6
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo/Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Salón Eventos
          </h1>
          <p className="text-sm text-gray-400 mt-1">Sistema de Gestión</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
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
                  ${isActive ? 'sidebar-item-active' : 'text-gray-300 hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card p-3 text-xs text-gray-400">
            <p className="font-semibold text-white mb-1">Usuario Admin</p>
            <p>Sistema v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}