import { h } from 'preact';
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
  return (
    <nav class="fixed top-0 left-0 w-full z-50 bg-frost bg-opacity-90 border-b-2 border-mystic flex items-center justify-between px-4 py-2 shadow-lg"
      role="navigation" aria-label="Main Navigation">
      <Link href="/" class="flex items-center gap-2 focus:outline-none">
        <SacredGeometrySVG size={36} className="mr-2" />
        <span class="font-pixel text-lg text-entropy">Vacili</span>
      </Link>
      <ul class="flex gap-2 sm:gap-4 items-center">
        {navLinks.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              class={`px-3 py-2 rounded-lg font-pixel flex items-center gap-1 transition border-2 border-transparent hover:border-entropy hover:bg-mystic hover:text-beige focus:border-entropy focus:bg-mystic focus:text-beige ${current === link.href ? 'bg-entropy text-beige border-entropy' : 'text-graphite'}`}
              aria-current={current === link.href ? 'page' : undefined}
            >
              <span class="text-xl">{link.icon}</span>
              <span class="hidden sm:inline">{link.label}</span>
            </Link>
          </li>
        ))}
        {isLoggedIn && (
          <>
            <li>
              <Link href="/dashboard" class={`px-3 py-2 rounded-lg font-pixel flex items-center gap-1 transition border-2 border-transparent hover:border-entropy hover:bg-mystic hover:text-beige focus:border-entropy focus:bg-mystic focus:text-beige ${current === '/dashboard' ? 'bg-entropy text-beige border-entropy' : 'text-graphite'}`}>⚙️ <span class="hidden sm:inline">Dashboard</span></Link>
            </li>
            <li>
              <Link href="/admin" class={`px-3 py-2 rounded-lg font-pixel flex items-center gap-1 transition border-2 border-transparent hover:border-entropy hover:bg-mystic hover:text-beige focus:border-entropy focus:bg-mystic focus:text-beige ${current === '/admin' ? 'bg-entropy text-beige border-entropy' : 'text-graphite'}`}>🛡️ <span class="hidden sm:inline">Admin</span></Link>
            </li>
          </>
        )}
      </ul>
      <div>
        {isLoggedIn ? (
          <button class="ml-4 px-3 py-1 rounded font-pixel bg-mystic text-graphite border border-mystic hover:bg-amber hover:text-graphite hover:border-amber" onClick={logout}>Logout</button>
        ) : (
          <button class="ml-4 px-3 py-1 rounded font-pixel bg-bytegreen text-beige border border-bytegreen hover:bg-amber hover:text-graphite hover:border-amber" onClick={() => login('admin')}>Login</button>
        )}
      </div>
    </nav>
  );
} 