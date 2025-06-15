import { h } from 'preact';

/**
 * SacredGeometrySVG — Seed of Life motif for page headers.
 * Accessible, responsive, and visually harmonious.
 */
export default function SacredGeometrySVG({ size = 96, className = '' }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`mx-auto drop-shadow-lg ${className}`}
      style={{ shapeRendering: 'geometricPrecision' }}
      aria-label="Sacred Geometry Seed of Life"
      role="img"
      focusable="false"
      tabIndex="-1"
    >
      <circle cx="60" cy="30" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
      <circle cx="60" cy="90" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
      <circle cx="30" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
      <circle cx="90" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
      <circle cx="42.4" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="77.6" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="42.4" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="77.6" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
    </svg>
  );
} 