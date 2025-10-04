import { useTheme } from "../context/ThemeContext";

const THEME_BG_COLORS = {
  fellowship: "#f4f1e9",
  sauron: "#1c1c1c",
};

export default function ThemeBackground() {
  const { theme, previousTheme, isTransitioning } = useTheme();

  const currentColor = THEME_BG_COLORS[theme];
  const oldColor = previousTheme ? THEME_BG_COLORS[previousTheme] : null;

  return (
    <div className="fixed inset-0 z-[-1]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: currentColor }}
      />
      {isTransitioning && oldColor && (
        <div
          className="absolute inset-0 animate-theme-wipe"
          style={{ backgroundColor: oldColor }}
        />
      )}
    </div>
  );
}
