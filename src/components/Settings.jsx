import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Slider,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Fade,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../styles/settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  // Default nutritional targets
  const defaultSettings = {
    calories: 2000,
    carbs: 250, // grams
    protein: 150, // grams
    fat: 70, // grams
    weight: 70, // kg
    height: 170, // cm
    age: 30,
    gender: "male",
    activityLevel: "moderate",
    notifications: true,
    darkMode: false, // Set dark mode to false by default
    mealReminders: true,
    waterReminders: true,
    units: "metric", // metric or imperial
    highContrast: false, // accessibility option
  };

  // State for user settings
  const [settings, setSettings] = useState(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setOriginalSettings(parsedSettings);
    } else {
      setOriginalSettings(defaultSettings);
    }
  }, []);

  // Check if settings have changed
  useEffect(() => {
    if (originalSettings) {
      const changed =
        JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(changed);
    }
  }, [settings, originalSettings]);

  // Handle input changes
  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  // Handle slider changes
  const handleSliderChange = (field) => (event, newValue) => {
    handleChange(field, newValue);
  };

  // Handle text input changes
  const handleInputChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    handleChange(field, value);
  };

  // Handle switch changes
  const handleSwitchChange = (field) => (event) => {
    handleChange(field, event.target.checked);
  };

  // Save settings
  const saveSettings = () => {
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      setOriginalSettings(settings);
      setHasChanges(false);
      setLoading(false);

      // Show success message
      setSnackbar({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });

      // If dark mode setting changed, reload the page to apply the theme change
      if (originalSettings && originalSettings.darkMode !== settings.darkMode) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 800); // Simulate network delay
  };

  // Reset settings to default
  const resetToDefault = () => {
    setSettings(defaultSettings);
    setSnackbar({
      open: true,
      message: "Settings reset to default values",
      severity: "info",
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Navigate to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Container className="settings-container">
      <Box
        className="settings-header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" className="settings-title">
            Settings
          </Typography>
          <Typography variant="body1" className="settings-subtitle">
            Customize your nutrition targets and app preferences
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={goToDashboard}
          className="back-to-dashboard-btn"
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Nutrition Targets */}
      <Fade in={true} timeout={500}>
        <Paper className="settings-card" elevation={2}>
          <Box className="settings-card-header">
            <RestaurantIcon className="settings-card-icon" />
            <Typography variant="h6">Nutrition Targets</Typography>
          </Box>
          <Box className="settings-card-content">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div className="settings-form-group">
                  <Typography id="calories-slider" gutterBottom>
                    Daily Calorie Target
                  </Typography>
                  <Slider
                    className="settings-slider"
                    value={settings.calories}
                    onChange={handleSliderChange("calories")}
                    aria-labelledby="calories-slider"
                    valueLabelDisplay="auto"
                    min={1200}
                    max={4000}
                    step={50}
                    color="primary"
                  />
                  <div className="settings-slider-label">
                    <span>1200 kcal</span>
                    <span>{settings.calories} kcal</span>
                    <span>4000 kcal</span>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="settings-form-group">
                  <Typography id="carbs-slider" gutterBottom>
                    Carbohydrates Target (g)
                  </Typography>
                  <Slider
                    className="settings-slider"
                    value={settings.carbs}
                    onChange={handleSliderChange("carbs")}
                    aria-labelledby="carbs-slider"
                    valueLabelDisplay="auto"
                    min={50}
                    max={500}
                    step={5}
                    color="primary"
                  />
                  <div className="settings-slider-label">
                    <span>50g</span>
                    <span>{settings.carbs}g</span>
                    <span>500g</span>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="settings-form-group">
                  <Typography id="protein-slider" gutterBottom>
                    Protein Target (g)
                  </Typography>
                  <Slider
                    className="settings-slider"
                    value={settings.protein}
                    onChange={handleSliderChange("protein")}
                    aria-labelledby="protein-slider"
                    valueLabelDisplay="auto"
                    min={30}
                    max={300}
                    step={5}
                    color="primary"
                  />
                  <div className="settings-slider-label">
                    <span>30g</span>
                    <span>{settings.protein}g</span>
                    <span>300g</span>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="settings-form-group">
                  <Typography id="fat-slider" gutterBottom>
                    Fat Target (g)
                  </Typography>
                  <Slider
                    className="settings-slider"
                    value={settings.fat}
                    onChange={handleSliderChange("fat")}
                    aria-labelledby="fat-slider"
                    valueLabelDisplay="auto"
                    min={20}
                    max={150}
                    step={5}
                    color="primary"
                  />
                  <div className="settings-slider-label">
                    <span>20g</span>
                    <span>{settings.fat}g</span>
                    <span>150g</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>

      {/* Personal Information */}
      <Fade in={true} timeout={700}>
        <Paper className="settings-card" elevation={2}>
          <Box className="settings-card-header">
            <AccountCircleIcon className="settings-card-icon" />
            <Typography variant="h6">Personal Information</Typography>
          </Box>
          <Box className="settings-card-content">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  className="settings-form-control"
                  label="Weight"
                  type="number"
                  value={settings.weight}
                  onChange={handleInputChange("weight")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {settings.units === "metric" ? "kg" : "lb"}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  className="settings-form-control"
                  label="Height"
                  type="number"
                  value={settings.height}
                  onChange={handleInputChange("height")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {settings.units === "metric" ? "cm" : "in"}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  className="settings-form-control"
                  label="Age"
                  type="number"
                  value={settings.age}
                  onChange={handleInputChange("age")}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  className="settings-form-control"
                  select
                  label="Gender"
                  value={settings.gender}
                  onChange={handleInputChange("gender")}
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  className="settings-form-control"
                  select
                  label="Activity Level"
                  value={settings.activityLevel}
                  onChange={handleInputChange("activityLevel")}
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">
                    Light (light exercise 1-3 days/week)
                  </option>
                  <option value="moderate">
                    Moderate (moderate exercise 3-5 days/week)
                  </option>
                  <option value="active">
                    Active (hard exercise 6-7 days/week)
                  </option>
                  <option value="very_active">
                    Very Active (very hard exercise & physical job)
                  </option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>

      {/* App Preferences */}
      <Fade in={true} timeout={900}>
        <Paper className="settings-card" elevation={2}>
          <Box className="settings-card-header">
            <SettingsIcon className="settings-card-icon" />
            <Typography variant="h6">App Preferences</Typography>
          </Box>
          <Box className="settings-card-content">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  className="settings-switch"
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleSwitchChange("notifications")}
                      color="primary"
                    />
                  }
                  label="Enable Notifications"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1, ml: 3, mb: 2 }}
                >
                  Receive important updates and reminders
                </Typography>
                <FormControlLabel
                  className="settings-switch"
                  control={
                    <Switch
                      checked={settings.mealReminders}
                      onChange={handleSwitchChange("mealReminders")}
                      color="primary"
                    />
                  }
                  label="Meal Reminders"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1, ml: 3 }}
                >
                  Get reminders for regular meal times
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  className="settings-switch"
                  control={
                    <Switch
                      checked={settings.waterReminders}
                      onChange={handleSwitchChange("waterReminders")}
                      color="primary"
                    />
                  }
                  label="Water Intake Reminders"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1, ml: 3, mb: 2 }}
                >
                  Stay hydrated with regular water reminders
                </Typography>
                <TextField
                  className="settings-form-control"
                  select
                  label="Units"
                  value={settings.units}
                  onChange={handleInputChange("units")}
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lb, in)</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>

      {/* Theme Preferences */}
      <Fade in={true} timeout={1100}>
        <Paper className="settings-card" elevation={2}>
          <Box className="settings-card-header">
            <ColorLensIcon className="settings-card-icon" />
            <Typography variant="h6">Theme Preferences</Typography>
          </Box>
          <Box className="settings-card-content">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  className="settings-switch"
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={handleSwitchChange("darkMode")}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1, ml: 3 }}
                >
                  Enable dark mode for a more comfortable viewing experience in
                  low light
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  className="settings-switch"
                  control={
                    <Switch
                      checked={settings.highContrast || false}
                      onChange={handleSwitchChange("highContrast")}
                      color="primary"
                    />
                  }
                  label="High Contrast"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1, ml: 3 }}
                >
                  Increase contrast for better accessibility
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>

      {/* Action Buttons */}
      <Box className="settings-action-buttons" mt={4}>
        <Tooltip title="Reset all settings to default values">
          <Button
            className="settings-reset-button"
            variant="outlined"
            onClick={resetToDefault}
            startIcon={<RestoreIcon />}
          >
            Reset to Default
          </Button>
        </Tooltip>
        <Tooltip
          title={!hasChanges ? "No changes to save" : "Save your changes"}
        >
          <span>
            {" "}
            {/* Wrapper needed for disabled tooltip */}
            <Button
              className="settings-save-button"
              variant="contained"
              onClick={saveSettings}
              disabled={!hasChanges || loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
