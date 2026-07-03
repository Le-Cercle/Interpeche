/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#000b18',  // abysse
          900: '#00152a',  // mer profonde
          800: '#001e3c',  // fonds marins
          700: '#003d5c',
          600: '#006994',
          500: '#0096c7',
          400: '#00b4d8',
          300: '#48cae4',
          200: '#90e0ef',
          100: '#caf0f8',
          50:  '#e6f4f8',
        },
        coral: {
          400: '#ff9f47',
          500: '#f77f00',
          600: '#d46900',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'slide-up':      'slideUp 0.7s ease-out forwards',
        'scale-in':      'scaleIn 0.5s ease-out forwards',
        'bubble':        'bubble-rise linear infinite',
        'ray':           'ray-shimmer ease-in-out infinite',
        'wave-drift':    'wave-drift linear infinite',
        'fish-swim':     'fish-swim ease-in-out',
        'fish-return':   'fish-swim-reverse ease-in-out',
        'caustic':       'caustic-pulse ease-in-out infinite',
        'biolum':        'biolum-glow ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-18px)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bubble-rise': {
          '0%':   { transform: 'translateY(0) translateX(0px)',        opacity: '0' },
          '10%':  {                                                      opacity: '0.65' },
          '50%':  { transform: 'translateY(-50vh) translateX(14px)' },
          '90%':  {                                                      opacity: '0.25' },
          '100%': { transform: 'translateY(-110vh) translateX(-6px)', opacity: '0' },
        },
        'ray-shimmer': {
          '0%,100%': { opacity: '0.03' },
          '50%':     { opacity: '0.16' },
        },
        'wave-drift': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fish-swim': {
          '0%':   { transform: 'translateX(-180px)', opacity: '0' },
          '6%':   { opacity: '1' },
          '94%':  { opacity: '0.9' },
          '100%': { transform: 'translateX(110vw)',  opacity: '0' },
        },
        'fish-swim-reverse': {
          '0%':   { transform: 'translateX(110vw) scaleX(-1)',   opacity: '0' },
          '6%':   {                                               opacity: '0.8' },
          '94%':  {                                               opacity: '0.8' },
          '100%': { transform: 'translateX(-180px) scaleX(-1)', opacity: '0' },
        },
        'caustic-pulse': {
          '0%,100%': { backgroundPosition: '0% 0%',     opacity: '0.6' },
          '50%':     { backgroundPosition: '100% 100%', opacity: '1' },
        },
        'biolum-glow': {
          '0%,100%': { textShadow: '0 0 20px rgba(0,180,216,0.4)' },
          '50%':     { textShadow: '0 0 60px rgba(0,180,216,0.9), 0 0 100px rgba(0,180,216,0.3)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ocean-deep':      'linear-gradient(180deg,#000b18 0%,#001020 20%,#001e3c 50%,#003566 75%,#006994 100%)',
        'ocean-gradient':  'linear-gradient(135deg,#00152a 0%,#003d5c 40%,#006994 100%)',
      },
      boxShadow: {
        'ocean': '0 4px 30px rgba(0,105,148,0.25)',
        'coral': '0 4px 30px rgba(247,127,0,0.3)',
        'glass': '0 8px 32px rgba(0,40,64,0.15)',
        'glow':  '0 0 0 1px rgba(0,180,216,0.3), 0 20px 60px rgba(0,105,148,0.25)',
        'abyss': '0 25px 50px rgba(0,11,24,0.6)',
      },
    },
  },
  plugins: [],
}
