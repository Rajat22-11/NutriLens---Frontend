import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ColorModeProvider } from "./context/ColorModeContext";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";

const Scan = lazy(() => import("./pages/Scan"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Loader() {
  return (
    <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated, signedOut } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return signedOut ? <Navigate to="/" replace /> : <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default function App() {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              {/* v1 routes */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/index" element={<Navigate to="/scan" replace />} />
              <Route
                element={
                  <RequireAuth>
                    <AppLayout />
                  </RequireAuth>
                }
              >
                <Route path="/scan" element={<Scan />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ColorModeProvider>
  );
}
