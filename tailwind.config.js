/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexusBlack: "#0a0a0c", // Deep background
        nexusGray: "#121214",  // Card background
        // Agent Specific Colors (ECE Signal Logic)
        architect: "#10b981",    // Green (Generation)
        orchestrator: "#8b5cf6", // Purple (Logic/Flow)
        auditor: "#f59e0b",      // Yellow (Warning/Check)
        recovery: "#ef4444",     // Red (Error/Fix)
        ethics: "#06b6d4",       // Cyan (Balance)
        motivation: "#f472b6",   // Pink (Reward)
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(6, 182, 212, 0.3)',
        'neon-purple': '0 0 15px rgba(139, 92, 246, 0.3)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.3)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}