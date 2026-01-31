import { useEffect } from "react";

export interface RegionTheme {
  glow: string;
  accent: string;
}

const REGION_THEMES: Record<string, RegionTheme> = {
  tokyo: {
    glow: "hsla(340, 90%, 70%, 0.3)",
    accent: "hsl(340 90% 70%)"
  },
  america: {
    glow: "hsla(30, 90%, 60%, 0.3)",
    accent: "hsl(30 90% 60%)"
  },
  university: {
    glow: "hsla(120, 50%, 55%, 0.3)",
    accent: "hsl(120 50% 55%)"
  },
  mexico_city: {
    glow: "hsla(0, 85%, 65%, 0.3)",
    accent: "hsl(0 85% 65%)"
  },
  beirut: {
    glow: "hsla(280, 70%, 70%, 0.3)",
    accent: "hsl(280 70% 70%)"
  },
  cairo: {
    glow: "hsla(40, 90%, 60%, 0.3)",
    accent: "hsl(40 90% 60%)"
  },
  dubai: {
    glow: "hsla(200, 90%, 70%, 0.3)",
    accent: "hsl(200 90% 70%)"
  },
  default: {
    glow: "hsla(320, 90%, 60%, 0.3)",
    accent: "hsl(320 90% 60%)"
  }
};

export function useRegionTheme(regionId: string | null) {
  useEffect(() => {
    const theme = REGION_THEMES[regionId || "default"] || REGION_THEMES.default;
    const root = document.documentElement;

    root.style.setProperty("--region-glow", theme.glow);
    root.style.setProperty("--region-accent", theme.accent);

    return () => {
      const defaultTheme = REGION_THEMES.default;
      root.style.setProperty("--region-glow", defaultTheme.glow);
      root.style.setProperty("--region-accent", defaultTheme.accent);
    };
  }, [regionId]);
}

export function getRegionTheme(regionId: string): RegionTheme {
  return REGION_THEMES[regionId] || REGION_THEMES.default;
}
