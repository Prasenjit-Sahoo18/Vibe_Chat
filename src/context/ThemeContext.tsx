"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("vibechat_theme") as Theme) || "dark";
    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let darkActive = true;

    if (theme === "system") {
      darkActive = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      darkActive = theme === "dark";
    }

    setIsDark(darkActive);
    if (darkActive) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("vibechat_theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
