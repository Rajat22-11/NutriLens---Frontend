import { useState } from "react";
import { Link as RouterLink, Navigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Logo } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/client";

const EMPTY_SIGNUP = { name: "", email: "", password: "", age: "", height: "", weight: "", gender: "" };

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  const { login, signup, isAuthenticated } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from || "/scan";

  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [form, setForm] = useState(EMPTY_SIGNUP);
  const [showDetails, setShowDetails] = useState(false);

  // After a successful login/signup the auth state flips and this redirect takes over.
  if (isAuthenticated) return <Navigate to={mode === "signup" ? "/settings?welcome=1" : redirectTo} replace />;

  const switchMode = (m) => {
    setError("");
    setParams(m === "signup" ? { mode: "signup" } : {}, { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(loginForm.email, loginForm.password);
      } else {
        const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
        await signup(payload);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const pwField = (value, onChange, autoComplete) => (
    <TextField
      label="Password"
      type={showPw ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      helperText={mode === "signup" ? "At least 6 characters" : undefined}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="Toggle password visibility">
                {showPw ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return (
    <Grid container sx={{ minHeight: "100dvh" }}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          p: 6,
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg,#14532d 0%,#15803d 55%,#a16207 140%)",
        }}
      >
        <Box component={RouterLink} to="/" sx={{ color: "inherit", textDecoration: "none" }}>
          <Logo />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ mb: 2, maxWidth: 480 }}>
            Your plate, decoded in seconds.
          </Typography>
          <Stack spacing={1.5}>
            {["Detects 15 popular Indian dishes from one photo", "Calories, macros & micronutrients vs your goals", "Personal trends, streaks and healthier swaps"].map((t) => (
              <Stack key={t} direction="row" spacing={1.2} alignItems="center">
                <CheckCircleRoundedIcon sx={{ color: "#bbf7d0" }} />
                <Typography sx={{ opacity: 0.92 }}>{t}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {["vada-pav", "dosa", "jalebi", "paneer-tikka"].map((s, i) => (
            <Box
              key={s}
              component="img"
              src={`/samples/${s}.jpg`}
              alt=""
              sx={{ width: 96, height: 96, borderRadius: 4, objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", transform: `rotate(${[-4, 3, -2, 4][i]}deg)` }}
            />
          ))}
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 4 } }}>
        <Box sx={{ width: "100%", maxWidth: 440 }}>
          <Box component={RouterLink} to="/" sx={{ display: { md: "none" }, color: "inherit", textDecoration: "none", mb: 3, width: "fit-content" }}>
            <Logo />
          </Box>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" mb={0.5}>
                {mode === "login" ? "Welcome back 👋" : "Create your account"}
              </Typography>
              <Typography color="text.secondary" mb={3}>
                {mode === "login" ? "Sign in to keep tracking your meals." : "Start understanding your meals today."}
              </Typography>

              <Tabs value={mode} onChange={(_, v) => switchMode(v)} variant="fullWidth" sx={{ mb: 3, bgcolor: "action.hover", borderRadius: 3, p: 0.5, minHeight: 0, "& .MuiTabs-indicator": { height: "100%", borderRadius: 2.5, zIndex: 0, bgcolor: "background.paper", boxShadow: 1 }, "& .MuiTab-root": { zIndex: 1, minHeight: 40 } }}>
                <Tab value="login" label="Sign in" />
                <Tab value="signup" label="Sign up" />
              </Tabs>

              <Collapse in={Boolean(error)}>
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              </Collapse>

              <Box component="form" onSubmit={submit} noValidate={false}>
                {mode === "login" ? (
                  <Stack spacing={2}>
                    <TextField label="Email" type="email" autoComplete="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                    {pwField(loginForm.password, (e) => setLoginForm({ ...loginForm, password: e.target.value }), "current-password")}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <TextField label="Full name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <TextField label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {pwField(form.password, (e) => setForm({ ...form, password: e.target.value }), "new-password")}
                    <Button size="small" onClick={() => setShowDetails((s) => !s)} sx={{ alignSelf: "flex-start" }}>
                      {showDetails ? "Hide" : "Add"} body details (optional, for personalised goals)
                    </Button>
                    <Collapse in={showDetails}>
                      <Grid container spacing={2}>
                        <Grid size={4}>
                          <TextField label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} slotProps={{ htmlInput: { min: 1, max: 120 } }} />
                        </Grid>
                        <Grid size={4}>
                          <TextField label="Height" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment> }, htmlInput: { min: 50, max: 260 } }} />
                        </Grid>
                        <Grid size={4}>
                          <TextField label="Weight" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} slotProps={{ input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> }, htmlInput: { min: 20, max: 350 } }} />
                        </Grid>
                        <Grid size={12}>
                          <TextField select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                            <MenuItem value="">Prefer not to say</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Stack>
                )}
                <Button type="submit" variant="contained" size="large" fullWidth disabled={busy} sx={{ mt: 3 }}>
                  {busy ? <CircularProgress size={22} color="inherit" /> : mode === "login" ? "Sign in" : "Create account"}
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={2.5}>
                {mode === "login" ? "New to NutriLens? " : "Already have an account? "}
                <Box component="button" type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} sx={{ border: 0, background: "none", color: "primary.main", fontWeight: 700, cursor: "pointer", font: "inherit", p: 0 }}>
                  {mode === "login" ? "Create an account" : "Sign in"}
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
