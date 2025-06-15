import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useAuth } from './AuthContext.jsx';
import { useLocation } from 'wouter';
import SacredGeometrySVG from './SacredGeometrySVG.jsx';

export default function Dashboard() {
  const { isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (!isLoggedIn) setLocation('/');
  }, [isLoggedIn]);
  if (!isLoggedIn) return <div class="min-h-screen flex items-center justify-center text-entropy font-pixel">Access Denied</div>;
  const [theme, setTheme] = useState('auto');
  const [geometry, setGeometry] = useState('seed');
  // Placeholder analytics and bookmarks
  const mostTraversed = [
    { title: "White Half Moon's Fire", slug: 'white-half-moon' },
    { title: 'Neo-Pixel Fractal', slug: 'neo-pixel-fractal' },
  ];
  const bookmarks = [
    { title: 'Agent Garden Architecture', slug: 'agent-garden-architecture' },
  ];
  return (
    <div class="min-h-screen flex flex-col items-center bg-beige text-graphite px-4 py-8">
      <div class="mb-6 flex flex-col items-center">
        <SacredGeometrySVG size={72} />
        <h2 class="text-3xl mt-4 mb-2 font-pixel text-mystic whisper">Dashboard</h2>
        <div class="text-mystic font-elegant mb-4">Personalize your garden. View your journey. Access admin tools.</div>
      </div>
      <div class="glass p-6 rounded max-w-xl w-full flex flex-col gap-6 border-2 border-mystic">
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Preferences</h3>
          <div class="flex gap-4 flex-wrap">
            <label class="font-elegant">Theme:
              <select class="ml-2 p-1 rounded border border-mystic" value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label class="font-elegant">Sacred Geometry:
              <select class="ml-2 p-1 rounded border border-mystic" value={geometry} onChange={e => setGeometry(e.target.value)}>
                <option value="seed">Seed of Life</option>
                <option value="flower">Flower of Life (coming soon)</option>
                <option value="spiral">Golden Spiral (coming soon)</option>
              </select>
            </label>
          </div>
        </section>
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Most Traversed Patterns</h3>
          <ul class="list-disc ml-6">
            {mostTraversed.map(p => (
              <li key={p.slug}><a href={`/blog/${p.slug}`} class="text-bytegreen hover:underline">{p.title}</a></li>
            ))}
          </ul>
        </section>
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Bookmarks</h3>
          <ul class="list-disc ml-6">
            {bookmarks.map(p => (
              <li key={p.slug}><a href={`/blog/${p.slug}`} class="text-amber hover:underline">{p.title}</a></li>
            ))}
          </ul>
        </section>
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Admin Tools</h3>
          <div class="text-mystic">(Admin features coming soon: post management, analytics, user controls.)</div>
        </section>
      </div>
    </div>
  );
} 