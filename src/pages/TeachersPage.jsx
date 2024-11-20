import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Email as EmailIcon, Person as PersonIcon } from "@mui/icons-material";
import decodeToken from "../helpers/decodeToken";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../api/teacher";

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [teacherData, setTeacherData] = useState({ first_name: "", last_name: "", phone: "", school_email: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  const fetchAllTeachers = async () => {
    try {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showSnackbar("Failed to fetch teachers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (teacher = null) => {
    setEditMode(!!teacher);
    setTeacherData(teacher || { first_name: "", last_name: "", phone: "", school_email: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setTeacherData({ first_name: "", last_name: "", phone: "", school_email: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveTeacher = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...teacherData,
        uid: userId,
      };

      if (editMode) {
        await updateTeacher(teacherData._id, requestData);
        showSnackbar("Teacher updated successfully!", "success");
      } else {
        await createTeacher(requestData);
        showSnackbar("Teacher added successfully!", "success");
      }
      fetchAllTeachers(); // Refresh the list after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving teacher:", error);
      showSnackbar("Failed to save teacher.", "error");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher(id);
      showSnackbar("Teacher deleted successfully!", "success");
      fetchAllTeachers(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showSnackbar("Failed to delete teacher.", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Teachers
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Teacher
      </Button>
      <Grid container spacing={4}>
        {teachers.map((teacher) => (
          <Grid item xs={12} sm={6} md={4} key={teacher._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  {teacher.first_name} {teacher.last_name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Phone: {teacher.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <EmailIcon sx={{ mr: 0.5 }} />
                  {teacher.school_email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenDialog(teacher)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteTeacher(teacher._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Adding or Editing a Teacher */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            fullWidth
            value={teacherData.first_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            fullWidth
            value={teacherData.last_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            fullWidth
            value={teacherData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="School Email"
            name="school_email"
            fullWidth
            value={teacherData.school_email}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTeacher} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default TeachersPage;
