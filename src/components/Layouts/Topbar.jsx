import * as React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import "./css/topbar.css";

function DashboardPage() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className="topbar pad-y-2 pad-x-4">
      <div className="topbar-content d-flex aic jcsb gap-2">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="topbar-right-section d-flex jce aic flex-1 gap-2">
          <div className="searchbar-container">
            <div className="searchbar-wrapper d-flex aic jcc pad-x-2">
              <input
                type="serach"
                className="w-100 font-normal"
                placeholder="Search, Ex. page"
              />
              <SearchIcon className="font-color-200" />
            </div>
          </div>
          <div className="topbar-icons-container">
            <div className="topbar-icons-wrapper d-flex gap-1">
              <div
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                className="topbar-icon cur-point font-color-200"
              >
                <NotificationsIcon />
              </div>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "var(--bg-200)",
                    borderRadius: "10px",
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
                    padding: "10px",
                    width: "100%",
                    maxWidth: "600px",
                    marginTop: "var(--spacing-2)",
                  },
                }}
              >
                <Typography sx={{ p: "var(--spacing-2)" }}>
                  <b className="pad-l-1 font-color-200">Notifications</b>

                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <nav>
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              p: "0 var(--spacing-1)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            <ListItemText
                              primary="Assignment Due Soon"
                              secondary="Your Software Engineering assignment is due in 2 days."
                            />
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              p: "0 var(--spacing-1)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            <ListItemText
                              primary="Grade Update"
                              secondary="You received an 85% in your Math Midterm."
                            />
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              p: "0 var(--spacing-1)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            <ListItemText
                              primary="New Grade Available"
                              secondary="Your final grade for Project Management is now available."
                            />
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              p: "0 var(--spacing-1)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            <ListItemText
                              primary="Low Performance Warning"
                              secondary="Your current grade in Algorithms is below 50%. Seek help."
                            />
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                          <ListItemButton
                            sx={{
                              p: "0 var(--spacing-1)",
                              marginBottom: "var(--spacing-1)",
                            }}
                          >
                            <ListItemText
                              primary="Upcoming Exam"
                              secondary="Your Physics exam is scheduled for next week."
                            />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </nav>
                  </Box>
                </Typography>
              </Popover>

              <Link
                className="topbar-icon cur-point font-color-200"
                to="/profile"
              >
                <AccountCircleIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
