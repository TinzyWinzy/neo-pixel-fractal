import { h } from 'preact';

/**
 * SacredGeometrySVG — Dynamic sacred geometry motifs for page headers.
 * Props:
 *   - type: 'seed-of-life' | 'vesica-piscis' | 'spiral' | 'flower-of-life' | ...
 *   - colorPrimary: main stroke color
 *   - colorAccent: accent stroke color
 *   - animate: boolean or animation type
 *   - size: px
 *   - phase: optional, for theming
 *   - className: string
 */
export default function SacredGeometrySVG({
  type = 'seed-of-life',
  colorPrimary = '#0f4c5c',
  colorAccent = '#fbbf24',
  animate = false,
  size = 96,
  phase,
  className = '',
}) {
  // Motif renderers
  const motifs = {
    'seed-of-life': () => (
      <g>
        <circle cx="60" cy="30" r="28" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <circle cx="60" cy="90" r="28" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <circle cx="30" cy="60" r="28" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <circle cx="90" cy="60" r="28" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <circle cx="42.4" cy="42.4" r="28" fill="none" stroke={colorAccent} strokeWidth="2" />
        <circle cx="77.6" cy="42.4" r="28" fill="none" stroke={colorAccent} strokeWidth="2" />
        <circle cx="42.4" cy="77.6" r="28" fill="none" stroke={colorAccent} strokeWidth="2" />
        <circle cx="77.6" cy="77.6" r="28" fill="none" stroke={colorAccent} strokeWidth="2" />
      </g>
    ),
    'vesica-piscis': () => (
      <g>
        <ellipse cx="60" cy="60" rx="28" ry="48" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <ellipse cx="60" cy="60" rx="48" ry="28" fill="none" stroke={colorAccent} strokeWidth="2" />
      </g>
    ),
    'spiral': () => (
      <g>
        <path d="M60,60 m0,-40 a40,40 0 1,1 -40,40" fill="none" stroke={colorPrimary} strokeWidth="2" />
        <path d="M60,60 m0,-30 a30,30 0 1,1 -30,30" fill="none" stroke={colorAccent} strokeWidth="2" />
      </g>
    ),
    'flower-of-life': () => (
      <g>
        {/* 7 overlapping circles */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle
            key={i}
            cx={60 + 28 * Math.cos((angle * Math.PI) / 180)}
            cy={60 + 28 * Math.sin((angle * Math.PI) / 180)}
            r="28"
            fill="none"
            stroke={i % 2 === 0 ? colorPrimary : colorAccent}
            strokeWidth="2"
          />
        ))}
        <circle cx="60" cy="60" r="28" fill="none" stroke={colorAccent} strokeWidth="2" />
      </g>
    ),
  };

  // Animation (simple pulse)
  const animation = animate
    ? {
        animation: 'sacred-pulse 2.4s infinite ease-in-out',
      }
    : {};

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`mx-auto drop-shadow-lg ${className}`}
      style={{ shapeRendering: 'geometricPrecision', ...animation }}
      aria-label={`Sacred Geometry: ${type}`}
      role="img"
      focusable="false"
      tabIndex="-1"
    >
      {motifs[type] ? motifs[type]() : motifs['seed-of-life']()}
      {animate && (
        <style>{`
          @keyframes sacred-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; transform: scale(1.04); }
          }
        `}</style>
      )}
    </svg>
  );
} 