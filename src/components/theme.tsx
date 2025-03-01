// src/components/theme.tsx
export const oceanTheme = {
  colors: {
    primary: {
      DEFAULT: "#20B2AA", // Turquoise
      hover: "#1A918A",
      foreground: "#FFFFFF",
    },
    background: {
      DEFAULT: "#0B1B2D", // Deep navy
      subtle: "#142438",
    },
    card: {
      DEFAULT: "#1E3D59", // Lighter blue
      hover: "#264B6B",
      foreground: "#E0F4FF",
    },
    muted: {
      DEFAULT: "#263D52",
      foreground: "#A0C2D9",
    },
    accent: {
      DEFAULT: "#4DA8DA", // Light blue accent
      foreground: "#FFFFFF",
    },
    border: "#2A4562",
    input: "#1E3D59",
  },
  // Add custom CSS
  styles: `
    .wave-gradient {
      background: linear-gradient(180deg, #0B1B2D 0%, #1E3D59 100%);
    }
    
    .ocean-card {
      background: rgba(30, 61, 89, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(74, 168, 218, 0.1);
      transition: all 0.3s ease;
    }
    
    .ocean-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  `,
};