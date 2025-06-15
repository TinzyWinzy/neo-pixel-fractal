import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Link, useRoute } from 'wouter';
import SacredGeometrySVG from './SacredGeometrySVG.jsx';
import { useAuth } from './AuthContext.jsx';

const navLinks = [
  { href: '/', label: 'Home', icon: '☉' },
  { href: '/blog', label: 'Blog', icon: '⌬' },
  { href: '/blog/fractal-map', label: 'Fractal Map', icon: '✦' },
  { href: '/about', label: 'About', icon: '☾' },
  { href: '/contact', label: 'Contact', icon: '|' },
];

export default function SacredNav() {
  const [match, params] = useRoute('/:section*');
  const current = window.location.pathname;
  const { isLoggedIn, userRole, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  // Combine nav links with conditional admin/dashboard
  const fullLinks = [
    ...navLinks,
    ...(isLoggedIn ? [
      { href: '/dashboard', label: 'Dashboard', icon: '⚙️' },
      { href: '/admin', label: 'Admin', icon: '🛡️' },
    ] : [])
  ];
  return (
    <nav class="fixed top-0 left-0 w-full z-50 bg-frost bg-opacity-90 border-b-2 border-mystic flex items-center justify-between px-2 py-1 sm:px-4 sm:py-2 shadow-lg"
      role="navigation" aria-label="Main Navigation">
      <Link href="/" class="flex items-center gap-2 focus:outline-none">
        <SacredGeometrySVG size={28} className="mr-1 sm:mr-2" />
        <span class="font-pixel text-base sm:text-lg text-entropy">Vacili</span>
      </Link>
      {/* Hamburger for mobile */}
      <button class="sm:hidden ml-auto mr-2 p-2 rounded focus:outline-none" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
        <span class="text-2xl">☰</span>
      </button>
      {/* Nav links */}
      <ul class={`fixed sm:static top-12 left-0 w-full sm:w-auto bg-frost bg-opacity-95 sm:bg-transparent flex-col sm:flex-row flex sm:flex gap-0 sm:gap-2 items-center transition-all duration-200 ${open ? 'flex' : 'hidden sm:flex'}`} style={{ boxShadow: open ? '0 2px 16px 0 var(--mystic)' : 'none' }}>
        {fullLinks.map(link => (
          <li key={link.href} class="w-full sm:w-auto">
            <Link
              href={link.href}
              class={`w-full sm:w-auto px-4 py-3 sm:px-3 sm:py-2 rounded-lg font-pixel flex items-center gap-1 transition border-2 border-transparent hover:border-entropy hover:bg-mystic hover:text-beige focus:border-entropy focus:bg-mystic focus:text-beige ${current === link.href ? 'bg-entropy text-beige border-entropy' : 'text-graphite'} text-lg sm:text-base`}
              aria-current={current === link.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <span class="text-xl sm:text-lg">{link.icon}</span>
              <span class="inline sm:inline">{link.label}</span>
            </Link>
          </li>
        ))}
        <li class="w-full sm:w-auto flex justify-center">
          {isLoggedIn ? (
            <button class="btn ml-0 sm:ml-4 w-full sm:w-auto my-2 sm:my-0" onClick={() => { setOpen(false); logout(); }}>Logout</button>
          ) : (
            <button class="btn ml-0 sm:ml-4 w-full sm:w-auto my-2 sm:my-0" onClick={() => { setOpen(false); login('admin'); }}>Login</button>
          )}
        </li>
      </ul>
    </nav>
  );
} 