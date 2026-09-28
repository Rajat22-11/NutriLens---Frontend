import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import api, { errorMessage } from "../api/client";
import MealResult, { MealImage } from "../components/MealResult";
import { normalizeMeal } from "../utils/meal";
import { EmptyState, PageHeader } from "../components/ui";
import { MACRO_COLORS } from "../theme/theme";
import { fmt, mealLabel, relativeDay, timeOf } from "../utils/nutrition";
import { useGoals } from "../utils/useGoals";

export default function History() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { goals } = useGoals();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api
      .get("/api/analysis/history")
      .then((r) => setItems(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (items || []).filter((m) => !q || m.foods.some((f) => f.name.toLowerCase().includes(q)));
    const map = new Map();
    for (const m of filtered) {
      const key = relativeDay(m.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    return [...map.entries()];
  }, [items, query]);

  const remove = async (m) => {
    try {
      await api.delete(`/api/analysis/${m.id}`);
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      setToast("Meal deleted");
      setOpen(null);
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setConfirm(null);
    }
  };

  const meal = open ? normalizeMeal(open) : null;

  return (
    <Box>
      <PageHeader
        title="Food diary"
        subtitle={items ? `${items.length} meal${items.length === 1 ? "" : "s"} logged` : "Loading your meals…"}
        action={
          <TextField
            size="small"
            placeholder="Search dishes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 260 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }}
          />
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {!items && !error && (
        <Grid container spacing={2.5}>
          {[...Array(6)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={260} sx={{ borderRadius: 5 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {items && items.length === 0 && (
        <Card>
          <EmptyState
            emoji="📖"
            title="No meals yet"
            text="Every meal you scan is saved here so you can look back at what you ate."
            action={<Button variant="contained" startIcon={<CameraAltRoundedIcon />} onClick={() => navigate("/scan")}>Scan a meal</Button>}
          />
        </Card>
      )}

      {items && items.length > 0 && groups.length === 0 && <Typography color="text.secondary">No meals match “{query}”.</Typography>}

      <Stack spacing={4}>
        {groups.map(([day, meals]) => (
          <Box key={day}>
            <Stack direction="row" alignItems="baseline" spacing={1.5} mb={1.5}>
              <Typography variant="h6">{day}</Typography>
              <Typography variant="body2" color="text.secondary">
                {fmt(meals.reduce((s, m) => s + (m.totals.calories || 0), 0))} kcal
              </Typography>
            </Stack>
            <Grid container spacing={2.5}>
              {meals.map((m) => (
                <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea onClick={() => setOpen(m)} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                      {m.imageBase64 ? (
                        <Box component="img" src={`data:image/jpeg;base64,${m.imageBase64}`} alt="" sx={{ width: "100%", height: 160, objectFit: "cover" }} />
                      ) : (
                        <Box sx={{ height: 160, display: "grid", placeItems: "center", fontSize: 64, bgcolor: "action.hover" }}>{m.foods[0]?.emoji || "🍽️"}</Box>
                      )}
                      <CardContent sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                          <Box minWidth={0}>
                            <Typography variant="subtitle1" noWrap>
                              {m.foods.map((f) => f.name).join(", ") || "Meal"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {mealLabel(m.timestamp)} · {timeOf(m.timestamp)}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                            {fmt(m.totals.calories)}
                            <Typography component="span" variant="caption" color="text.secondary"> kcal</Typography>
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} mt={1.5} flexWrap="wrap" useFlexGap>
                          {["protein", "carbs", "fat"].map((k) => (
                            <Chip key={k} size="small" variant="outlined" label={`${k[0].toUpperCase()} ${fmt(m.totals[k])}g`} sx={{ borderColor: MACRO_COLORS[k], color: MACRO_COLORS[k] }} />
                          ))}
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} fullWidth maxWidth="md" fullScreen={fullScreen} scroll="body">
        {meal && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                {mealLabel(meal.timestamp)}
                <Typography variant="body2" color="text.secondary">
                  {new Date(meal.timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpen(null)} aria-label="Close">
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {meal.image && (
                <Box mb={2.5}>
                  <MealImage meal={meal} height={260} />
                </Box>
              )}
              <MealResult meal={meal} goals={goals} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setConfirm(open)}>
                Delete meal
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)}>
        <DialogTitle>Delete this meal?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">It will be removed from your diary and dashboard totals.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => remove(confirm)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast("")} message={toast} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
    </Box>
  );
}
