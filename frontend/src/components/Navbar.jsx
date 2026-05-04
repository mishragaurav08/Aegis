import React, { useEffect, useState } from 'react';

const Navbar = ({ setActivePage, activePage }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Security Overview' },
    { id: 'assets', label: 'Manage Systems' },
    { id: 'risks', label: 'Risk Assessment' },
    { id: 'audit', label: 'System Activity' }
  ];

  return (
    <nav className={`panel-3d border-primary/30 relative z-20 transition-transform duration-500 ease-out ${mounted ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-between p-2 md:px-4">
        {/* Left Side: Logo (No Hover) */}
        <div className="flex items-center cursor-pointer" onClick={() => setActivePage('dashboard')}>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Aegis" className="h-6 md:h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Navigation Items (ONLY HOVER EFFECTS HERE) */}
        <div className="flex items-center gap-2 md:gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                tech-btn nav-btn-hover px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest
                ${activePage === item.id 
                  ? 'bg-primary text-bg border-primary translate-x-[2px] translate-y-[2px] shadow-none' 
                  : 'bg-surface text-text'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side: Status */}
        <div className="hidden lg:flex items-center gap-3 border-l border-border pl-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-accent uppercase font-bold tracking-widest leading-none">Status</span>
            <span className="text-[10px] text-primary font-mono font-bold leading-none mt-1">ENCRYPTED_LINK</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
