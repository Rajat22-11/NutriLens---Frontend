import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  TextField,
  CircularProgress,
  CssBaseline,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
  Link,
  Snackbar,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import CakeIcon from "@mui/icons-material/Cake";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { foodTheme } from "../themes/theme";
import "../styles/index.css";

const AuthPage = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
    customerType: "Basic", // Default value for customer type
  });

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Login form handlers
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // Signup form handlers
  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  // Form submission handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginForm,
        { withCredentials: true }
      );

      // Debug the response to see what we're getting
      console.log("Login response:", response.data);

      // Check if token exists in response
      if (!response.data.token) {
        throw new Error("No token received from server");
      }

      setAlert({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });

      // Store token in localStorage - make sure it's properly saved
      // Store token and user ID in localStorage
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user_id", response.data.user._id); // Store the ObjectId

      // Verify token was saved
      const savedToken = localStorage.getItem("auth_token");
      console.log("Saved token:", savedToken);

      // Redirect after successful login (replace with your routing logic)
      setTimeout(() => {
        window.location.href = "/index"; // Try redirecting to root instead of /index
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        open: true,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (signupForm.password !== signupForm.confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        signupForm,
        { withCredentials: true }
      );

      // Check if token exists in response
      if (response.data.token) {
        // Store token and user ID in localStorage
        localStorage.setItem("auth_token", response.data.token);
        if (response.data.user && response.data.user._id) {
          localStorage.setItem("user_id", response.data.user._id);
        }
      }

      setAlert({
        open: true,
        message: "Account created successfully! Please log in.",
        severity: "success",
      });

      // Switch to login tab after successful signup
      setTimeout(() => {
        setTabValue(0);
      }, 1500);
    } catch (error) {
      setAlert({
        open: true,
        message:
          error.response?.data?.message || "Signup failed. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Close alert handler
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <ThemeProvider theme={foodTheme}>
      <Box className="app-background">
        <CssBaseline />
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box className="header-section">
            <Typography variant="h3" className="app-title">
              AI Nutrition Analyzer
            </Typography>
            <Typography variant="h6" className="app-subtitle">
              Your personal food analysis assistant
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            {/* Animation Section */}
            <Grid item xs={12} md={6} className="auth-animation">
              {/* Second Lottie Animation using DotLottieReact */}
              <Box mt={4} width="100%" display="flex" justifyContent="center">
                <DotLottieReact
                  src="https://lottie.host/214bd97a-58c3-4d00-a9ab-1873154a3783/KHSKnWUIYv.lottie"
                  loop
                  autoplay
                  style={{ width: 300, height: 300 }}
                />
              </Box>

              <Box className="auth-benefits" mt={4} textAlign="center">
                <Typography
                  variant="h5"
                  color="primary.main"
                  fontWeight={600}
                  mb={2}
                >
                  Why Join Us?
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={4} className="benefit-item">
                    <Box className="benefit-icon">📊</Box>
                    <Typography variant="body1">
                      Track Your Nutrition
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} className="benefit-item">
                    <Box className="benefit-icon">🍎</Box>
                    <Typography variant="body1">Healthier Choices</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} className="benefit-item">
                    <Box className="benefit-icon">📱</Box>
                    <Typography variant="body1">Easy To Use</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Auth Form Section */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} className="auth-card">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="auth tabs"
                  >
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                  </Tabs>
                </Box>

                {/* Login Tab */}
                <Box
                  className="tab-panel"
                  hidden={tabValue !== 0}
                  sx={{ p: 3 }}
                >
                  <form onSubmit={handleLoginSubmit}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ mt: 2, mb: 3, textAlign: "right" }}>
                      <Link href="#" variant="body2" color="secondary.dark">
                        Forgot password?
                      </Link>
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ mb: 2, py: 1.5 }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<GoogleIcon />}
                      sx={{ mb: 2, py: 1.5 }}
                    >
                      Continue with Google
                    </Button>
                  </form>
                </Box>

                {/* Signup Tab */}
                <Box
                  className="tab-panel"
                  hidden={tabValue !== 1}
                  sx={{ p: 3 }}
                >
                  <form onSubmit={handleSignupSubmit}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="signup-email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          id="signup-password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
                          type={showPassword ? "text" : "password"}
                          id="confirm-password"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Customer Type Selection */}
                    <FormControl
                      component="fieldset"
                      sx={{ mt: 3, width: "100%" }}
                    >
                      <FormLabel component="legend">Customer Type</FormLabel>
                      <RadioGroup
                        row
                        name="customerType"
                        value={signupForm.customerType}
                        onChange={handleSignupChange}
                      >
                        <FormControlLabel
                          value="Basic"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="subtitle2">Basic</Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Limited features, free forever
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="Premium"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="subtitle2">
                                Premium
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Full access to all features
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>

                    {/* Optional health information */}
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ mt: 3, mb: 1 }}
                    >
                      Health Information (Optional)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          id="age"
                          label="Age"
                          name="age"
                          type="number"
                          value={signupForm.age}
                          onChange={handleSignupChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CakeIcon color="secondary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          id="height"
                          label="Height (cm)"
                          name="height"
                          type="number"
                          value={signupForm.height}
                          onChange={handleSignupChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <HeightIcon color="secondary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          id="weight"
                          label="Weight (kg)"
                          name="weight"
                          type="number"
                          value={signupForm.weight}
                          onChange={handleSignupChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FitnessCenterIcon color="secondary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        By signing up, you agree to our{" "}
                        <Link href="#" color="secondary.dark">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" color="secondary.dark">
                          Privacy Policy
                        </Link>
                      </Typography>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ mt: 2, mb: 2, py: 1.5 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<GoogleIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Continue with Google
                    </Button>
                  </form>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AuthPage;
