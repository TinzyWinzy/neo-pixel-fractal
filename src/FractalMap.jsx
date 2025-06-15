import { h } from 'preact';
import { Link } from 'wouter';
import { useState } from 'preact/hooks';

// Fractal map data (can be generated or fetched in future)
const nodes = [
  { id: 'A', slug: 'white-half-moon', title: "White Half Moon's Fire", desc: 'Ritual, identity, entropy, fractal selfhood', tags: ['ritual', 'identity', 'entropy'] },
  { id: 'B', slug: 'neo-pixel-fractal', title: 'Neo-Pixel Fractal', desc: 'Fractal modularity, pixel logic, entropy as style', tags: ['fractal', 'design', 'entropy'] },
  { id: 'C', slug: 'pixel-systems-design', title: 'Pixel Systems', desc: 'Retro UI, memory coding, fractal padding', tags: ['pixel', 'retro', 'fractal'] },
  { id: 'D', slug: 'agent-garden-architecture', title: 'Agent Garden Architecture', desc: 'Holonic agents, modular orchestration, living systems', tags: ['agent', 'holonic', 'modular'] },
  { id: 'E', slug: 'entropy-agents-crypto', title: 'Entropy-Aware Agents in Crypto Trading', desc: 'Q-learning, holonic structure, entropy as signal', tags: ['entropy', 'crypto', 'agent'] },
];
const links = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'A', to: 'E' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'D', to: 'E' },
  { from: 'C', to: 'A' },
];

const nodePos = {
  A: { x: 200, y: 80 },
  B: { x: 100, y: 200 },
  C: { x: 300, y: 200 },
  D: { x: 100, y: 320 },
  E: { x: 300, y: 320 },
};

export default function FractalMap() {
  const [hovered, setHovered] = useState(null);
  return (
    <div class="w-full flex flex-col items-center my-8">
      <svg viewBox="0 0 400 400" width="100%" height="340" style={{ maxWidth: 480 }}>
        {/* Draw links */}
        {links.map((l, i) => (
          <line
            key={i}
            x1={nodePos[l.from].x}
            y1={nodePos[l.from].y}
            x2={nodePos[l.to].x}
            y2={nodePos[l.to].y}
            stroke="#7755aa"
            strokeWidth={hovered && (hovered === l.from || hovered === l.to) ? 4 : 2}
            opacity={hovered && !(hovered === l.from || hovered === l.to) ? 0.2 : 0.7}
          />
        ))}
        {/* Draw nodes */}
        {nodes.map(n => (
          <Link href={`/blog/${n.slug}`} key={n.id}>
            <g
              tabIndex={0}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={nodePos[n.id].x}
                cy={nodePos[n.id].y}
                r={hovered === n.id ? 32 : 26}
                fill={hovered === n.id ? '#fbbf24' : '#fff'}
                stroke="#7755aa"
                strokeWidth={hovered === n.id ? 4 : 2}
                filter={hovered === n.id ? 'drop-shadow(0 0 12px #fbbf24cc)' : ''}
              />
              <text
                x={nodePos[n.id].x}
                y={nodePos[n.id].y + 6}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize={hovered === n.id ? 18 : 15}
                fill="#0f4c5c"
                pointerEvents="none"
              >{n.title}</text>
              {/* Tooltip */}
              {hovered === n.id && (
                <g>
                  <rect x={nodePos[n.id].x - 90} y={nodePos[n.id].y - 60} width="180" height="54" rx="10" fill="#fffbe6" stroke="#fbbf24" strokeWidth="2" />
                  <text x={nodePos[n.id].x} y={nodePos[n.id].y - 40} textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#7755aa">{n.desc}</text>
                  <text x={nodePos[n.id].x} y={nodePos[n.id].y - 20} textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#0f4c5c">{n.tags.join(', ')}</text>
                </g>
              )}
            </g>
          </Link>
        ))}
      </svg>
      <div class="mt-4 text-mystic font-elegant text-center text-sm max-w-lg">
        <b>Fractal Map:</b> Click a node to visit its post. Hover to see details. Lines show resonance.
      </div>
    </div>
  );
} 