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
import { Email as EmailIcon, School as SchoolIcon } from "@mui/icons-material";
import decodeToken from "../helpers/decodeToken"; 
import {
  createSubject,
  getSubjectsByUser,
  updateSubject,
  deleteSubject,
} from "../api/subject";


function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectData, setSubjectData] = useState({ subjectTitle: "", targetGrade: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserSubjects();
  }, []);

  const fetchUserSubjects = async () => {
    try {
      if (!token) throw new Error("No token found");
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
      const subjects = await getSubjectsByUser(userId);
      setSubjects(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showSnackbar("Failed to fetch subjects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (subject = null) => {
    setEditMode(!!subject);
    setSubjectData(subject || { subjectTitle: "", targetGrade: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSubjectData({ subjectTitle: "", targetGrade: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSubject = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;

      const requestData = {
        ...subjectData,
        uid: userId,
        t_uid: userId,
      };

      if (editMode) {
        await updateSubject(subjectData._id, requestData);
        showSnackbar("Subject updated successfully!", "success");
      } else {
        await createSubject(requestData);
        showSnackbar("Subject added successfully!", "success");
      }
      fetchUserSubjects(); // Refresh the list after saving
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving subject:", error);
      showSnackbar("Failed to save subject.", "error");
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
      showSnackbar("Subject deleted successfully!", "success");
      fetchUserSubjects(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting subject:", error);
      showSnackbar("Failed to delete subject.", "error");
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
        Subjects
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Subject
      </Button>
      <Grid container spacing={4}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  {subject.subjectTitle}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Target Grade: {subject.targetGrade}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Teacher: {subject.t_uid.firstName} {subject.t_uid.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <EmailIcon sx={{ mr: 0.5 }} />
                  {subject.t_uid.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenDialog(subject)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteSubject(subject._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Adding or Editing a Subject */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Subject Title"
            name="subjectTitle"
            fullWidth
            value={subjectData.subjectTitle}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Target Grade"
            name="targetGrade"
            fullWidth
            type="number"
            value={subjectData.targetGrade}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSubject} color="primary">
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

export default SubjectsPage;
