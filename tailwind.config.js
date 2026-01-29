/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./docs/**/*.{js,ts,vue,md}",
        "./docs/.vitepress/**/*.{js,ts,vue,css}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
            },
            colors: {
                canvas: { DEFAULT: '#FAFAFA', subtle: '#F4F4F5' },
                brand: { 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd' },
                emerald: { 400: '#34D399', 500: '#10B981', 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0' },
                amber: { 400: '#fbbf24', 500: '#f59e0b', 100: '#fef3c7' },
                neutral: { 50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8', 400: '#A1A1AA', 500: '#71717A', 600: '#52525B', 700: '#3F3F46', 800: '#27272A', 900: '#18181B' },
            },
            boxShadow: {
                'card': '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
                'glow-lg': '0 0 30px rgba(59, 130, 246, 0.25)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        }
    },
    plugins: [],
}
