import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography, alpha } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { Logo, ProgressRing } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { MACRO_COLORS } from "../theme/theme";

const DISHES = [
  ["🍛", "Biryani"], ["🫓", "Chole Bhature"], ["🍔", "Dabeli"], ["🥣", "Dal"], ["🧽", "Dhokla"],
  ["🥞", "Dosa"], ["🍥", "Jalebi"], ["🌯", "Kathi Roll"], ["🧆", "Kofta"], ["🫓", "Naan"],
  ["🍤", "Pakora"], ["🍢", "Paneer Tikka"], ["🥟", "Panipuri"], ["🍛", "Pav Bhaji"], ["🍔", "Vada Pav"],
];

const FEATURES = [
  { icon: <CameraAltRoundedIcon />, color: "#16a34a", title: "Snap & detect", text: "A custom YOLOv5 model trained on Indian dishes spots every item on your plate in milliseconds." },
  { icon: <AutoAwesomeRoundedIcon />, color: "#6366f1", title: "Gemini-powered fallback", text: "Packaged snacks, labels or dishes outside the model? Gemini vision reads them for you." },
  { icon: <InsightsRoundedIcon />, color: "#f59e0b", title: "Goals & trends", text: "Daily rings, weekly trends and eating patterns show how each meal fits your targets." },
  { icon: <RestaurantMenuRoundedIcon />, color: "#f43f5e", title: "Healthier swaps", text: "Practical, desi-friendly tips to make your favourite food lighter without losing the taste." },
];

function PhoneMock() {
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 360 },
        mx: "auto",
        borderRadius: 7,
        p: 1.5,
        boxShadow: "0 40px 80px -30px rgba(21,128,61,0.45)",
        transform: { md: "rotate(2deg)" },
      }}
    >
      <Box sx={{ borderRadius: 5, overflow: "hidden", position: "relative" }}>
        <Box component="img" src="/samples/vada-pav.jpg" alt="Vada pav" sx={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
        <Box sx={{ position: "absolute", left: "18%", top: "16%", width: "64%", height: "66%", border: "3px solid #22c55e", borderRadius: 3 }}>
          <Chip label="Vada Pav · 83%" size="small" sx={{ position: "absolute", top: -14, left: 8, bgcolor: "#22c55e", color: "#fff" }} />
        </Box>
      </Box>
      <CardContent sx={{ px: 1, pb: "8px !important" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ProgressRing value={456} max={2000} size={86} stroke={9}>
            <Box>
              <Typography variant="subtitle1" lineHeight={1}>456</Typography>
              <Typography variant="caption" color="text.secondary">kcal</Typography>
            </Box>
          </ProgressRing>
          <Stack spacing={1} flex={1}>
            {[["Protein", 9, 80, MACRO_COLORS.protein], ["Carbs", 53, 250, MACRO_COLORS.carbs], ["Fat", 23, 70, MACRO_COLORS.fat]].map(([l, v, g, c]) => (
              <Box key={l}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" fontWeight={700}>{l}</Typography>
                  <Typography variant="caption" color="text.secondary">{v} g</Typography>
                </Stack>
                <Box sx={{ height: 6, borderRadius: 9, bgcolor: "action.hover" }}>
                  <Box sx={{ width: `${(v / g) * 100 * 2.2}%`, maxWidth: "100%", height: "100%", borderRadius: 9, bgcolor: c }} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Box sx={{ mt: 2, p: 1.5, borderRadius: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.08) }}>
          <Typography variant="caption" fontWeight={700} color="primary.main">SWAP IDEA</Typography>
          <Typography variant="body2">Try an air-fried vada and add a side of sprouts for protein.</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const primaryCta = isAuthenticated ? { to: "/scan", label: "Open NutriLens" } : { to: "/auth?mode=signup", label: "Get started — it's free" };

  return (
    <Box>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5 }}>
          <Logo />
          <Stack direction="row" spacing={1}>
            {isAuthenticated ? (
              <Button variant="contained" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/auth" color="inherit">
                  Sign in
                </Button>
                <Button variant="contained" component={RouterLink} to="/auth?mode=signup" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                  Create account
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        {/* Hero */}
        <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center" sx={{ pt: { xs: 3, md: 8 }, pb: { xs: 6, md: 10 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip icon={<BoltRoundedIcon />} label="AI nutrition, tuned for Indian food" color="primary" variant="outlined" sx={{ mb: 3 }} />
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: "2.4rem", sm: "3.2rem", md: "3.6rem" }, lineHeight: 1.05, mb: 2.5 }}>
              Point. Snap.{" "}
              <Box component="span" sx={{ background: "linear-gradient(120deg,#22c55e,#f59e0b)", WebkitBackgroundClip: "text", color: "transparent" }}>
                Know your plate.
              </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 4, maxWidth: 520 }}>
              NutriLens recognises your meal from a single photo and breaks down calories, macros and
              micronutrients — then helps you hit your daily goals.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button size="large" variant="contained" component={RouterLink} to={primaryCta.to} endIcon={<ArrowForwardRoundedIcon />}>
                {primaryCta.label}
              </Button>
              <Button size="large" variant="outlined" component="a" href="#how">
                How it works
              </Button>
            </Stack>
            <Stack direction="row" spacing={3} mt={4} color="text.secondary">
              <Typography variant="body2">⚡ Results in seconds</Typography>
              <Typography variant="body2">🍛 15+ Indian dishes</Typography>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>🔒 Private by default</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PhoneMock />
          </Grid>
        </Grid>

        {/* How it works */}
        <Box id="how" sx={{ py: { xs: 4, md: 8 }, scrollMarginTop: 24 }}>
          <Typography variant="overline" color="primary.main">How it works</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: "1.9rem", md: "2.4rem" }, mb: 4 }}>
            From plate to insights in three steps
          </Typography>
          <Grid container spacing={2.5}>
            {[
              ["01", "Capture", "Upload a photo, drag-and-drop, paste or use your camera."],
              ["02", "Analyse", "Our vision model detects each dish and estimates the portion size."],
              ["03", "Improve", "See calories & macros against your goals, plus smarter swaps."],
            ].map(([n, t, d]) => (
              <Grid key={n} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h3" sx={{ color: "primary.main", opacity: 0.35, mb: 1 }}>{n}</Typography>
                    <Typography variant="h6">{t}</Typography>
                    <Typography color="text.secondary">{d}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features */}
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <Grid container spacing={2.5}>
            {FEATURES.map((f) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3.5, display: "grid", placeItems: "center", mb: 2, color: f.color, bgcolor: alpha(f.color, 0.12) }}>
                      {f.icon}
                    </Box>
                    <Typography variant="h6" mb={0.5}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Dishes */}
        <Box sx={{ py: { xs: 4, md: 6 }, textAlign: "center" }}>
          <Typography variant="overline" color="primary.main">Trained on the food you love</Typography>
          <Typography variant="h4" mb={3}>From street-side chaat to Sunday biryani</Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.2} sx={{ maxWidth: 820, mx: "auto" }}>
            {DISHES.map(([e, n]) => (
              <Chip key={n} label={`${e}  ${n}`} variant="outlined" sx={{ fontSize: 15, py: 2.4, px: 0.5, bgcolor: "background.paper" }} />
            ))}
          </Stack>
        </Box>

        {/* CTA */}
        <Card
          sx={{
            my: { xs: 6, md: 10 },
            p: { xs: 3, md: 6 },
            textAlign: "center",
            color: "#fff",
            border: 0,
            background: "linear-gradient(135deg,#166534 0%,#15803d 45%,#b45309 130%)",
          }}
        >
          <Typography variant="h3" sx={{ fontSize: { xs: "1.8rem", md: "2.6rem" }, mb: 1.5 }}>
            Eat what you love, knowing what’s in it.
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 3 }}>Free to use. Your meal history stays in your account.</Typography>
          <Button size="large" variant="contained" color="secondary" component={RouterLink} to={primaryCta.to} endIcon={<ArrowForwardRoundedIcon />}>
            {primaryCta.label}
          </Button>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={1} sx={{ py: 4, borderTop: 1, borderColor: "divider" }}>
          <Logo size={26} textVariant="subtitle1" />
          <Stack direction="row" spacing={0.8} alignItems="center" color="text.secondary">
            <LockRoundedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">Estimates are for guidance only and not medical advice.</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
