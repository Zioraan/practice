import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "fellowship";
  });
  const [previousTheme, setPreviousTheme] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (isTransitioning) return;

    const nextTheme = theme === "fellowship" ? "sauron" : "fellowship";
    setPreviousTheme(theme);
    setTheme(nextTheme);
    setIsTransitioning(true);

    // This duration should be long enough for the background wipe and card ripple
    setTimeout(() => {
      setIsTransitioning(false);
      setPreviousTheme(null);
    }, 2500);
  };

  const value = {
    theme,
    toggleTheme,
    isTransitioning,
    previousTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
