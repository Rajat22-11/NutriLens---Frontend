import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Slider,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import SettingsBrightnessRoundedIcon from "@mui/icons-material/SettingsBrightnessRounded";
import api, { errorMessage } from "../api/client";
import { PageHeader } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";
import { ACTIVITY_LEVELS, DEFAULT_GOALS, GOAL_TYPES, NUTRIENTS, fmt, suggestGoals } from "../utils/nutrition";
import { useGoals } from "../utils/useGoals";

const GOAL_SLIDERS = {
  calories: [1200, 4500, 50],
  protein: [30, 250, 5],
  carbs: [50, 600, 5],
  fat: [20, 180, 5],
  fiber: [10, 60, 1],
  sugar: [0, 120, 1],
  sodium: [500, 5000, 50],
  cholesterol: [0, 800, 10],
};

function Section({ title, subtitle, children }) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={3}>
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

export default function Settings() {
  const [params] = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const { user, setUser } = useAuth();
  const { preference, setPreference } = useColorMode();
  const { goals, save } = useGoals();

  const [profile, setProfile] = useState({ name: "", age: "", height: "", weight: "", gender: "", activityLevel: "moderate" });
  const [draftGoals, setDraftGoals] = useState(goals);
  const [goalType, setGoalType] = useState("maintain");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  const [saving, setSaving] = useState("");

  useEffect(() => {
    if (user)
      setProfile({
        name: user.name || "",
        age: user.age ?? "",
        height: user.height ?? "",
        weight: user.weight ?? "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "moderate",
      });
  }, [user]);

  useEffect(() => setDraftGoals(goals), [goals]);

  const notify = (msg, severity = "success") => setToast({ open: true, msg, severity });

  const saveProfile = async () => {
    setSaving("profile");
    try {
      const payload = Object.fromEntries(Object.entries(profile).filter(([, v]) => v !== ""));
      const { data } = await api.put("/api/user/profile", payload);
      setUser(data);
      notify("Profile saved");
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setSaving("");
    }
  };

  const saveGoals = async () => {
    setSaving("goals");
    try {
      await save(draftGoals);
      notify("Daily goals updated");
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setSaving("");
    }
  };

  const suggestion = suggestGoals(
    { age: Number(profile.age), height: Number(profile.height), weight: Number(profile.weight), gender: profile.gender, activityLevel: profile.activityLevel },
    goalType
  );
  const goalsChanged = JSON.stringify(draftGoals) !== JSON.stringify(goals);

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Personalise your targets and how NutriLens looks." />
      {welcome && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Welcome to NutriLens! Add your body details below and we’ll suggest daily goals that fit you.
        </Alert>
      )}
      <Stack spacing={3}>
        <Section title="Profile" subtitle="Used to personalise your calorie and macro targets.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" value={user?.email || ""} disabled />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField label="Age" type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField label="Height" type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment> } }} />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField label="Weight" type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} slotProps={{ input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select label="Gender" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                <MenuItem value="">Prefer not to say</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField select label="Activity level" value={profile.activityLevel} onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}>
                {ACTIVITY_LEVELS.map((a) => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.label} — {a.hint}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" mt={3}>
            <Button variant="contained" onClick={saveProfile} disabled={saving === "profile"}>
              Save profile
            </Button>
          </Stack>
        </Section>

        <Section title="Daily goals" subtitle="Targets used for your rings, progress bars and meal comparisons.">
          <Card variant="outlined" sx={{ mb: 3, bgcolor: "action.hover", border: 0 }}>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1">Smart suggestion</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {suggestion
                      ? `Based on your profile: ~${fmt(suggestion.calories)} kcal, ${suggestion.protein} g protein, ${suggestion.carbs} g carbs, ${suggestion.fat} g fat.`
                      : "Add your age, height and weight above to get a personalised suggestion."}
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                  <ToggleButtonGroup size="small" exclusive value={goalType} onChange={(_, v) => v && setGoalType(v)}>
                    {GOAL_TYPES.map((g) => (
                      <ToggleButton key={g.value} value={g.value}>
                        {g.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Button variant="outlined" startIcon={<AutoFixHighRoundedIcon />} disabled={!suggestion} onClick={() => setDraftGoals(suggestion)}>
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Grid container spacing={4} rowSpacing={2.5}>
            {NUTRIENTS.map((n) => {
              const [min, max, step] = GOAL_SLIDERS[n.key];
              return (
                <Grid key={n.key} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2">{n.label}</Typography>
                    <Typography variant="subtitle2" sx={{ color: n.color }}>
                      {fmt(draftGoals[n.key])} {n.unit}
                    </Typography>
                  </Stack>
                  <Slider
                    value={Number(draftGoals[n.key]) || 0}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(_, v) => setDraftGoals({ ...draftGoals, [n.key]: v })}
                    sx={{ color: n.color }}
                    aria-label={`${n.label} goal`}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={2}>
            <Button onClick={() => setDraftGoals(DEFAULT_GOALS)}>Reset to defaults</Button>
            <Button variant="contained" onClick={saveGoals} disabled={!goalsChanged || saving === "goals"}>
              Save goals
            </Button>
          </Stack>
        </Section>

        <Section title="Appearance" subtitle="Choose how NutriLens looks on this device.">
          <ToggleButtonGroup exclusive value={preference} onChange={(_, v) => v && setPreference(v)}>
            <ToggleButton value="light" sx={{ px: 2.5 }}>
              <LightModeRoundedIcon sx={{ mr: 1 }} /> Light
            </ToggleButton>
            <ToggleButton value="dark" sx={{ px: 2.5 }}>
              <DarkModeRoundedIcon sx={{ mr: 1 }} /> Dark
            </ToggleButton>
            <ToggleButton value="system" sx={{ px: 2.5 }}>
              <SettingsBrightnessRoundedIcon sx={{ mr: 1 }} /> System
            </ToggleButton>
          </ToggleButtonGroup>
        </Section>
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
