/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['VT323', 'monospace'],
        elegant: ['Inter', 'IBM Plex Serif', 'serif'],
      },
      colors: {
        frost: '#c8e0f4',
        beige: '#f5f0e6',
        entropy: '#e95e5e',
        bytegreen: '#6fa38e',
        graphite: '#1e1e1e',
        amber: '#f8c76c',
        mystic: '#7755aa',
      },
      spacing: {
        'px-2': '2px',
        'px-4': '4px',
        'px-8': '8px',
        'px-16': '16px',
        'px-32': '32px',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(200,224,244,0.25)',
      },
      backgroundImage: {
        noise: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
}

