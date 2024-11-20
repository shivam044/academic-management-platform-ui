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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Email as EmailIcon, School as SchoolIcon } from "@mui/icons-material";
import decodeToken from "../helpers/decodeToken"; 
import {
  createSubject,
  getSubjectsByUser,
  updateSubject,
  deleteSubject,
} from "../api/subject";
import { getAllTeachers } from "../api/teacher";
import { getAllSemesters } from "../api/semester";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectData, setSubjectData] = useState({ subjectTitle: "", targetGrade: "", room: "", semester_id: "", t_uid: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserSubjects();
    fetchAllTeachers();
    fetchAllSemesters();
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

  const fetchAllTeachers = async () => {
    try {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchAllSemesters = async () => {
    try {
      const semesters = await getAllSemesters();
      setSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (subject = null) => {
    setEditMode(!!subject);
    setSubjectData(subject || { subjectTitle: "", targetGrade: "", room: "", semester_id: "", t_uid: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSubjectData({ subjectTitle: "", targetGrade: "", room: "", semester_id: "", t_uid: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSubject = async () => {
    try {
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
  
      // Construct the requestData with only IDs
      const requestData = {
        ...subjectData,
        uid: userId,
        t_uid: subjectData.t_uid, // Ensure this is an ID, not an object
        semester_id: subjectData.semester_id, // Ensure this is an ID, not an object
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
                  Teacher: {subject.t_uid?.firstName} {subject.t_uid?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <EmailIcon sx={{ mr: 0.5 }} />
                  {subject.t_uid?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Room: {subject.room}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Semester: {subject.semester_id?.title}
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
          <TextField
            margin="dense"
            label="Room"
            name="room"
            fullWidth
            value={subjectData.room}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
          <InputLabel>Semester</InputLabel>
          <Select
            name="semester_id"
            value={subjectData.semester_id} // This should be the ID
            onChange={handleInputChange}
          >
            {semesters.map((semester) => (
              <MenuItem key={semester._id} value={semester._id}>
                {semester.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Teacher</InputLabel>
          <Select
            name="t_uid"
            value={subjectData.t_uid} // This should be the ID
            onChange={handleInputChange}
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.first_name} {teacher.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
