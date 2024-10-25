import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import "./css/sidebar.css";

function Sidebar() {
  const location = useLocation(); // Get the current location

  // Check if the current path matches the link path to add the active class
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-links-container">
          <div className="sidebar-links-wrapper pad-t-3 pad-x-2 d-flex flex-direction-col gap-2">
            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/dashboard") ? "active" : ""
              }`}
              to="/dashboard"
            >
              <div className="sidebar-link-icon">
                <DashboardIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Dashboard</div>
            </Link>

            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/grades") ? "active" : ""
              }`}
              to="/grades"
            >
              <div className="sidebar-link-icon">
                <EqualizerIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Grades</div>
            </Link>

            <div className="pad-y-1"></div>

            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/settings") ? "active" : ""
              }`}
              to="/settings"
            >
              <div className="sidebar-link-icon">
                <SettingsIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Settings</div>
            </Link>

            <Link
              className={`sidebar-link d-flex flex-direction-col aic pad-1 link-deco-none font-color-200 ${
                isActive("/help") ? "active" : ""
              }`}
              to="/help"
            >
              <div className="sidebar-link-icon">
                <QuestionMarkIcon />
              </div>
              <div className="sidebar-link-text font-smaller">Help</div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
