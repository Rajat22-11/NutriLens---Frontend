import { Box, Card, CardContent, LinearProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { fmt, pct } from "../utils/nutrition";

export function Logo({ size = 34, withText = true, textVariant = "h6" }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.2}>
      <Box component="img" src="/favicon.svg" alt="" sx={{ width: size, height: size, display: "block" }} />
      {withText && (
        <Typography variant={textVariant} sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Nutri
          <Box component="span" sx={{ color: "primary.main" }}>
            Lens
          </Box>
        </Typography>
      )}
    </Stack>
  );
}

/** Circular SVG progress ring. */
export function ProgressRing({ value = 0, max = 100, size = 120, stroke = 12, color, children, trackColor }) {
  const theme = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const over = max > 0 && value > max;
  const ring = over ? theme.palette.error.main : color || theme.palette.primary.main;
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} role="img" aria-label={`${Math.round(ratio * 100)}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor || alpha(theme.palette.text.primary, 0.08)} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{children}</Box>
    </Box>
  );
}

export function NutrientBar({ label, value, goal, unit, color, compact = false }) {
  const p = pct(value, goal);
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={0.6}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
          <Typography variant={compact ? "body2" : "subtitle2"}>{label}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
            {fmt(value, 1)}
          </Box>
          {goal ? ` / ${fmt(goal)}` : ""} {unit}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.min(p, 100)}
        sx={{ "& .MuiLinearProgress-bar": { bgcolor: p > 100 ? "error.main" : color } }}
      />
    </Box>
  );
}

export function StatCard({ icon, label, value, sub, color = "primary.main" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.2, sm: 2 }} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Box
            sx={(t) => {
              const c = color.includes(".") ? t.palette[color.split(".")[0]][color.split(".")[1]] : color;
              return { width: 48, height: 48, borderRadius: 3.5, display: "grid", placeItems: "center", bgcolor: alpha(c, 0.12), color: c, flexShrink: 0 };
            }}
          >
            {icon}
          </Box>
          <Box minWidth={0}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
              {value}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary">
                {sub}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ emoji = "🍽️", title, text, action }) {
  return (
    <Stack alignItems="center" textAlign="center" spacing={1.5} sx={{ py: 6, px: 2 }}>
      <Box sx={{ fontSize: 56, lineHeight: 1 }}>{emoji}</Box>
      <Typography variant="h6">{title}</Typography>
      {text && (
        <Typography color="text.secondary" maxWidth={420}>
          {text}
        </Typography>
      )}
      {action}
    </Stack>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">{children}</Typography>
      {action}
    </Stack>
  );
}
