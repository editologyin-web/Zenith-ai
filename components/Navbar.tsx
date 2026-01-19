
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-[#050505]/20 border-b border-white/5">
      <div className="text-xl font-bold tracking-tighter uppercase">
        FRIZZY <span className="text-white/40 font-light">MUSIC</span>
      </div>
      <div className="hidden md:flex items-center space-x-12">
        <NavLink href="#">Design</NavLink>
        <NavLink href="#">Audio</NavLink>
        <NavLink href="#">Tech Specs</NavLink>
        <NavLink href="#">Support</NavLink>
      </div>
      <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full uppercase tracking-widest hover:bg-white/90 transition-colors">
        Buy
      </button>
    </nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-xs uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition-colors"
  >
    {children}
  </a>
);

export default Navbar;
