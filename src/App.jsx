import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppTheme from "./themes/AppTheme";
import AuthPage from "./components/loginSignup";
import Index from "./components/index";
import Dashboard from "./components/dashboard";

const App = () => {
  return (
    <AppTheme>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
