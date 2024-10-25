import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import GradesPage from "./pages/GradeTrackingPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

import Sidebar from "./components/Layouts/Sidebar";
import Topbar from "./components/Layouts/Topbar";

import "./App.css";

// Layout wrapper to control Topbar and Sidebar visibility based on the route
function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app-body">
      {!isLoginPage && (
        <>
          <div className="topbar-container">
            <Topbar />
          </div>
          <div className="sidebar-container">
            <Sidebar />
          </div>
        </>
      )}
      <main className={`main-container pad-y-2 pad-x-4 ${isLoginPage ? "login-page" : ""}`}>
        {children}
      </main>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
