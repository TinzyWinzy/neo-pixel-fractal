import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
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
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (isLoggedIn) setShowLogin(false); }, [isLoggedIn]);
  // Combine nav links with conditional admin/dashboard
  const fullLinks = [
    ...navLinks,
    ...(isLoggedIn ? [
      { href: '/dashboard', label: 'Dashboard', icon: '⚙️' },
      { href: '/admin', label: 'Admin', icon: '🛡️' },
    ] : [])
  ];
  return (
    <nav class="fixed top-0 left-0 w-full z-50 bg-frost bg-opacity-60 border-b-2 border-mystic flex items-center justify-between px-2 py-1 sm:px-4 sm:py-2 shadow-lg"
      role="navigation" aria-label="Main Navigation">
      <Link href="/" class="flex items-center gap-2 focus:outline-none">
        <SacredGeometrySVG size={24} className="mr-1 sm:mr-2" />
        <span class="font-pixel text-base sm:text-lg text-entropy">Vacili</span>
      </Link>
      {/* Hamburger for mobile */}
      <button class="sm:hidden ml-auto mr-2 p-2 rounded focus:outline-none" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
        <span class="text-2xl">☰</span>
      </button>
      {/* Mobile menu overlay/backdrop */}
      {open && (
        <div class="fixed inset-0 z-40 bg-graphite bg-opacity-40" onClick={() => setOpen(false)}></div>
      )}
      {/* Nav links */}
      <ul class={`fixed sm:static top-12 left-0 w-full sm:w-auto bg-frost bg-opacity-95 sm:bg-transparent flex-col sm:flex-row flex sm:flex gap-0 sm:gap-2 items-center transition-all duration-200 z-50 ${open ? 'flex' : 'hidden sm:flex'}`} style={{ boxShadow: open ? '0 2px 16px 0 var(--mystic)' : 'none', maxHeight: open ? '80vh' : '0', overflowY: open ? 'auto' : 'visible' }}>
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
            <button class="btn ml-0 sm:ml-4 w-full sm:w-auto my-2 sm:my-0" onClick={() => { setOpen(false); setShowLogin(true); }}>Login</button>
          )}
        </li>
      </ul>
      {showLogin && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-graphite bg-opacity-60">
          <div class="glass p-8 rounded flex flex-col gap-4 w-80 border-2 border-entropy relative">
            <button class="absolute top-2 right-2 text-entropy text-xl font-pixel" onClick={() => setShowLogin(false)} aria-label="Close">✕</button>
            <h2 class="text-2xl mb-2 font-pixel text-entropy whisper">Login</h2>
            <form onSubmit={e => {
              e.preventDefault();
              if (user === 'whitehalfmoon' && pass === 'changeme') {
                login('admin');
                setError('');
              } else {
                setError('Invalid credentials');
              }
            }} class="flex flex-col gap-3">
              <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Username" value={user} onInput={e => setUser(e.target.value)} required aria-label="Username" />
              <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="password" placeholder="Password" value={pass} onInput={e => setPass(e.target.value)} required aria-label="Password" />
              <button class="glass p-2 rounded font-pixel bg-entropy text-beige hover:bg-amber hover:text-graphite border border-entropy hover:glow" type="submit">Login</button>
              {error && <div class="text-entropy font-elegant">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </nav>
  );
} 