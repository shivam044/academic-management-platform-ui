import { React, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import GradesPage from "./pages/GradeTrackingPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

import CrudTestPage from "./pages/CrudTestPage";

import Register from './components/Auth/Register'; // Import the Register component


import Sidebar from "./components/Layouts/Sidebar";
import Topbar from "./components/Layouts/Topbar";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div className="app-body">
          <div className="topbar-container">
            <Topbar />
          </div>
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <main className="main-container pad-y-2 pad-x-4">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/register" element={<Register />} /> {/* Register Page */}

              <Route path="/crudtestpage" element={<CrudTestPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
