import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import api, { errorMessage } from "../api/client";
import MealResult, { MealImage } from "../components/MealResult";
import { normalizeMeal } from "../utils/meal";
import { EmptyState, PageHeader } from "../components/ui";
import { useGoals } from "../utils/useGoals";
import { fmt } from "../utils/nutrition";

const SAMPLES = [
  { src: "/samples/vada-pav.jpg", name: "Vada Pav" },
  { src: "/samples/dosa.jpg", name: "Dosa" },
  { src: "/samples/jalebi.jpg", name: "Jalebi" },
  { src: "/samples/paneer-tikka.jpg", name: "Paneer Tikka" },
];

const STEPS = ["Uploading photo", "Detecting dishes", "Estimating portions", "Crunching nutrition", "Writing insights"];

function AnalyzingState() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Analysing your meal…
        </Typography>
        <LinearProgress sx={{ mb: 3 }} />
        <Stack spacing={1.5}>
          {STEPS.map((s, i) => (
            <Stack key={s} direction="row" spacing={1.5} alignItems="center" sx={{ opacity: i <= step ? 1 : 0.4, transition: "opacity .3s" }}>
              {i < step ? (
                <CheckCircleRoundedIcon color="primary" fontSize="small" />
              ) : (
                <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: 2, borderColor: i === step ? "primary.main" : "divider" }} />
              )}
              <Typography fontWeight={i === step ? 700 : 500}>{s}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function CameraDialog({ open, onClose, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setError("");
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } } })
      .then((stream) => {
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Camera unavailable. Check permissions or upload a photo instead."));
    if (!navigator.mediaDevices) setError("Camera is not supported in this browser.");
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  const capture = () => {
    const v = videoRef.current;
    if (!v?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d").drawImage(v, 0, 0);
    canvas.toBlob((blob) => blob && onCapture(new File([blob], "camera.jpg", { type: "image/jpeg" })), "image/jpeg", 0.92);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Take a photo
        <IconButton onClick={onClose} aria-label="Close camera">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="warning">{error}</Alert>
        ) : (
          <Box sx={{ borderRadius: 4, overflow: "hidden", bgcolor: "#000" }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", display: "block", maxHeight: "60vh" }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<CameraAltRoundedIcon />} onClick={capture} disabled={Boolean(error)}>
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ManualLogDialog({ open, onClose, onLogged }) {
  const [foods, setFoods] = useState([]);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && !foods.length) api.get("/api/foods").then((r) => setFoods(r.data)).catch(() => {});
    if (open) {
      setItems([]);
      setError("");
    }
  }, [open, foods.length]);

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/api/analysis/manual", { items: items.map((i) => ({ name: i.name, servings: i.servings })) });
      onLogged(data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const total = items.reduce((s, i) => s + i.nutrients.calories * i.servings, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Log a meal without a photo</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={foods.filter((f) => !items.some((i) => i.name === f.name))}
          getOptionLabel={(o) => `${o.emoji} ${o.name}`}
          onChange={(_, v) => v && setItems((prev) => [...prev, { ...v, servings: 1 }])}
          value={null}
          blurOnSelect
          renderInput={(params) => <TextField {...params} label="Add a dish" placeholder="Search e.g. Dosa" sx={{ mt: 1 }} />}
        />
        <Stack spacing={1.5} mt={2}>
          {items.map((i) => (
            <Stack key={i.name} direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ fontSize: 26 }}>{i.emoji}</Typography>
              <Box flex={1}>
                <Typography fontWeight={700}>{i.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {fmt(i.nutrients.calories * i.servings)} kcal · {fmt(i.unitWeight * i.servings)} g
                </Typography>
              </Box>
              <TextField
                type="number"
                label="Servings"
                size="small"
                value={i.servings}
                onChange={(e) => setItems((prev) => prev.map((p) => (p.name === i.name ? { ...p, servings: Math.max(0.25, Number(e.target.value) || 0.25) } : p)))}
                slotProps={{ htmlInput: { step: 0.5, min: 0.25, max: 10 } }}
                sx={{ width: 110 }}
              />
              <IconButton onClick={() => setItems((prev) => prev.filter((p) => p.name !== i.name))} aria-label={`Remove ${i.name}`}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
        <Typography fontWeight={700}>{items.length ? `${fmt(total)} kcal` : ""}</Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={!items.length || busy}>
            Log meal
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default function Scan() {
  const navigate = useNavigate();
  const { goals } = useGoals();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [meal, setMeal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const analyze = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setMeal(null);
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post("/predict", body);
      if (!data.foods?.length) {
        setNotice(data.message || "We couldn't spot any food in this photo.");
      } else {
        setMeal(normalizeMeal(data, url));
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }, []);

  // Paste an image from the clipboard
  useEffect(() => {
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
      if (item) analyze(item.getAsFile());
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [analyze]);

  const trySample = async (s) => {
    const blob = await (await fetch(s.src)).blob();
    analyze(new File([blob], s.src.split("/").pop(), { type: blob.type || "image/jpeg" }));
  };

  const reset = () => {
    setPreview(null);
    setMeal(null);
    setError("");
    setNotice("");
  };

  const hasImage = Boolean(preview);
  const manual = preview === "manual";

  return (
    <Box>
      <PageHeader
        title="Scan your meal"
        subtitle="Upload, drop, paste or snap a photo — we'll handle the rest."
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<EditNoteRoundedIcon />} onClick={() => setManualOpen(true)}>
              Log manually
            </Button>
            {hasImage && (
              <Button variant="contained" startIcon={<RestartAltRoundedIcon />} onClick={reset} disabled={busy}>
                New scan
              </Button>
            )}
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {!manual && (
        <Grid size={{ xs: 12, lg: hasImage ? 5 : 12 }}>
          {!hasImage ? (
            <Card
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                analyze(e.dataTransfer.files?.[0]);
              }}
              sx={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: dragging ? "primary.main" : "divider",
                bgcolor: (t) => (dragging ? alpha(t.palette.primary.main, 0.06) : "background.paper"),
                transition: "all .2s",
              }}
            >
              <CardContent sx={{ py: { xs: 5, md: 8 }, px: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    mx: "auto",
                    mb: 2.5,
                    borderRadius: "28px",
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  }}
                >
                  <AddPhotoAlternateRoundedIcon sx={{ fontSize: 44 }} />
                </Box>
                <Typography variant="h5" mb={1}>
                  Drop a food photo here
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  or paste with Ctrl/⌘ + V · JPG, PNG, WEBP up to 10 MB
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
                  <Button variant="contained" size="large" startIcon={<AddPhotoAlternateRoundedIcon />} onClick={() => inputRef.current?.click()}>
                    Choose photo
                  </Button>
                  <Button variant="outlined" size="large" startIcon={<CameraAltRoundedIcon />} onClick={() => setCameraOpen(true)}>
                    Use camera
                  </Button>
                </Stack>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  data-testid="file-input"
                  onChange={(e) => {
                    analyze(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <Typography variant="overline" color="text.secondary" display="block" mt={5} mb={1.5}>
                  No photo handy? Try a sample
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
                  {SAMPLES.map((s) => (
                    <Box
                      key={s.src}
                      component="button"
                      onClick={() => trySample(s)}
                      aria-label={`Try sample ${s.name}`}
                      sx={{
                        p: 0,
                        border: 2,
                        borderColor: "divider",
                        borderRadius: 3.5,
                        overflow: "hidden",
                        cursor: "pointer",
                        bgcolor: "transparent",
                        position: "relative",
                        transition: "transform .2s, border-color .2s",
                        "&:hover": { transform: "translateY(-3px)", borderColor: "primary.main" },
                      }}
                    >
                      <Box component="img" src={s.src} alt="" sx={{ width: 84, height: 84, objectFit: "cover", display: "block" }} />
                      <Typography variant="caption" sx={{ position: "absolute", bottom: 0, left: 0, right: 0, color: "#fff", fontWeight: 700, py: 0.3, background: "linear-gradient(transparent, rgba(0,0,0,.7))" }}>
                        {s.name}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
              {meal ? <MealImage meal={meal} height={380} /> : (
                <Box sx={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <Box component="img" src={preview} alt="Your meal" sx={{ width: "100%", maxHeight: 380, objectFit: "contain", display: "block", bgcolor: "action.hover", filter: busy ? "saturate(.6)" : "none" }} />
                  {busy && <Box className="scan-line" />}
                </Box>
              )}
            </Box>
          )}
        </Grid>
        )}

        {hasImage && (
          <Grid size={{ xs: 12, lg: manual ? 12 : 7 }}>
            {busy && <AnalyzingState />}
            {error && (
              <Alert severity="error" action={<Button color="inherit" onClick={reset}>Try again</Button>}>
                {error}
              </Alert>
            )}
            {notice && (
              <Card>
                <EmptyState
                  emoji="🔍"
                  title="No food detected"
                  text={`${notice} Tip: shoot from above in good light with the dish filling most of the frame.`}
                  action={
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" onClick={reset}>Try another photo</Button>
                      <Button variant="outlined" onClick={() => setManualOpen(true)}>Log manually</Button>
                    </Stack>
                  }
                />
              </Card>
            )}
            {meal && (
              <>
                <Alert severity="success" sx={{ mb: 2.5 }} action={<Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>}>
                  {manual ? "Meal logged to your food diary." : "Saved to your food diary."}
                </Alert>
                <MealResult meal={meal} goals={goals} />
              </>
            )}
          </Grid>
        )}
      </Grid>

      <CameraDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(file) => {
          setCameraOpen(false);
          analyze(file);
        }}
      />
      <ManualLogDialog
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onLogged={(entry) => {
          setManualOpen(false);
          setPreview(null);
          setNotice("");
          setError("");
          setMeal(normalizeMeal(entry));
          setPreview("manual");
        }}
      />
    </Box>
  );
}
