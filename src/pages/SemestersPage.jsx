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
import decodeToken from "../helpers/decodeToken";
import {
  createSemester,
  getAllSemesters,
  updateSemester,
  deleteSemester,
} from "../api/semester";

function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [semesterData, setSemesterData] = useState({ title: "", startDate: "", endDate: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      if (!token) throw new Error("No token found");
      const semesters = await getAllSemesters();
      setSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      showSnackbar("Failed to fetch semesters.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (semester = null) => {
    setEditMode(!!semester);
    setSemesterData(semester || { title: "", startDate: "", endDate: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSemesterData({ title: "", startDate: "", endDate: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSemesterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSemester = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...semesterData,
        uid: userId,
      };

      if (editMode) {
        await updateSemester(semesterData._id, requestData);
        showSnackbar("Semester updated successfully!", "success");
      } else {
        await createSemester(requestData);
        showSnackbar("Semester added successfully!", "success");
      }
      fetchSemesters(); // Refresh the list after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving semester:", error);
      showSnackbar("Failed to save semester.", "error");
    }
  };

  const handleDeleteSemester = async (id) => {
    try {
      await deleteSemester(id);
      showSnackbar("Semester deleted successfully!", "success");
      fetchSemesters(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting semester:", error);
      showSnackbar("Failed to delete semester.", "error");
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
        Semesters
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Semester
      </Button>
      <Grid container spacing={4}>
        {semesters.map((semester) => (
          <Grid item xs={12} sm={6} md={4} key={semester._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {semester.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Start Date: {new Date(semester.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  End Date: {new Date(semester.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenDialog(semester)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteSemester(semester._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Adding or Editing a Semester */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Semester" : "Add New Semester"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={semesterData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Start Date"
            name="startDate"
            type="date"
            fullWidth
            value={semesterData.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            value={semesterData.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSemester} color="primary">
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

export default SemestersPage;