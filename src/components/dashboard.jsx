import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Button,
  Badge,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { foodTheme } from "../themes/theme";
import "../styles/dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as RechartTooltip,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CardMedia from "@mui/material/CardMedia";

// Add sample data for fallback when API data is not available
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const macroNutrients = [
  { name: "Protein", value: 30, color: "#8884d8" },
  { name: "Carbs", value: 45, color: "#82ca9d" },
  { name: "Fat", value: 25, color: "#ffc658" },
];

const nutrientData = [
  { subject: "Protein", value: 80 },
  { subject: "Carbs", value: 65 },
  { subject: "Fat", value: 70 },
  { subject: "Fiber", value: 55 },
  { subject: "Vitamins", value: 60 },
];

const dailyData = [
  { name: "Breakfast", calories: 450, protein: 20, carbs: 45, fat: 15 },
  { name: "Lunch", calories: 650, protein: 35, carbs: 65, fat: 22 },
  { name: "Dinner", calories: 550, protein: 30, carbs: 55, fat: 18 },
  { name: "Snacks", calories: 350, protein: 10, carbs: 40, fat: 12 },
];

const weeklyData = [
  { name: "Mon", calories: 1800, target: 2000 },
  { name: "Tue", calories: 2100, target: 2000 },
  { name: "Wed", calories: 1950, target: 2000 },
  { name: "Thu", calories: 2300, target: 2000 },
  { name: "Fri", calories: 2450, target: 2000 },
  { name: "Sat", calories: 2200, target: 2000 },
  { name: "Sun", calories: 1900, target: 2000 },
];

const monthlyData = [
  { name: "Week 1", calories: 2050, target: 2000 },
  { name: "Week 2", calories: 2150, target: 2000 },
  { name: "Week 3", calories: 1950, target: 2000 },
  { name: "Week 4", calories: 2100, target: 2000 },
];

const Dashboard = () => {
  // State
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Add CSS class for fixed navbar
  document.body.classList.add("fixed-navbar");
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    nutrientDistribution: [],
    goalProgress: [],
  });
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 80,
    carbs: 250,
    fat: 70,
    fiber: 25,
  });
  const [mealTrends, setMealTrends] = useState({
    commonFoods: [],
    mealTimings: [],
    weekdayPatterns: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all data needed for dashboard
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchAnalysisHistory(),
          fetchNutritionSummary(),
          fetchNutritionGoals(),
          fetchMealTrends(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/analysis/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalysisHistory(response.data);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
    }
  };

  const fetchNutritionSummary = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/user/nutrition/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNutritionSummary(response.data);
    } catch (error) {
      console.error("Error fetching nutrition summary:", error);
    }
  };

  const fetchNutritionGoals = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/user/nutrition/goals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNutritionGoals(response.data);
    } catch (error) {
      console.error("Error fetching nutrition goals:", error);
    }
  };

  const fetchMealTrends = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/user/meal-trends",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMealTrends(response.data);
    } catch (error) {
      console.error("Error fetching meal trends:", error);
    }
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const navigateToHome = () => {
    navigate("/index");
  };

  // Chart renderers - updated to use real data
  const renderCalorieLineChart = (data) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="calories"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#82ca9d"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Fix the renderMacroNutrientPieChart function
  const renderMacroNutrientPieChart = () => {
    const data =
      nutritionSummary.nutrientDistribution &&
      nutritionSummary.nutrientDistribution.length > 0
        ? nutritionSummary.nutrientDistribution
        : macroNutrients;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <RechartsTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderNutrientRadarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={nutrientData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Nutrients"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderMealBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={dailyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Bar dataKey="calories" fill="#8884d8" name="Calories" />
        <Bar dataKey="protein" fill="#82ca9d" name="Protein (g)" />
        <Bar dataKey="carbs" fill="#ffc658" name="Carbs (g)" />
        <Bar dataKey="fat" fill="#ff8042" name="Fat (g)" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ThemeProvider theme={foodTheme}>
      <Box className="dashboard-container">
        <CssBaseline />

        {/* Navigation */}
        <AppBar
          position="static"
          color="primary"
          elevation={1}
          className="app-navbar"
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
                AI Nutrition Dashboard
              </Box>
            </Typography>

            <Button
              color="inherit"
              startIcon={<RestaurantIcon />}
              onClick={navigateToHome}
              className="home-button"
            >
              Food Analysis
            </Button>

            {userProfile && (
              <Box className="user-controls">
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
                    {userProfile?.name || "User"}
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuClick}
                    className="avatar-button"
                  >
                    <Avatar className="user-avatar">
                      {userProfile?.name?.charAt(0).toUpperCase() || "U"}
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
          onNavigate={navigateToHome}
          onLogout={handleLogout}
        />

        {/* Main Dashboard Content */}
        <Container className="dashboard-content">
          {loading ? (
            <Box
              className="loading-container"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
              }}
            >
              <CircularProgress size={60} thickness={5} color="secondary" />
              <Typography variant="h6" className="loading-text" sx={{ mt: 2 }}>
                Loading your nutrition dashboard...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Summary Cards - Updated to use real data */}
              <Box className="summary-section">
                <Typography variant="h5" className="section-title">
                  <AssessmentIcon className="section-icon" />
                  Nutrition Summary
                </Typography>

                <Grid container spacing={3}>
                  {nutritionSummary.goalProgress.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        className={`summary-card ${item.name.toLowerCase()}-card`}
                      >
                        <CardContent>
                          <Typography variant="h6" className="card-title">
                            {item.name}
                          </Typography>
                          <Typography variant="h3" className="card-value">
                            {item.current}
                            {item.unit}
                          </Typography>
                          <Box className="progress-container">
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(
                                (item.current / item.goal) * 100,
                                100
                              )}
                              color={
                                item.color === "#ff7300"
                                  ? "primary"
                                  : "secondary"
                              }
                              className="progress-bar"
                            />
                            <Typography
                              variant="body2"
                              className="progress-label"
                            >
                              {Math.round((item.current / item.goal) * 100)}% of
                              target ({item.goal}
                              {item.unit})
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Timeline Selector */}
              <Box className="time-selector">
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  className="time-tabs"
                >
                  <Tab icon={<CalendarTodayIcon />} label="Daily" />
                  <Tab icon={<DateRangeIcon />} label="Weekly" />
                  <Tab icon={<DateRangeIcon />} label="Monthly" />
                </Tabs>
              </Box>

              <Divider className="section-divider" />

              {/* Charts Section - Updated to use real data */}
              {currentTab === 0 && (
                <Box className="charts-section">
                  <Typography variant="h5" className="section-title">
                    <AssessmentIcon className="section-icon" />
                    Daily Nutrition Insights
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Daily Calorie Intake
                          </Typography>
                          {renderCalorieLineChart(
                            nutritionSummary.daily.length > 0
                              ? nutritionSummary.daily
                              : weeklyData
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Macronutrient Breakdown
                          </Typography>
                          {renderMacroNutrientPieChart()}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Add a new chart for meal timing trends */}
                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Meal Timing Patterns
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={mealTrends.mealTimings}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Bar
                                dataKey="count"
                                fill="#8884d8"
                                name="Meal Count"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Add a new chart for common foods */}
                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Most Common Foods
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              layout="vertical"
                              data={mealTrends.commonFoods}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 100,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" />
                              <RechartsTooltip />
                              <Bar
                                dataKey="count"
                                fill="#82ca9d"
                                name="Frequency"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Weekly and Monthly tabs - similar updates with real data */}
              {currentTab === 1 && (
                <Box className="charts-section">
                  <Typography variant="h5" className="section-title">
                    <AssessmentIcon className="section-icon" />
                    Weekly Nutrition Trends
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Calorie Intake vs Target (Weekly)
                          </Typography>
                          {renderCalorieLineChart(weeklyData)}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Average Macronutrient Breakdown
                          </Typography>
                          {renderMacroNutrientPieChart()}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Weekly Nutritional Profile
                          </Typography>
                          {renderNutrientRadarChart()}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {currentTab === 2 && (
                <Box className="charts-section">
                  <Typography variant="h5" className="section-title">
                    <AssessmentIcon className="section-icon" />
                    Monthly Nutrition Overview
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Monthly Calorie Trends
                          </Typography>
                          {renderCalorieLineChart(monthlyData)}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Monthly Nutritional Balance
                          </Typography>
                          {renderNutrientRadarChart()}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card className="chart-card">
                        <CardContent>
                          <Typography variant="h6" className="chart-title">
                            Average Monthly Macronutrients
                          </Typography>
                          {renderMacroNutrientPieChart()}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Recent Analysis Section */}
              <Box className="recent-analysis-section">
                <Typography variant="h5" className="section-title">
                  <FastfoodIcon className="section-icon" />
                  Recent Food Analysis
                </Typography>

                <Grid container spacing={3}>
                  {analysisHistory.length > 0 ? (
                    analysisHistory.slice(0, 6).map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card className="analysis-history-card">
                          <CardMedia
                            component="img"
                            height="140"
                            image={`data:image/jpeg;base64,${item.imageBase64}`}
                            alt="Food Analysis"
                            className="history-image"
                          />
                          <CardContent>
                            <Typography variant="h6" className="food-name">
                              {item.foodItems && item.foodItems.length > 0
                                ? item.foodItems[0].name
                                : "Food Analysis"}
                            </Typography>
                            <Box className="nutrient-summary">
                              <Chip
                                icon={<LocalFireDepartmentIcon />}
                                label={`${(item.totalCalories || 0).toFixed(
                                  0
                                )} kcal`}
                                color="primary"
                                size="small"
                                className="nutrient-chip"
                              />
                              <Chip
                                label={`${(item.totalProtein || 0).toFixed(
                                  0
                                )}g protein`}
                                size="small"
                                className="nutrient-chip"
                              />
                              <Chip
                                label={`${(item.totalCarbs || 0).toFixed(
                                  0
                                )}g carbs`}
                                size="small"
                                className="nutrient-chip"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="timestamp"
                            >
                              {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Box
                      className="empty-history-container"
                      sx={{ width: "100%" }}
                    >
                      <Typography variant="h6" className="empty-history-text">
                        No food analysis history yet. Upload your first meal!
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/")}
                        startIcon={<CloudUploadIcon />}
                        className="upload-button"
                      >
                        Analyze Food
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Box>

              {/* Weekday Patterns Section */}
              <Box className="weekday-patterns-section">
                <Typography variant="h5" className="section-title">
                  <CalendarTodayIcon className="section-icon" />
                  Weekly Eating Patterns
                </Typography>

                <Card className="chart-card">
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={
                          mealTrends.weekdayPatterns &&
                          mealTrends.weekdayPatterns.length > 0
                            ? mealTrends.weekdayPatterns
                            : weeklyData.map((d) => ({
                                name: d.name,
                                count: d.calories / 100,
                              }))
                        }
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="count" name="Meal Count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
