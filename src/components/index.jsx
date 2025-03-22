import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  CssBaseline,
  Avatar,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import api from "../utils/axios-config"; // Import the configured axios instance
import parse from "html-react-parser";
import { foodTheme } from "../themes/theme";
import "../styles/index2.css";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";

const IndexPage = () => {
  // State management
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState([
    "Analyzing your delicious meal...",
    "Counting those calories...",
    "Identifying the ingredients...",
    "Calculating nutritional values...",
    "Determining portion sizes...",
    "Almost done with your food analysis...",
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    // Fetch user data on component mount
    fetchUserProfile();
    fetchAnalysisHistory();
  }, []);

  useEffect(() => {
    // Rotate through loading quotes
    if (loading) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % loadingQuotes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading, loadingQuotes.length]);

  // API calls - updated to use the api instance
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.warn("No authentication token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      // Using the api instance instead of axios directly
      const profileResponse = await api.get("/api/auth/profile");
      setUserProfile(profileResponse.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // No need to handle 401 here as it's handled by the interceptor
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("Authentication token missing");
        return;
      }

      // Using the api instance
      const response = await api.get("/api/analysis/history");
      setAnalysisHistory(response.data);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Using the api instance with multipart/form-data
        const response = await api.post("/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setDetections(response.data.detections);
        setGeminiAnalysis(response.data.gemini_analysis);
        setAnnotatedImage(
          `data:image/jpeg;base64,${response.data.annotated_image}`
        );

        // Calculate total calories
        let totalCals = 0;
        Object.entries(response.data.detections).forEach(([food, details]) => {
          const calories = details.calories || 0;
          totalCals += calories;
        });

        setTotalCalories(totalCals);

        // The analysis is already stored in the backend during the /predict call
        // Just refresh the analysis history to show the latest data
        if (localStorage.getItem("auth_token")) {
          // Refresh analysis history
          fetchAnalysisHistory();
        }

        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
      }
    }
  };

  const saveAnalysisToDatabase = async (analysisData) => {
    try {
      // Using the api instance
      await api.post("/api/analysis/save", analysisData);
    } catch (error) {
      console.error("Error saving analysis:", error);
    }
  };

  // UI Helper Functions
  const getCalorieEmoji = (calories) => {
    if (calories === 0) return "🍽️";
    if (calories < 300) return "🥗";
    if (calories < 600) return "🍲";
    return "🔥";
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const prepareAnalysisContent = (content) => {
    if (!content) return "";

    const trimmedContent = content.trim();
    let cleanedContent = trimmedContent;

    if (trimmedContent.startsWith("```html")) {
      cleanedContent = trimmedContent.replace(/```html\n|```$/g, "");
    } else if (trimmedContent.startsWith("```")) {
      cleanedContent = trimmedContent.replace(/```\n|```$/g, "");
    }

    return cleanedContent;
  };

  const renderAnalysisContent = (content) => {
    if (!content) return null;

    const preparedContent = prepareAnalysisContent(content);

    if (preparedContent.trim().startsWith("<")) {
      return <div className="nutrition-analysis">{parse(preparedContent)}</div>;
    }

    return (
      <ReactMarkdown className="nutrition-analysis">
        {preparedContent}
      </ReactMarkdown>
    );
  };

  // History Dialog
  const renderHistoryDialog = () => (
    <Dialog
      open={historyDialogOpen}
      onClose={() => setHistoryDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" className="history-title">
          Your Analysis History
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {analysisHistory.length > 0 ? (
            analysisHistory.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="history-card">
                  <CardMedia
                    component="img"
                    height="140"
                    image={`data:image/jpeg;base64,${item.imageBase64}`}
                    alt="Food Analysis"
                  />
                  <CardContent>
                    <Typography variant="h6" className="history-calories">
                      {item.totalCalories.toFixed(1)} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" className="empty-history">
                No analysis history found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHistoryDialogOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Loading Overlay
  const loadingOverlay = (
    <Box className="loading-overlay">
      <Box className="loading-content">
        <CircularProgress size={80} thickness={5} color="secondary" />
        <Typography
          variant="h5"
          sx={{ mt: 3, color: "white", fontWeight: "bold" }}
        >
          {loadingQuotes[currentQuote]}
        </Typography>
        <Box sx={{ width: "80%", mt: 3 }}>
          <LinearProgress color="secondary" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={foodTheme}>
      <Box className="app-background">
        <CssBaseline />

        {/* Navigation */}
        <AppBar
          position="fixed"
          color="primary"
          elevation={1}
          className="app-navbar"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box className="app-logo">
                <FastfoodIcon className="logo-icon" />
                AI Nutrition Analyzer
              </Box>
            </Typography>

            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={navigateToDashboard}
              className="dashboard-button"
            >
              Dashboard
            </Button>

            {userProfile && (
              <Box className="user-controls">
                <Button
                  color="inherit"
                  onClick={() => setHistoryDialogOpen(true)}
                  className="history-button"
                >
                  Analysis History
                </Button>
                <Tooltip title="Premium Features">
                  <Badge
                    badgeContent={
                      userProfile.customerType === "Premium" ? "PRO" : null
                    }
                    color="secondary"
                    className="premium-badge"
                  >
                    <IconButton color="inherit">
                      <TrendingUpIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Box className="user-avatar-container">
                  <Typography variant="subtitle2" className="username">
                    {userProfile.name}
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuClick}
                    className="avatar-button"
                  >
                    <Avatar className="user-avatar">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Box>
              </Box>
            )}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              className="user-menu"
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Side Drawer */}
        <SideNav
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          userProfile={userProfile}
          onNavigate={navigateToDashboard}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <Container className="main-container">
          <Grid
            container
            spacing={4}
            alignItems="flex-start"
            justifyContent="center"
          >
            {/* Upload & Image Display Section */}
            <Grid item xs={12} md={5}>
              <Card elevation={3} className="upload-card">
                <CardContent>
                  <Box className="upload-header">
                    <Typography variant="h5" className="upload-title">
                      <CloudUploadIcon
                        sx={{ mr: 1, verticalAlign: "bottom" }}
                      />
                      Upload Your Food Photo
                    </Typography>

                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      size="large"
                      fullWidth
                      className="upload-button"
                    >
                      Select Image
                      <input
                        type="file"
                        hidden
                        onChange={handleUpload}
                        accept="image/*"
                      />
                    </Button>
                  </Box>

                  <Grid container spacing={2} justifyContent="center">
                    {image && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" className="image-label">
                          Original Image:
                        </Typography>
                        <Card className="image-card">
                          <CardMedia
                            component="img"
                            image={image}
                            alt="Uploaded Food"
                            className="food-image"
                          />
                        </Card>
                      </Grid>
                    )}

                    {annotatedImage && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" className="image-label">
                          Analysis Result:
                        </Typography>
                        <Card className="image-card">
                          <CardMedia
                            component="img"
                            image={annotatedImage}
                            alt="Annotated Food"
                            className="food-image"
                          />
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Analysis Results Section */}
            <Grid item xs={12} md={7}>
              <Card elevation={3} className="analysis-card">
                <Box className="analysis-header">
                  <Typography variant="h5" sx={{ color: "secondary.dark" }}>
                    <RestaurantIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                    Your Food Analysis
                  </Typography>
                </Box>

                <CardContent className="analysis-content">
                  {!geminiAnalysis && !loading && (
                    <Box className="empty-analysis">
                      <DotLottieReact
                        src="https://lottie.host/af412a7b-d5d8-4bf9-b5d6-14340c3c6559/MwuRLYe32D.json"
                        loop
                        autoplay
                        style={{ width: 250 }}
                      />
                      <Typography variant="h6" className="empty-text">
                        Upload a food image to see detailed nutritional analysis
                      </Typography>
                    </Box>
                  )}

                  {geminiAnalysis && (
                    <Box className="analysis-result">
                      {renderAnalysisContent(geminiAnalysis)}
                    </Box>
                  )}
                </CardContent>
              </Card>
              {/* Calorie Summary Card */}
              {totalCalories > 0 && (
                <Card className="calorie-card">
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar className="calorie-avatar">
                          <LocalFireDepartmentIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box ml={2}>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            Estimated Calories
                          </Typography>
                          <Typography variant="h4" className="calorie-value">
                            {totalCalories.toFixed(1)} kcal
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h2" sx={{ opacity: 0.8 }}>
                        {getCalorieEmoji(totalCalories)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* Loading Overlay */}
        {loading && loadingOverlay}

        {/* History Dialog */}
        {renderHistoryDialog()}
      </Box>
    </ThemeProvider>
  );
};

export default IndexPage;
