import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const SideNav = ({ open, onClose, userProfile, onNavigate, onLogout }) => {
  const navigateToPage = (page) => {
    onClose();
    if (page === "dashboard") {
      onNavigate();
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "none",
          marginTop: 0,
          height: "100%",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000 /* Ensure it's below the navbar's z-index of 1100 */,
          paddingTop: "64px" /* Add padding to the top instead of margin */,
        },
      }}
    >
      {/* Logo and App Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "#FF9800", // Changed to orange
          color: "white",
        }}
      >
        <FastfoodIcon
          sx={{
            fontSize: 36,
            marginRight: "12px",
          }}
        />
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          AI Nutrition App
        </Typography>
      </Box>

      {/* User Profile Section */}
      {userProfile && (
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FFF3E0", // Changed to light orange
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontSize: 28,
              bgcolor: "#FB8C00", // Changed to darker orange
              marginBottom: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {userProfile?.name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {userProfile?.email || "user@example.com"}
          </Typography>
          {userProfile?.customerType === "Premium" && (
            <Box
              sx={{
                backgroundColor: "#FFB74D", // Changed to lighter orange
                borderRadius: "12px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#E65100", // Changed to dark orange
                marginTop: "8px",
              }}
            >
              PREMIUM USER
            </Box>
          )}
        </Box>
      )}

      {/* Main Navigation */}
      <List sx={{ padding: "8px 0" }}>
        <ListItem
          button
          onClick={() => navigateToPage("home")}
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" }, // Changed hover color
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            {" "}
            {/* Changed icon color */}
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Food Analysis" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigateToPage("dashboard")}
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Analysis History" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <LocalDiningIcon />
          </ListItemIcon>
          <ListItemText primary="Meal Planner" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Nutrition Reports" />
        </ListItem>
      </List>

      <Divider sx={{ margin: "8px 16px" }} />

      {/* Account & Settings */}
      <List sx={{ padding: "8px 0" }}>
        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <ListItem
          button
          sx={{
            margin: "4px 8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
        >
          <ListItemIcon sx={{ minWidth: "40px", color: "#F57C00" }}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Logout Button */}
      <Box
        sx={{
          padding: "16px",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          color="error"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            padding: "8px 16px",
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideNav;
