import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { NutrientBar, ProgressRing } from "./ui";
import { DEFAULT_GOALS, NUTRIENTS, fmt, pct, scoreMeta } from "../utils/nutrition";

const SOURCE_LABEL = {
  yolo: { label: "NutriLens Vision · on-device model", color: "success" },
  gemini: { label: "Gemini AI vision", color: "info" },
  manual: { label: "Logged manually", color: "default" },
};

export function MealImage({ meal, height = 320 }) {
  const [view, setView] = useState("detected");
  const src = view === "detected" && meal.annotated ? meal.annotated : meal.image;
  if (!src) return null;
  return (
    <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", bgcolor: "action.hover" }}>
      <Box component="img" src={src} alt="Your meal" sx={{ width: "100%", height, objectFit: "contain", display: "block" }} />
      {meal.annotated && meal.image && (
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
            backdropFilter: "blur(8px)",
            borderRadius: 2.5,
          }}
        >
          <ToggleButton value="detected">Detected</ToggleButton>
          <ToggleButton value="original">Original</ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
}

export default function MealResult({ meal, goals = DEFAULT_GOALS }) {
  const { foods, totals, insights } = meal;
  const score = insights.health_score;
  const sm = scoreMeta(score);
  const source = SOURCE_LABEL[meal.source];
  const calPct = pct(totals.calories, goals.calories);

  return (
    <Stack spacing={2.5}>
      {/* Headline */}
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" flexWrap={{ xs: "wrap", sm: "nowrap" }} useFlexGap spacing={3} alignItems="center" justifyContent="space-between">
            <ProgressRing value={totals.calories || 0} max={goals.calories} size={132} stroke={12}>
              <Box>
                <LocalFireDepartmentRoundedIcon sx={{ color: "secondary.main", fontSize: 20 }} />
                <Typography variant="h5" sx={{ lineHeight: 1 }}>
                  {fmt(totals.calories)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  kcal
                </Typography>
              </Box>
            </ProgressRing>
            <Box sx={{ flex: { xs: "1 1 100%", sm: 1 }, order: { xs: 3, sm: 0 }, minWidth: 0 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={1}>
                {source && <Chip size="small" label={source.label} color={source.color} variant="outlined" />}
                <Chip size="small" label={`${calPct}% of daily calories`} />
              </Stack>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {foods.map((f) => `${f.emoji} ${f.name}`).join("  ·  ")}
              </Typography>
              {insights.summary && <Typography color="text.secondary">{insights.summary}</Typography>}
            </Box>
            {score != null && (
              <Tooltip title="Health score based on protein & fibre density vs sugar, sodium and fat">
                <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 96 }}>
                  <ProgressRing value={score} max={100} size={84} stroke={8} color={sm.color}>
                    <Typography variant="h6" sx={{ color: sm.color }}>
                      {score}
                    </Typography>
                  </ProgressRing>
                  <Typography variant="caption" fontWeight={700} sx={{ color: sm.color }}>
                    {sm.label}
                  </Typography>
                </Stack>
              </Tooltip>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Foods */}
      <Grid container spacing={2}>
        {foods.map((f, i) => (
          <Grid key={`${f.name}-${i}`} size={{ xs: 12, sm: foods.length > 1 ? 6 : 12 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                  <Box sx={{ fontSize: 34, lineHeight: 1 }}>{f.emoji}</Box>
                  <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle1" noWrap>
                      {f.name} {f.count > 1 ? `×${f.count}` : ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~{fmt(f.weight)} g{f.confidence != null && meal.source !== "manual" ? ` · ${Math.round(f.confidence * 100)}% match` : ""}
                    </Typography>
                  </Box>
                  <Typography variant="h6">{fmt(f.nutrients.calories)}<Typography component="span" variant="caption" color="text.secondary"> kcal</Typography></Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {["protein", "carbs", "fat", "fiber"].map((k) => (
                    <Chip
                      key={k}
                      size="small"
                      label={`${NUTRIENTS.find((n) => n.key === k).label} ${fmt(f.nutrients[k], 1)}g`}
                      sx={{ bgcolor: (t) => alpha(NUTRIENTS.find((n) => n.key === k).color, t.palette.mode === "dark" ? 0.2 : 0.12) }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Nutrients vs goals */}
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h6" mb={0.5}>
            Nutrition breakdown
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
            Compared with your daily targets
          </Typography>
          <Grid container spacing={2.5}>
            {NUTRIENTS.filter((n) => n.key !== "calories").map((n) => (
              <Grid key={n.key} size={{ xs: 12, sm: 6 }}>
                <NutrientBar label={n.label} value={totals[n.key]} goal={goals[n.key]} unit={n.unit} color={n.color} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Insights */}
      {(insights.health_insight || insights.healthier_options?.length || insights.fun_fact) && (
        <Grid container spacing={2}>
          {insights.health_insight && (
            <Grid size={{ xs: 12, md: insights.healthier_options?.length ? 6 : 12 }}>
              <InsightCard icon={<AutoAwesomeRoundedIcon />} color="#16a34a" title="Health insight">
                <Typography>{insights.health_insight}</Typography>
              </InsightCard>
            </Grid>
          )}
          {insights.healthier_options?.length > 0 && (
            <Grid size={{ xs: 12, md: insights.health_insight ? 6 : 12 }}>
              <InsightCard icon={<SwapHorizRoundedIcon />} color="#6366f1" title="Make it healthier">
                <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5 }}>
                  {insights.healthier_options.map((t, i) => (
                    <Typography component="li" key={i}>
                      {t}
                    </Typography>
                  ))}
                </Stack>
              </InsightCard>
            </Grid>
          )}
          {insights.fun_fact && (
            <Grid size={12}>
              <InsightCard icon={<TipsAndUpdatesRoundedIcon />} color="#f59e0b" title="Did you know?">
                <Typography>{insights.fun_fact}</Typography>
              </InsightCard>
            </Grid>
          )}
        </Grid>
      )}
    </Stack>
  );
}

function InsightCard({ icon, color, title, children }) {
  return (
    <Card sx={{ height: "100%", borderColor: alpha(color, 0.25), bgcolor: (t) => alpha(color, t.palette.mode === "dark" ? 0.08 : 0.04) }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" mb={1.2}>
          <Box sx={{ color, display: "flex" }}>{icon}</Box>
          <Typography variant="subtitle1">{title}</Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
