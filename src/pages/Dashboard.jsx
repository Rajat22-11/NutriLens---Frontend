import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import api, { errorMessage, tzOffset } from "../api/client";
import { EmptyState, NutrientBar, PageHeader, ProgressRing, SectionTitle, StatCard } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { MACRO_COLORS } from "../theme/theme";
import { NUTRIENT_BY_KEY, fmt, greeting, mealLabel, pct, timeOf } from "../utils/nutrition";

function ChartTooltip({ active, payload, label, unit = "kcal" }) {
  if (!active || !payload?.length) return null;
  return (
    <Card sx={{ px: 1.5, py: 1, borderRadius: 2.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {payload.map((p) => (
        <Typography key={p.dataKey} variant="body2" fontWeight={700} sx={{ color: p.color }}>
          {p.name}: {fmt(p.value)} {unit}
        </Typography>
      ))}
    </Card>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [recent, setRecent] = useState([]);
  const [range, setRange] = useState("daily");
  const [error, setError] = useState("");

  useEffect(() => {
    const tz = tzOffset();
    Promise.all([
      api.get("/api/user/nutrition/summary", { params: { tz } }),
      api.get("/api/user/meal-trends", { params: { tz } }),
      api.get("/api/analysis/history", { params: { limit: 5 } }),
    ])
      .then(([s, t, h]) => {
        setSummary(s.data);
        setTrends(t.data);
        setRecent(h.data);
      })
      .catch((e) => setError(errorMessage(e)));
  }, []);

  const axis = { fontSize: 12, fill: theme.palette.text.secondary };
  const grid = alpha(theme.palette.text.primary, 0.08);

  const chartData = useMemo(() => (summary ? summary[range] : []), [summary, range]);
  const firstName = (user?.name || "").split(" ")[0];

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!summary) {
    return (
      <Box>
        <Skeleton variant="text" width={280} height={48} />
        <Grid container spacing={2.5} mt={1}>
          {[0, 1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Skeleton variant="rounded" height={96} sx={{ borderRadius: 5 }} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 5 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 5 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const { today, goals, stats } = summary;
  const remaining = Math.round(goals.calories - today.calories);
  const empty = stats.totalScans === 0;

  return (
    <Box>
      <PageHeader
        title={`${greeting()}${firstName ? `, ${firstName}` : ""} 👋`}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        action={
          <Button variant="contained" startIcon={<CameraAltRoundedIcon />} component={RouterLink} to="/scan">
            Scan a meal
          </Button>
        }
      />

      {empty && (
        <Card sx={{ mb: 3 }}>
          <EmptyState
            emoji="🥗"
            title="Your food diary is empty"
            text="Scan your first meal to unlock daily rings, trends and personalised insights."
            action={
              <Button variant="contained" onClick={() => navigate("/scan")} startIcon={<CameraAltRoundedIcon />}>
                Scan my first meal
              </Button>
            }
          />
        </Card>
      )}

      {/* Today */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Today</SectionTitle>
              <Stack direction="row" spacing={3} alignItems="center">
                <ProgressRing value={today.calories} max={goals.calories} size={148} stroke={14}>
                  <Box>
                    <Typography variant="h4" lineHeight={1}>
                      {fmt(today.calories)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      of {fmt(goals.calories)} kcal
                    </Typography>
                  </Box>
                </ProgressRing>
                <Stack spacing={1.5} flex={1}>
                  <Box>
                    <Typography variant="h5" color={remaining >= 0 ? "primary.main" : "error.main"}>
                      {fmt(Math.abs(remaining))} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {remaining >= 0 ? "left for today" : "over your goal"}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stats.mealsToday} meal{stats.mealsToday === 1 ? "" : "s"} logged today
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Macros & fibre</SectionTitle>
              <Grid container spacing={2.5}>
                {["protein", "carbs", "fat", "fiber"].map((k) => (
                  <Grid key={k} size={{ xs: 6, sm: 3 }}>
                    <Stack alignItems="center" spacing={1}>
                      <ProgressRing value={today[k]} max={goals[k]} size={84} stroke={9} color={MACRO_COLORS[k]}>
                        <Typography variant="subtitle2">{pct(today[k], goals[k])}%</Typography>
                      </ProgressRing>
                      <Box textAlign="center">
                        <Typography variant="subtitle2">{NUTRIENT_BY_KEY[k].label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {fmt(today[k])} / {fmt(goals[k])} g
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<WhatshotRoundedIcon />} label="Day streak" value={`${stats.streak} 🔥`} color="#f97316" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<RestaurantRoundedIcon />} label="Meals scanned" value={fmt(stats.totalScans)} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<LocalFireDepartmentRoundedIcon />} label="Avg. per day" value={`${fmt(stats.avgDailyCalories)}`} sub="kcal on logged days" color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard icon={<CalendarMonthRoundedIcon />} label="Days logged" value={fmt(stats.daysLogged)} color="#6366f1" />
        </Grid>

        {/* Calorie trend */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle
                action={
                  <ToggleButtonGroup size="small" exclusive value={range} onChange={(_, v) => v && setRange(v)}>
                    <ToggleButton value="daily">7 days</ToggleButton>
                    <ToggleButton value="weekly">8 weeks</ToggleButton>
                    <ToggleButton value="monthly">6 months</ToggleButton>
                  </ToggleButtonGroup>
                }
              >
                Calories
              </SectionTitle>
              <Typography variant="body2" color="text.secondary" mb={2} mt={-1}>
                {range === "daily" ? "Total per day" : "Average per logged day"} vs your {fmt(goals.calories)} kcal goal
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={MACRO_COLORS.calories} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={MACRO_COLORS.calories} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={grid} vertical={false} />
                    <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
                    <YAxis tick={axis} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={goals.calories} stroke={theme.palette.secondary.main} strokeDasharray="6 6" label={{ value: "Goal", position: "insideTopRight", fill: theme.palette.secondary.main, fontSize: 12 }} />
                    <Area isAnimationActive={false} type="monotone" dataKey="calories" name="Calories" stroke={MACRO_COLORS.calories} strokeWidth={3} fill="url(#calGrad)" dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Macro split */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Today’s macro split</SectionTitle>
              {summary.nutrientDistribution.length ? (
                <>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie isAnimationActive={false} data={summary.nutrientDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4} cornerRadius={6} stroke="none">
                          {summary.nutrientDistribution.map((d) => (
                            <Cell key={d.name} fill={MACRO_COLORS[d.name.toLowerCase()]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip unit="%" />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Stack direction="row" justifyContent="space-around" mt={1}>
                    {summary.nutrientDistribution.map((d) => (
                      <Box key={d.name} textAlign="center">
                        <Typography variant="h6" sx={{ color: MACRO_COLORS[d.name.toLowerCase()] }}>
                          {Math.round(d.value)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {d.name}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              ) : (
                <EmptyState emoji="🥧" title="Nothing yet today" text="Log a meal to see your macro split." />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Other nutrients today */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Watch-list today</SectionTitle>
              <Stack spacing={2.5}>
                {["sugar", "sodium", "cholesterol"].map((k) => (
                  <NutrientBar key={k} label={NUTRIENT_BY_KEY[k].label} value={today[k]} goal={goals[k]} unit={NUTRIENT_BY_KEY[k].unit} color={MACRO_COLORS[k]} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Meal timings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>When you eat</SectionTitle>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={trends?.mealTimings || []} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid stroke={grid} vertical={false} />
                    <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip unit="meals" />} cursor={{ fill: alpha(theme.palette.primary.main, 0.06) }} />
                    <Bar isAnimationActive={false} dataKey="count" name="Meals" radius={[8, 8, 0, 0]} fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Favourite foods */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle>Your favourites</SectionTitle>
              {trends?.commonFoods?.length ? (
                <Stack spacing={1.8}>
                  {trends.commonFoods.slice(0, 5).map((f, i) => (
                    <Stack key={f.name} direction="row" alignItems="center" spacing={1.5}>
                      <Typography variant="subtitle2" color="text.secondary" width={16}>
                        {i + 1}
                      </Typography>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="subtitle2" noWrap>
                          {f.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ~{fmt(f.avgCalories)} kcal each
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2">{f.count}×</Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <EmptyState emoji="⭐" title="No favourites yet" />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent meals */}
        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SectionTitle action={<Button component={RouterLink} to="/history">View all</Button>}>Recent meals</SectionTitle>
              {recent.length ? (
                <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
                  {recent.map((m) => (
                    <Stack key={m.id} direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
                      {m.imageBase64 ? (
                        <Box component="img" src={`data:image/jpeg;base64,${m.imageBase64}`} alt="" sx={{ width: 56, height: 56, borderRadius: 3, objectFit: "cover" }} />
                      ) : (
                        <Box sx={{ width: 56, height: 56, borderRadius: 3, display: "grid", placeItems: "center", fontSize: 28, bgcolor: "action.hover" }}>
                          {m.foods[0]?.emoji || "🍽️"}
                        </Box>
                      )}
                      <Box flex={1} minWidth={0}>
                        <Typography variant="subtitle2" noWrap>
                          {m.foods.map((f) => f.name).join(", ") || "Meal"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mealLabel(m.timestamp)} · {new Date(m.timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short" })}, {timeOf(m.timestamp)}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        {fmt(m.totals.calories)} <Typography component="span" variant="caption" color="text.secondary">kcal</Typography>
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No meals yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
