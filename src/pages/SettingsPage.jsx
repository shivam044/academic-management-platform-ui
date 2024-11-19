import React from "react";
import { Box, Typography, Paper, TextField, Switch, FormControlLabel, Divider, Button } from "@mui/material";

function SettingsPage() {
  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {/* Account Details Section */}
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <TextField label="Username" variant="outlined" fullWidth />
          <TextField label="Email" type="email" variant="outlined" fullWidth />
          <TextField label="Phone Number" type="tel" variant="outlined" fullWidth />
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Notifications Section */}
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive Email Notifications"
          />
          <FormControlLabel
            control={<Switch />}
            label="Receive SMS Notifications"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive Push Notifications"
          />
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Privacy Settings Section */}
        <Typography variant="h6" gutterBottom>
          Privacy Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
          <FormControlLabel
            control={<Switch />}
            label="Make Profile Private"
          />
          <FormControlLabel
            control={<Switch />}
            label="Allow Location Access"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Two-Factor Authentication"
          />
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default SettingsPage;
