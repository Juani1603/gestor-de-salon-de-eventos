'use client';

import { Home, Calendar, Users, FileText, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Eventos', icon: Calendar, path: '/eventos' },
  { name: 'Reuniones', icon: Users, path: '/reuniones' },
  { name: 'Cotizaciones', icon: FileText, path: '/cotizaciones' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Menu Button con animación */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Overlay con animación */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar con animación de slide solo en mobile */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : '-100%') : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="
          fixed top-0 left-0 h-screen w-64 z-40
          bg-white border-r border-[#E8E8E8]
        "
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo con animación de entrada */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Image
              src="/logo.png"
              alt="Salón Eventos Logo"
              width={150}
              height={40}
              className="rounded-lg"
            />
          </motion.div>

          {/* Navigation con animación escalonada */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
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
                </motion.div>
              );
            })}
          </nav>

          {/* Footer con animación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4 border-t border-[#E8E8E8]"
          >
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#3C3C3C] truncate">Admin</p>
                <p className="text-xs text-[#9CA3AF]">Sistema v1.0</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}