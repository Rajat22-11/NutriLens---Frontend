import { useEffect, useState } from "react";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Logo } from "./ui";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";
import api from "../api/client";

const NAV = [
  { to: "/scan", label: "Scan", icon: <CameraAltRoundedIcon /> },
  { to: "/dashboard", label: "Dashboard", icon: <SpaceDashboardRoundedIcon /> },
  { to: "/history", label: "History", icon: <HistoryRoundedIcon /> },
  { to: "/settings", label: "Settings", icon: <TuneRoundedIcon /> },
];

const SIDEBAR_W = 256;

function useServerWarmup() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    let done = false;
    const t = setTimeout(() => !done && setSlow(true), 3500);
    api
      .get("/api/health", { timeout: 90000 })
      .catch(() => {})
      .finally(() => {
        done = true;
        clearTimeout(t);
        setSlow(false);
      });
    return () => clearTimeout(t);
  }, []);
  return slow;
}

function ThemeToggle() {
  const { mode, setPreference } = useColorMode();
  return (
    <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
      <IconButton onClick={() => setPreference(mode === "dark" ? "light" : "dark")} aria-label="Toggle colour mode">
        {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);
  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();
  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontWeight: 700 }}>{initial}</Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { minWidth: 220, borderRadius: 3 } } }}>
        <Box sx={{ px: 2, py: 1.2 }}>
          <Typography fontWeight={700}>{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            navigate("/settings");
          }}
        >
          <ListItemIcon>
            <TuneRoundedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout(true);
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}

export default function AppLayout() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const slow = useServerWarmup();
  const current = NAV.find((n) => pathname.startsWith(n.to))?.to ?? false;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {desktop && (
        <Box
          component="nav"
          sx={{
            width: SIDEBAR_W,
            flexShrink: 0,
            position: "fixed",
            inset: "0 auto 0 0",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            p: 2.5,
            zIndex: 10,
          }}
        >
          <Box component={RouterLink} to="/" sx={{ color: "inherit", textDecoration: "none", mb: 4, px: 1 }}>
            <Logo />
          </Box>
          <List sx={{ display: "grid", gap: 0.5 }}>
            {NAV.map((n) => {
              const active = current === n.to;
              return (
                <ListItemButton
                  key={n.to}
                  component={RouterLink}
                  to={n.to}
                  selected={active}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{n.icon}</ListItemIcon>
                  <ListItemText primary={n.label} slotProps={{ primary: { fontWeight: active ? 700 : 600 } }} />
                </ListItemButton>
              );
            })}
          </List>
          <Box flex={1} />
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.06), borderColor: alpha(theme.palette.primary.main, 0.2) }}
          >
            <Typography variant="subtitle2">Snap. Know. Eat better.</Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Log your next meal in seconds.
            </Typography>
            <Button fullWidth variant="contained" size="small" startIcon={<CameraAltRoundedIcon />} onClick={() => navigate("/scan")}>
              Scan a meal
            </Button>
          </Paper>
          <Stack direction="row" alignItems="center" spacing={1} mt={2} px={0.5}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15, fontWeight: 700 }}>
              {(user?.name || "?").charAt(0).toUpperCase()}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {user?.name || "…"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap component="div">
                {user?.email}
              </Typography>
            </Box>
            <ThemeToggle />
            <Tooltip title="Sign out">
              <IconButton
                size="small"
                onClick={() => {
                  logout(true);
                }}
                aria-label="Sign out"
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0, ml: desktop ? `${SIDEBAR_W}px` : 0, pb: desktop ? 4 : "96px" }}>
        {!desktop && (
          <Box
            component="header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              px: 2,
              py: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: alpha(theme.palette.background.default, 0.8),
              backdropFilter: "blur(12px)",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box component={RouterLink} to="/" sx={{ color: "inherit", textDecoration: "none" }}>
              <Logo size={30} />
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ThemeToggle />
              <UserMenu />
            </Stack>
          </Box>
        )}
        <Collapse in={slow}>
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            Waking up the NutriLens AI server — the first request after a break can take up to a minute.
          </Alert>
        </Collapse>
        <Box component="main" sx={{ maxWidth: 1240, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2.5, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>

      {!desktop && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            left: 12,
            right: 12,
            bottom: "calc(12px + env(safe-area-inset-bottom))",
            borderRadius: 5,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
            boxShadow: "0 12px 32px -12px rgba(0,0,0,0.25)",
            zIndex: 30,
          }}
        >
          <BottomNavigation value={current} onChange={(_, v) => navigate(v)} showLabels sx={{ height: 64, bgcolor: alpha(theme.palette.background.paper, 0.95) }}>
            {NAV.map((n) => (
              <BottomNavigationAction key={n.to} value={n.to} label={n.label} icon={n.icon} sx={{ minWidth: 0, "&.Mui-selected": { fontWeight: 700 } }} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
