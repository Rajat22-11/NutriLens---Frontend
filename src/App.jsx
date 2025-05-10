import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppTheme from "./themes/AppTheme";
import AuthPage from "./components/loginSignup";
import Index from "./components/index";
import Dashboard from "./components/dashboard";
import Settings from "./components/Settings";

const App = () => {
  return (
    <AppTheme>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
