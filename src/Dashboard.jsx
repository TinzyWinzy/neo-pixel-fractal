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
          <h3 class="font-pixel text-lg text-entropy mb-2">Phase Control</h3>
          <PhaseControl />
        </section>
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Ritual/Phase To-Do</h3>
          <ToDoViewer />
        </section>
        <section>
          <h3 class="font-pixel text-lg text-entropy mb-2">Admin Tools</h3>
          <div class="text-mystic">(Admin features coming soon: post management, analytics, user controls.)</div>
        </section>
      </div>
    </div>
  );
}

function PhaseControl() {
  const phases = [
    { key: 'ritual', label: 'Ritual Structure', desc: 'Foundational content, static site, sacred geometry, agent annotation.' },
    { key: 'symbolic', label: 'Symbolic/Visual', desc: 'Dynamic SVGs, mind map, to-do viewer, phase control.' },
    { key: 'ai', label: 'AI Playground', desc: 'AI features, memory, journaling, dashboard.' },
    { key: 'sync', label: 'Sync & Gamification', desc: 'Automation, gamification, phase sync.' },
    { key: 'persona', label: 'Persona/Community', desc: 'Persona expansion, community, advanced rituals.' },
  ];
  const [phase, setPhase] = useState(() => {
    try {
      return localStorage.getItem('current-phase') || 'ritual';
    } catch {
      return 'ritual';
    }
  });
  function selectPhase(key) {
    setPhase(key);
    localStorage.setItem('current-phase', key);
  }
  const current = phases.find(p => p.key === phase) || phases[0];
  return (
    <div class="flex flex-col gap-2 mb-2">
      <div class="flex gap-2 flex-wrap">
        {phases.map(p => (
          <button
            key={p.key}
            class={`px-3 py-1 rounded font-pixel border-2 ${phase === p.key ? 'bg-amber text-graphite border-amber' : 'bg-beige text-mystic border-mystic'} transition`}
            onClick={() => selectPhase(p.key)}
          >{p.label}</button>
        ))}
      </div>
      <div class="mt-2 font-elegant text-sm text-mystic">
        <b>Current Phase:</b> {current.label}<br />
        <span class="text-xs">{current.desc}</span>
      </div>
    </div>
  );
}

function ToDoViewer() {
  const defaultTasks = [
    { text: 'Phase I: Ritual Structure (complete)', phase: 'ritual', done: true },
    { text: 'Phase II: Symbolic/Visual Expansion', phase: 'symbolic', done: false },
    { text: 'Phase III: AI Playground & Memory', phase: 'ai', done: false },
    { text: 'Phase IV: Sync & Gamification', phase: 'sync', done: false },
    { text: 'Phase V: Persona/Community', phase: 'persona', done: false },
  ];
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ritual-tasks')) || defaultTasks;
    } catch {
      return defaultTasks;
    }
  });
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState(() => {
    try {
      return localStorage.getItem('current-phase') || 'ritual';
    } catch {
      return 'ritual';
    }
  });
  useEffect(() => {
    function syncPhase() {
      setPhase(localStorage.getItem('current-phase') || 'ritual');
    }
    window.addEventListener('storage', syncPhase);
    return () => window.removeEventListener('storage', syncPhase);
  }, []);
  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks(tsk => {
      const next = [...tsk, { text: input, phase: 'custom', done: false }];
      localStorage.setItem('ritual-tasks', JSON.stringify(next));
      return next;
    });
    setInput('');
  }
  function toggleTask(i) {
    setTasks(tsk => {
      const next = tsk.map((t, j) => j === i ? { ...t, done: !t.done } : t);
      localStorage.setItem('ritual-tasks', JSON.stringify(next));
      return next;
    });
  }
  function removeTask(i) {
    setTasks(tsk => {
      const next = tsk.filter((_, j) => j !== i);
      localStorage.setItem('ritual-tasks', JSON.stringify(next));
      return next;
    });
  }
  return (
    <div class="flex flex-col gap-2">
      <form onSubmit={addTask} class="flex gap-2 mb-2">
        <input
          class="border border-mystic rounded px-2 py-1 font-elegant text-sm flex-1"
          value={input}
          onInput={e => setInput(e.target.value)}
          placeholder="Add new ritual or phase task..."
        />
        <button class="px-2 py-1 rounded bg-bytegreen text-beige font-pixel hover:bg-amber hover:text-graphite border border-bytegreen transition" type="submit">Add</button>
      </form>
      <ul class="list-none p-0 m-0">
        {tasks.map((t, i) => (
          <li key={i} class={`flex items-center gap-2 mb-1 ${t.phase === phase ? 'bg-amber bg-opacity-20 rounded' : ''}`}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(i)} />
            <span class={`font-elegant text-sm flex-1 ${t.done ? 'line-through text-mystic' : ''}`}>{t.text}</span>
            <span class="font-pixel text-xs text-amber">{t.phase}</span>
            <button class="ml-1 text-xs text-entropy hover:text-amber" onClick={() => removeTask(i)} title="Remove">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 