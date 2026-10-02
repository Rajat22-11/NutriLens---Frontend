import { alpha, createTheme } from "@mui/material/styles";

// "Fresh market" palette: leafy greens, turmeric gold and chilli accents.
export const MACRO_COLORS = {
  calories: "#16a34a",
  protein: "#6366f1",
  carbs: "#f59e0b",
  fat: "#f43f5e",
  fiber: "#14b8a6",
  sugar: "#f97316",
  sodium: "#64748b",
  cholesterol: "#a855f7",
};

export function createAppTheme(mode = "light") {
  const dark = mode === "dark";
  const bg = dark ? "#0b1210" : "#f6f8f3";
  const paper = dark ? "#111b17" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(20,40,25,0.08)";

  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? "#22c55e" : "#15803d", light: "#4ade80", dark: "#166534", contrastText: "#fff" },
      secondary: { main: "#f59e0b", light: "#fbbf24", dark: "#b45309", contrastText: "#1f1300" },
      error: { main: "#ef4444" },
      success: { main: "#16a34a" },
      warning: { main: "#f59e0b" },
      info: { main: "#0ea5e9" },
      background: { default: bg, paper },
      text: {
        primary: dark ? "#e7efe9" : "#12201a",
        secondary: dark ? "#9fb2a8" : "#51625a",
      },
      divider: border,
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.03em" },
      h2: { fontWeight: 800, letterSpacing: "-0.025em" },
      h3: { fontWeight: 800, letterSpacing: "-0.02em" },
      h4: { fontWeight: 750, letterSpacing: "-0.015em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 650 },
      button: { fontWeight: 650, textTransform: "none", letterSpacing: 0 },
      overline: { fontWeight: 700, letterSpacing: "0.12em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bg,
            backgroundImage: dark
              ? "radial-gradient(1200px 600px at 100% -10%, rgba(34,197,94,0.10), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(245,158,11,0.06), transparent 60%)"
              : "radial-gradient(1200px 600px at 100% -10%, rgba(34,197,94,0.12), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(245,158,11,0.10), transparent 60%)",
            backgroundAttachment: "fixed",
            WebkitFontSmoothing: "antialiased",
          },
          "::selection": { background: alpha("#22c55e", 0.3) },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12, paddingInline: 18, minHeight: 42 },
          sizeLarge: { minHeight: 50, paddingInline: 24, fontSize: "1rem", borderRadius: 14 },
          containedPrimary: {
            backgroundImage: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
            boxShadow: "0 8px 20px -8px rgba(21,128,61,0.55)",
            "&:hover": { backgroundImage: "linear-gradient(135deg, #16a34a 0%, #166534 100%)" },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${border}`,
            backgroundImage: "none",
            boxShadow: dark ? "none" : "0 1px 2px rgba(16,24,20,0.04), 0 8px 24px -12px rgba(16,24,20,0.08)",
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 10 } } },
      MuiTextField: { defaultProps: { fullWidth: true } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 99, height: 8, backgroundColor: alpha(dark ? "#fff" : "#12201a", 0.08) },
          bar: { borderRadius: 99 },
        },
      },
      MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 8, fontSize: 12, fontWeight: 500 } } },
      MuiToggleButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600, borderRadius: 10 } } },
      MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 650, minHeight: 44 } } },
    },
  });
}
