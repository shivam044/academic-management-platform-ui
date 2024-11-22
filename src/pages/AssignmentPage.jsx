import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";

function AssignmentsPage() {
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [assignmentData, setAssignmentData] = useState({ name: "", due_date: "" });
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Customize as needed

  const backendUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchUserAssignments();
  }, []);

  const fetchUserAssignments = async () => {
    try {
      if (!token) throw new Error("No token found");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${backendUrl}/api/assignments`, config);
      setAssignmentsList(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (assignment = null) => {
    setEditMode(!!assignment);
    setAssignmentData(assignment || { name: "", due_date: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setAssignmentData({ name: "", due_date: "" });
  };

  const handleSaveAssignment = async () => {
    // Validate required fields
    if (!assignmentData.name || !assignmentData.due_date) {
      setSnackbar({ open: true, message: "All fields are required.", severity: "error" });
      return;
    }
  
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const uid = JSON.parse(atob(token.split('.')[1])).user_id;
      const updatedAssignmentData = {
        ...assignmentData,
        uid,
        s_id: 1,
      };
  
      if (editMode) {
        await axios.put(
          `${backendUrl}/api/assignments/${updatedAssignmentData._id}`,
          updatedAssignmentData,
          config
        );
        setSnackbar({ open: true, message: "Assignment updated successfully!", severity: "success" });
      } else {
        // Create new assignment
        await axios.post(`${backendUrl}/api/assignment`, updatedAssignmentData, config);
        setSnackbar({ open: true, message: "Assignment added successfully!", severity: "success" });
      }
  
      // Refresh assignments list
      fetchUserAssignments();
    } catch (error) {
      console.error("Error saving assignment:", error);
      setSnackbar({ open: true, message: "Error saving assignment.", severity: "error" });
    } finally {
      handleCloseDialog();
    }
  };
  

  const handleDeleteAssignment = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${backendUrl}/api/assignments/${id}`, config);
      setSnackbar({ open: true, message: "Assignment deleted successfully!", severity: "success" });
      fetchUserAssignments();
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting assignment.", severity: "error" });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = assignmentsList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 2 }}
      >
        Add New Assignment
      </Button>
      {loading ? (
        <Typography>Loading assignments...</Typography>
      ) : assignmentsList.length > 0 ? (
        <>
          <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Due Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assignment.name}</TableCell>
                    <TableCell>
                      {assignment.due_date
                        ? new Date(assignment.due_date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(assignment)}
                        sx={{ marginRight: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteAssignment(assignment._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(assignmentsList.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      ) : (
        <Typography>No assignments found.</Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={assignmentData.name}
            onChange={(e) => setAssignmentData({ ...assignmentData, name: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={assignmentData.due_date ? assignmentData.due_date.split("T")[0] : ""}
            onChange={(e) => setAssignmentData({ ...assignmentData, due_date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveAssignment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AssignmentsPage;
