import { useAppContext } from "./context/AppContext";

// ─── Dark palette ───────────────────────────────────────────────
export const DARK = {
  bg: "#0B0813",
  card: "rgba(255,255,255,0.075)",
  cardSoft: "rgba(255,255,255,0.065)",
  primary: "#7136FD",
  primarySoft: "rgba(113, 54, 253, 0.15)",
  textMuted: "#BEB3CB",
  textSoft: "#DED6FF",
  amber: "#F6A623",
  danger: "#FF6262",
  green: "#20E69C",
  border: "rgba(255,255,255,0.18)",
  borderSoft: "rgba(255,255,255,0.14)",
  text: "#FFFFFF",
  // gradient used as page background
  gradientColors: ["#3E0D6F", "#1C0B35", "#0B0813", "#0B0813"],
  gradientLocations: [0, 0.15, 0.45, 0.92],
  // bottom nav / modal sheet bg
  navBg: "#0B0813",
  modalBg: "#10092A",
  tabIndicator: "#7136FD",
  tabInactive: "#A89AB8",
};

// ─── Light palette ───────────────────────────────────────────────
export const LIGHT = {
  bg: "#F8F5FF",
  card: "rgba(99, 38, 232, 0.05)",
  cardSoft: "rgba(99, 38, 232, 0.03)",
  primary: "#6326E8",
  primarySoft: "rgba(99, 38, 232, 0.10)",
  textMuted: "#6B5F85",
  textSoft: "#4A3870",
  amber: "#D4830B",
  danger: "#D83737",
  green: "#0BA360",
  border: "rgba(99, 38, 232, 0.12)",
  borderSoft: "rgba(99, 38, 232, 0.08)",
  text: "#100820",
  gradientColors: ["#E2D4FF", "#F0E8FF", "#F8F5FF", "#F8F5FF"],
  gradientLocations: [0, 0.15, 0.45, 0.92],
  navBg: "#FFFFFF",
  modalBg: "#F0E8FF",
  tabIndicator: "#6326E8",
  tabInactive: "#8E80AA",
};

export type ThemePalette = {
  bg: string;
  card: string;
  cardSoft: string;
  primary: string;
  primarySoft: string;
  textMuted: string;
  textSoft: string;
  amber: string;
  danger: string;
  green: string;
  border: string;
  borderSoft: string;
  text: string;
  gradientColors: string[];
  gradientLocations: number[];
  navBg: string;
  modalBg: string;
  tabIndicator: string;
  tabInactive: string;
};

/** Returns the current palette based on the global isDarkMode flag. */
export function useTheme(): ThemePalette {
  const { isDarkMode } = useAppContext();
  return isDarkMode ? DARK : LIGHT;
}
