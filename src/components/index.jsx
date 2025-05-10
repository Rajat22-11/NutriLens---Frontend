import React, { useState, useEffect, useRef } from "react";
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
  Paper,
  Divider,
  Fade,
  Zoom,
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
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  const [cameraActive, setCameraActive] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    // Fetch user data on component mount
    fetchUserProfile();
    fetchAnalysisHistory();

    // Add scroll event listener to hide hero section on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowHero(false);
      } else {
        setShowHero(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Camera handling functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Could not access camera. Please check permissions or try uploading an image instead."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // Create a file from the blob
            const file = new File([blob], "camera-capture.jpg", {
              type: "image/jpeg",
            });

            // Set image preview
            setImage(URL.createObjectURL(blob));

            // Stop the camera
            stopCamera();

            // Process the captured image
            await processImage(file);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await processImage(file);
    }
  };

  const processImage = async (file) => {
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

        {/* Hero Section */}
        <Fade in={showHero} timeout={800}>
          <Box className="hero-section">
            <Container maxWidth="lg">
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Zoom in={true} timeout={1000}>
                    <Box className="hero-content">
                      <Typography
                        variant="h2"
                        className="hero-title"
                        gutterBottom
                      >
                        Analyze Your Food with AI
                      </Typography>
                      <Typography
                        variant="h5"
                        className="hero-subtitle"
                        paragraph
                      >
                        Get instant nutritional insights from your meals with
                        our advanced AI technology
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() =>
                          window.scrollTo({ top: 500, behavior: "smooth" })
                        }
                        className="hero-button"
                      >
                        Try It Now
                      </Button>
                    </Box>
                  </Zoom>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Zoom in={true} timeout={1200}>
                    <Box className="hero-image-container">
                      <DotLottieReact
                        src="https://lottie.host/c5f7e1c9-3cd1-4bd9-b6c4-e92ade1d50d9/jkx3THBWMj.json"
                        loop
                        autoplay
                        style={{ width: "100%", maxWidth: 500 }}
                      />
                    </Box>
                  </Zoom>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Fade>

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
                      Capture or Upload Your Food Photo
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
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
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<CameraAltIcon />}
                          size="large"
                          fullWidth
                          onClick={cameraActive ? stopCamera : startCamera}
                          className="camera-button"
                        >
                          {cameraActive ? "Stop Camera" : "Use Camera"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {cameraActive && (
                    <Box className="camera-container" mt={2}>
                      <Paper elevation={3} className="video-paper">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="camera-preview"
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        <Box className="camera-controls">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={captureImage}
                            startIcon={<PhotoCameraIcon />}
                            className="capture-button"
                          >
                            Capture
                          </Button>
                        </Box>
                      </Paper>
                    </Box>
                  )}

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

          {/* Features Section */}
          <Box className="features-section" mt={8} mb={8}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              className="section-title"
            >
              Why Choose Our AI Nutrition Analyzer
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              paragraph
              className="section-subtitle"
            >
              Powerful features to help you make better food choices
            </Typography>

            <Grid container spacing={4} mt={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={800}>
                  <Paper elevation={2} className="feature-card">
                    <Box className="feature-icon-container">
                      <HealthAndSafetyIcon className="feature-icon" />
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      Accurate Analysis
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      Our AI precisely identifies food items and provides
                      detailed nutritional information
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1000}>
                  <Paper elevation={2} className="feature-card">
                    <Box className="feature-icon-container">
                      <BarChartIcon className="feature-icon" />
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      Nutrition Tracking
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      Keep track of your daily calorie intake and nutritional
                      balance
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1200}>
                  <Paper elevation={2} className="feature-card">
                    <Box className="feature-icon-container">
                      <CameraAltIcon className="feature-icon" />
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      Instant Capture
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      Use your camera to instantly analyze meals wherever you
                      are
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1400}>
                  <Paper elevation={2} className="feature-card">
                    <Box className="feature-icon-container">
                      <RestaurantIcon className="feature-icon" />
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      Food Insights
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      Get detailed insights about ingredients and health
                      benefits
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            </Grid>
          </Box>

          {/* Testimonials Section */}
          <Box className="testimonials-section" mb={8}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              className="section-title"
            >
              What Our Users Say
            </Typography>

            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} md={4}>
                <Card elevation={2} className="testimonial-card">
                  <CardContent>
                    <Box className="testimonial-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="star-icon" />
                      ))}
                    </Box>
                    <Typography variant="body1" className="testimonial-text">
                      "This app has completely changed how I track my nutrition.
                      The AI is incredibly accurate and the insights are so
                      helpful!"
                    </Typography>
                    <Box className="testimonial-user">
                      <Avatar className="testimonial-avatar">S</Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="testimonial-name"
                        >
                          Sarah Johnson
                        </Typography>
                        <Typography
                          variant="caption"
                          className="testimonial-title"
                        >
                          Fitness Enthusiast
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2} className="testimonial-card">
                  <CardContent>
                    <Box className="testimonial-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="star-icon" />
                      ))}
                    </Box>
                    <Typography variant="body1" className="testimonial-text">
                      "As a nutritionist, I recommend this app to all my
                      clients. It makes tracking food intake so much easier and
                      more accurate."
                    </Typography>
                    <Box className="testimonial-user">
                      <Avatar className="testimonial-avatar">M</Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="testimonial-name"
                        >
                          Michael Chen
                        </Typography>
                        <Typography
                          variant="caption"
                          className="testimonial-title"
                        >
                          Certified Nutritionist
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2} className="testimonial-card">
                  <CardContent>
                    <Box className="testimonial-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="star-icon" />
                      ))}
                    </Box>
                    <Typography variant="body1" className="testimonial-text">
                      "I've lost 15 pounds since I started using this app! Being
                      able to quickly analyze my meals has made healthy eating
                      so much easier."
                    </Typography>
                    <Box className="testimonial-user">
                      <Avatar className="testimonial-avatar">J</Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="testimonial-name"
                        >
                          Jessica Williams
                        </Typography>
                        <Typography
                          variant="caption"
                          className="testimonial-title"
                        >
                          Weight Loss Journey
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Call to Action */}
          <Box className="cta-section" mb={8}>
            <Paper elevation={3} className="cta-paper">
              <Grid container alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" className="cta-title">
                    Ready to transform your nutrition habits?
                  </Typography>
                  <Typography variant="subtitle1" className="cta-subtitle">
                    Join thousands of users who are making healthier food
                    choices with AI assistance
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    justifyContent={{ xs: "center", md: "flex-end" }}
                    mt={{ xs: 3, md: 0 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="cta-button"
                    >
                      Get Started Now
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
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
