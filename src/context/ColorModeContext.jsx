import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { createAppTheme } from "../theme/theme";

const KEY = "nutrilens_color_mode";
const ColorModeContext = createContext({ preference: "system", mode: "light", setPreference: () => {} });

function readPreference() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
    // migrate the v1 setting
    const legacy = JSON.parse(localStorage.getItem("userSettings") || "null");
    if (legacy && typeof legacy.darkMode === "boolean") return legacy.darkMode ? "dark" : "light";
  } catch {
    /* ignore */
  }
  return "system";
}

export function ColorModeProvider({ children }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [preference, setPreference] = useState(readPreference);
  const mode = preference === "system" ? (prefersDark ? "dark" : "light") : preference;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, preference);
    } catch {
      /* ignore */
    }
  }, [preference]);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#0b1210" : "#15803d");
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const value = useMemo(() => ({ preference, mode, setPreference }), [preference, mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);
